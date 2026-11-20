# BILL interview presentation plan

This file is an earlier technical plan. It is not the approved plan. Use `docs/BILL_PRESENTATION_PLAN.md` and `.cursor/rules/bill-presentation.mdc`. Do not put 10,204 or the 1,266 applicant-type count on the deck from the notes below.

Technical direction that stays: dedicated `/present/bill`, a separate `BillDeck`, and the existing Presentation control in the hidden resume menu. No public nav link. Do not implement until this revision is approved.

Prepared material is about **36:00** across **35 slides**. The extra room inside the 45-minute onsite is for questions. The first cut if the prototype runs long is slide 17.

Final adjustments, approved with the build:

- The results slide is two slides. Results leads with 162 multi-incentive specials across 38 clients, and labels 10,204 active specials across 337 clients as overall platform usage. Lessons learned is the next slide: product-wide consistency, advanced features off the default path, and a success metric chosen before development.
- Launch bugs and the engineering fix stay in the results speaker note. The note does not say Cody led that fix.
- Speaker notes lead with the point and the transition. Evidence and qualifications sit under those two lines.
- The live prototype is loaded for manual use, with a screenshot fallback if it fails. Automatic scene positioning is not part of the build.

This file is the review copy. Do not build the deck until it is approved.

## 1. Current presentation architecture

The live deck is a full-viewport Astro page plus a client React island. [src/pages/present/move-in-scanner.astro](src/pages/present/move-in-scanner.astro) owns the editorial CSS and mounts [src/components/presentations/MoveInDeck.tsx](src/components/presentations/MoveInDeck.tsx). Slide content lives in [src/data/presentations/move-in-scanner.ts](src/data/presentations/move-in-scanner.ts).

Keep for BILL:

- Layouts already in the deck: `title`, `chapter`, `statement`, `split`, `prose`, `metrics`, `rings`, `compare`.
- Hash navigation (`#1` …) via `history.replaceState`, plus arrow keys, space, Page Up/Down, Home, End, and on-screen prev/next.
- A same-origin iframe of `/prototypes/oxp-mobile/`, opened with `labSrc()` from [src/components/presentations/proto-driver.ts](src/components/presentations/proto-driver.ts). `driveScene()` exists and is not called by `MoveInDeck`. Today the presenter drives the phone by hand.
- `noindex, nofollow`. The deck is not in site navigation.

Leave the Move-In page, `MoveInDeck`, and `slides` / `slidesB` **byte-for-byte**. Do not extract their CSS into a shared file. A shared stylesheet is an unnecessary refactor, and any shared edit could restyle the deck this interview still depends on. `bill.astro` gets its own copy of that style block, with a one-line comment that it was copied from the Move-In page and is intentionally separate. New BILL-only layouts (`bio`, `screens`, `placeholder`) are scoped to the BILL page.

[src/pages/present/bill.astro](src/pages/present/bill.astro) is already a `noindex` stub. Use it. Do not add a second route.

## 2. Secret resume menu

[src/components/resume/ResumeKit.tsx](src/components/resume/ResumeKit.tsx) opens on double-tap `M`. Presentation is hardcoded disabled. `doc === 'presentation'` falls back to the resume view.

BILL is already the only company with a destination, in [src/data/applications.ts](src/data/applications.ts): `presentationPath: '/present/bill'`. Astro’s default `trailingSlash: 'ignore'` serves `/present/bill` and `/present/bill/`. Use that path.

Menu change, and nothing else:

- While the selected company has `presentationPath`, that control is a link to `withBase(presentationPath)`.
- Every other company keeps the disabled button and the current title.
- Do not add a per-row button, change the `M` shortcut, or touch resume, cover letter, or ATS behavior.
- Leave the menu label `Bill`.
- The menu is anchored to the bottom of the window. With every company listed, its top (Document controls, then Bill) ran above the window at 720px and 900px tall. It now scrolls inside itself (`max-height` and `overflow-y: auto` on `.kit-menu`). Nothing else about the menu changed.

## 3. Route and files

- [src/pages/present/bill.astro](src/pages/present/bill.astro) — same document shell as Move-In (fonts, `noindex`, full viewport) and a **copied** style block. Title: `Cody Duke · BILL`. Mount `BillDeck` with `client:load` and `protoSrc={withBase('/prototypes/oxp-mobile/')}`.
- [src/components/presentations/BillDeck.tsx](src/components/presentations/BillDeck.tsx) — one deck. Duplicate the navigation loop. Do not import `MoveInDeck`.
- [src/data/presentations/bill.ts](src/data/presentations/bill.ts) — ordered slides, notes, and minute marks. Reuse Move-In slide objects by id where the words stay true. Override copy in this file only. Do not edit `slides` or `slidesB`.
- [src/components/resume/ResumeKit.tsx](src/components/resume/ResumeKit.tsx) — Presentation link only when `presentationPath` is set.
- At implementation, **copy** mapped images into `public/present/bill/`. Do not move or rename the originals under `Job Applications/companies/Bill/`.
- Do not touch [src/pages/present/move-in-scanner.astro](src/pages/present/move-in-scanner.astro), [src/components/presentations/MoveInDeck.tsx](src/components/presentations/MoveInDeck.tsx), or [src/data/presentations/move-in-scanner.ts](src/data/presentations/move-in-scanner.ts).

