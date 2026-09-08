# Review: UX / PM critique of the live prototype

Walked `/proto/caliber-skill-on-deals` on port 4331, 2026-09-03. No prototype changes from this note. Checked against Ellis / Reid / Jordan, the packet Skill Intelligence screenshots, and the Component Library notes in `docs/figma-library.md`. Figma MCP was rate-limited this pass, so library checks are against that inspect plus the tokens already sampled into `caliber.css`.

## TLDR

The idea is right. The page still teaches every time Ellis opens it. Keep the four piles, the skill switcher, dollars on the counts, and the compact `+N pts → about $X` pair. Cut the rest of the essay. One forecast, next to the gauge. Empty cells should be empty. The primary button has to match the diagnosis: if this is not the skill, do not offer “Set six-week focus” as the thing to do. Two copy bugs (`1 deal ha s`, `Watch 8 deal s`) are real. Library: logo and six nav icons are correct; toggle, extra Admin item, 1160px shell vs 1440, and stand-in search/bell/Admin icons are not.

## What is already working

Do not undo these.

- Four piles as a classification, not a metric. Britton confirmed.
- Skill switcher defaults to weakest. Tara’s menu already shows the Kyle Norton case: discovery is lowest (34, about $70K), Closing & Commitment has the most money (about $110K).
- Amounts always on. Dollars in parentheses next to counts.
- Compact forecast pair exists. Direction is locked.
- Fit-or-skill status tag (`Looks like skill, not the leads`) instead of a recap paragraph.
- Honest states: Tara / Priya / Nate / Simone thin / Devon empty.
- Opportunity column is on the team Deals table.
- Focus modal: sticky header and footer, one scroll, recommended deals checked, plan inputs move the prediction.
- Correlation lives on one info icon.
- Caliber wordmark and the six SI nav icons are the official SVGs.

## The job, restated

Ellis opens this from a weekly digest or right before a 1:1. Done is: I know what we have been working on, whether it moved, and what to work on next. One hour. Which skill, and why (money).

Reid needs the right coaching on the right people. That is served by the switcher and the focus, not by a third surface.

Jordan needs a defensible skill → pipeline story. The Opportunity column and dollars on piles are the breadcrumb. This screen is not his dashboard.

## Learnability vs efficiency

The prototype is currently a walkthrough. That is correct for Britton and for a first visit. It is wrong for Ellis’s second visit.

| Keep for first visit | Cut for the weekly loop |
|---|---|
| 2×2 axes (Proficient / stalled) | Sentence inside every cell |
| Skill-menu notes: lowest score, most money | Repeating that as a paragraph under Priority action |
| Thin / empty refusals | Teaching copy that restates the refusal |
| One info icon on Fit or skill | A second, third, and fourth explanation of the same stall |
| Compact `+9 pts → about $70K` | The same pair again on Priority action |

**Efficiency default:** land Ellis on the dominant pile already filtered. For Tara that is the 8 / $349K cell. He can clear it. He should not have to hunt 19 deals to see the thing the page already decided.

**Learnability default:** keep the axes and the status tag. Anyone who has never seen a 2×2 can still read it. Anyone who has seen it only needs the number and the dollars.

## Noise vs signal

Ellis’s scan, in order:

1. Who.
2. Which skill, and whether another skill is worth more.
3. How much money sits behind the weak-and-stalled pile.
4. What she will practise this window — or the button to set it.

Everything else is supporting. Ranked:

**Signal (keep on the surface)**
- Name, skill switcher, OSR gauge, forecast pair
- Four piles with count + $
- Status tag (skill vs fit)
- Priority action as a plan, or a single CTA
- Team: who, OSR, coverage fraction, split bar, stalled-after-weak, Opportunity

**Supporting (keep, quieter)**
- Coverage as `14/19`, not as a hero percent
- Sub-skill bars (the top three only on first paint)
- Deal table, filtered to the active pile
- Skill-menu dollars

