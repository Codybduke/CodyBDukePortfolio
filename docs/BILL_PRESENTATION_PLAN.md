# BILL presentation implementation plan

This is the plan for the interview deck at `/present/bill`. It is not permission to build yet. Implementation waits for approval.

The older file at the repo root, `BILL_PRESENTATION_PLAN.md`, is a previous technical plan. It is not this document. The Move-In presentation, the case-study pages, and the rest of the portfolio stay as they are.

## What stays true

The rule in `.cursor/rules/bill-presentation.mdc` is the factual source. These figures stay as they are on the deck now.

- Move-in baseline: about 21% the same day, 36% the next morning, 43% later or never.
- Same-day 95%+, under 20 seconds, and about 60% less morning-after entry are targets. The 30% device figure stays off the slide.
- Move-in did not ship. Save move-in for sync can queue an offline move-in. Reconnect is an attempt. A conflict can need review.
- The upload was explored. It is not a shipped replacement for Bulk Move-In.
- Pricing results show 162 specials across 38 clients, and 8,290 lease-term specials across 278 clients.
- If someone asks for one more cut, the note uses 1,563 move-in-date specials across 155 clients.
- 10,204 and the older R1 2024 applicant-type count of 1,266 stay off this deck.
- The original path uses Edit Special and the empty rates editor. It does not use the Add Special file.
- Selection count is named only where the still shows it.
- Navigation, speaker notes, the timer, hash routing, and the Move-In prototype stay. The new dividers join that same system. They do not get a second navigator.

## Where the deck lives

The route is `/present/bill`, rendered by `src/pages/present/bill.astro`. Slide order, copy, and image paths live in `src/data/presentations/bill.ts`. The deck component is `src/components/presentations/BillDeck.tsx`. The opener stone is `src/components/presentations/BillOpener.tsx`, using stone set A (`public/models/stone-b.glb` and `public/models/stone-polished-b.glb`). Styles are `src/styles/bill-deck.css`, copied for this deck so the Move-In page is not in the blast radius.

There are 33 slides today. `line-shift` is number 9 in the room. Eight new chapter dividers raise the count to 41. `line-shift` stays the same slide. After the two Move-In dividers in front of it, it is number 11. Its id does not change.

`BillDeck` already has a `chapter` branch, copied from the older Move-In pattern: an eyebrow, a title, and an optional photograph. No BILL slide uses it. The eight new dividers use that branch only as a hook. The composition is the one in this plan, not a Move-In chapter slide pasted into this deck, and not a content slide restyled to stand in for one.

Keyboard navigation walks `billSlides` by index. The hash is `#` plus that position, starting at 1. Home, End, the counter, and the hash all follow the array. The new slides are entries in that array, in the order below. Old numeric hashes will land on different slides after the inserts. That is expected. Slide ids of the existing slides stay put.

## The new stills

These files were supplied for this pass. Copy them into `public/present/bill/` under the names below. Do not redraw them, and do not edit the attachments.

- `move-in-roster-phone.png` is the tilted Upcoming Move-ins phone. It replaces the home-screen still on `line-shift`. This file is already on `main`.
- `final-step-1-special-details.png` replaces the Special Details still.
- `final-step-2-recipients.png` replaces the Recipients still.
- `final-step-3-incentives.png` replaces the Incentives still. The gifts are unnamed placeholders. There is no iPad and no Apple Watch. This replacement is already on `main`. Do not put the older incentives still back.
- `final-space-options.png` replaces the expanded space-options still. Private Room, Private Unit, and Shared Room are visible, and the selection control reads 2.
- `final-lease-term-rates.png` replaces the lease-term still. The dialog sits on top of Incentives. The rows are still academic terms. This is the example. It is not a conventional 6-, 12-, or 18-month capture.

The phone mock already has its own ground, tilt, and shadow. It uses `contain` and does not get a second charcoal frame. The Pricing crops are flat UI. The frame goes around them in CSS.

