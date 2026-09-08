# Manager: skill on deals

**Jira:** None  
**Status:** Prototype built  
**Solves:** Initiative problem 2

## TLDR

Ellis cannot tell bad-fit pipeline from weak discovery. The answer is a classification, not a metric: place every open deal by the score on its most recent live discovery call and by whether the deal has moved. That 2×2 says which of Tara's stalls follow a weak call and which do not, and a fifth bucket holds the deals with no scored call so the view refuses to characterise what it cannot see. Built as a coded prototype at `/proto/caliber-skill-on-deals` rather than Figma frames.

## Summary

Design the primary manager experience: how Ellis sees a skill on named deals so he can tell fit from skill.

This is an extension of Skill Intelligence, not a new product. The scene is Tara: many deals created, close dates slipping, no coverage. The question the UI has to make answerable is "is she booking the wrong companies, or can she not run discovery?"

## In

- On-system Figma, mid fidelity, reuse the current Skill Intelligence language
- One skill (default: Value Based Discovery)
- Team → person → deals, with stage / stall as the outcome proxy
- A Tara-class drill-in that leads to a next coaching action
- Empty, thin-data, and "do not overclaim" states

## Out

- Rebuilding the existing OSR heatmap from scratch
- ~~Dollar columns~~ — superseded, see below
- A full deal CRM
- Custom plans for eight different gaps (Ellis said that is the wrong problem)

### Dollar columns — resolved 2026-09-01

This README said "out." [causation.md](../E.skill-revenue-model/docs/causation.md), written after the Current State §4 correction, says this epic should show "amount + stage + win/loss when present." The later doc wins on the data question, but Ellis's problem is still not a dollar problem.

Resolved in the design instead of by fiat: a **Show deal amounts** toggle, default **off**. Stage plus days-since-activity is the primary outcome. Amounts are available for the CRO conversation without letting a dollar column become the headline. A deal with no amount in CRM falls back to stage and last activity rather than being dropped or estimated.

## The design

**Team → person → deal**, all inside the existing Skill Intelligence page.

1. **Team.** A new *Deals* tab beside the existing *Skill* tab. The Skill tab is the packet's OSR bar and heatmap, unchanged, kept as context — it answers who is low, not why. The Deals tab lists each rep with coverage and a stacked bar of how their open book splits. Ellis can see at a glance that Tara's bar is mostly "stalled after a weak call," Priya's is mostly "stalled after a strong call," and Nate's is mostly "moving after a weak call."
2. **Person.** The *Fit or skill?* panel: a 2×2 of discovery score (below Proficient / Proficient+) against movement (stalled 21+ days / moved recently), plus a fifth block for deals with no scored call. Clicking a cell filters the deal table. A written read below the matrix states the split in words and then says it is association.
3. **Deal.** One named deal: its scored calls in order, the sub-skill breakdown of the latest one, contacts, and signals (no economic buyer, close date pushed, no next step). Includes the reverse-causation caveat — a dying deal also produces poor calls.
4. **Next action.** The packet's empty "No actions have been identified." becomes a dated six-week focus: one sub-skill, a window, a practice count, and the specific deals whose stage and activity get reported at week six.

### The four states the data produces

Rather than a state switcher, the fabricated dataset produces each state naturally:

| Rep | State | What it proves |
|-----|-------|----------------|
| Tara Whitfield | 8 of 14 scored deals stalled after a weak call | The skill read Ellis came for |
| Priya Raman | 4 of 7 stalled after a *strong* call | Discovery does not explain it — fit, timing, or another skill |
| Nate Kowalski | Weak calls, deals moving anyway | The fairness case. Progression is not proof the discovery worked |
| Simone Alvarez | 3 scored deals of 8 | Thin data — the view refuses the characterising sentence |
| Devon Clarke | 0 of 7 open deals scored | Empty. Missing evidence is not a low score |

### Honesty rules on screen

No always-on legal banners. One correlation note, behind the **Fit or skill** info icon. Language stays associated / we see, never caused. Practice counted separately from live scores.

### Talk about in the founder review (not a formula on the screen)

**Money is the why.** Ellis opens this before a 1:1 or from a digest. The job is one hour of coaching: which skill, and why. Person page gets a skill switcher (default weakest). Dollars sit next to pile counts. Forecast on the gauge, on Priority action even when empty, and in the set-focus modal where window and practice change the predicted points. They own the math; we present it.

**Lead source is still not on the deal.** Secondary to money. Do not put it on the screen.

**The "same score, different money" story is the rare case.** The harder fork is this skill vs another skill. The person-page skill switcher is the cut we chose instead of a full skill-vs-skill product.

## Docs

- [docs/review-understanding.md](docs/review-understanding.md) — first walkthrough recap
- [docs/review-improvements.md](docs/review-improvements.md) — punch list; do not start until we go through it
- `docs/prd.md` and `docs/user-stories.md` when we leave discovery

## Prototype

**Coded**, at [`/proto/caliber-skill-on-deals`](../../../src/pages/proto/caliber-skill-on-deals.astro). Figma-first was the plan; the idea turned out to be a classification of a book that has to be filtered, sorted and drilled into, and static frames cannot show 85 deals re-grouping. Deep links (`#tara`, `#priya/strong-stalled`) exist so the walkthrough can jump between states.

Colors are sampled from the packet screenshots, not guessed — the Figma MCP quota was exhausted before the Colors page could be exported. Type is the library's Inter scale. Primitives map to named library pages; the icon set is a stroke-matched stand-in and should be swapped for their exports.
