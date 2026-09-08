# How we show (and do not show) causation

Working model for skills → deals → revenue. Correlation-vs-causation read the brief asked for.

Corrected 2026-08-31: “aware of, but doesn’t use” is not “not in the dataset.” See Current State §4.

## TLDR

We can put deal value and won/lost next to skill scores. Skill Intelligence does not use those CRM fields yet; the brief says we may start. That shows skill and revenue **go together**. It does not show skill **caused** the money.

The closest honest version is a dated six-week focus: practice → live scores up on named deals → those deals moved → dollars followed. Say “after the focus,” never “caused $X.” Ellis still has to look at named deals to tell bad fit from weak skill — a dollar column does not do that for him.

## What the packet actually says about data

Two lists in [Skill Intelligence: Current State §4](https://docs.google.com/document/d/1dpE1ZtZ9qeDh7wBfdmKDPgnF5zKPOKnjuScBkc4wRiI):

| Bucket | Fields | Meaning for this exercise |
|--------|--------|---------------------------|
| Product **knows** (used in SI today) | OSR; scored calls; CRM deal as id, name, stage names, last-updated, contacts | Already joinable in the current UI (evaluations already group by deal) |
| **Aware of, doesn’t use** | Revenue / amount / ARR / currency; win rate / win-loss; stage progression as an outcome; quota / attainment / pipeline value; CRO roll-up | Available to correlate with skills. No revenue-impact surface to copy. Using them is the net-new work. |

Same section, after both lists: “We have this information defined above available, and can correlate/link skills with the above data.”

The Deep-Dive Brief’s “no dollar value, win/loss, or quota today” describes the **current SI object**, not a prohibition. Design may join the unused CRM fields. Jordan still will not trust them; uncertainty stays in the UI.

Remaining ambiguity (ask only if it changes a screen): “aware of” = already in Caliber’s CRM sync (queryable in v1) vs “we know Salesforce has Amount” (start capturing). For the sample, treat unused as joinable.

## Plain hypothesis

Skill does not create revenue. Skill changes the odds that a deal of a given type progresses and closes.

The unit of analysis is not the person-period OSR. It is:

**scored call → skill score on that call → the deal the call belongs to → whether that deal progressed, stalled, won, or lost — and at what amount.**

OSR is a roll-up of those calls. It is useful for “did Tara get better at discovery over six weeks.” It is the wrong grain for “did skill move this deal.”

## What “increased skill” and “increased revenue” can mean here

| Phrase | Honest meaning | Dishonest meaning |
|--------|----------------|-------------------|
| Increased skill | Live-call OSR on one skill rose for this person in this window; or later calls on the same deal scored higher | Composite OSR (live + role-play) went up, so they are better at selling |
| Increased revenue | Amount on won deals, or pipeline value that progressed, after the skill moved. Associated, not caused. | “Discovery caused $X” or “$Y lost to this gap” as a fact |
| Outcome (unused, now in play) | Amount, win/loss, stage progression on the same deal as the scored call | Quota/attainment as if book quality were held still |
| Fallback proxy (if amount/win-loss missing on a deal) | Current stage + recency of last-updated | Treating last-updated as conversion |
| Intervention | A dated Priority action / six-week focus | A heatmap cell turning green |

Role-play is evidence the intervention happened. It is not an outcome. Mixing it into the OSR you then line up against $ will manufacture a correlation.

## Claim ladder

Using unused CRM fields moves the ceiling from stall-association to **revenue association (L5)**. It does not move it to causal revenue (L6).

| Level | What we can say | Available? |
|-------|-----------------|------------|
| L0 Rank | Tara is Developing at Value Based Discovery | Yes — already in SI |
| L1 Co-occurrence | Her Developing discovery calls sit on early-stage / still-open deals | Yes — evaluations → deals |
| L2 Association with stall / $ | Deals with weak latest discovery score are staler, or carry more open $, than deals scored Proficient+ | Yes — unused amount + last-updated / stage. Still association |
| L3 Within-person change | After six weeks her live discovery OSR rose and her open $ is less stalled / more progressed | Yes — OSR trend + unused outcomes, same window. “After,” not “because” |
| L4 Contrasted change | Reps with a discovery focus moved stage / $ / close rate more than teammates focused elsewhere, same period | Yes if Priority action is a dated treatment and N is on screen |
| L5 Revenue association | Close rate and $ won differ by skill tier (Jordan’s close rate vs late-stage win rate) | Yes — this is what “aware of, doesn’t use” is for. Headline for CRO, not proof |
| L6 Causal revenue | Coaching this skill caused incremental closed revenue | No — needs L5 plus a real quasi-experiment and book-quality controls. Do not print |

The brief asked for a back-of-napkin model, not a stats project. We stop at the ladder and the identification strategy. No fitted formula.

## The identification strategy

Cross-sectional “high OSR people close more $” is what Jordan already did by hand. He saw a correlation and still called pipeline a wet thumb. That overlay is now **in scope** (unused win/loss + amount). It should not be the headline that implies causation.

The strongest design inside this packet:

1. Join live scored calls to named deals, and start **using** amount, win/loss, and stage progression on those deals.
2. Manager assigns one skill focus at T0 (empty Priority action becomes a timestamped treatment).
3. During the window, count practice separately from live scored calls on named deals.
4. At T0 + six weeks, for that person: live OSR on the focused skill, and what happened to those deals (progressed, stalled, won/lost, $).
5. If the team is large enough, contrast with teammates who did not have that focus.

That is still not causation of revenue. It is Ellis’s sports design with real CRM outcomes attached: one metric, six weeks, look at the tape, then look at the deals. Without T0, unused revenue fields only give a nicer correlation.

**Lag as the visible causal story**

If skill is doing work: practice rises first → live-call scores on that skill rise next → stage/$ on those deals move → closed $ follows, later than the skill change.

If $ moves and live skill does not, it is book or luck. If live skill rises and deals/$ do not, it is fit — Tara’s question.

**Mechanism check for discovery**

Jordan’s leak is close rate (entered → closed), not late-stage win rate. Value Based Discovery should associate with early-stage progression and close rate, not with “already in solution, then won.” If “better discovery” also lifts every other skill and late-stage win rate, it is a good-seller halo.

## Confounders (using amount does not remove these)

- **Fit vs skill (Tara).** Weak discovery and bad-fit pipeline can both produce lots of open $, early stage, slipping dates. Amount without source/fit still cannot split them. A human still has to inspect named deals.
- **Book quality, inbound vs outbound, tenure.** Quota/attainment are unused and joinable; lining OSR up against them without book quality is Ellis’s fairness problem.
- **Reverse causation.** Bigger or later-stage deals produce better-sounding calls. Score the call, then look at *subsequent* movement of that deal.
- **Selection.** Only uploaded transcripts exist. Low coverage is not low skill. $ on unscored deals cannot be attributed.
- **Jordan’s wet thumb.** The people they sell to already do not trust CRM coverage math. Putting unused amount on screen without N, coverage, and “associated” language is the overclaim.

## Uncertainty rules for the UI

- Every claim past L0 carries N calls, N deals, coverage (scored deals / open deals), and the window.
- Language: “associated with,” “after the focus.” Never “caused $X.”
- If N is too small for a trend, refuse the trend sentence.
- Separate live OSR, role-play/practice count, and deal outcomes ($ / win-loss / stage). Do not composite them into one “revenue impact” score.
- If amount or win/loss is missing on a given deal, fall back to stage + last-updated on that row. Do not drop the deal or invent $.

Lead source / inbound is still not in either list. That is the field we would still ask to capture, because it is the Tara/fairness split.

## Product implication

- **E.manager-skill-on-deals:** skill on named deals with unused amount + stage + win/loss when present; stall as fallback; coverage visible; Tara inspectable by a human.
- **E.six-week-coaching-loop:** dated focus; practice vs live demonstration vs deal outcomes ($ / progression / close); director-ready “after” not “because.”
- **E.cro-revenue-story:** same join rolled up — close rate vs win rate, $ associated with skill tier — labeled association, with the wet-thumb caveat on screen.

We do not show causation by computing it. We show it by joining unused CRM outcomes to scored calls, and by making the intervention inspectable at the grain a manager can still argue with.
