# BILL presentation implementation plan

This is the plan for the interview deck at `/present/bill`. It is not permission to build yet. Implementation waits for approval, and a Cloud Agent waits until the replacement stills are on the remote.

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
- Navigation, speaker notes, the timer, hash routing, and the Move-In prototype stay.

## Where the deck lives

The route is `/present/bill`, rendered by `src/pages/present/bill.astro`. Slide order, copy, and image paths live in `src/data/presentations/bill.ts`. The deck component is `src/components/presentations/BillDeck.tsx`. The opener stone is `src/components/presentations/BillOpener.tsx`, using stone set A (`public/models/stone-b.glb` and `public/models/stone-polished-b.glb`). Styles are `src/styles/bill-deck.css`, copied for this deck so the Move-In page is not in the blast radius.

There are 33 slides today. Slide 9 in the room is `line-shift`. The eight chapter slides raise that count to 41, and `line-shift` will no longer be number 9.

## The new stills

These files were supplied for this pass. Copy them into `public/present/bill/` under the names below. Do not redraw them, and do not edit the attachments.

- `move-in-roster-phone.png` is the tilted Upcoming Move-ins phone. It replaces the home-screen still on `line-shift`.
- `final-step-1-special-details.png` replaces the Special Details still.
- `final-step-2-recipients.png` replaces the Recipients still.
- `final-step-3-incentives.png` replaces the Incentives still. The gifts are unnamed placeholders. There is no iPad and no Apple Watch.
- `final-space-options.png` replaces the expanded space-options still. Private Room, Private Unit, and Shared Room are visible, and the selection control reads 2.
- `final-lease-term-rates.png` replaces the lease-term still. The dialog sits on top of Incentives. The rows are still academic terms. This is the example. It is not a conventional 6-, 12-, or 18-month capture.

The phone mock already has its own ground, tilt, and shadow. It uses `contain` and does not get a second charcoal frame. The Pricing crops are flat UI. The frame goes around them in CSS.

Before a Cloud Agent runs, these six files are committed and pushed. This planning pass does not commit them. Local implementation can read the workspace, and cloud execution cannot start without them on the remote.

## The missing portrait

The about-me collage is a layout reference. It is not an asset to slice. The black-and-white plaid portrait with “I’m Cody” on it is not in the repo as its own file.

`public/images/cody-duke.jpg` may stand in so the scroll can be built and reviewed. That headshot is a different photograph. The About Me design is not fully approved until the plaid portrait is in the repo and reviewed on the slide. Do not crop the reference collage to fake it.

## Chapter system

The reference strip is the spec. Each chapter opens on its own full-bleed slide. The ground is the deck cream. One Lucide outline fills the frame in a light gray, cropped hard by the edges, the same way the stone is cut by the opener. The only type is a small label at the bottom-left, in the deck ink. There is no photograph, no body, and no display title on that slide. The icon does not scroll, pulse, or marquee.

These slides are added. They do not replace `line-problem`, `line-role`, or the other evidence slides. Those slides still carry the story. A giant icon behind the drive-through photo would not match the reference, and it would bury the photograph.

The small indicator on the following content slides is the same icon, about 32px, bottom-left, on the same pad as the title. It does not cover type, a screenshot, or the prototype. The chapter slide itself does not also show the small icon.

The eight slides, in order, with the label from the reference:

- `chapter-move-problem`, icon `search`, label “Understanding the Problem.” Insert before `line-problem`. Small icon then on `line-problem`, `line-spreadsheet`, `line-baseline`.
- `chapter-move-approach`, icon `git-branch`, label “Finding a Better Approach.” Insert before `line-role`. Small icon then on `line-role`, `line-upload`, `line-shift`.
- `chapter-move-experience`, icon `smartphone`, label “Designing the Experience.” Insert before `line-shape`. Small icon in the copy column on `line-shape`, `search`, `readiness`, `confirm`, `optional`, `required`, `offline`.
- `chapter-move-measure`, icon `target`, label “Handoff & Measured Targets.” Insert before `targets`. `ai` stays where it is and uses the small target icon. The numbers on `targets` stay the focal point. The label matches the reference, not “Building and measuring.”
- `chapter-pricing-problem`, icon `list-tree`, label “The Problem.” Insert before `pricing-problem`. Small icon on `pricing-problem` and `pricing-original`.
- `chapter-pricing-explore`, icon `pencil-ruler`, label “Exploration & Testing.” Insert before `pricing-challenge`. Small icon on `pricing-challenge`, `pricing-v1`, `pricing-v2`, `pricing-testing`, `pricing-tradeoff`.
- `chapter-pricing-design`, icon `layers`, label “The Final Design.” Insert before `pricing-details`. Small icon on `pricing-details`, `pricing-recipients`, `pricing-incentives`, `pricing-space`, `pricing-lease`. The stills keep the frame. The icon does not share that slide.
- `chapter-pricing-results`, icon `chart-no-axes-column`, label “Results & Takeaways.” Insert before `pricing-results`. Small icon on `pricing-results` and `pricing-lessons`.