The roster phone and the incentives replacement are on the remote. The other four replacements are not in `public/present/bill/` yet. Copy and push those four before a cloud run that uses them. Do not overwrite the two files that are already correct.

## The missing portrait

The about-me collage is a layout reference. It is not an asset to slice. The black-and-white plaid portrait with “I’m Cody” on it is not in the repo as its own file.

`public/images/cody-duke.jpg` may stand in so the scroll can be built and reviewed. That headshot is a different photograph. The About Me design is not fully approved until the plaid portrait is in the repo and reviewed on the slide. Do not crop the reference collage to fake it.

## Chapter dividers

The eight chapters are eight new slides. Four belong to Real-Time Move-Ins and four belong to Pricing Specials. Each one is inserted immediately before the first content slide of that chapter.

They are added. They do not replace, remove, or substantially redesign an existing slide to make room. `line-problem`, `line-role`, `line-shape`, `targets`, `pricing-problem`, `pricing-challenge`, `pricing-details`, and `pricing-results` stay content slides. They may still take the ordinary type, layout, and frame refinements in this plan. They do not become dividers. A giant icon behind the drive-through photograph is the wrong move. That photograph stays the evidence.

`chapter-move-measure` sits before `ai`, not before `targets`. `ai` is where the story turns from the phone flow to how the work was built and handed off. Its note already points at what engineering received and what would have counted. `targets` is the measurement slide that follows. Designing the Experience ends on `offline`.

Each divider is the same kind of slide.

- A dedicated 16:9 composition, full bleed, on the deck’s warm cream.
- One oversized Lucide outline, cropped by the frame the way the opener stone is cropped. The icon is a primary element, large enough to structure the slide. It is not a small accent and not a second 3D stone.
- A large, bold chapter title. The title is the chapter name. Divider titles are larger than the content-slide title. They are not an eyebrow.
- One consistent label on every divider: the case name and that case’s chapter number, in the same size and the same place. Move-Ins uses “Move-ins · 1” through “Move-ins · 4”. Pricing uses “Pricing · 1” through “Pricing · 4”.
- The same type, spacing, and stroke family on all eight. Icon placement and crop may shift a little so the title and the icon balance. That is the only variation.
- Little else. No photograph, no body paragraph, no marquee, no scrolling icon, no pulse.

Lucide is not installed. Draw the eight outlines inline. Do not add a package for them.

The small indicator comes after the divider, on the content slides of that chapter. It is the same icon at about 32px, with a 1.5–2px stroke, bottom-left, on the same pad as the title. Position, scale, and stroke stay the same from chapter to chapter. It does not cover type, a screenshot, prototype controls, or anything the room has to read. The divider itself does not also show the small icon.

Intro stays three slides. `intro-title`, `intro-gallery`, and `intro-timeline` do not get a chapter icon. `close` does not get one either.

The eight slides, in order:

| New slide | Title | Icon | Insert between | Small icon then on |
| --- | --- | --- | --- | --- |
| `chapter-move-problem` | Understanding the Problem | `search` | `intro-timeline` → `line-problem` | `line-problem`, `line-spreadsheet`, `line-baseline` |
| `chapter-move-approach` | Finding a Better Approach | `git-branch` | `line-baseline` → `line-role` | `line-role`, `line-upload`, `line-shift` |
| `chapter-move-experience` | Designing the Experience | `smartphone` | `line-shift` → `line-shape` | `line-shape`, `search`, `readiness`, `confirm`, `optional`, `required`, `offline` |
| `chapter-move-measure` | Building & Measuring | `target` | `offline` → `ai` | `ai`, `targets` |
| `chapter-pricing-problem` | The Problem | `list-tree` | `targets` → `pricing-problem` | `pricing-problem`, `pricing-original` |
| `chapter-pricing-explore` | Exploration & Testing | `pencil-ruler` | `pricing-original` → `pricing-challenge` | `pricing-challenge`, `pricing-v1`, `pricing-v2`, `pricing-testing`, `pricing-tradeoff` |
| `chapter-pricing-design` | The Final Design | `layers` | `pricing-tradeoff` → `pricing-details` | `pricing-details`, `pricing-recipients`, `pricing-incentives`, `pricing-space`, `pricing-lease` |
| `chapter-pricing-results` | Results & Takeaways | `chart-no-axes-column` | `pricing-lease` → `pricing-results` | `pricing-results`, `pricing-lessons` |