BILL-only slide fields: `notes` (the five-part note below), `fallback` for a failed prototype. New layouts in `BillDeck` only:

- `bio` — one photo and a few short lines.
- `screens` — one to three real images, each with a one-sentence caption.
- `placeholder` — used only for personal photos that are not in the repo. Never for Pricing.

### Prototype control

Do not call `driveScene`. Automatic scene positioning is out of the build so a missed label cannot disturb the live phone.

- Load the iframe once with `labSrc()`, same origin, and leave it interactive for the whole deck.
- Arrow keys, space, and the on-screen buttons move slides. Clicks inside the phone move the prototype.
- If the iframe errors or does not load within about 12 seconds, cover that pane with the slide’s fallback still and a link that opens the same `labSrc` URL in a new tab.
- Keep the iframe in the page when the fallback is showing, so a late load can replace the still.

### Speaker notes and timer

Notes are hidden by default so a Zoom share does not show them. `N` toggles a bottom band. Each note is scannable, not a script. On screen, the order is:

- Point, then the transition to the next slide. These two lines are the ones to read while talking.
- Evidence and qualifications, in smaller type under those lines.
- Time, kept in the data for rehearsal. It does not need to dominate the band.

Timer: elapsed `m:ss` in the control pill, started on the first forward navigation, toggled with `T`, off on load. Not a countdown.

## 4. Local Pricing assets

Inspected `/Users/codyduke/Documents/Cursor/cody-duke-portfolio/Job Applications/companies/Bill` on this revision. Nothing was moved. Filenames below are the originals, including the folder typo `Specails Before` and `Epmpty`.

### On a slide

| Source file | Size | What it shows | Slide |
| --- | --- | --- | --- |
| `Specails Before/Original add screen.png` | 520×721 | Add Special modal. Special Type is a single dropdown set to Discount. One discount name. Footer button is Continue to Pricing. | 22 |
| `Specails Before/Original edit screen.png` | 667×726 | A second modal, Edit Special: name, recipients, dates, coupon, cap, media. The record is not on the add screen. | 23 |
| `Specails Before/Step 3 - Rates Editor Screenshot.png` | 1777×1074 | Bulk Edit Pricing - Prospect Rents. General charge grid (charge timing, charge code, amount, tax, lease terms, schedule updates) after a toast that special settings were saved. The grid is empty. This is the surface Continue to Pricing opened. | 23 |
| `Research findings and notes images/Frame 425.png` | 1469×827 | Create Tiered Offer. A red note on the image says the "or" label is a selectable special and parentheses grouped selectable specials. This is the workaround for one incentive per special. | 22 |
| `Research findings and notes images/Frame 328.png` | 1059×898 | Three parallel journeys: new application, renewal, and promo code. Each ends in picking an incentive, an automatic credit, and the property delivering a gift. Not a role swimlane. | 24 |
| `Research findings and notes images/Frame 422.png` | 1512×873 | Google Sheet "Pick your Perk", last edit line names Robert Jones. Stepped fields, AND/OR gifts and a discount, "How many items can be selected?", and a step that says use the existing rates editor. Red notes on the sheet say the steps are a popup and that discounts link to that editor. | 25 |
| `Early Wizard Explorations/V1 Step 1.png` | 933×930 | First wizard. Step One, Step Two, Step Three. Long Special Details form, plus open dropdowns for Gift Incentive / Discount and date criteria. | 26 |
| `Early Wizard Explorations/V1 Step 2.png` | 643×678 | Step Two, Items to Offer: several gifts and a rent discount, and "How many items can be selected?" | 26 |
| `Early Wizard Explorations/V3 Step 1.png` | 1165×668 | Later pass. Two steps only: General and Incentives. Shorter details form. | 27 |
| `Final Designs/Add Special_ Step 1.png` | 1440×880 | Shipped Special Details: name, descriptions, a few toggles. Steps read Special Details, Recipients, Incentives. | 27, 29 |
| `Final Designs/Add Special_ Step 2, Prospects.png` | 1440×880 | Shipped Recipients: Prospects checked, qualification trigger, lease terms, floor plans / unit types / units, space options defaulted to all. | 29 |
| `Final Designs/Step 3_ 3 Incentives, gifts & Concessions.png` | 1440×880 | Shipped Incentives: iPad, Apple Watch, and a concession. Space options show as a collapsed "3 Space Options" row. Price by Lease Term is a control on the row. The "how many may be selected" control is not in this crop. | 30 |
| `Final Designs/Price by Space Option.png` | 1441×880 | Same concession expanded to Private Room, Private Unit, and Shared Room. Footer shows "Number of incentives a recipient may select" set to 2. | 31 |
| `Final Designs/Price by lease term.png` | 1086×502 | Lease Terms Rates dialog: one row per season, amount, tax, and total. It is the dialog alone, not a screenshot of it stacked on Add Special. | 31 |

