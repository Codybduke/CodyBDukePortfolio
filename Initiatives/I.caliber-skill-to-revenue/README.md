# Skill → Revenue (Caliber working sample)

**Jira:** None — Caliber take-home, not an Entrata initiative  
**Status:** In progress  
**Deadline:** Packet says Tuesday, September 8, 2026. Britton's email said September 6. Confirm.  
**Submit:** britton@caliber.io, cc chris@caliber.io, then book the founder interview.

## Goal

Define how seller skill connects to deals and revenue, then design how a front-line sales manager uses that connection. The same work has to stand as a 60-minute founder walkthrough and later as a portfolio case study.

This is a one-day working sample, not a full product build. Sharp prioritization over coverage.

## Who it is for

| Audience | Weight | What they need |
|----------|--------|----------------|
| Front-line sales manager (Ellis) | Primary — design fully | Which skill gaps cost deals, who to coach on what, how team skill maps to outcomes |
| Individual rep | Secondary — design meaningfully | How my skill growth connects to my deals; what to practice next |
| CRO / revenue leader | Designed (added as an epic) | A defensible skill → pipeline → revenue story |

## Problems this initiative has to solve

These are the problems in the packet, stated as jobs. Holes are called out under each one.

### 1. There is no model for skill → deals → revenue

Caliber measures OSR (0–100) from scored calls and role-plays. Skill Intelligence cannot show whether skill growth moves revenue. They have not defined the connection. Defining it is the exercise.

**Holes**
- No deal value, ARR, currency, win/loss, close date, quota, or attainment in the product today.
- CRM is a lightweight object: id, name, stage names, last-updated, contacts. Used only to group calls.
- OSR grain is unclear: period roll-up is documented; per-call / per-deal score is implied by evaluations but not confirmed as a stored object.
- They want a back-of-napkin hypothesis, not a stats project. Correlation vs causation must be honest.
- Caliber's public site already claims Skill Intelligence "quantifies revenue upside." The product cannot. The design has to be the honest path to that claim, not a copy of the marketing.

### 2. Managers can see that a number is bad and cannot see why

Ellis: Tara creates a lot of deals and has no pipe coverage. He cannot tell bad-fit pipeline from weak discovery, urgency, or multi-threading. Metrics (create / progress / win) have too many variables underneath. Reports contradict each other. His workaround is paste transcripts into an LLM, then listen to calls himself.

**Holes**
- Today's dashboard is skill-centric (one skill, team heatmap, Skill Report). It is not deal-centric.
- Stage exists but is not treated as an outcome. No conversion rates between stages.
- No way to hold book quality / inbound vs outbound / tenure constant, which is the fairness problem he named.
- The Skill Report already lists strengths and growth areas and then shows "No actions have been identified." Diagnosis without a next step.

### 3. Coaching cannot be measured across six weeks

Ellis's director asks: what are you coaching, and how are you measuring it? His dream state is a six-week focus, practice counted, score climbing. He cannot check whether a rep actually did the agreed skill without listening to every call. He tried AI role-play and stopped because building scenarios took too long. If eight reps each have a different gap, he cannot stay on top of it — and he says they are mostly missing the same basics anyway.

**Holes**
- Priority action on the Skill Report is empty.
- No homework / practice / live-call accountability object in the current product.
- Role-play exists in the platform but is not wired to a manager-agreed focus.
- No "did the skill appear on live deals" view.

### 4. Training ROI cannot be closed

Reid wants to stop one-size-fits-all enablement and know whether training moved performance. Jordan already overlaid self/manager skill assessments on performance by hand and saw a correlation. He still cannot trust pipeline coverage ("wetting a thumb"). Both say the skill they most want to move is executive / value / commercial selling. Jordan splits win rate (late stage) from close rate (entered → closed) and says the leak is early.

