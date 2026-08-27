# DO.

> **An AI decision engine for messy real-world problems.**

DO is an experimental project exploring a simple question:

**What if you could tell an AI what you're trying to get done, in whatever messy way you naturally think about it, and it could figure out what needs to happen next?**

Not another to-do list.  
Not another AI chatbot.  
Not another productivity dashboard.

The goal is to reduce the amount of thinking required between:

> **“I need to do this.”**

and

> **“I'm doing it.”**

---

## The problem

Most productivity tools assume you already know what the problem looks like.

You create a goal, break it into tasks, set priorities, and start working.

But real life rarely works that way.

For example:

> My college is at 10. Breakfast arrives at 8:30. I need to complete my files and paste the pictures, but I haven't taken the printouts. The shop opens at 9:45. I also have to finish my ES project and submit a working software and hardware system before 8 PM. The hardware is done, but I haven't coded anything for the software yet.

That's not really a "task."

It's a **situation**.

There are deadlines, dependencies, things that are already done, things that aren't started, limited time, and decisions that need to be made.

The difficult part isn't necessarily doing each individual task.

It's figuring out:

- What matters most?
- What needs to happen first?
- What depends on what?
- What can happen in parallel?
- What is actually blocking me?
- What can wait?
- Where am I likely to run out of time?
- What's the next decision I need to make?

That's the problem DO is trying to solve.

---

## The idea

You give DO a situation in your own words.

It tries to turn that situation into something you can act on.

```text
Messy situation
       ↓
   Understand
       ↓
   Find goals
       ↓
 Find constraints
       ↓
 Find deadlines
       ↓
 Find dependencies
       ↓
 Identify blockers
       ↓
 Evaluate options
       ↓
 Reduce decisions
       ↓
  Next action
       ↓
    Execute
```

The user shouldn't have to do all of that thinking manually.

---

## What DO currently does

DO sends the user's situation to an LLM and asks it to identify things such as:

- **Goal** — what you're actually trying to accomplish
- **Constraints** — time, money, availability, location, etc.
- **Deadlines** — what has to happen and by when
- **Dependencies** — what needs to happen before something else
- **Blockers** — what's currently preventing progress
- **Risks** — what could make the plan fail
- **Decisions** — choices that need to be made
- **Next action** — what makes sense to do now
- **Plan** — a practical sequence toward the outcome

The interface then turns that analysis into something easier to understand and act on.

---

## It's not just for one type of problem

The input is intentionally open-ended.

You could give it:

```text
I have an exam tomorrow and haven't started studying.
```

or:

```text
I need to move out of my room this weekend but I have classes every day.
```

or:

```text
I need to prepare a presentation, travel 40 minutes to college,
and submit it before 2 PM.
```

or:

```text
I have ₹500 and need groceries for the week.
I don't have a vehicle.
```

or:

```text
I need to organize a small event for 20 people tomorrow.
```

Or something completely different.

That's important.

**DO isn't supposed to be a tea planner, study planner, or grocery planner.**

Those are just examples of situations it should eventually be able to handle.

---

## A simple example

Imagine you say:

> I want to make tea for four friends before it starts raining at 5.

The system might figure out that you need:

```text
Tea leaves
Milk
Sugar
Cups
Stove / lighter
```

Then it can figure out what's missing and help resolve the situation.

If milk is missing:

```text
Store
₹62
6 min away

vs.

Delivery
₹94
~30 min
```

Instead of making you research everything yourself, DO can surface the relevant trade-off:

> **Go to the store. You'll save ₹32 and still be back before the rain.**

The tea example is useful because it's easy to understand.

But the actual product isn't about tea.

The interesting question is whether the same approach works when the situation becomes much more complicated.

---

## The core principle

> **Don't give people more information. Give them fewer decisions.**

A good result isn't necessarily a long, detailed plan.

Sometimes the best result is simply:

> **Do this first.**

And then, once that's done:

> **Now do this.**

The product should reduce cognitive load rather than create another place where users have to manage information.

---

## How this differs from a normal productivity app

### Traditional productivity

```text
Goal
 ↓
Create tasks
 ↓
Organize tasks
 ↓
Prioritize tasks
 ↓
Figure out dependencies
 ↓
Figure out what to do
 ↓
Execute
```

A lot of the thinking still belongs to the user.

### DO

```text
Situation
 ↓
AI understands it
 ↓
AI identifies the structure
 ↓
AI evaluates constraints
 ↓
AI reduces the decisions
 ↓
User chooses / acts
 ↓
AI adapts
```

The ambition is to move more of the **planning and decision work** to the system while keeping the user in control.

---

## What this prototype is

This is an **early experimental prototype**.

It's intentionally small.

The current stack includes:

- HTML
- CSS
- JavaScript
- Node.js
- Express
- OpenRouter
- LLM-based situation analysis

There is currently no:

- Authentication
- Database
- Payments
- User accounts
- Complex agent framework
- External action integrations

That's intentional.

Right now, the goal isn't to build a giant productivity platform.

The goal is to test the core idea.