### In the folder, not on a slide

These are real and available if a question needs them. They do not get their own minute.

| Source file | Size | What it shows | Why it stays off the timeline |
| --- | --- | --- | --- |
| `Early Wizard Explorations/V2 Step 2.png` | 971×864 | Items-to-offer table. Gift vs rent discount per row, two value columns, "How many items can be selected?" set to 5. | Same idea as V1 Step 2, denser. Mention only if asked. |
| `Early Wizard Explorations/V3 step 2.png` | 1165×660 | V3 Incentives step with one empty gift row and an inventory cap. | The testing contrast uses V3 Step 1, which shows the pattern change. |
| `Early Wizard Explorations/V3 Step 2 Epmpty state.png` | 1165×660 | Empty state: "Add a rent discount or gift incentive." | Same pass as V3 Step 1. Hold for a question. |

### Public copies

The deck serves copies from `public/present/bill/` with URL-safe names, because the comma and ampersand in two originals broke the image URLs in dev. The originals in `Job Applications/companies/Bill/` are unchanged.

| Original | Public copy |
| --- | --- |
| `Specails Before/Original add screen.png` | `original-add-special.png` |
| `Specails Before/Original edit screen.png` | `original-edit-special.png` |
| `Specails Before/Step 3 - Rates Editor Screenshot.png` | `original-bulk-pricing-editor.png` |
| `Research findings and notes images/Frame 425.png` | `research-tiered-offer-or-groups.png` |
| `Research findings and notes images/Frame 328.png` | `research-recipient-journeys.png` |
| `Research findings and notes images/Frame 422.png` | `research-pick-your-perk-sheet.png` |
| `Early Wizard Explorations/V1 Step 1.png` | `wizard-v1-step-1.png` |
| `Early Wizard Explorations/V1 Step 2.png` | `wizard-v1-step-2.png` |
| `Early Wizard Explorations/V3 Step 1.png` | `wizard-v3-step-1.png` |
| `Final Designs/Add Special_ Step 1.png` | `final-step-1-special-details.png` |
| `Final Designs/Add Special_ Step 2, Prospects.png` | `final-step-2-recipients.png` |
| `Final Designs/Step 3_ 3 Incentives, gifts & Concessions.png` | `final-step-3-incentives.png` |
| `Final Designs/Price by Space Option.png` | `final-space-options.png` |
| `Final Designs/Price by lease term.png` | `final-lease-term-rates.png` |

`public/work/pricing-specials/` is the case-study set. Do not mix those files into this deck. The interview source is the Bill folder.

### Actually missing

- Personal photographs besides [public/images/cody-duke.jpg](public/images/cody-duke.jpg). The bio slide uses that portrait and a placeholder for anything Cody has not supplied. Do not invent family, car, or hobby details.
- A usability-test report, participant count, or quote. Slide 27 may say that testing sent the visual language back to Pricing people already knew, because that decision is already in [src/data/case-studies/pricing-specials.ts](src/data/case-studies/pricing-specials.ts). It may not add a quote, a sample size, or a metric.
- The 1% figure. It is removed from on-screen copy and from the notes. Do not say it.

The rates-editor capture is an empty grid. Use it. The caption says the special has been saved and the next surface is the general pricing editor. Do not describe rows that are not in the file.

## 5. Slide inventory

35 slides. Clocks are cumulative from 0:00. Notes are the speaker band, not the on-slide text. Point and transition come first. Evidence and qualifications are secondary.

### Introduction — 4:00 — slides 1–4

**1 · 0:00 · title · 0:40.** On slide: "Cody Duke." Lead: product designer, a little over ten years. Stage: BILL · Lead Product Designer, Spend & Expense.

- Point: who is talking, and which role this hour is for.
- Evidence: none. This is the introduction.
- Next: a little personal context, then the work.
- Qualification: do not open with a portfolio tour.
- Time: 0:40.

**2 · 0:40 · bio · 1:00.** Portrait from `cody-duke.jpg`. Short lines for family, hobbies, cars, technology, and personal projects. Placeholder slots until photos and the specific facts are supplied.

- Point: a person, briefly, then back to the work.
- Evidence: only facts Cody has actually given for this deck.
- Next: how the job changed from FamilySearch to Entrata.
- Qualification: do not invent biographical details to fill the slide.
- Time: 1:00.