**Holes**
- No CRO surface.
- No amount or win/loss, so no close-rate or dollar story is buildable from today's fields.
- Enablement is not a designed persona in the brief. Reid is pressure on the manager loop, not a third primary UI.
- Customer CRM data is messy; any "$X lost to discovery" claim will be disbelieved by the same people they sell to.

### 5. The working sample itself has to become a founder presentation and a portfolio case

This is our constraint, not Caliber's. The packet asks for a model, a manager flow on-system in Figma, a time log, and a 60-minute walkthrough. We also need a case study that can be shown later: decisions, tradeoffs, what AI did, what Figma did, and which prompts mattered.

**Holes**
- Packet deadline (Sept 8) and Britton's email (Sept 6) disagree.
- No NDA, but this is a real product problem they are working on. Case study publishing after the process needs a later decision.
- Fidelity, stack (Figma only vs Figma + proto), and second-persona depth are our call.

## What we will not solve in this initiative

- Dollar impact, quota, attainment, hiring, or ramp presented as fact on today's fields
- A fitted statistical model
- Rebuilding Skill Intelligence or the design system
- A new app information architecture
- Full PRD / stories / tests / proto on E.founder-case-study (that epic is the narrative around the other four)

## Epics

| Epic | Status | Solves | In this one-day sample |
|------|--------|--------|------------------------|
| [E.skill-revenue-model](E.skill-revenue-model/README.md) | In progress | Problem 1 | Yes — written model is core |
| [E.manager-skill-on-deals](E.manager-skill-on-deals/README.md) | Not started | Problem 2 | Yes — primary Figma flow |
| [E.six-week-coaching-loop](E.six-week-coaching-loop/README.md) | Not started | Problem 3 | Yes — secondary |
| [E.cro-revenue-story](E.cro-revenue-story/README.md) | Not started | Problem 4 | Yes — designed, not only articulated |
| [E.founder-case-study](E.founder-case-study/README.md) | Not started | Problem 5 | Yes — walkthrough + later portfolio |

Lifecycle: full Product OS on the four product epics (discovery → PRD → user stories → test cases → prototype → docs). E.founder-case-study stays a narrative epic. Sequence them in the table order so the model exists before any screen.

## Shared docs

- [docs/discovery.md](docs/discovery.md) — packet synthesis, current product, VOC
- [docs/process-log.md](docs/process-log.md) — every step in this process (internal)
- [E.skill-revenue-model/docs/model.md](E.skill-revenue-model/docs/model.md) — sendable model
- [E.founder-case-study/docs/time-log.md](E.founder-case-study/docs/time-log.md) — sendable time and tools
- [docs/britton-call-agenda.md](docs/britton-call-agenda.md) — 30-min Zoom with Britton

## Design system

- [Component library](https://www.figma.com/design/PRv7sjue5TZ7HBn7BhRBPb/Component-Library) — 27 pages, all inspected. Includes tokens, inputs, tags, modals, and app chrome (Menus — old IA labels). No heatmap or data table. See [docs/figma-library.md](docs/figma-library.md).
- [Brand / style guide](https://www.figma.com/design/O0YvFWtpyKN4U04TGbWyOb/Caliber-Brand) — not opened yet (tokens).

## Working hypothesis (belongs to E.skill-revenue-model)

Skill does not create revenue. Skill changes the odds that a deal of a given type progresses and closes. The unit of analysis is scored call → skill score on that call → the deal it belongs to → whether that deal progressed, stalled, won, or lost, and at what amount.

Current State §4: SI already **knows** OSR, scored calls, and a lightweight deal object. It is **aware of but does not use** amount, ARR, win/loss, stage progression, quota. Those unused fields are available to correlate — that is the net-new join, not a missing dataset. Using them gets you revenue *association* (close rate and $ by skill), not causation. The identification strategy is still a dated six-week focus (practice → live demonstration → deal outcomes), language “associated / after,” never “caused $X.”

See [E.skill-revenue-model/docs/causation.md](E.skill-revenue-model/docs/causation.md).
