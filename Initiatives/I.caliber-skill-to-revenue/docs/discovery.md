# Discovery — Skill Intelligence packet

Raw input organized. Substance preserved. This is cross-epic research, not a persona invention.

**Sources**
- [START HERE](https://docs.google.com/document/d/1GzereGZsUJPjbBuaVSVfyBCSotud-tPPlkgVPrEiVP4)
- [Deep-Dive Brief](https://docs.google.com/document/d/1LOVvBxfvVSXCMEHhNSXyI0R40DpBuvjCfbBRkexlA9E)
- [Skill Intelligence: Current State](https://docs.google.com/document/d/1dpE1ZtZ9qeDh7wBfdmKDPgnF5zKPOKnjuScBkc4wRiI)
- [Voice of the Customer](https://docs.google.com/document/d/1KLG389cjReyPlMhMOqYU-yTM3_-Lgnr5Den0rAhyTU0)
- Britton Broderick email (working-sample invite)
- Caliber public site (company, Skill Intelligence claims) — supporting context only

## What Caliber is

Revenue skill transformation platform: expert-led courses, AI role-play, Skill Intelligence. Customers are reps, front-line managers, and revenue leaders. Chris Orlob is founder/CEO (Gong background). Britton Broderick is co-founder/CTO and owns the platform stack / Skill Intelligence engine. Chris (chris@caliber.io) is the other contact on this exercise.

## What Skill Intelligence is today

Analytics dashboard. One core metric: **OSR (Overall Skill Rating), 0–100**, from scored real calls and AI role-plays against a skill scorecard, rolled up per person, per skill, over a time window.

| Tier | OSR |
|------|-----|
| Novice | 0–19 |
| Developing | 20–39 |
| Proficient | 40–69 |
| Strong | 70–89 |
| Expert | 90–100 |

**Current UI (from packet screenshots)**
- Dark theme. Nav: Home, Courses, Role Plays, Paths, Analytics, Skills (NEW).
- Filters: Role profile (e.g. Mid Market AEs), Skill (e.g. Value Based Discovery), Teams/Members, Time frame (7 / 30 / 60 / 90 / 180 / all).
- Overall OSR bar for the selected skill (example: 65, Proficient).
- Team/individual heatmap with optional compare-to-prior-period (+N / −N, red regression overlay). Empty rows: "No data is available."
- Skill Report modal: team or individual, OSR gauge, "Outperforming X%," strengths, growth areas, AI-generated skill-breakdown copy, link to that person's/team's calls, **Priority action empty**.
- Skill Evaluations: table of scored calls, CRM deal name column, deal/opportunity filter.
- Admin: rollout banner, Add Call (single/bulk transcript upload).

**Example skill already on screen:** Value Based Discovery. Sub-skills in the report include Buyer's Journey Alignment, Active Listening, Agenda Alignment (strengths) and Negative Consequence Development, Root Cause Identification, Problem Clarity & Quantification (growth).

## Data: knows vs aware-of vs uses

§4 of the current-state doc is two lists, not one. They are not the same as “in the dataset” vs “missing.”

**The product knows (already in Skill Intelligence, used today)**
- OSR per rep, per skill, over time, plus trend
- Scored calls / evaluations
- CRM deal, used only to group calls: external id, name, stage names, last-updated, contact ids/emails

**It is aware of, but does not use (available to join; no revenue surface exists yet)**
- Revenue, deal value / amount, ARR, currency
- Win rate, win/loss, stage progression as an outcome
- Quota, attainment, pipeline value
- Any CRO / executive roll-up

The closer in that same section: “We have this information defined above available, and can correlate/link skills with the above data.” “Above” includes both lists. Connecting skills → deals → revenue is net-new because SI does not use the second list, not because those fields are forbidden or absent from CRM.

The Deep-Dive Brief still describes the *current SI object* as “name + stage; no dollar value, win/loss, or quota today.” That is what the product uses. It is not a ban on designing with the unused fields. VOC (Jordan) still says that CRM is not trusted — using amount is not the same as believing it.

## Voice of the customer (three real conversations)

Priority order is theirs.

### Ellis — front-line manager, mid-market, ~8 reps (primary)

- The space is guesswork. Random coaching, cannot tell if a skill shows up across all deals or one deal.
- Comes from sports: measure one metric for six weeks, look at the tape. Here he listens to calls manually.
- Does not trust CRM reports. Correlation is not causation: poor qualification / bad-fit deals vs good-fit deals that break later.
- Can see create / progress / win scores, not root cause. No stage-conversion rates. A rep with nothing closing can still look "good at creating pipeline."
- Workaround: paste discovery transcripts into an LLM with a scorecard. Scoring is wrong; no trend. Back to listening.
- Obvious gaps when he does listen: urgency, multi-threading / decision-makers. Hard to diagnose across the cycle and show improvement.
- Director wants coaching focuses and how he measures them. None of the reports work.
- Boss asks for customized plans per rep. He says they are all missing the same basics. Eight different gaps is unmanageable.
- **Tara:** lots of deals, no pipe coverage, close dates slip. Is she booking the wrong companies, or can she not run discovery / get the economic buyer / create urgency? He does not know what to tell her.
- Alarming basic gaps (no agenda, no follow-up that names consequence of inaction) even at high compensation.
- Fairness: newer reps with a poor book run better process than four-year inbound reps and are the ones at risk of being managed out. Baseline skill vs attainment.
- Accountability: "has Sam done the skill we agreed on for the next six weeks?"
- Tried AI role-play; blocked by the time to build scenarios.
- Dream: homework, six-week focus, practice twice a week, scores climb, he can tell his director.

### Reid + Nora — enablement, scaling connected-device company

- No objective read on skill gaps. Default to one-size-fits-all ("everyone needs a business case").
- Wants validated gaps, the right training to the right people, and whether training impacted performance.
- Do not actually know ramp time.
- Suspects the gap is executive / value selling as they move upmarket. Junior sellers need discovery, demo, multi-threading, champion, MAP, stall recovery — coached, not trained into a framework.
- Manager skill development is untouched. If managers do not reinforce, it looks like wasted spend.
- Culture: not cutthroat; they want reps to feel supported, not watched for a miss.

### Jordan — VP revenue performance, enterprise HCM

- Nobody defines the problem first; everyone runs off to fix whatever is top of mind. His job is predictable, scalable, measurable.
- Already ran a self + manager skill assessment overlaid on performance. Below-proficient on the assessment mapped to below-proficient performers.
- Biggest gaps: no clear methodology, account planning undefined, commercial acumen lacking.
- Same executive-selling gap: fine with CHRO, struggle with CIO/CFO/CEO (TCV, free cash flow, operating profit).
- Separates **win rate** (solution-stage → close, ~44%) from **close rate** (entered opportunity → close). Close rate is the weakness: converting early-stage into qualified.
- Correlation is easy to see; data is not clean enough to trust pipeline (3.5x / 4x is a wet thumb). RevOps investment has not caught up.
- Front-line leaders each default to how they did it at the last company.
- ~$1M spent on methodology, executive-selling training, and tooling. The real test is missing quarters in a row.

### What the packet says is consistent across all three

1. Cannot locate skill gaps objectively.
2. Metrics do not explain themselves — no root cause.
3. Cannot prove training moved the number. Two of them tried by hand.
4. They name correlation vs causation themselves. Messy CRM and confounders are everywhere.
5. The skill they most want to move is executive / value / commercial selling.
6. Fairness and accountability keep showing up.

## Evaluation criteria (from the brief)

Product strategy and the model · Research and user thinking · UX and visual craft (on-system) · Design-systems thinking · Communication and defense · Handling ambiguity (questions asked) · Judgment and honesty (scope, tradeoffs, time log).

AI is allowed. Disclose where it showed up. Questions count. Fidelity is our call.

## Early product bets (not locked)

- One skill: **Value Based Discovery** — already on their screens; maps to Tara, to Jordan's early-stage leak, and to Reid's "value up to the C-suite."
- Primary designed surface: manager, deal-centric slice of Skill Intelligence, not a new app.
- Secondary designed surface: six-week coaching / accountability loop (rep is visible inside it).
- CRO: designed as E.cro-revenue-story, same model, still no fake ARR.
- Outcome proxy now: stage + last-updated stall. Dollars later.
