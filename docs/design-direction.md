# Design direction — Cody Duke portfolio

**Status:** Planning only — do not implement yet.  
**Date:** Aug 7, 2026  
**Repo:** `cody-duke-portfolio`  
**References studied:** [Tobias Ahlin](https://tobiasahlin.com/), [rsms.me](https://rsms.me/), [rsms Spotify case](https://rsms.me/work/spotify/)  
**Skipped:** [katesyuma.com](https://katesyuma.com) — broken at planning time; **will not revisit** (decision locked).

---

## Intent

Build a portfolio that does three jobs at once:

1. **Craft signal** — the site itself proves design skill (Tobias).
2. **Process signal** — case studies show how work gets refined (rsms + Cody’s Product Lead loop).
3. **Metaphor signal** — a memorable visual idea: **rough stone → polished stone** = problem → researched, validated, prototyped, tested, shipped product.

This is not a clone of any one site. It’s a synthesis tuned for Product Design hiring: ownership, field/data, decisions, metrics, handoff — with a landing experience that feels designed, not templated.

---

## North-star metaphor: the polished stone

### The story

| Design process | Stone / erosion image |
|---|---|
| Rough complaint, idea, or problem | Raw, jagged stone |
| Research & validation (knock pieces off) | Weathering — weak facets break away |
| Rough workflows, wireframes, sketches | Still coarse; shape emerging |
| Prototype → feedback → refine | Abrasion; edges soften |
| Usability test → iterate again | Continued polishing |
| Spec, handoff, ship | Polished stone — dense, clear, usable |
| Outcomes / metrics | How the finished stone “reads” in the world |

**One-liner for About (not home):**  
*I take rough problems and polish them into products — through research, validation, prototype, and feedback — until what’s left is what people can actually use.*

Home shows the stone visually; **About explains the metaphor in copy.**

### Why this metaphor fits Cody

- Matches the Product Lead claim: not decorating a stone — choosing what to knock off.
- Maps cleanly onto existing case spine (problem → process → decisions → metrics → handoff → outcome).
- Gives a unique hero asset without needing a photo of Cody on day one.
- Bridges craft (visual/3D) and systems thinking (AI-native workflows) if the stone “glitches” digitally while smoothing.

### Guardrails for the metaphor

- **Home:** show the stone (and motion) — do **not** explain the polished-stone metaphor in hero copy.
- **About:** explain the metaphor in 1–3 sentences (erosion / refine / polish ↔ design process).
- Don’t force “stone” language into case studies; cases prove process with decisions and metrics.
- Erosion = **removing the wrong things**, not endless polish for polish’s sake — keep “what we cut” visible in cases.
- Avoid new-age / wellness tone. Keep it industrial, material, slightly digital.

---

## What to take from Tobias Ahlin

**Source:** [tobiasahlin.com](https://tobiasahlin.com/)

### Strengths to borrow

| Pattern | Why it works | How we’d adapt |
|---|---|---|
| **Huge in-your-face name / brand** | Instant identity; confidence; portfolio-as-artifact | Hero: Cody mark/logo at scale over the stone, not a small nav wordmark |
| **Minimal first viewport** | Brand + short positioning; no dashboard clutter | Hero budget: brand, one line, one CTA path into work — stone is the visual |
| **Site craft = proof** | Typography, motion, spacing show skill before case studies | White field, deliberate type, restrained motion; hero animation is the craft flex |
| **Clear section rhythm** | Blog / Projects / Work / Say hi — scannable | Keep Home → Work → About → Fun; don’t add Tobias’s blog unless we want writing later |
| **Quiet confidence after the hero** | Content below is calm, editorial | After stone intro, drop into selected work without competing chrome |

### What not to copy

- Design-engineer / open-source project grid as the primary story (Cody’s primary story is product cases).
- Blog-led homepage (unless writing becomes a deliberate pillar).
- His exact type, color, or layout skeleton.

### Tobias → Cody translation

> Tobias proves “I design” by how the homepage feels.  
> Cody proves “I design products” the same way **plus** process-heavy cases — hero for craft, cases for ownership.

---

## What to take from Rasmus Andersson (rsms)

**Sources:** [rsms.me](https://rsms.me/), [Spotify writeup](https://rsms.me/work/spotify/)

### Strengths to borrow

| Pattern | Why it works | How we’d adapt |
|---|---|---|
| **Process as architecture** | He places himself closer to “architect” than “artist”; paper → digital → pixels | Case studies show stages as erosion steps, not just pretty finals |
| **Artifacts of making** | Desk photos, sketches, printouts to eng, pixel craft | Include real process artifacts: site-visit notes, SQL framing, IG decisions, prototype frames, handoff packages |
| **Stakeholder loop early** | “Keeping stakeholders in the loop during early stages” | Explicit decision tables + who was in the room (operators, eng, partners) |
| **Surface → depth** | Brand / desktop / mobile / process / culture — chapters | Case template chapters: Context → Evidence → Decisions → Making → Handoff → Outcome |
| **Personal voice without fluff** | Short declarative sentences; ownership claimed clearly | Keep Cody’s voice: direct, metrics-honest, Product Lead scope named |

### Spotify case — structural lessons

1. **Open with ownership** (“that’s me”) — then role clarity.
2. **Product surfaces in sequence** (brand → desktop → mobile) — not a single screenshot dump.
3. **Dedicated Design process section** — medium, tools, how eng received specs.
4. **Culture / context** as color, not the main proof.
5. **Images as evidence of making**, not decoration alone.

### What not to copy

- Long retrospective memoir tone for every case (Spotify is a career chapter; Cody’s cases should stay interview-scannable, ~5–8 min).
- Pixel-craft as the climax — Cody’s climax is decisions + metrics + ship.
- Personal photo essay unless it supports a process point.

### rsms → Cody translation

> Rasmus shows *how* Spotify got shaped.  
> Cody’s cases should show *how* the stone got polished — with SQL, field visits, IG flips, trust UX, and eng handoff as the “graphite and printouts” of this era.

---

## Kate Syuma — skipped (locked)

Will **not** revisit. Case IA comes from Cody’s existing spine + rsms process-chapter pattern only.

---

## Proposed visual direction

### Atmosphere

| Token | Value / direction |
|---|---|
| **Field** | **`#FBFBF1`** — pale neutralized yellow (locked Phase 1) |
| **Elevated** | `#F3F3E8` |
| **Ink** | `#1C1C1A` charcoal (soft on the field — not pure black body text everywhere) |
| **Object** | Dark veined stone — high contrast against the field |
| **Accent** | Mineral charcoal / stone black for CTAs and rules — *not* sage-on-dark |
| **Motion** | **Hover:** subtle glitch → smooth. **Scroll:** 3D rotate. Reduced-motion: static |

### Vibe reference (in repo)

| Asset | Path |
|---|---|
| Source board (archive) | `public/images/stone-rough-smooth-vibe.png` |
| **Rough still** | `public/images/stone-rough.png` |
| **Smooth still** | `public/images/stone-smooth.png` |
| White mark (SVG) | `public/brand/mark-light.svg` |
| Field color | `#FBFBF1` |

**Phase 2:** Hero uses a single stacked rough→smooth still pair (hover refines). Mark is baked into the stills from the vibe board; SVG mark kept for future unmarked renders / chrome. About shows the rough\|smooth pair next to the metaphor explainer.

### Hero concept (v1 fantasy — not building yet)

1. **Land** on a large, quiet **white / light** viewport.
2. **Dark 3D stone** (rough) as the dominant visual plane — full presence, not a tiny card.
3. **On hover:** subtle digital glitch that resolves into a smoother/polished stone (not an obvious “AI” look).
4. **On scroll:** stone rotates (true 3D / GLB).
5. **Logo superimposed at Tobias-scale** — brand first; no metaphor explainer on home.
6. **Primary path:** enter selected work (or scroll). Secondary: contact / about.

### Hero budget (keep strict)

- Brand (CDD mark and/or name) at hero scale  
- Optional one short **ownership** line (not the stone metaphor)  
- One CTA group  
- One dominant visual (the stone)  
- No case cards, stats, or schedule-like clutter in the first viewport  

### Logo / mark

| Asset | Path | Use |
|---|---|---|
| Mark (dark SVG) | `public/brand/logo-mark-dark.svg` | Nav on `#FBFBF1` |
| Mark (light SVG) | `public/brand/logo-mark-light.svg` | Light mark |
| Lockup (light SVG) | `public/brand/logo-lockup-light.svg` | Stone overlay |
| Lockup (dark SVG) | `public/brand/logo-lockup-dark.svg` | Dark stacked lockup |

**Note:** Chat attachments arrived as low-res PNGs (mark was ~57×25), which caused blur. Site now uses crisp SVG recreations. Prefer dropping native Figma SVG exports into `public/brand/` to replace these 1:1.

### Theme (locked)

**Light theme with `#FBFBF1` field** + dark stone. Phase 1 skin is in progress / applied in CSS.

### Further ideas (expand on the vibe)

These are options for later phases — not commitments:

1. **One stone in the hero, both states in motion** — Still board is great for direction; live hero should prefer a *single* dominant stone (Tobias scale). Rough→smooth happens via hover glitch/morph, not a side-by-side diptych on first paint.
2. **White mark only on stone; dark wordmark in chrome** — Mark reads as carved light in the vein stone; nav stays charcoal type on `#FBFBF1` so the logo doesn’t fight the field.
3. **Material language for UI chrome** — Hairline rules like stone seams; primary buttons as near-black “polished” slabs; cards almost flush with the field (paper, not floating glass).
4. **Case study section labels** — Optional quiet stage words (Rough / Evidence / Decisions / Polished) as typographic crumbs — not illustrated pebbles on every page.
5. **Screenshot framing** — Device frames on `#FBFBF1` with soft charcoal shadow; avoid heavy dark mode mock chrome that reintroduces the old site.
6. **Soundless “erosion” cue** — Hover glitch should feel like a few frames of digital abrasion, then settle — more film grain / vertex jitter than RGB slice-glitch.
7. **About metaphor block** — Short paragraph + optional small rough|smooth pair (from the vibe board) beside the explainer — the only place we narrate the metaphor.
8. **Export clean assets** — Separate `stone-rough.png`, `stone-smooth.png`, and `mark-on-stone` (transparent) so we aren’t cropping a composite forever.
9. **Compression path for GLB** — Keep Midnight Veinstone character (dark + veins) but target << 24 MB before public ship.
10. **Print / PDF leave-behind** — Same `#FBFBF1` + charcoal + one stone mark on the cover so interview packet matches the site.

---

## Proposed structure (eventual IA)

Unchanged at the route level; refined in *feel* and *case depth*:

```
/                 Stone hero → selected 3 → view more
/work             Index (highlights + more + Behance)
/work/[slug]      Process-deep case (rsms chapters + Cody spine)
/about            Arc + LinkedIn-proof metrics + quotes
/fun              Product OS / Cursor — personality proof
```

### Case study template (synthesis)

Inspired by rsms process chapters + Cody hiring needs:

1. **Opening claim** — what this product is + your ownership line  
2. **Problem (rough stone)** — complaint / ops pain / business gap  
3. **Evidence** — research, SQL, visits, Gong, usability (what you knocked off)  
4. **Key decisions** — explicit cuts and bets  
5. **Making** — flows, wires, prototypes, artifacts (show the abrasion)  
6. **Handoff** — what eng received; how “polished” was defined for ship  
7. **Outcome / metrics** — shipped or honest targets  
8. **Built with** — one short line only when Cursor/prototype tooling mattered  

Optional motif: tiny stone-stage indicator (Rough → Refined → Polished) as section chrome — only if it stays subtle.

---

## Content already in hand (don’t lose)

From current site + prep work — keep as substance under the new skin:

- Positioning: ownership loop; field / data / AI systems  
- Highlight 3: Move-In Scanner, CSV Agent, Mobile Strategy + Lookup  
- About: FamilySearch metrics, Entrata Senior PD + Product Lead scope, Burn the Boats, **stone metaphor explainer**, quotes  
- Fun: Product OS / Cursor skills as proof of the same muscle  

---

## Implementation phases (later — do not start until agreed)

| Phase | Scope | Notes |
|---|---|---|
| **0 — Align** | Decisions + assets | Done |
| **1 — Skin** | Light theme `#FBFBF1`, type, spacing; IA unchanged | **Done** |
| **2 — Hero stills** | Clean rough/smooth exports + hover refine | **Done** |
| **3 — Hero motion** | True 3D GLB: **scroll = rotate**; **hover = subtle glitch → smooth** | **Done** — `StoneHero` + `/models/stone.glb` |
| **4 — Case depth** | rsms-style Making/Process chapters + real artifacts | Content > chrome |
| **5 — Polish pass** | Micro-interactions, screenshot framing, PDF leave-behind | Interview-ready |

---

## Decisions (locked)

1. **Logo:** **Placeholder for now** — CDD monogram at `public/brand/logo-placeholder.png` (may change later). Tobias-scale over stone; wordmark “Cody Duke” OK in nav.  
2. **Hero tech:** **True 3D** (Three.js / R3F). **Scroll → rotate.** Asset: **GLB** (see below).  
3. **Metaphor copy:** **Explain only on About.** Home shows the stone; no metaphor explainer in the hero.  
4. **Theme:** **Flip to light theme** (white / near-white field + dark stone). Don’t wait on finishing Move-In Scanner writeup.  
5. **Kate revisit:** **No.**  
6. **Glitch tone:** **Subtle.** On **hover**, glitch → smooth/polish the stone (not an obvious AI aesthetic).

### 3D asset format (locked recommendation)

| Format | For this site? | Why |
|---|---|---|
| **glb** | **Yes — export this** | Binary glTF. Web standard for Three.js/R3F. One file (mesh + materials + optional anim). Smallest practical path for scroll-rotate hero. |
| gltf (separate .gltf + .bin + textures) | OK as working export | Same as GLB but multi-file; prefer packing to `.glb` for the site. |
| usdz | No (primary) | Apple AR Quick Look — not the main web runtime format. Optional later for iOS AR only. |
| fbx / obj / blend / stl / 3mf / dxf | Source / exchange only | Fine in Blender/CAD; convert → **GLB** for the portfolio. |

**Practical pipeline:** model in Blender (or whatever) → export **GLB** → `public/models/stone.glb` → load with Three.js / `@react-three/drei` `useGLTF`. Keep poly count and texture size modest for mobile; provide a static polished-stone image if WebGL fails or `prefers-reduced-motion` is on.

### 3D stone asset (in repo)

| Item | Detail |
|---|---|
| **File** | `public/models/stone.glb` **(canonical)** |
| **Source** | Meshy AI — “Midnight Veins” (`Meshy_AI_Midnight_Veins_0807204054_texture.glb`) |
| **Role** | Hero stone for Phase 3 (scroll rotate + hover glitch→smooth) |
| **Size note** | ~20 MB — OK for local prototyping; **compress / retopo / smaller textures** before public ship (target often well under ~3–5 MB) |

Site runtime path: `/models/stone.glb`

### Logo placeholder (in repo)

| Item | Detail |
|---|---|
| **File** | `public/brand/logo-placeholder.png` |
| **Mark** | CDD monogram (three rounded half-pill forms) on black |
| **Size** | 1024 × 438 PNG (~20 KB) |
| **Role** | Hero overlay / brand mark; may be replaced later |
| **Usage note** | Low-contrast dark-on-black — for a **white** hero field, export a light (or single-color) version, or treat the black as a knockout and recolor in CSS/SVG later |

---

## Success criteria for the eventual redesign

- First viewport feels **designed** (Tobias bar): scale, restraint, memorable object.  
- Cases feel **architected** (rsms bar): process artifacts and decisions, not only finals.  
- Metaphor is **legible in 5 seconds** and doesn’t drown the hiring narrative.  
- Hiring manager can answer: *What does Cody own? How does he refine? What shipped?*  
- Mobile and `prefers-reduced-motion` still look intentional.  

---

## Reference links

- https://tobiasahlin.com/  
- https://rsms.me/  
- https://rsms.me/work/spotify/  
- https://katesyuma.com/ *(skipped — will not revisit)*