The deck grows by eight slides, from 33 to 41. Room order after the inserts:

1. `intro-title`
2. `intro-gallery`
3. `intro-timeline`
4. `chapter-move-problem`
5. `line-problem`
6. `line-spreadsheet`
7. `line-baseline`
8. `chapter-move-approach`
9. `line-role`
10. `line-upload`
11. `line-shift`
12. `chapter-move-experience`
13. `line-shape`
14. `search`
15. `readiness`
16. `confirm`
17. `optional`
18. `required`
19. `offline`
20. `chapter-move-measure`
21. `ai`
22. `targets`
23. `chapter-pricing-problem`
24. `pricing-problem`
25. `pricing-original`
26. `chapter-pricing-explore`
27. `pricing-challenge`
28. `pricing-v1`
29. `pricing-v2`
30. `pricing-testing`
31. `pricing-tradeoff`
32. `chapter-pricing-design`
33. `pricing-details`
34. `pricing-recipients`
35. `pricing-incentives`
36. `pricing-space`
37. `pricing-lease`
38. `chapter-pricing-results`
39. `pricing-results`
40. `pricing-lessons`
41. `close`

Each new divider gets a short speaker note: say the chapter name, then move on. Do not invent a new claim in that note. Existing notes on the content slides stay.

## How a slide should feel

Both projects use one title scale on content slides. Today the screen slides shrink the title below the feature slides, down to about 2rem. Raise screen titles to the feature-title size, `clamp(1.7rem, 2.5vw, 2.4rem)`, so Pricing and Move-In feel like one deck. Divider titles are a step larger than that. The chapter name is the display title. The case-and-number label stays small.

The body on a screenshot slide is one or two sentences. Captions stay one sentence, in the text column, not over the UI. Prototype slides do not add a second caption under the iframe. Divider slides have no body.

Whitespace uses the existing `--pad`. The title, the body, the screenshot inset, and the small icon share that inset. On a stacked screenshot slide the still is at least half the slide height at 1280×720. Two stills side by side is the maximum, and only where the story is a comparison: the original path, and V1 beside V2. A single final step is a hero.

The focal point is one thing. On a divider it is the cropped icon together with the large title. On a screenshot slide it is the UI. On a metric slide it is the number. The stone on the opener and the close stays the only 3D object.

Move-In’s live prototype and Pricing’s flat stills can look different and still belong together if the radius, the cream border, the charcoal field, and the title size match. The pre-composed phone on `line-shift` is the exception to the frame, because it already has one.

## Copy that changes

Everything else stays. These are the only wording changes.

`line-problem`, `line-role`, `line-shape`, `targets`, `pricing-problem`, `pricing-challenge`, `pricing-details`, and `pricing-results` keep their titles and bodies. The chapter names live on the new divider slides, not as replacement eyebrows and not by turning these slides into dividers.

`line-shift` keeps the title and the body. The caption and alt change, because the still is the roster, not the home screen.

> Alt: Upcoming move-ins on a phone, with Ready, Optional, Required, and Blocked on the list.
>
> Caption: Ready, Optional, Required, and Blocked are visible before anyone is opened.

Speaker note, added to the existing careful line: “Move-In also sits on the home screen they already open. This still is the roster, not that home screen.”

`pricing-incentives` title and body stay. The alt and the evidence note change to match the unnamed gifts.

