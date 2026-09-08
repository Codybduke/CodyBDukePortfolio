# Review: improvements to make

Cody's walkthrough notes plus Britton call (Gong, Sep 1, 2026, 30 min). Pass 1 shipped 2026-09-02. Pass 2 reviewed the same day. Do not change the prototype until we start the next pass.

## TLDR

Britton liked the four piles. Money is the why. On a person, Ellis needs to switch skills so he can see which one is worth the hour. Amounts are always on. The forecast stays — if this score goes up this many points, we have seen about this much more money — but Pass 1 put too many sentences around it. The winner is the number pair (`+9 pts → about $70K`) next to the score, with the explanation behind an info icon. Same treatment on Priority action. Cut the Fit-or-skill paragraph down to a small status. On the team Deals tab, add an Opportunity column so Ellis can scan for the person with the most money behind a skill gain. We present the idea; we do not invent the math.

## Pass 1 — shipped 2026-09-02

P0 and P1 are in the prototype. What changed:

- **Multi-skill model.** Five skills in the role profile (Value Based Discovery, Closing & Commitment, Objection Handling, Multithreading, Negotiation), each with its own scorecard, its own per-rep OSR, and its own score on every open deal. A deal with no scored call stays unscored on every skill, so coverage is a property of the deal and not of the skill you are looking at.
- **Skill switcher** on the person page, defaulting to the rep's weakest skill. The menu shows each skill's OSR and the money behind it, and tags the lowest score and the one with the most money. For Tara those are different skills — discovery is her weakest at 34, and Closing & Commitment has about $110K behind it against discovery's $70K. That is the Kyle Norton case, on screen.
- **Amounts always on.** The toggle is gone from the team view, the person page and the deal modal.
- **Dollars on the piles.** `8 ($349K)`, same size as the count, in parentheses, weight 500 rather than bold. Same treatment on the team stats and on each person's weak-and-stuck cell in the team table.
- **Forecast in all three places.** Beside the OSR gauge, on Priority action when it is empty, and in the set-focus modal where changing the skill, the sub-skill, the time window or the practice cadence moves both the predicted points and the dollars. The filled Priority action card keeps the number that was agreed, and week six is reported against it.
- **No fitted model.** `src/data/caliber/forecast.ts` is a labelled placeholder. The exposure figure is real open CRM value on deals below Proficient; only the points-to-dollars conversion is a stand-in. Every string says "about", "we have seen", "has gone with".
- **One correlation note**, on the Fit-or-skill info icon. Every other always-on caveat, the lead-source banner and the "after not because" alerts are out. Verified: person pages now render zero standing banners.
- **Quadrant reads as a quadrant.** Proficient-or-better on top, moving on the right, so the best outcome is top right.
- **Piles repeat as filter chips** above the deal table, with counts, dollars and a Clear.
- **Focus modal.** Skill is a dropdown, not "locked to the current view". Plain labels ("What Tara will practise", "Time window"). Practice-vs-live copy moved into a tooltip on Practice. Recommended deals are checked and listed first with the rule spelled out. No nested scroll: header and footer are pinned and only the body moves.
- **Dashed no-scored-call row** removed. The grey segment, the legend and the chip carry it.
- Number column headers right-aligned to match their cells.

Not done, deliberately: renaming Fit or skill / Open book by discovery score / Coverage (waiting on words), and the P2 craft list.

## Pass 2 — review 2026-09-02

Cody walked the shipped Pass 1. A lot of it is right. The page now has too many words, and the words that matter are hard to find. Do not start this pass until we say so.

### The page is too wordy

There is a lot to look at. Body copy that restates a chart, or that takes two sentences to say one number, is not earning its space. Next pass: less text, more scannable. Hide explanations behind info icons. Prefer a number, a status, or a short bullet over a paragraph.

### Forecast: keep the number, hide the essay

The "If this score moves" block is the biggest problem. The idea is good. The box and the two sentences are too much, and they do not feel attached to the gauge.

- **The winner:** `+9 pts → about $70K`, with an info icon next to it. That is the whole surface.
- **The rest goes in the tooltip.** The current copy — "$390K of Tara's open book sits behind below-Proficient discovery calls. Across customers, moving this score about 9 points has gone with about $70K more of a book like this closing." — is two sentences that read as a run-on. Rewrite it so a person can get it in one pass. Do not leave that wording as-is behind the icon.
- **It has to feel like the score.** The score needs to go up 9 points. If this score goes up 9 points, we are looking at about $70K. The number pair sits with the gauge, not in a separate green essay box.
- **Same treatment on Priority action**, empty and filled ("What this plan has been worth"). Headline number + info icon. No standing paragraph.

### Fit or skill: one status, not a recap

The paragraph under the four piles is describing the chart. "8 of Tara's 14 scored open deals — $349K — stalled after a Value Based Discovery call…" is already on the piles. "Which is the question you came in with" comes out.

The only useful bit is the last clause: most of the stall follows weak calls rather than the companies being wrong. Turn that into a **small status**, top-right of the card — something like "Looks like skill, not the leads" / "Looks like fit, not this skill". Nobody is going to read a paragraph that says nothing the chart did not already say.

### Filled Priority action: say what she will do

After a focus is set, "Tara practises this 2× a week and every live call on 8 watched deals is scored against it" does not parse. Make it **scannable bullets** of what Tara is going to do. Practice cadence, watched deals, what gets scored. A person should be able to glance and know the plan.

The "What this plan has been worth" block on that same card gets the compact forecast treatment above.

### Team Deals tab: Opportunity column

Add a column called **Opportunity**: what a realistic skill-point gain on this person equates to in money. Ellis is looking for the person with the most monetary opportunity to improve based on skill. That answer should be on the team table, not only after he opens someone.

## What the call changed

