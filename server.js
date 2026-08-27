import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '64kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    outcome: { type: 'string' },
    urgency: { type: 'string', enum: ['low','medium','high','critical'] },
    constraints: { type: 'array', items: { type: 'string' } },
    deadlines: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' } },
    dependencies: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: { from: {type:'string'}, to: {type:'string'}, reason: {type:'string'} },
        required: ['from','to','reason']
      }
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          id:{type:'string'}, title:{type:'string'}, why:{type:'string'}, status:{type:'string',enum:['next','upcoming','blocked','risk','optional']}, estimated_minutes:{type:['integer','null']}, deadline:{type:['string','null']}, depends_on:{type:'array',items:{type:'string'}}, priority:{type:'integer'}
        },
        required:['id','title','why','status','estimated_minutes','deadline','depends_on','priority']
      }
    },
    next_decision: {
      type: ['object','null'], additionalProperties: false,
      properties: { question:{type:'string'}, recommendation:{type:'string'}, reasoning:{type:'string'}, options:{type:'array',items:{type:'object',additionalProperties:false,properties:{label:{type:'string'},impact:{type:'string'},recommended:{type:'boolean'}},required:['label','impact','recommended']}} },
      required:['question','recommendation','reasoning','options']
    },
    risks: { type:'array', items:{type:'object',additionalProperties:false,properties:{risk:{type:'string'},impact:{type:'string'},mitigation:{type:'string'}},required:['risk','impact','mitigation']} },
    plan_notes: { type:'array', items:{type:'string'} }
  },
  required:['title','summary','outcome','urgency','constraints','deadlines','blockers','dependencies','tasks','next_decision','risks','plan_notes']
};

const systemPrompt = `You are DO, a low-cognitive-load decision engine for messy real-world situations. Your job is NOT to turn every input into a generic checklist. Interpret the user's situation, infer the desired outcomes, extract hard constraints and deadlines, identify blockers and dependencies, prioritize risk, and produce the smallest practical sequence of actions that moves the user toward the outcome.

Rules:
1. The input can be ANY domain: college, work, travel, cooking, errands, projects, events, health routines, money decisions, etc. Do not assume a domain.
2. Never force the same workflow onto different situations.
3. Preserve explicit times, dates, quantities, budgets, locations, opening hours, submission deadlines, and other constraints. If a time is ambiguous, say so instead of inventing certainty.
4. Separate facts from assumptions. If something is missing and materially changes the plan, put it into next_decision or plan_notes.
5. Dependencies must be real: if B cannot happen before A, represent A -> B.
6. Prioritize tasks by consequence and time sensitivity, not simply by the order mentioned.
7. The first task should be the most useful next action, unless a necessary clarification is required first.
8. Minimize cognitive load. Give a small number of meaningful decisions. Do not ask for information that can be inferred.
9. Do not fabricate real-time weather, store hours, prices, travel time, inventory, or external facts. Treat user-provided facts as facts; label estimates as estimates.
10. For conflicts, compare the user's stated goal against the proposed action. Flag only meaningful conflicts.
11. Keep task titles action-oriented and concise. Use estimated_minutes only when reasonably inferable; otherwise null.
12. Return ONLY JSON matching the supplied schema.`;

function cleanJsonText(text) {
  const stripped = String(text || '').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  const first = stripped.indexOf('{');
  const last = stripped.lastIndexOf('}');
  if (first >= 0 && last > first) return stripped.slice(first, last + 1);
  return stripped;
}

app.get('/api/health', (_req,res)=>res.json({ok:true, configured:Boolean(process.env.OPENROUTER_API_KEY), model:process.env.OPENROUTER_MODEL||'openrouter/auto'}));

app.post('/api/plan', async (req,res)=>{
  try {
    const situation = String(req.body?.situation || '').trim();
    if (!situation) return res.status(400).json({error:'Write a situation first.'});
    if (!process.env.OPENROUTER_API_KEY) return res.status(503).json({error:'OpenRouter is not configured. Copy .env.example to .env and add OPENROUTER_API_KEY.'});

    const model = process.env.OPENROUTER_MODEL || 'openrouter/auto';
    const body = {
      model,
      temperature: 0.2,
      max_completion_tokens: 3500,
      response_format: { type: 'json_object' },
      messages: [
        { role:'system', content: systemPrompt },
        { role:'user', content:`Here is the user's situation. Analyze it as DO.\n\n${situation}` }
      ]
    };

    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method:'POST',
      headers:{
        Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type':'application/json',
        // 'HTTP-Referer':process.env.APP_URL || `http://localhost:${port}`,  # use it for local development

        'HTTP-Referer':process.env.APP_URL || 'https://do-rho-five.vercel.app/',  // this is for production

        'X-Title':'DO. AI Decision Engine'
      },
      body:JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) {
      const msg = data?.error?.message || data?.message || `OpenRouter returned ${r.status}`;
      return res.status(502).json({error:msg, provider_status:r.status});
    }
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return res.status(502).json({error:'The model returned no plan.'});
    let plan;
    try { plan = JSON.parse(cleanJsonText(content)); }
    catch { return res.status(502).json({error:'The model returned invalid JSON. Try again or choose a model with structured-output support.'}); }
    res.json({plan, model:data.model || model, usage:data.usage || null});
  } catch (e) {
    console.error(e);
    res.status(500).json({error:'Unexpected server error.'});
  }
});

// app.listen(port, ()=>console.log(`DO running at http://localhost:${port}`)); # use it for local development

app.listen(port, ()=>console.log(`DO running at ${process.env.APP_URL}`)); // this is for production
