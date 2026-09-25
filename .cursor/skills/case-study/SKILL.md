---
name: case-study
description: >-
  Add or revise a rich portfolio case study so it matches the Caliber structure.
  Use when writing or editing a case study, case copy, screenshots, captions,
  tables, a prototype embed, or the case lightbox.
---

# Case study

Follow [.cursor/rules/case-study-writing.mdc](../../rules/case-study-writing.mdc) for prose and [.cursor/rules/case-study-layout.mdc](../../rules/case-study-layout.mdc) for layout. Do not restate those rules here.

Caliber is the structural reference: [src/data/case-studies/caliber-skill.ts](../../../src/data/case-studies/caliber-skill.ts), slug `caliber-skill-on-deals`. The other rich cases use the same parents.

## Author

1. Set `stage` on every section. Parents are Problem, Process, Solution, and What's next. Use Results only when the case shipped with measured outcomes. The template shows each parent once.
2. Give each subsection a title that names what is below it.
3. Put in-article screenshots in `figures`. The hero is `heroFigure`. A walkable prototype is `embed`, with one caption sentence and no `hint`.
4. Export screenshots wide enough for the lightbox (`calc(100vw - 6.5rem)`). Do not drop in a 1024px chat export and expect it to stay sharp.

## Check in the browser

Open the case and confirm:

- Body, captions, and in-article screenshots share one left edge at the 48rem column.
- The hero and the prototype are as wide as page padding allows. Their captions stay in the text column.
- A two-column table wraps in equal columns, with no sideways scroll on desktop.
- Clicking an in-article screenshot opens the image only: dark scrim, drop shadow, height from the ratio, × outside the image, no caption. The hero and the prototype do not open it.