**Noise (cut or hide)**
- “Outperforming 14% of the team” on the person Ellis came to coach
- Live scored calls / Practice reps in the person header
- Cell sentences that repeat the axes
- Split bar + legend + filter chips all saying the same five buckets
- AI paragraph that restates the piles
- “No actions have been identified” next to Set six-week focus
- “What gets reported at week six” on a newly set plan
- Missing-amount footnote
- Zero-count quadrant cells with a diagnosis written on them
- Deal modal: gold banner + signals + stall footer all repeating idle days
- Presenter strip covering the deal table (prototype chrome, but it hides the product)

## Wording to change

US English, sentence case, no em dashes in product copy (already a P2 rule). British `practise` / `characterise` leak in.

| Now | Change to | Why |
|---|---|---|
| Fit or skill? | Still open. Best stand-in: **Skill or the book?** | “Fit” is our word, not Ellis’s. He said wrong companies vs bad first call. |
| Open book by discovery score | **Open deals by score** | “Book” is insider. Column is already next to a bar. |
| Coverage | Keep the fraction `14/19`. Drop the percent until the word is locked. | Ellis does not manage a coverage KPI. He manages missing calls. |
| Looks like skill, not the leads | Lock it. | Short, true, matches Tara. |
| Looks like fit, not this skill | Lock it. | Matches Priya. |
| Healthy | **Moving** | “Healthy” is a judgment the 2×2 is supposed to earn, not a label. |
| Consistent with a discovery gap | Drop from the cell. Keep in the tooltip. | The count and $ already say it. |
| Discovery was not the blocker here | Drop from the cell. | Same. Never show it on 0 deals. |
| Outperforming 14% of the team | Cut, or **7th of 8 on this skill** | Percentile-from-the-bottom on the coaching target reads as praise. |
| No actions have been identified. | Cut once a focus can be set. | Packet empty state. Contradicts the green button under it. |
| What this plan has been worth | **What we have seen this kind of plan go with** | Past tense on a plan you just set. And it is still association. |
| If Tara improves Value Based Discovery | **If this score moves** | The gauge is already this skill. |
| Little to recover here | Keep. | Honest. |
| most money behind it | **Highest $** | Scannable in the menu. |
| View Tara Whitfield Value Based Discovery calls | **View discovery calls** | The page already named her and the skill. |
| Where discovery breaks down | **Where it breaks down** | Skill is already selected. |
| Priority action for Tara Whitfield | **Priority action** | Name is in the header. |
| Practise | **Practice** | Matches “Practice reps” and the modal’s Practice picker. |
| characterise | **characterize** | Rest of the UI is US. |
| 1 deal ha s no amount… | **1 deal has no amount in CRM.** | JSX line-break bug. Then consider cutting the sentence. |
| Watch 8 deal s | **Watch 8 deals ($349K)** | Same bug. |

Forecast tooltip, still too long:

> If this score goes up about 9 points, we have seen about $70K more of a book like this close. $390K of Tara’s open deals sit behind below-Proficient discovery calls.

One pass:

> If this score goes up about 9 points, we have seen about $70K more close. That is against $390K sitting behind weak discovery calls.

## Design system

Checked against `figma-library.md` and the packet chrome. Could not re-export Colors / Type / Menus from Figma this pass (View-seat cap). Tokens in `caliber.css` were sampled from the four SI screenshots, which is still the right ground truth for the shipping product.

**Correct**
- Inter, Display 700 / 120%, Body 400 / 150%
- Brand lime `#6ee512` on primary buttons and picker
- Wordmark SVG, fill `#E5E5EA`
- Home / Courses / Role Plays / Paths / Analytics / Skills icons from the official 24×24 set
- Breadcrumb pills, lime checkbox, lime picker, dark tooltip, modal amber glow
- Tag tones mapped to OSR tiers