**3 · 1:40 · prose · 1:20.** FamilySearch, then Entrata. Senior product designer, then product lead. The change is owning the problem with product and engineering, not only the surface.

- Point: the scope grew from a surface to the problem.
- Evidence: the employment history already on the resume. Do not add new metrics here.
- Next: two stories, chosen because each one started with a solution he had to walk back.
- Qualification: product lead on these projects is not "I led engineering."
- Time: 1:20.

**4 · 3:00 · statement · 1:00.** "I try to understand the problem before I commit to a solution."

- Point: the hour is two cases of that, not a greatest-hits reel.
- Evidence: both stories change direction after he was already designing.
- Next: the move-in line.
- Qualification: do not promise launch metrics.
- Time: 1:00.

### Real-Time Move-Ins — 16:00 — slides 5–20

Section ends at 20:00. Reuse existing Move-In slides where the sentence is still accurate. Override required and offline in `bill.ts` only.

The published case study and the rewrite both say required items stop a normal move-in, and a manager PIN was left out of the first release. The rewrite also records the offline exception: if staff have completed the required checklist items on their end, they can Save move-in for sync. On reconnect, Entrata tries to process it. A conflict flags the resident. Staff can then review and, if they verified the items, override and mark the resident ready. The BILL slides have to say that exception in the same breath as the stop. Do not put "no override" on a slide by itself.

**5 · 4:00 · chapter · 0:25.** "The line." Lead: move-in day, and Entrata still says they never arrived. Reuse `chapter-problem`.

- Point: the record and the driveway were on different clocks.
- Evidence: the field story already in the Move-In deck.
- Next: why the business cared that week.
- Qualification: this workflow was not launched. Pilot results are not in.
- Time: 0:25.

**6 · 4:25 · statement · 1:00.** Reuse `business`. Move-in week is when student housing uses Entrata or replaces it with a spreadsheet. Image: `spreadsheet-laptop.jpg`.

- Point: the competitor that week was the spreadsheet they already trusted.
- Evidence: staff were reluctant to open a new app during the week it mattered most.
- Next: how often the record was actually written while the resident was there.
- Qualification: do not turn this into a revenue claim.
- Time: 1:00.

**7 · 5:25 · rings · 1:20.** Reuse `line`. About 21% written in real time, 36% the next morning, 43% later or never.

- Point: most move-ins were not in Entrata while the resident was still there.
- Evidence: the three-way split already on the Move-In deck.
- Next: what Cody owned on this one.
- Qualification: these are the baseline figures from the case, not pilot results.
- Time: 1:20.

**8 · 6:45 · prose · 0:45.** Reuse `role`, in the BILL array: Cody was product manager and UX designer for this workflow. The component library was shared with another designer.

- Point: one person held the flow and the product calls. The system work was shared.
- Evidence: the role slide already in the Move-In deck.
- Next: the flow itself, on the phone.
- Qualification: do not describe this as leading an engineering organization.
- Time: 0:45.

**9 · 7:30 · chapter · 0:20.** "Search. Readiness. Confirm." In seconds, online or off.

- Point: three beats, then the phone.
- Evidence: the solution frame from the existing deck.
- Next: search, live.
- Qualification: none beyond the section.
- Time: 0:20.

**10 · 7:50 · split · 1:20.** Search leads. Scene `roster`. Fallback still: `after-roster-phone-sim-on.png`.

- Point: they type the name they just heard. The camera was not the way in.
- Evidence: operators described the line as a name and a unit.
- Next: readiness before anyone is opened.
- Qualification: Cody can ignore the starting scene and drive the phone himself.
- Time: 1:20.

**11 · 9:10 · split · 1:10.** One glance, four states. Scene `riley`. Fallback: `02-summary.png`.

- Point: Ready, Optional, Required, and Blocked are visible before the record is opened.
- Evidence: operators already ran an express line and a cleanup line by hand.
- Next: confirm stays short.
- Qualification: same manual-drive note as slide 10.
- Time: 1:10.

**12 · 10:20 · split · 1:10.** Confirm stays short. Scene `confirm`. Fallback: `03-confirm.png`.

- Point: checklist, photo ID, confirm. A full profile never shows up at the table.
- Evidence: the desktop flow asked for a full profile, and the line could not bear it.
- Next: optional items do not stop the person.
- Qualification: same manual-drive note.
- Time: 1:10.

**13 · 11:30 · split · 1:00.** Optional items still move in. Scene `morgan`. Fallback: `after-optional-phone-sim-on.png`.

- Point: open optional items become a follow-up after the rush.
- Evidence: an earlier orange warning made a person who could still move in look like an exception.
- Next: required items are the stop, with one offline exception.
- Qualification: do not say optional items are ignored. They are deferred.
- Time: 1:00.

