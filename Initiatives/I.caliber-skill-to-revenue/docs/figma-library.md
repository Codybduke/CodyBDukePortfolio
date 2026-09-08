# Caliber Component Library — what we can reuse

[Component Library](https://www.figma.com/design/PRv7sjue5TZ7HBn7BhRBPb/Component-Library)

All **27 pages** screenshot-inspected 2026-08-31. Figma MCP only returns the 6 published library pages. Use the whole file.

Brand file still unopened: [Caliber Brand](https://www.figma.com/design/O0YvFWtpyKN4U04TGbWyOb/Caliber-Brand). Color and type already live here.

## All 27 pages

| # | Page | Node | What it is | Prototype |
|---|------|------|------------|-----------|
| 1 | AI role play cards | `1592:71` | Small/large cards, persona cards, generated image, “difficult thing” tags | Six-week practice evidence |
| 2 | Alerts & banners | `153:9801` | Full-width banner (upgrade); slim + block alerts in gray/green/yellow/red/blue | Thin N, coverage, “associated not caused” |
| 3 | Chicken switch | `724:97` | Confirm-destructive modal. “Nevermind” + “Yes, delete” (coral, trash icon) | Only if we delete a focus |
| 4 | Breadcrumbs | `879:61` | Dark pill + chevron trail | Team → person → deals |
| 5 | Buttons | `11:100` | Primary/Secondary/Link/AI, social login, icon squares, circle arrows, role-play chip | Actions |
| 6 | Card | `1666:4575` | Dark rounded card, optional title, content slot | Deal/skill recap |
| 7 | Checkboxes & Radios | `4:100` | Unselected / selected (lime + check) / indeterminate (minus); disabled; with-text | Filters, multi-select |
| 8 | Colors | `1:25` | Gray 0–6, system, brand green + gradient, contrast matrices | Tokens |
| 9 | Confetti | `503:97` | Horizontal strip of gold particles | Skip |
| 10 | Containers | `171:713` | Responsive max-width 2560→402 | 1440 = SI width |
| 11 | Icons | `1:27` | Published: 3D, flags, payment, social, status. Large unpublished categorized set | Use theirs as SVG, not Lucide |
| 12 | Inputs | `359:2` | Text, textarea, date, **currency+USD**, dropdowns, team multi-select (Britton’s team, Apply/Reset) | Filters and deal $ |
| 13 | Image upload | `1609:1619` | “Role play image”: filled photo, Make an Image / Upload, dashed empty | Role-play only |
| 14 | Loader | `619:4416` | Blue spinner; **Cali AI** pink–purple spinner; spinner+text; dark full-screen overlay | Loading coverage; AI copy |
| 15 | Logos | `1:28` | Palm **pclub.io** (legacy) + **Caliber** circular star mark; “formerly pclub.io” | Chrome. Use Caliber, not pclub |
| 16 | Menus | `17:2` | **App chrome exists here:** side nav (collapsed/expanded), desktop header, mobile overlay. Labels are old product: Home, Channels, Forecaster, Ethics, Analytics, Stats | Reuse chrome. Swap labels to SI: Home, Courses, Role Plays, Paths, Analytics, Skills |
| 17 | Modals + Overlay | `153:6296` | modal / modal-image / modal-image-long; backdrop | Skill Report, deal drill-in, set focus |
| 18 | Pagination | `455:4344` | Dark squares, gray default, lime active, joined bar | Deal/eval lists |
| 19 | Picker | `772:4403` | Segmented control; lime selected | Time window 7/30/60/90; live vs practice |
| 20 | Slider | `1609:408` | Role-play **difficulty**: Easy peasy → Leveling up → Tough crowd → Insane mode → Beast mode. AI gradient fill | Practice intensity, not deals |
| 21 | Tabs | `117:2` | Pill (lime active, red badge) + underline sub-tabs | Live vs practice; team vs person |
| 22 | Tags | `214:50` | Gray, red, yellow, green, blue, brand lime, AI lavender, glass; optional dismiss | OSR tier, stage, won/lost |
| 23 | Toggle Switches | `4:220` | Pill with Yes/On vs No/Off inside the track; lime on, gray off; glow focus | Compare to prior period |
| 24 | Tool Tips | `116:321` | Dark; one-line or title+body; arrows 8 ways | Uncertainty on $ |
| 25 | Tour Guide | `1516:4326` | 3-step onboarding card, 328px wrap, Next/Previous/Done | Skip unless founder walkthrough overlay |
| 26 | Type | `1:26` | Inter. Display 40→16 / 120%. Body 16/14/12/10 / 150% | Tokens |
| 27 | Thumbnail | `0:1` | File cover: lime field, “Caliber COMPONENTS Pattern library” | Not a component |

Still **not** in this file: OSR gauge, heatmap, data table. Compose the deal table from Type + Tag + currency input.

## Tokens

**Color** — dark product UI. Neutral grays 0–6. System red/yellow/green/blue/purple. Brand lime + gradient. AI uses pink–purple (loader, slider, AI button, AI tag).

**Type — Inter**
- Display Bold 700, 120% leading, Gray-0: 40 / 32 / 24 / 20 / 18 / 16
- Body Regular 400, 150% leading, Gray-1: 16 / 14 / 12 italic / 10
- Their code note: xxs→10px, 3xl→32, 4xl→40; drop 5xl–7xl

## What to code for Ellis

**From this library**
- Tokens (Colors + Type)
- Side nav / header from **Menus**, with SI labels from packet screenshots
- Button, Tag, Input, Dropdown, Picker, Toggle, Card, Modal, Alert, Tabs, Tooltip, Breadcrumb, Checkbox
- Currency field for deal value
- Team picker (Apply / Reset)

**Compose**
- Deal table: name, live score (Tag), stage (Tag), amount, won/lost (Tag), recency
- Dated six-week focus inside the Skill Report modal
- Heatmap / OSR bar: keep as current SI context, do not rebuild as the idea

**Six-week loop extras**
- Role-play cards, difficulty slider, AI loader, role-play image upload, role-play selected chip

**Skip**
- Confetti, Thumbnail cover, Tour Guide (unless walkthrough), Chicken switch (unless we delete), pclub.io logo