**He confirmed.** Ellis is the user. He comes in from a weekly digest or right before a 1:1 / team coaching. "Done" is: I know what we have been working on, whether it moved, and what to work on next. Calls already join to CRM deals with amounts. The four piles, the "bad call but the deal moved anyway" cell, filtering the deal list from a pile, and a dated focus are directionally right.

**He corrected.** Same skill score / different money is the rare case. The harder job is which skill gets the one hour. Kyle Norton at Owner: they were about to train discovery; closing was the higher-leverage hour.

**He asked us to add.** Make the revenue tie-in explicit. Hoist dollars onto the piles. On the focus: this window and this practice usually move the score by N points, and across customers that has gone with about $X. Correlation, not proof. They own the math.

## Decided (2026-09-02)

- **Skill switcher on the person page.** Dropdown to change which skill the page is about (OSR, piles, deals, forecast). Default to that person's **weakest** skill. This is how Ellis compares "which skill would do the most good."
- **Amounts always on.** Remove the toggle. Amp them up.
- **Dollars on the piles.** Next to the count, in parentheses, same type size, not bold. Example: **8** `($349K)`. Slightly less weight than the count, still right there.
- **Forecast is the most important change.** Presentation only; placeholder numbers are fine.
  - Next to the OSR gauge: if we can move this score, about this much more money.
  - On **Priority action**, even when no action is set: improving this skill by a realistic number of points could mean about this much more money.
  - In the **set-focus modal**: predicted points for *this* plan, and the dollars that go with it. Changing the skill / sub-skill, time window, or practices per week should change the predicted points (and therefore the dollars).
- **Correlation caveat:** one info icon, on **Fit or skill**. Pull every other always-on legal / "this does not cause the stall" / lead-source banner out of the UI.
- **No scored-call row:** remove the dashed block. Gray segment on the color bar plus its tooltip is enough.
- **Deals to watch:** keep checkboxes. No nested scroll. They live in the modal's single scroll.
- **Focus modal chrome:** shorter viewport. **Priority action** eyebrow + title stay put. **Set focus / Cancel** stay put. Only the body scrolls.
- **Open-deals number columns:** stay right-aligned. Right-align those headers too.
- **Progress on the six-week focus:** wait until money is on the card.
- **Names** (Fit or skill, Open book by discovery score, Coverage): skip. Decide later.
- **Coverage percent under the fraction:** skip until Coverage itself is understood.
- **When we start the pass / how big it is:** skip. Come back when we are ready to hit it.

## Still open

- Actual words for Fit or skill, Open book by discovery score, and Coverage.
- Exact words for the Fit-or-skill status ("Looks like skill, not the leads" is a stand-in).
- Exact rewrite of the forecast tooltip. Direction is locked: one clear pass, not the current run-on.
- What Coverage is, in plain language, and then whether the percent stays.
- Whether the set-focus modal forecast stays a full block or gets the same compact treatment. Not locked this review; the person page and Priority action are.

## Priority (updated)

### Shipped in Pass 1

- Skill dropdown on the person page. Default weakest.
- Amounts always visible. Dollars on the piles and on team weak-and-stuck.
- Forecast in three places (idea is right; presentation is Pass 2).
- One correlation tooltip on Fit or skill. Standing disclaimers out.
- Quadrant, filter chips, focus modal chrome, no nested deals scroll.

### P0 — Next pass: scan, do not essay

- Forecast next to the gauge: number pair + info icon only. No green essay box. Must read as "this score, up this many points."
- Same compact forecast on Priority action, empty and filled.
- Rewrite the tooltip copy. Current two sentences are confusing.
- Fit or skill: delete the recap paragraph. Small status, top-right of the card, for skill-vs-leads.
- Filled Priority action: replace the practice sentence with scannable bullets of what Tara will do.
- Team Deals tab: add an **Opportunity** column (realistic point gain → about $). Sort/scan for the biggest monetary opportunity.

### P1 — Still waiting on words

- Rename Fit or skill / Open book / Coverage when Cody picks words.
- Fit-or-skill status label: lock the words.

### P2 — Craft

- Top-align team stats.
- Team table: stalled-after-weak alignment.
- Person header labels: sentence case. Drop the practice-reps legal tooltip.
- Right-align number headers to match the cells.
- No em dashes in UI copy.
- Tooltips: sentence case; must not clip inside the modal.
- Real logo and icons when vectors arrive. (Nav lockup + six nav icons shipped separately 2026-09-02. Admin, search, and bell still stand-ins.)
- Library spacing, especially the filled Priority action card.
- AI line under Where discovery breaks down: two sentences, what to do. Keep the bars.

### P3 — Later

- Progress on the focus, after money is in.
- Multiple focuses at once. Parked.
- Custom time window. 4 / 6 / 8 is enough.
- Their heatmap collapse-vs-trend and red-stripe clipping. Out of scope. Keep our decline contrast.
- Clickable strength/growth icons on their Skill Report. Not this tab.

## What not to do

- Do not build a fitted revenue model.
- Do not claim this plan will cause $X for Tara. Say we see / associated.
- Do not hide amounts.
- Do not put a scroll inside the deals-to-watch list.
- Do not throw away the four piles.
- Do not put a standing paragraph under the piles that restates the piles.
- Do not leave the forecast explanation on the page. Number + icon. Tooltip for the rest.

## Call quotes to design against

- "If I can only tackle one to move the needle… which one, and why."
- "We believe that money is a compelling why."
- "Tara's got almost $350K of deals that are at risk because she's not executing this well."
- "None of it tells me how much are we leaving on the table."
- "I haven't given you the mathematical model and I don't want you to go figure out the mathematical model."
- "We can't definitively prove that these 10 points are going to be this much revenue… we see across the body of our user base that those 10 points move the needle."