**14 · 12:30 · split · 1:00.** Required items stop a normal move-in. Scene `jamie`. Fallback: `08-summary-required-blocked.png`.

On-slide lines:

- Required items end the table path. Staff route that person the way the property already does.
- A manager PIN is not in this release.
- Offline is the exception, and it is the next slide.

- Point: the stop is real, and it is not absolute.
- Evidence: interviews said a permissioned person already handled hard stops on site. A PIN would have been too easy to burn on a Saturday. The rewrite documents Save move-in for sync when the required items were completed offline.
- Next: what that offline path actually does.
- Qualification: do not say "no override" and stop. The PIN is what was left out. The sync path is a different, real path.
- Time: 1:00.

**15 · 13:30 · split · 1:30.** Wi-Fi was scarce, and a completed checklist can still be saved. Scene `offline-home`. Fallback: `after-offline-phone-sim-on.png`. Second still in the note if he opens the roster: `10-roster-offline.png` and `11-summary-offline.png` exist on the case study and can be mentioned, not required as a second slide.

On-slide lines:

- The next 30 days are cached. An Offline chip says the write has not reached Entrata.
- If the required items were completed on site, Save move-in for sync queues the move-in.
- When the device reconnects, Entrata tries to process it. A conflict flags the resident. Staff can review and, if they verified the items, mark the resident ready.

- Point: offline is part of the first release, including the required-item case.
- Evidence: breezeway Wi-Fi failed often, and staff were on company iPads. The rewrite’s `b-edges` section is the source for the sync-and-conflict path.
- Next: the first spec was a different product.
- Qualification: the reconnect step is an attempt, not a guarantee. Do not say the conflict override is a manager PIN.
- Time: 1:30.

**16 · 15:00 · compare · 1:20.** Reuse `first-bet`. The first spec was the spreadsheet plus an AI upload. Visits moved the bet to the phone.

- Point: he was willing to drop the approach he had already designed.
- Evidence: the CSV prototype versus the phone home screen, already in the deck.
- Next: one visible iteration, then how AI actually fit.
- Qualification: the spreadsheet concept was explored. It is not a shipped Bulk Move-In replacement.
- Time: 1:20.

**17 · 16:20 · compare · 1:00.** Compressible. Reuse `iteration-search`. QR first, then the roster.

- Point: the first build opened on a camera. The line was a name and a unit.
- Evidence: the QR still versus the roster still.
- Next: where AI did and did not decide.
- Qualification: skip this slide if the live phone ran long. The point is already inside slide 10.
- Time: 1:00.

**18 · 17:20 · prose · 1:00.** One AI slide, condensed from the five AI slides on the full Move-In deck.

On-slide lines:

- The problem still starts in words, and the research sits in one repo.
- AI shortens the path from that repo to a prototype people can react to.
- Judgment, Figma corrections, and what gets released stay with Cody. Developers see it early.

- Point: AI accelerated the loop. It did not choose the problem.
- Evidence: the process Cody already uses on the Move-In deck: research repo, vet the problem, high-fidelity prototype, Figma when something is off, testing back into the repo.
- Next: what would have counted as success, and what is not known yet.
- Qualification: do not imply AI designed the offline rules or the required-item exception.
- Time: 1:00.

**19 · 18:20 · metrics · 1:00.** Reuse the short-deck framing of `targets`. These are targets, not pilot results. Same-day staying near 21% would mean the spreadsheet won.

- Point: the bet was measurable, and the measurement is not back.
- Evidence: 95%+ same-day, under 20 seconds at the table, less overtime data entry, 30%+ of move-ins on the device. What left his hands was a SwiftUI package. The mobile team’s review found five defects in about half an hour.
- Next: the lesson he would actually say out loud.
- Qualification: do not say the product launched or that any target was hit. The five defects are from the handoff review, not from production.
- Time: 1:00.

**20 · 19:20 · statement · 0:40.** Reuse `learned`. Entrata becomes the record when the write happens where they stand, including when the Wi-Fi is gone. Image: `line-cherokee.jpg`.

- Point: a nicer screen of the desktop flow still leaves the day wrong.
- Evidence: the spreadsheet worked where they stood.
- Next: a desktop workflow with the opposite problem, too many surfaces for one special.
- Qualification: lesson, not a result.
- Time: 0:40.

### Pricing Specials — 14:30 — slides 21–33

Section runs 20:00–34:30. Fewer slides than the first inventory, and each one is an artifact. There is no two-minute text explanation of research. Results and lessons are separate slides.

**21 · 20:00 · chapter · 0:20.** "One special could only hold one incentive." Entrata Pricing, desktop.