Lucide is not installed. Draw these eight outlines inline. Do not add a package for them. The deck grows by eight slides, from 33 to 41. That is the cost of matching the reference without deleting a story slide.

## How a slide should feel

Both projects use one title scale. Today the screen slides shrink the title below the feature slides, down to about 2rem. Raise screen titles to the feature-title size, `clamp(1.7rem, 2.5vw, 2.4rem)`, so Pricing and Move-In feel like one deck. Chapter slides do not use that title scale. Their label is small, about the size of an eyebrow, sitting bottom-left under the cropped icon.

The body on a screenshot slide is one or two sentences. Captions stay one sentence, in the text column, not over the UI. Prototype slides do not add a second caption under the iframe.

Whitespace uses the existing `--pad`. The title, the body, the screenshot inset, and the small icon share that inset. On a stacked screenshot slide the still is at least half the slide height at 1280×720. Two stills side by side is the maximum, and only where the story is a comparison: the original path, and V1 beside V2. A single final step is a hero.

The focal point is one thing. On a chapter slide it is the cropped icon. On a screenshot slide it is the UI. On a metric slide it is the number. The stone on the opener and the close stays the only 3D object.

Move-In’s live prototype and Pricing’s flat stills can look different and still belong together if the radius, the cream border, the charcoal field, and the title size match. The pre-composed phone on slide 9 is the exception to the frame, because it already has one.

## Copy that changes

Everything else stays. These are the only wording changes.

`line-problem`, `line-role`, `line-shape`, `targets`, `pricing-problem`, `pricing-challenge`, `pricing-details`, and `pricing-results` keep their titles and bodies. The chapter names live on the new divider slides, not as replacement eyebrows.

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

`prefers-reduced-motion` stops the track and shows a still row. Chapter slides do not use this motion.

The portrait in that first build is `public/images/cody-duke.jpg`. Call that out in review as a temporary stand-in. The scroll can be approved on its own. The About Me slide is not approved as a finished design until the plaid portrait is reviewed.

## Slide-by-slide

Intro stays three slides. `intro-title` and `close` keep the stone and do not gain a chapter icon. `intro-timeline` keeps its three stops. No icon.

`chapter-move-problem` is the first new divider, immediately before `line-problem`. `line-problem` keeps the drive-through photograph, the title, and the body. `line-spreadsheet` keeps its photograph and copy, with the small search icon. `line-baseline` keeps the rings and the long title. The title is the claim. Do not shorten it into a label. If it wraps to three lines at 1280, let it wrap.

`chapter-move-approach` comes before `line-role`. `line-role` keeps its bullets. `line-upload` keeps the preflight still and the “explored, not shipped” note. `line-shift` keeps the new phone and the caption above. All three use the small git-branch icon. Slide 9 in today’s deck is `line-shift`. After the four Move-In dividers in front of it, its number in the room will change. The id stays `line-shift`.

`chapter-move-experience` comes before `line-shape`. The six prototype slides keep their copy and the iframe. The readiness fallback is still the summary still. Do not swap the new roster phone onto those slides. It belongs on `line-shift`.

`ai` keeps its copy and gains the small target icon. `chapter-move-measure` comes before `targets`. Do not add a fourth metric.

`chapter-pricing-problem` comes before `pricing-problem`. `pricing-original` keeps Edit Special on the left and the empty rates editor on the right. Do not use `original-add-special.png`.