**Wrong or off**
- Content shell is **1160px**. Library Containers: SI width is **1440**. The team table is already cramped (Opportunity wraps, split bar is tight).
- Type extras not on the scale: 13, 11 (tags), 8.5 (OSR ticks / heatmap), 7 (NEW).
- Toggle is an iOS knob, system green. Library: pill with **Yes / On** vs **No / Off** inside the track, **lime** on.
- Skill / Deals tab badge is gray. Library pill tabs use a **red** badge.
- **Admin** is a seventh nav item. Packet SI chrome is six: Home, Courses, Role Plays, Paths, Analytics, Skills.
- Search, bell, Admin icons are still stroke stand-ins.
- Filter chips show an X and look dismissible. They are not.
- Sub-skill rows: green check on “strengths” whose bar is still orange. Icon and meter disagree.
- Target icon on the lowest three, check on the rest: fine as a pattern, but the checks on “Weakest three” inside the deal modal are the wrong metaphor.

## Screen by screen

### Team · Deals

Ellis’s list. He is looking for the person with the most money behind a skill gain.

- Opportunity column is the right add. Sort default should follow it, or follow stalled-after-weak. Today it is stalled-after-weak, which is Tara, which is fine for the walkthrough and slightly wrong for Britton’s “which hour” job once several reps have money.
- Five stats on top. Keep **Stalled after a weak call** as the hero. Open / scored / stalled-21 are supporting. Strong-stalled is the Priya contrast — keep, but do not equal-weight it with the coaching gap.
- Column **Open book by discovery score** is the longest label on the page and still needs the legend above the table. Rename. Consider dropping the legend once the bar has a hover.
- “Largest coaching gap on this team” on Tara is useful. “Thin data” / “No scored call” are useful. Do not also paint the row gold — the subline is enough.
- Tenure is fairness (Nate). Keep it quiet.

### Team · Skill

Keep as context. The footnote “This is the existing skill view, unchanged…” is presenter copy. Hide it for a founder walkthrough; it reads as us talking to ourselves.

Compare toggle should be the library Yes/On lime pill, not our knob.

### Person header

Too many competing numbers before the 2×2.

- Keep: name, skill switcher, gauge, forecast pair.
- Move or cut: outperforming line, four mini-stats, “View … calls” (or shorten).
- Coverage belongs as `14/19 scored`, not a 74% display number.
- Forecast sits with the gauge. Good. Do not repeat it.

Skill menu: good. Closed trigger showing `34 OSR` duplicates the gauge — show the dollar on the closed trigger instead (`about $70K`), keep OSR + notes in the open menu.

### Fit or skill

- Status tag: keep, top right.
- 0-count cells: do not render a diagnosis. Empty or omit.
- Cell body: count + $ only. Axis labels already say stalled vs moved, below vs proficient.
- Split bar under the 2×2 is a third encoding of the same split. Keep it or the chips, not both plus a legend.

### Where it breaks down

- First three sub-skills are the coaching input. The other five are proof she is not bad at everything. Collapse the bottom five.
- AI block still restates the piles. Two sentences, what to do, as already specified. Tara’s current paragraph is one long sentence.

### Priority action

**Empty**
- Cut “No actions have been identified.”
- Cut the duplicate forecast.
- If another skill has more money, that line is the most important sentence on the card. Make it the lead, not a footnote under a discovery forecast.
- Primary button must match the status:
  - Tara, skill gap → Set six-week focus
  - Priya, looks like fit → **Look at another skill** (or no primary, just the switcher hint)
  - Simone, thin → **Upload calls** (same as Devon)
  - Devon, empty → Upload calls; keep Set focus disabled

**Filled**
- Plan bullets: keep. Fix `deal s`. US spelling.
- Forecast pair: keep, one line.
- Cut “What gets reported at week six.” That is a week-six screen. Ellis setting the hour does not need a reporting syllabus.
- “What this plan has been worth” → association wording, not past-tense worth.

### Deal table

- Default filter = dominant pile.
- Chips are a fine filter. They currently repeat the 2×2 and the legend. If the 2×2 is the filter, the chips are redundant — or the 2×2 is the filter and the chips go.
- 19 rows unfiltered is noise. Stage + amount + last activity + latest score is enough. Scored-calls count and close-date-pushed can be deal-modal only.
- Footer sentence about missing amounts: one line or none.