- Point: name the constraint before the screens.
- Evidence: the opening of the Pricing case study.
- Next: the two screens that show it, and the workaround customers were already using.
- Qualification: do not preview the 1% argument. It is gone.
- Time: 0:20.

**22 · 20:20 · screens · 1:40.** Headline: "A choice meant another special." Images: `Original add screen.png` and `Frame 425.png`.

- Point: one special type, and the way a choice was faked.
- Evidence: the add modal’s single Special Type, and the annotated tiered-offer screen. The note already on Frame 425 says the "or" was a selectable special and parentheses grouped them.
- Next: even a single incentive did not stay in that modal.
- Qualification: the red annotation is part of the file. Do not add a quote that is not on it. Do not call Frame 425 a usability-test result.
- Time: 1:40.

**23 · 22:00 · screens · 1:10.** Headline: "Continue to Pricing left the special." Images: `Original edit screen.png` and `Step 3 - Rates Editor Screenshot.png`.

- Point: setup was fragmented. Details lived in another modal. Charges lived in the general bulk editor.
- Evidence: Edit Special holds name, dates, cap, and media. Bulk Edit Pricing - Prospect Rents is a charge grid with property, charge code, amount, tax, lease terms, and schedule updates. The toast says special settings were saved. The grid in this capture has no rent rows yet.
- Next: before redrawing it, he mapped who the special was actually for.
- Qualification: do not describe a filled-in rate table. The screenshot is the empty editor. Do not say he owned that bulk editor. He was designing the special, and this was the surface it threw people into.
- Time: 1:10.

**24 · 23:10 · screens · 1:00.** Headline: "Three ways someone reached a special." Image: `Frame 328.png`.

- Point: a new application, a renewal, and a promo code were different paths into the same offer.
- Evidence: the three rows on the frame. They are journey steps, not a role swimlane and not a study write-up.
- Next: a stakeholder sheet tried to turn that into steps, and it still pointed discounts at the old rates editor.
- Qualification: do not invent pain scores, interview counts, or quotes from this diagram. The typos on the sticky notes stay in the image.
- Time: 1:00.

**25 · 24:10 · screens · 1:00.** Headline: "The sheet still sent discounts to the old editor." Image: `Frame 422.png`.

- Point: early structured thinking still assumed the existing rates editor was step 3.
- Evidence: the sheet is titled Pick your Perk. Its last-edit line names Robert Jones. Red notes on the sheet say the configuration is a step-by-step popup and that discounts link to the existing rates editor. It also asks how many items can be selected.
- Next: the wizard was the attempt to make that popup real.
- Qualification: Robert Jones is the name on the file. Do not give him a title. This is a working sheet, not a research finding and not a metric.
- Time: 1:00.

**26 · 25:10 · screens · 1:10.** Headline: "A guided wizard, still a new pattern." Images: `V1 Step 1.png` and `V1 Step 2.png`.

- Point: the first exploration broke the work into steps and let one special hold many items, including how many a person could select.
- Evidence: V1’s three steps, and Step Two’s list of gifts plus a rent discount. V2’s table and V3’s shorter pass exist in the folder if someone asks. They are not this slide.
- Next: testing did not reward the newer pattern.
- Qualification: do not call V1 the shipped design. "How many items can be selected?" on this screen is the exploration, not the shipped control.
- Time: 1:10.

**27 · 26:20 · screens · 1:10.** Headline: "Testing sent it back to Pricing people already knew." Images: `V3 Step 1.png` and `Add Special_ Step 1.png`.

- Point: a cleaner, shorter wizard was still a second interface to learn. The shipped step uses the Pricing chrome and three questions.
- Evidence: the case study says early concepts were cleaner than the rest of Pricing, customers trusted the interface they knew, and a new visual pattern would have been something else to learn. These two frames are the direction change. The folder has no test report.
- Next: the argument that almost took the advanced pricing out entirely.
- Qualification: do not invent a participant quote, a count of sessions, or a claim that testing demanded three steps. V3 is two steps (General, Incentives). The final is three. Say that the shipped structure is three questions in the existing visual language. Do not put words in a tester’s mouth.
- Time: 1:10.

**28 · 27:30 · statement · 1:10.** Headline: "Should rarely used features dictate the experience for everyone?"

On-slide lines:

- Cody argued for removing advanced lease-term and space-option pricing, because they made the common path heavy.
- The PM said important customers depended on them, and removing existing capabilities was outside the project’s scope.
- They kept both, off the default path.

- Point: he lost the removal, and the compromise was placement.
- Evidence: the disagreement as Cody described it for this interview. The case study’s "about 1%" line is not used.
- Next: the default path, on the real screens.
- Qualification: do not say 1%, do not invent a denominator, and do not say engineering was overruled or that Cody led the team. The PM held the scope. Cody held the design of where the capability sat.
- Time: 1:10.