> Alt: Add Special on Incentives, with two gift rows and a concession summarized as three space options.
>
> Evidence: Two gift rows and one concession. The concession is summarized as 3 Space Options. Price by Lease Term is on that row. The gifts in this still are placeholders, not a specific product list. The selection control is not on this screen.

`intro-gallery` title becomes “I’m Cody,” set on the portrait, as in the reference. The current sentence stays as the only line of body: “I spend most of my time with my family, and the rest on a car and on small machines I build because I want to see if I can.” Per-photo captions can remain if they fit under the track without turning the slide into a grid. If they collide with the scroll, they move to the speaker note and the slide keeps the one sentence.

## About me motion

The left side is a fixed, full-height portrait, rounded, and above everything that moves. The right side is one horizontal track of the personal photos, moving slowly left. Photos pass under the portrait and are clipped at its left edge, which is the edge of the slide. They do not reappear on the other side. If the track needs to loop, the duplicate exists only inside the right-hand clip and enters from the right.

`prefers-reduced-motion` stops the track and shows a still row. Chapter dividers do not use this motion. Their icons do not scroll.

The portrait in that first build is `public/images/cody-duke.jpg`. Call that out in review as a temporary stand-in. The scroll can be approved on its own. The About Me slide is not approved as a finished design until the plaid portrait is reviewed.

## Slide-by-slide

`chapter-move-problem` is the first new divider, between `intro-timeline` and `line-problem`. `line-problem` keeps the drive-through photograph, the title, and the body. `line-spreadsheet` keeps its photograph and copy, with the small search icon. `line-baseline` keeps the rings and the long title. The title is the claim. Do not shorten it into a label. If it wraps to three lines at 1280, let it wrap.

`chapter-move-approach` comes between `line-baseline` and `line-role`. `line-role` keeps its bullets. `line-upload` keeps the preflight still and the “explored, not shipped” note. `line-shift` keeps the new phone and the caption above. All three use the small git-branch icon.

`chapter-move-experience` comes between `line-shift` and `line-shape`. The six prototype slides keep their copy and the iframe. The readiness fallback is still the summary still. Do not swap the new roster phone onto those slides. It belongs on `line-shift`.

`chapter-move-measure` comes between `offline` and `ai`. `ai` keeps its copy and gains the small target icon. `targets` keeps the three metrics. Do not add a fourth metric. The title on the divider is “Building & Measuring.”

`chapter-pricing-problem` comes between `targets` and `pricing-problem`. `pricing-original` keeps Edit Special on the left and the empty rates editor on the right. Do not use `original-add-special.png`.

`chapter-pricing-explore` comes between `pricing-original` and `pricing-challenge`. `pricing-v1` and `pricing-v2` keep their stills and the point that V1 is a name, a value, and a cap, and V2 adds type. `pricing-testing` and `pricing-tradeoff` keep their copy. No participant counts, no 1% figure.

`chapter-pricing-design` comes between `pricing-tradeoff` and `pricing-details`. `pricing-details`, `pricing-recipients`, `pricing-incentives`, `pricing-space`, and `pricing-lease` use the new files and the small layers icon. The divider does not share the slide with the still. Space options is where the selection control is mentioned. Lease terms still need the spoken line that the season names are that property’s terms.

`chapter-pricing-results` comes between `pricing-lease` and `pricing-results`. The numbers stay 162 and 8,290. `pricing-lessons` keeps its three bullets and the small icon. `close` stays the stone, with no chapter icon.

## Files

- `src/data/presentations/bill.ts` for the eight new slide entries, paths, the few copy edits, and alts.
- `src/components/presentations/BillDeck.tsx` for the divider composition, the portrait track, the small chapter icon, and the screenshot frame markup.
- `src/styles/bill-deck.css` for the divider, the type scale, the icon crop, the frame, and the intro track.
- `public/present/bill/` for the stills.
- No change to `src/pages/present/move-in-scanner.astro`, `MoveInDeck`, or case-study data.