### Deal modal (Vantage Freight)

- Header facts are good.
- Gold banner restates the 2×2 cell and the idle days. Cut it, or keep one clause.
- Signals repeat header facts (pushed, 52d idle, 58 days in stage). Keep only what the header does not say: no economic buyer, no next step.
- Sub-skill list + AI paragraph + “Weakest three” box = three statements of the same gap. Keep the bars and the weakest three. Cut the paragraph, or cut the box.
- Footer stall alert is a fourth restatement. Cut.
- If a focus already exists, **Add to six-week focus** should read **Add to this focus**.
- Info icon on every sub-skill is chrome. One help pattern is enough.

### Focus modal

- Forecast at the top can stay (plan inputs change it). Compact, not a second essay.
- `practise` vs `Practice` in the same modal. Pick Practice.
- Sub-skill descriptions under every option: keep on the selected one, hide on the rest.
- “Checked by default…” paragraph: one line. **Recommended = stalled after a weak call.**
- Eight watched deals is a lot for one hour. Default-check is right; show a “Watching 8 · $349K” summary and collapse the list.

### Simone (thin)

The gold alert is the truth. The page then ignores it: still draws a 2×2, still quotes +10 pts → $15K, still offers Set six-week focus, still suggests Closing. Pick one: refuse the characterisation, or allow a tentative read. Not both.

### Devon (empty)

Empty card is good. Then we also show an empty “Where it breaks down”, a disabled Set focus, and a 7-row unscored table. One empty, one upload button, the table of unscored deals. Cut the hollow breakdown card.

Contradiction: empty copy says he has 9 scored Objection Handling calls this window; the breakdown card says “No scored calls in this window.” Both are locally true (closed vs open). On screen they look like a bug. Say **none of them are on open deals**.

Defaulting Devon to Objection Handling (weakest OSR from closed-deal calls) is confusing when the live book is unscored on every skill.

### Nate (fairness)

Keep the weak-and-moving cell. That is the fairness argument. Make sure the status tag does not say “looks like skill” when deals are progressing. Do not let the forecast over-claim money on a book that is already moving.

## Copy bugs (fix with the next pass)

- `1 deal ha s no amount in CRM` — JSX split `ha` / `s`.
- `Watch 8 deal s` — same pattern on the filled plan.
- Apostrophes: `Simone ’s`, `Devon ’s` in a few strings.

## Priority for the next pass

### P0 — Scan, then act

- One forecast, next to the gauge. Remove it from empty Priority action.
- Cut “No actions have been identified.”
- 0-count cells: no diagnosis.
- Default the deal table to the dominant pile.
- Primary CTA matches the status (set focus / switch skill / upload calls).
- Cut “What gets reported at week six” from the filled card.
- Cell copy: number + $ only.
- Fix `ha s` / `deal s`.

### P1 — Words

- Lock Fit-or-skill, Open book, Coverage (or replace with the stand-ins above).
- Lock status tags.
- Rewrite the forecast tooltip to one pass.
- US spelling. Shorten “View … calls”. Drop outperforming % / header mini-stats.
- Simone: refuse or read, not both.
- Devon: one empty, one CTA. Align the two “scored calls” sentences.

### P2 — Library craft

- Shell 1440.
- Library toggle. Red tab badge. Six-item nav (drop Admin, or move it to the avatar menu).
- Real search / bell / Admin icons when they arrive.
- Filters that look dismissible should dismiss, or lose the X.
- Sub-skill icon vs bar color.
- Presenter strip: do not cover the table. Sit it lower or make it a right rail.
- No em dashes in product copy.

### P3 — Later

- Progress on the focus, after money is in.
- Collapse sub-skills 4–8.
- Deal-modal signal trim.
- Custom time window. Already out.

## What not to do

- Do not build a fitted revenue model.
- Do not claim the plan will cause $X.
- Do not hide amounts.
- Do not throw away the four piles.
- Do not put a standing paragraph under the piles.
- Do not add Reid or Jordan chrome to this screen.
- Do not start this pass until we say so.
