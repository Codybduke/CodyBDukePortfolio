# Tooling log — AI, Figma, and prompts

Keep this honest. The brief asks us to say where AI showed up. The case study will need the same split: what was reasoned, what was generated, what was designed by hand in Figma.

## How to use this file

Add a row when something material happens. "Include in case study" means it is worth showing founders or a hiring manager, not that every Cursor turn belongs on a slide.

| When | Tool | Used for | Prompt or note worth keeping | Case study? |
|------|------|----------|------------------------------|-------------|
| 2026-08-29 | Cursor (Grok) | Read the Drive packet, extract the four docs and Skill Intelligence screenshots, synthesize problem / model / scope | "Analyze the problem and context provided" + the Drive folder URL. First pass that named the Tara job, the empty Priority action hole, and "do not design a revenue dashboard." | Yes — analysis pass |
| 2026-08-29 | Cursor (Grok) | Email-reply options for Britton | "What are some good responses?" Useful only as process; not a product artifact. | No |
| 2026-08-29 | Cursor (Grok) | Clarify deadline vs effort budget | "Does he want this delivered on the 6th, or one day's work then hand it in?" Packet later said Sept 8. | Mention if we tell the time-log story |
| 2026-08-29 | Cursor (Grok) | Stand up I./E. structure, problem list, epic proposal, process + tooling logs | "Create a new I. initiative folder with E. epic folder… outline the problems… suggest the epics… keep track of AI vs Figma and prompts." | Yes — how the work was framed |
| 2026-08-29 | Cursor (Grok) | Applied setup decisions: stay in portfolio repo, full OS lifecycle, add CRO epic | Decision log, not a product prompt | No |
| 2026-08-31 | Cursor (Grok) | Causal identification from packet fields: claim ladder, six-week focus as quasi-experiment, live vs role-play split | "Based on the data the brief says we have access to, how might we show causation between increased skill and increased revenue?" First pass wrongly treated unused revenue as missing. | Yes — model POV, with the correction below |
| 2026-08-31 | Cursor (Grok) | Corrected §4: unused ≠ absent. Amount/win-loss/stage path are available to correlate. | User quoted Current State §4. Kept because it changed the model from “hide dollars” to “join unused CRM outcomes; still do not claim causation.” | Yes |
| 2026-08-31 | Figma MCP (View seat) | First read listed 6 published pages only, then monthly MCP cap. Incomplete inventory. | "Read the Figma Library…" | Yes — shows MCP ≠ the file |
| 2026-08-31 | Figma in browser | User: “I’m seeing 27 pages.” Pages panel confirms 27. Opened Colors, Type, Inputs, Card, Containers, Tabs, Alerts. | Correction. Full kit is unpublished+published; still no heatmap/table/nav. | Yes |
| 2026-08-31 | Figma in browser | Screenshot-inspected remaining 16+ pages. Menus has side nav / header (old labels). Picker, toggle, tooltip, difficulty slider, chicken switch, loaders, logos. | “Go ahead and screenshot-inspect the rest of the pages.” | Yes |
| 2026-09-01 | Figma MCP | Tried `get_variable_defs` on the Colors page for real hex tokens. Hit the View-seat call cap. No tokens retrieved. | Second time MCP was the constraint, not the file. | Yes — same MCP≠file point |
| 2026-09-01 | Pillow (local script) | Sampled exact hex values out of the four packet PNGs: dominant colors, then targeted crops for the lime pill, the toggle, the gauge, the tier tags, the link blue, and the OSR ramp stops. | Colour ground truth came from the shipping product, not the library. Worth showing — it is the reason the proto reads as native. | Yes |
| 2026-09-01 | Cursor (Claude) | Built the coded manager prototype: tokens, primitives mapped to library pages, OSR bar / heatmap / gauge rebuilt from screenshots, fabricated 85-deal dataset, fit-vs-skill 2×2, deal modal, six-week focus modal. | See prompt below. | Yes — the main build |
| 2026-09-01 | Cursor (Claude) | Caught two real bugs by inspecting rendered screenshots: a CSS specificity error killing every button style, and sub-skill averages rendering as zeros instead of an empty state for a rep with no coverage. | Worth telling: the agent's own subagent reported "no visual problems" and was wrong both times. | Yes — honest AI note |

| — | Figma | Brand file still unopened | [Caliber Brand](https://www.figma.com/design/O0YvFWtpyKN4U04TGbWyOb/Caliber-Brand) | — |

## Prompt scratch (keep the ones that changed a decision)

### 2026-08-29 — packet analysis

> Analyze the problem and context provided [Drive folder]. Start with START HERE.

Kept because it produced the working bets: one skill (Value Based Discovery), manager + deals as the primary surface, six-week loop as secondary, CRO articulated not designed, stage/stall as the only honest proxy.

### 2026-08-29 — process setup

> Keep track of all the steps… end result should be a portfolio case study that I could use as a presentation to the founders. Keep track of what I used AI for and what I used Figma for. Keep track of any prompts worth making note of. Create I. / E. using the product skill. Outline the problems including holes. Suggest the epics. Ask questions.

Kept because it defined the dual outcome: Caliber deliverable and portfolio case, with an audit trail.

### 2026-08-31 — causation from packet data

> Based on the data that the brief says we have access to, how might we show causation between increased skill and increased revenue?

Kept because it forced the model off a revenue dashboard and onto: join at the scored call, stall as proxy, six-week focus as treatment, role-play ≠ outcome, L5–L6 gated.

### 2026-09-01 — build the manager prototype

> Build a prototype for E.manager-skill-on-deals. Follow the design guidelines and the component library as closely as possible, including spacing, colors, typography, buttons, any data viz. Make sure it looks uniform and would fit right in with the screenshots included in the challenge packet… reference our reference material to answer questions as much as possible. Ask me any questions that cannot be answered by the reference material that will block a piece of the prototype.

Kept because the constraint "fit right in with the packet screenshots" is what sent the work to pixel-sampling the PNGs instead of guessing at brand colours, and because "ask only what blocks" is what forced the dollar-column conflict to be resolved in the design (a toggle) rather than by asking.

## Rules for later

- If a Figma file is created or their library is extended, log the file link and what was reused vs invented.
- If a prototype is coded, log it as AI-assisted build, not Figma.
- If we email Britton or Chris a question, log the question — they score that.
- Do not clean this file after the fact to look more impressive.