**29 · 28:40 · screens · 1:20.** Headline: "What is it, and who qualifies?" Images: `Add Special_ Step 1.png` and `Add Special_ Step 2, Prospects.png`.

- Point: the common path starts with a name, then the audience. Advanced targeting can stay closed.
- Evidence: Step 1 is name and descriptions. Step 2 is prospects, renewals, residents, lease terms, and where the special applies. Space options default to all.
- Next: what they receive, including more than one incentive.
- Qualification: Step 2 still shows lease terms and space options as fields. "Off the default path" on the next slides means the per-term and per-space amounts, not that those words disappeared.
- Time: 1:20.

**30 · 30:00 · screens · 1:00.** Headline: "What do they get?" Image: `Step 3_ 3 Incentives, gifts & Concessions.png`.

- Point: one special holds gifts and a concession. Space-level amounts stay collapsed until someone opens them.
- Evidence: Incentive 1 iPad, Incentive 2 Apple Watch, Incentive 3 a concession summarized as "3 Space Options," with Price by Lease Term on the row.
- Next: that collapsed row, opened, and the lease-term dialog beside it.
- Qualification: this crop does not show "number of incentives a recipient may select." That control is on the next image. Do not narrate it onto this one.
- Time: 1:00.

**31 · 31:00 · screens · 1:10.** Headline: "Advanced pricing stayed one step off the path." Images: `Price by Space Option.png` and `Price by lease term.png`.

- Point: the rare configuration is still there. It does not run the default steps.
- Evidence: the expanded concession has Private Room, Private Unit, and Shared Room, each with Price by Lease Term. The same screen sets "Number of incentives a recipient may select" to 2. Lease-term amounts open in their own dialog, one row per season.
- Next: what actually shipped, as adoption.
- Qualification: the lease-term file is the dialog by itself. Do not claim the screenshot shows it stacked on Add Special. Stacked dialogs were a library constraint. Say that in the note if it comes up. Do not apologize for it on the slide.
- Time: 1:10.

**32 · 32:10 · metrics · 1:00.** Headline: "162 specials let someone choose among incentives."

On-slide lines:

- 162 specials, across 38 clients, are the new behavior: more than one incentive on a single special.
- 10,204 active specials across 337 clients is overall platform usage after later fixes, not that behavior by itself.

- Point: Lead with 162 across 38 clients. Label 10,204 as the whole platform.
- Next: What I would set up before the next build.
- Evidence: Release-night testing passed. Significant bugs showed up after launch. Engineering fixed them under the PM. I owned the design and did not lead the build or that fix. Other counts, if asked: 8,290 limited by lease term, 1,563 by move-in date.
- Qualification: Adoption, not a faster workflow and not revenue. Do not use the resume line about 8,000 offers. Do not say I led the engineering fixes.
- Time: 1:00.

**33 · 33:10 · prose · 0:50.** Headline: "What I would set up before the next build."

On-slide lines:

- Stay consistent with the rest of the product when a new pattern would make people relearn one workflow.
- Keep a rarely used capability available, and keep it off the path everyone else has to walk.
- Choose the success metric before development. We could see adoption. We could not see time to create, errors, or which path people took.

- Point: Consistency, a short default path, and a metric chosen before the build.
- Next: What either story has to do with Spend & Expense.
- Evidence: The missing metric was time to create, errors, and which configuration path people actually took.
- Qualification: Do not turn the lesson into a claim that the redesign proved a time savings.
- Time: 0:50.

### Closing — 2:00 — slides 34–35

Ends at 36:00.

**34 · 34:00 · prose · 1:10.** What this has to do with Spend & Expense at BILL.

On-slide lines:

- Dense operational work, with a short default path and the rare case one step away.
- Research used to change a design he was already fond of.
- Product and engineering in the room while the problem was still movable.

- Point: the job is the same shape as these two stories.
- Evidence: the move-in redirect, and the Pricing retreat from a new visual pattern.
- Next: how he actually works, in one breath.
- Qualification: do not audit BILL’s product or invent a Spend & Expense diagnosis.
- Time: 1:10.

**35 · 35:10 · statement · 0:50.** "AI shortens the path from a written problem to something people can react to. The judgment stays mine."

- Point: close on the working method, then stop.
- Evidence: the Move-In AI loop, already shown. Pricing’s folder does not document an AI workflow. Do not borrow one.
- Next: questions.
- Qualification: do not claim AI was how Pricing was designed.
- Time: 0:50.

### If the hour slips

Cut slide 17 first. It repeats slide 10. Slide 24 can be one sentence on the way into the sheet. Do not cut slide 14’s offline exception, slide 23’s bulk editor, or slide 28’s disagreement.

## 6. What is reused from the existing deck

