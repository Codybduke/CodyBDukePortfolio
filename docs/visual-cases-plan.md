# Visual cases plan

**Status:** Steps 1–3 done — equal visual tiles on home and `/work`. Waiting on review before Step 4 (resident lookup case layout).  
**Date:** Aug 19, 2026  
**Repo:** `cody-duke-portfolio`  
**Parent:** [design-direction.md](./design-direction.md) (stone, field `#FBFBF1`, type, metaphor — still locked)  
**Reference:** [Frances Tung](https://www.francestung.com/), [Banking App case](https://www.francestung.com/banking-app)

Execute **one step at a time**. After each step: review in the browser, then start the next.

---

## Intent

The stone hero already does Tobias-style craft on the first viewport. Selected work does not. It is three bordered text cards.

Take Frances’s **structure**, not her beige Squarespace skin:

| Take | Leave |
|---|---|
| Homepage: product on a color field, title + tags only | 3D mockup-generator tilt, six equal tiles |
| Case study as alternating claim + full-width picture | Sprint Gantts, process theater |
| Title band → product hero → two-column intro → metrics slab → feature tour | Long opening essay before any image |
| Metadata in a side column | Wrapping meta bar as the first read |
| Metrics as a designed object | Numbers trapped in the essay |

Keep: stone, paper field, Clash Grotesk + Source Serif, 2px radius, Rough / Evidence / Decisions / Making crumbs, evidence voice, live product links.

---

## What “done” looks like

A hiring manager lands, still meets the stone, then meets **three products**. They only get density after they have already decided the work looks like design.

- Home selected work is visual first. No paragraph on the tile.
- `/work` uses the same tile language for highlights.
- Each highlight case opens like a visual essay, then earns the current depth.
- Mobile and `prefers-reduced-motion` still look intentional.

---

## Recommended sequence

Locked answers are in [Decisions](#decisions-fill-in-during-step-0). Next review is home + `/work` tiles, then Step 4 on the resident lookup case.

### Step 0 — Align *(this file)*

- [x] Written vision (chat, Aug 19)
- [x] Answer open questions (Aug 19)
- [x] Lock homepage layout: 3 equal tiles
- [x] Lock cover style: CSS crops on a stone field
- [x] Lock layout pilot: Resident lookup (not FamilySearch)

### Step 1 — Card data

Add `cover` on `CaseStudy`: `src`, `alt`, optional `position` for `object-position`. No per-tile field color or metric.

**Files:** `src/data/cases.ts`

### Step 2 — Homepage tiles

Replace `CaseCard` text boxes with visual tiles.

- Large stone field + CSS-cropped product image (3:2, matches lookup three-up)
- Title + piped tags only
- Equal 3-column grid
- Hover: image scale inside the field — no competing with the stone

**Files:** `src/components/CaseCard.astro`, `src/styles/global.css`

### Step 3 — Work index

Same tile component and same 3-column size for Highlights and More work. Move-In Scanner has no cover yet — stone field + title + tags until frames land.

**Files:** `src/pages/work/index.astro`

### Step 4 — Case study layout template (structure only)

Build the Frances rhythm **once**, on the existing `[slug].astro` + CSS, without rewriting all copy:

1. **Title band** — full-width field, eyebrow, one large claim
2. **Product hero** — existing `heroFigure` on a field, not in the text column
3. **Two-column intro** — short body left; Role / Surface / Timeframe / Collaborators / Still live right
4. **Metrics slab** — existing `case-metrics` as a full-width object
5. **Section rhythm** — stage label, headline, one graf, then figures as bands
6. **Feature tour** — a layout mode for 2–3 product moments in a row on a field
7. **Close** — outcome, live link, back

**Files:** `src/pages/work/[slug].astro`, `src/styles/global.css`, `src/data/case-studies/types.ts` (only if a new figure layout is needed, e.g. `tour`)

Pilot this on **one** case (recommended: FamilySearch). Other cases will look half-migrated until Steps 5–7. That is expected.

### Step 5 — FamilySearch (pilot content)

Cut the opening claim into a band headline + short left column. Place Pioneer as hero, Calendar in the tour, metrics slab on the retention numbers. Do not fake a WWI crop.

### Step 6 — Resident lookup

Closest to Frances’s banking page. Three-up hero already exists. Feature tour: Command Center → search → profile.

### Step 7 — Pricing Specials

Hardest visually (staff desktop). Crop to the hub row where one special carries two incentives. Tour: list → details/incentives → targeting. Story is “one special, many offers,” not “here is Entrata.”

### Step 8 — Supporting cases

Move-In Scanner is `ready` but its images are referenced and **not** in `public/work/`. CSV and others are drafts. Decide: leave as compact text, or give Move-In a cover when assets land.

### Step 9 — Polish

Hover, focus, reduced motion, mobile stacking, caption contrast on dark fields, preload homepage covers.

---

## Asset backlog

Update this list as we go. **Have** = in `public/work/` now. **Need** = create or recrop before that step looks finished.

### Homepage covers

| Case | Have | Need | Notes |
|---|---|---|---|
| FamilySearch | `01-pioneer-desktop.png` | Judge CSS crop (`center 32%`) — recrop in Figma if the timeline still shows | Stone field; product green stays in the screenshot |
| Resident lookup | `cover.webp` + `cover.mp4` (from Desktop `.mov`) | None for v1 | Hover plays compressed MP4; poster is first frame |
| Pricing Specials | `01-specials-list.png` | Judge CSS crop (`72% 42%`) — recrop if chrome/sidebar dominate | Bias toward the multi-incentive table |
| Move-In Scanner | *none in `public/work/`* | **Cover** before More work on `/work` looks finished | Tile ships as empty stone field for now |

### Case study heroes / tours

| Case | Have | Need |
|---|---|---|
| FamilySearch hero | Pioneer desktop | Optional composed hero (card + calendar fragment). Can ship v1 as Pioneer on a field. |
| FamilySearch tour | Pioneer, Calendar | **WWI / military crop — skip.** Writeup already says it isn’t faked. |
| Lookup hero | `00-hero-three-up.png` | Probably enough |
| Lookup tour | Command Center, search, profile, plus extras | Pick 3 for the tour; rest stay in sections |
| Pricing hero | Specials list | Crop / field treatment |
| Pricing tour | details, recipients, incentives, space, lease-term, resident profile | Pick 3 that tell “one special, many offers” |
| Move-In Scanner | *none in `public/work/move-in-scanner/`* | All referenced frames (`00-hero-three-up` through `11-summary-offline`) if that case gets the new treatment |

### Optional later

- [ ] Ghosted product behind the metrics slab (per case)
- [ ] Figma-composed device mockups (only if we reject CSS-on-a-field)
- [ ] New production captures from [FamilySearch Inspire](https://www.familysearch.org/en/inspire) if current PNGs are too full-page

### How covers get made (decide in Step 0)

**Path A (faster, stay in repo):** CSS object-position crops of existing PNGs on a color field. Good enough to judge layout.  
**Path B (closer to Frances):** Cody composes covers in Figma (product fragment on a field, maybe a second screen). Drop into `public/work/{slug}/cover.png`.

Recommendation: **Path A for Step 2**, Path B only if the crop looks like a screenshot dump.

---

## Decisions (fill in during Step 0)

| # | Decision | Default if unanswered | Locked answer |
|---|---|---|---|
| 1 | Homepage grid | 3 equal visual tiles | **3 equal tiles** |
| 2 | Tile copy | Title + piped tags, no metric on the tile | **Title + tags only** |
| 3 | Cover production | Path A — CSS crop on a field | **Path A — CSS crop** |
| 4 | Field color | Mineral / stone palette so tiles don’t fight the hero. Product color only if a crop needs it (e.g. FS green). | **Cut face:** Brass `#C4A056` (FamilySearch), Obsidian `#1C1B18` (Lookup), Terracotta `#B46848` (Pricing), Labradorite `#3E5358` (Move-In) |
| 5 | Layout pilot | FamilySearch | **Resident lookup** |
| 6 | Work index | Stay compact text until those cases have covers | **Same visual tiles on `/work`** |
| 7 | Copy rewrite | Layout first; cut opening claims only on the pilot case | Layout first; pilot copy on lookup later |
| 8 | Device chrome | Flat product crops, not tilted 3D mockups | Flat CSS crops |

---

## Open questions

See the chat turn that accompanies this file. Answers get written into the table above before Step 1 starts.

---

## Guardrails

- Do not convert SVGs to raster.
- Do not restyle the stone hero to match Frances.
- Do not invent WWI or other missing product shots.
- Do not start Step N+1 until Step N has been reviewed in the browser.
- Keep changes scoped: one surface per step (home, then index, then template, then one case).