## Phases

1. Capture the current deck before any visual change. The pilot baseline is `intro-gallery`, `line-shift`, and `pricing-incentives` at 1280×720 and 1920×1080. `chapter-move-problem` does not exist yet. For that slide, the baseline context is the current transition from `intro-timeline` to `line-problem`. Do not claim a before screenshot of a slide that was not in the deck.
2. The roster phone and the incentives replacement are already on `main`. Copy the other four stills into `public/present/bill/` and push them before a cloud run that uses them.
3. Build the pilot only: `intro-gallery`, the new `chapter-move-problem`, `line-shift`, and `pricing-incentives`. This pass includes the portrait track, one new divider in the system above, the new phone, and the new Incentives still in the shared frame with the title scale. `line-problem` stays a content slide. Stop.
4. Independent review of those four rendered slides. The reviewer compares the three existing slides with their baselines. For `chapter-move-problem`, the reviewer judges the new slide. There is no before frame of it.
5. After approval, the same divider treatment is added at the other seven insertion points, and the remaining stills go in. Content slides keep their jobs.
6. Independent review of the full deck, again against the baseline for the slides that already existed.

Each group gets at most four refinement cycles, and stops after two cycles that do not visibly improve the slide.

## Pilot

The pilot is four slides.

- `intro-gallery` tests the portrait, the one-direction scroll, the clip under the portrait, and reduced motion.
- `chapter-move-problem` is new. Creating it is part of the pilot. It tests the divider family: cream ground, one cropped `search` icon, the large title “Understanding the Problem,” and the label “Move-ins · 1.” The other seven use that same frame. They wait until this one is approved. `line-problem` is not rebuilt into this slide.
- `line-shift` tests the roster phone, the corrected caption, and the small chapter icon beside a feature image. It stays a content slide.
- `pricing-incentives` tests the new product still, the charcoal and cream frame, the shared title scale, and a screenshot that stays legible beside type.

## Review

After the pilot, and again after the full deck, run `bill-visual-reviewer` in its own context. Give it the rendered slides at both sizes, the baselines for the slides that already existed, and the intended message of each slide. For `chapter-move-problem`, say that the slide is new and give the surrounding transition as context. Do not give the reviewer a fabricated before shot. Do not give it self-scores, self-critiques, or reasons for the design.

The reviewer scores hierarchy, legibility, consistency, storytelling, and polish. The report is a pass, a fail, or cannot verify, plus the three highest-impact changes per group. Critical and high findings get fixed inside the cycle cap. If the reviewer cannot see the screenshots, the gate is not passed.

## Done when

- Eight new dividers are in the sequence above. Each one is cream, one oversized cropped icon, a large bold chapter title, and the same case-and-number label. No motion, no photograph, no body.
- None of `line-problem`, `line-role`, `line-shape`, `targets`, `pricing-problem`, `pricing-challenge`, `pricing-details`, or `pricing-results` has been turned into a divider.
- Later slides in that chapter show the matching small icon, and it does not cover type, UI, or prototype controls.
- Content-slide titles share one scale across both projects. A screenshot slide’s title does not shrink to a label. Divider titles are the larger display title.
- The eight new slides are in `billSlides`, so arrows, Home, End, the counter, notes, the timer, and `#n` hashes include them.
- Screenshot stills are readable at 1280×720. No more than two side by side. The phone on `line-shift` is contained, not cropped into the bezel.
- Margins follow `--pad`. Nothing clips, overflows, or scrolls except the introduction track.
- The introduction track goes under the portrait and does not come out the other side. Reduced motion holds still.
- The plaid portrait is either reviewed in place, or the slide is explicitly still on the temporary headshot and not called finished.
- Metrics and product facts match the rule. The prototype, notes, timer, and other pages still work.
- The slides that already existed are a clear improvement on their baseline captures. The new divider is judged as a new slide.