- Move-In copy and images for slides 5–13 and 16–20, except where section 5 overrides required and offline.
- Phone stills already in `public/work/move-in-scanner/` as fallbacks.
- `labSrc` for the iframe URL. Do not call `driveScene`.
- The editorial type and color, copied into `bill.astro`, not extracted from the Move-In page.
- Portrait: `public/images/cody-duke.jpg`.

`DeckStoneTitle` stays on the homepage and the Move-In opener. The BILL intro does not use the spinning stone.

## 7. Layouts

- `bio`, `screens`, and `placeholder`, as in section 3.
- `screens` at 1280×720: two images side by side is the maximum. Slide 23 puts the wide rates editor as the large image and the edit modal beside the caption, so the empty grid stays readable. Slide 22 stacks the narrow add modal beside Frame 425, with Frame 425 taking the width.
- Notes band and timer, as in section 3.
- Transitions stay the existing 460ms fade. No new animation.
- Present fullscreen in a 16:9 window. The copied CSS still stacks the prototype under 960px. A fullscreen share stays above that. Do not change the Move-In page’s breakpoint, because that page is not edited.

## 8. Implementation sequence

Structure, then the real files, then a visual pass.

1. Add `bill.ts` with the 35 slides. Notes lead with point and transition. Pricing `src` values point at the public copies, not at `Job Applications/`.
2. Add `BillDeck` and fill `bill.astro` with a copied style block. Confirm `move-in-scanner.astro` has no diff.
3. Wire the Presentation control.
4. Copy the mapped Bill-folder files into `public/present/bill/`, preserving the filenames. Leave the originals in place. This copy is already on disk. Do not move the originals.
5. Load the prototype for manual use. If it fails, show the still and the new-tab link. Do not automate scenes.
6. Add the notes band and the elapsed timer.
7. Read every on-slide line against section 5. No launch for Move-In. No "no override" without the sync exception. No 1%. No efficiency or revenue claim. No "I led engineering." The selection-count control is named only on slide 31. Slide 32 is adoption. Slide 33 is lessons. Bugs stay in the slide 32 note.

## 9. Risks

- Copying CSS can drift later. That is accepted. Sharing it would put the Move-In deck in the blast radius of a BILL edit. The Move-In file is not modified, so there is no styling regression to test there. The regression check is `git diff` on that file, empty.
- Automatic scene positioning is not in the build. A missed label in `driveScene` is not worth a broken phone. Manual use and the stills are the plan.
- Notes left open will be on the Zoom share. Default off.
- Frame 422 names Robert Jones and does not state his role. Slide 25 stays inside that.
- Frame 328 is three journeys. Calling it a role swimlane on stage would oversell the artifact.
- The rates editor screenshot is empty. A spoken tour of charge rows would be invented.
- V3 versus the final screen shows a direction change. The reason is the case study. The image does not contain a tester’s words.
- Resume "8,000 offers" and case-study "8,290 specials limited by lease term" stay unmixed.
- Personal slide 2 stays thin until photos exist.
- The Move-In case-study page still says there is no override in the first release, in [src/data/case-studies/move-in-scanner.ts](src/data/case-studies/move-in-scanner.ts). This plan does not edit that page. If an interviewer has read it, the spoken version is the rewrite: the PIN was left out, and Save move-in for sync is the offline path.

## 10. Acceptance

- `/present/bill` and `/present/bill/` render full viewport, `noindex`, slide 1, and no site header.
- `git diff` for the Move-In page, `MoveInDeck`, and `move-in-scanner.ts` is empty. `/present/move-in-scanner/` still advances, still hashes `#` and `#b`, and the prototype still loads.
- From Resume, double-tap `M`, select Bill, activate Presentation, and land on the deck. Any other company leaves Presentation disabled. Resume and cover-letter behavior is unchanged.
- Arrows, space, Page Up/Down, Home, End, and the on-screen buttons move slides. Refresh on `#14` restores that slide.
- On a split slide, the phone can be operated by hand. Nothing in the deck clicks through it. A failed iframe shows the still and the new-tab link.
- Notes show the point and the transition first. Evidence and qualifications are secondary. `N` and `T` are off on first load.
- Slide 32 leads with 162 specials across 38 clients and labels 10,204 as overall platform usage. The launch bugs are in that slide’s note, and the note does not say Cody led the fix. Slide 33 is the lessons. The deck has 35 slides.
- At 1280×720 and 1920×1080, headlines and the two-up screens are readable, the prototype is not stacked, and there is no horizontal scroll.
- Slide 14 names the offline exception. Slide 15 names Save move-in for sync, the reconnect attempt, and the conflict review.
- Slide 22 uses the add modal and Frame 425. Slide 23 uses the edit modal and the bulk editor. Slide 28 does not contain "1%". Slide 30 does not claim the selection-count control. Slide 31 does, because that file shows it.
- No Pricing image is a drawing or a cropped fake. Unused V2 and V3 frames are not presented as missing.