> **Can an AI take an arbitrary, messy real-world situation and turn it into something genuinely useful?**

---

## Run locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd do-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

Copy `.env.example` to `.env`.

```bash
cp .env.example .env
```

Add your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openrouter/auto
APP_URL=http://localhost:3000
```

### 4. Start the app

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

---

## OpenRouter

DO uses OpenRouter to access the language model.

The API key stays on the server and is never intended to be exposed to the browser.

For local development, keep your key in `.env`.

**Never commit `.env` to the repository.**

---

## Try to break it

This is probably the most useful thing you can do with the prototype.

Don't just give it perfect prompts.

Give it messy ones.

Include:

- incomplete information
- conflicting priorities
- multiple deadlines
- things you've already completed
- things you haven't started
- limited money
- limited time
- dependencies
- unexpected constraints

For example:

```text
I have college at 10, breakfast comes at 8:30,
I need to finish my files and get some photos printed,
the print shop opens at 9:45, and I also have an ES project
due at 8 PM. Hardware is already done but software hasn't
been coded. I also need to travel to college.
```

Then see where DO gets things wrong.

Those failures are valuable.

---

## What we're trying to learn

There are a few things this project needs to answer.

### 1. Can AI understand messy situations?

Not just clean prompts.

Real human input.

### 2. Can it identify what actually matters?

Finding ten tasks isn't useful if it misses the one deadline that matters.

### 3. Can it reason about dependencies?

For example:

```text
Print photos
     ↓
Paste photos
     ↓
Complete file
```

versus:

```text
Start software
     ↓
Integrate hardware
     ↓
Test
     ↓
Submit
```

### 4. Can it prioritize under constraints?

If you have six hours and five things to do, what should happen first?

### 5. Can it reduce cognitive load?

Does the system actually make the situation feel simpler?

### 6. Can it adapt?

If something changes, the plan shouldn't become useless.

---

## Building in public

DO is being built in public because this isn't a problem that should be solved from one person's assumptions.

I'm interested in seeing what happens when people from different backgrounds approach the same problem.

Contributions are welcome from:

- **Frontend developers**
- **Backend developers**
- **Full-stack developers**
- **AI/ML engineers**
- **Product researchers**
- **Product managers**
- **UI/UX designers**
- **Brand designers**
- **Growth marketers**
- **Content and technical writers**
- **Data and analytics people**
- **Students**
- **People who simply have strong opinions about the problem**

You don't need to be an expert in AI to contribute.

A designer might find a better way to reduce cognitive load.

A researcher might discover that users don't actually want what we assumed.

A developer might find a better architecture.

A marketer might find a completely different way to explain the product.

Someone using the prototype might find a situation where the whole approach breaks.

All of those are useful.

---

## What you can contribute

Some things we're interested in:

- Improving the decision-making pipeline
- Improving the UI and interaction model
- Reducing cognitive load
- Testing DO with real-world situations
- Finding failure cases
- Improving prompts and structured outputs
- Experimenting with different models
- Building evaluation datasets
- Designing better prioritization logic
- Researching how people actually plan everyday tasks
- Improving product positioning
- Improving onboarding
- Building useful integrations
- Writing documentation
- Creating experiments and case studies

Or propose something we haven't thought of.

---

## Building in public means showing the failures too

This project isn't going to pretend everything works.

If DO:

- makes a bad assumption
- misses an important dependency
- prioritizes the wrong thing
- gives an impossible plan
- misunderstands the user's goal
- creates unnecessary work
- asks too many questions

that's something worth reporting.

A good issue isn't just:

> "This doesn't work."

It's even better if you can show:

```text
Input
→ What DO understood
→ What it recommended
→ What it should have understood instead
```

That gives us something concrete to improve.

---

## Contributing

If you want to contribute, start with an issue or pull request.

For larger changes, it's useful to open an issue first so the direction can be discussed before implementation.

When contributing, keep one principle in mind:

> **The product should make the user's problem simpler, not add another layer of complexity.**

---

## Roadmap

The roadmap will change as we learn.

### Now

- [x] Basic interface
- [x] Natural-language situation input
- [x] LLM-powered analysis
- [x] Structured situation breakdown
- [x] Basic plan generation
- [x] OpenRouter integration

### Next

- [ ] Better decision modelling
- [ ] Better dependency handling
- [ ] Better prioritization
- [ ] Plan adaptation after changes
- [ ] More systematic evaluation
- [ ] Real-world user testing

### Later

Potential integrations could include:

- Weather
- Maps
- Calendar
- Shopping
- Local services
- Reminders
- Other tools that help DO move from planning to execution

These aren't assumptions about the final product. They're areas worth exploring if the core idea proves useful.

---

## Status

**Experimental / early prototype**

This project is being built to explore the product concept, interaction model, and underlying decision-making approach.

Expect rough edges.

If DO makes a bad assumption, misses a dependency, prioritizes something incorrectly, or gives you a plan that wouldn't work in the real world — that's useful information.

Those failures are part of the experiment.

---

## License

Add your preferred license here.