`chapter-pricing-explore` comes before `pricing-challenge`. `pricing-v1` and `pricing-v2` keep their stills and the point that V1 is a name, a value, and a cap, and V2 adds type. `pricing-testing` and `pricing-tradeoff` keep their copy. No participant counts, no 1% figure.

`chapter-pricing-design` comes before `pricing-details`. `pricing-details`, `pricing-recipients`, `pricing-incentives`, `pricing-space`, and `pricing-lease` use the new files and the small layers icon. The divider does not share the slide with the still. Space options is where the selection control is mentioned. Lease terms still need the spoken line that the season names are that property’s terms.

`chapter-pricing-results` comes before `pricing-results`. The numbers stay 162 and 8,290. `pricing-lessons` keeps its three bullets and the small icon.

## Files

- `src/data/presentations/bill.ts` for paths, eyebrows, the few copy edits, and alts.
- `src/components/presentations/BillDeck.tsx` for the portrait track, the chapter icon, and the screenshot frame markup.
- `src/styles/bill-deck.css` for type scale, icon crop, frame, and the intro track.
- `public/present/bill/` for the six stills.
- No change to `src/pages/present/move-in-scanner.astro`, `MoveInDeck`, or case-study data.

## Phases

1. Capture the four pilot slides at 1280×720 and 1920×1080 before any visual change. That set is the baseline the reviewer compares against.
2. Copy the six stills into `public/present/bill/`. Commit and push them before any cloud execution.
3. Build the pilot only: `intro-gallery`, `chapter-move-problem`, `line-shift`, and `pricing-incentives`. This pass includes the portrait track, one full-bleed chapter slide in the reference treatment, the new phone, and the new Incentives still in the shared frame with the title scale. Stop.
4. Independent review of those four rendered slides, against the baseline, without self-scores.
5. After approval, the same treatments go through the rest of the chapters and the remaining stills.
6. Independent review of the full deck, again against the baseline for the slides that changed.

Each group gets at most four refinement cycles, and stops after two cycles that do not visibly improve the slide.

## Pilot

The pilot is four slides, not three.

- `intro-gallery` tests the portrait, the one-direction scroll, the clip under the portrait, and reduced motion.
- `chapter-move-problem` tests a chapter slide against the reference: cream ground, one cropped light-gray `search` icon, and the small label “Understanding the Problem.” `line-problem` is not rebuilt into that slide.
- `line-shift` tests the new phone still, the corrected caption, and the small chapter icon beside a feature image.
- `pricing-incentives` tests the new product still, the charcoal and cream frame, the shared title scale, and a screenshot that stays legible beside type.

`chapter-move-problem` is the chapter sample because it is the first of the eight, and the other seven use the same frame. They do not need to be in the pilot if this one matches the reference.

## Review

After the pilot, and again after the full deck, run `bill-visual-reviewer` in its own context. Give it the rendered slides at both sizes, the baseline captures, and the intended message of each slide. Do not give it self-scores, self-critiques, or reasons for the design.

The reviewer scores hierarchy, legibility, consistency, storytelling, and polish. The report is a pass, a fail, or cannot verify, plus the three highest-impact changes per group. Not a list of nits. Critical and high findings get fixed inside the cycle cap. If the reviewer cannot see the screenshots, the gate is not passed.

## Done when

- Each chapter opens on its own full-bleed slide, matching the reference: cream ground, one light-gray cropped icon, small bottom-left label, no motion, no photograph.
- Later slides in that chapter show the matching small icon, and it does not cover type or UI.
- Titles share one scale across both projects. A screenshot slide’s title does not shrink to a label. Chapter slides do not use a display title.
- Screenshot stills are readable at 1280×720. No more than two side by side. The phone on slide 9 is contained, not cropped into the bezel.
- Margins follow `--pad`. Nothing clips, overflows, or scrolls except the introduction track.
- The introduction track goes under the portrait and does not come out the other side. Reduced motion holds still.
- The plaid portrait is either reviewed in place, or the slide is explicitly still on the temporary headshot and not called finished.
- Metrics and product facts match the rule. The prototype, notes, timer, and other pages still work.
- The new deck is a clear improvement on the baseline captures, not only a restyle that still fits.
