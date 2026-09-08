# Time and tools

Working sample for Caliber. Cody Duke. September 2026.

## TLDR

About ten hours, spread across a few days at a few hours a day. I read the packet myself. I used AI to organize the problem and to build and revise a coded prototype against the component library. I used FigJam for early wireframes that put money next to skill, then Figma to design the quadrant chart that went into the prototype. I built the manager flow as an interactive prototype and stopped when version 1.1 was in a place I could stand behind.

## Time

| | |
|--|--|
| **Total** | About 10 hours |
| **Spread** | 29 August to 3 September 2026, a few hours a day |

This was a focused sample, not a full product cycle.

## How the time was used

**Read.** I started in the Google Docs (START HERE, the brief, Skill Intelligence current state, Voice of the Customer) and understood them myself before asking a tool to restate them.

**Organize.** I used AI to summarize those docs, put the work into an initiative with epics, and get the problems into a few short documents I could design against. The two that mattered: a manager cannot tell fit from skill on named deals, and the business cannot show what amount of money a skill represents.

**Think in Figma.** I used FigJam to mock wireframe ideas off the packet screenshots and those two problems: ways to show revenue, and ways to show why a stall looks like skill or like the book.

**Plan, then build.** I went back and forth with AI on documented plans, then had it take a first pass at a coded prototype. It used the Figma MCP against the component library and the packet screenshots so the first version would sit on-system. I chose code over static frames because an interactive prototype can show different people, skills, and outcomes in one place, and because clicking through a live book of deals feels like the product instead of a slide deck.

**Review with Britton (1 September).** Thirty minutes. He confirmed I was pointed at the right manager problem. He also tightened the brief toward the business problem: a user should be able to see the monetary value of a skill. That clarification was the most useful thing I took into the rest of the work. He asked me to make the revenue tie-in explicit, and not to invent the mathematical model.

**Revise.** I kept a punch list of process and design changes (spacing, hierarchy, clarity, and especially brevity). AI applied those in passes. I then ran a design critique against the component library, learnability versus efficiency, and noise-to-signal, using issues I had already noticed.

**Quadrant in Figma, then back into the prototype.** The first version of the chart still read as a two-by-two card grid. In Figma I redesigned it so it reads as a quadrant. I then had AI apply that design together with the critique changes, and split the prototype into version 1 and version 1.1 so I could switch between them and see what the feedback changed.

**Final pass.** I did my own critique, called out specific UI changes, and had AI apply those in version 1.1. That is where I stopped. Design can always be pushed further. I chose to call this complete.

## What each tool was for

| Tool | Used for | Not used for |
|------|----------|--------------|
| **Me, in the docs** | Understanding the packet, picking the job, judging every pass | — |
| **AI (Cursor)** | Summarizing the packet into problems and epics; written plans; first coded prototype from the library; applying revision passes; a structured design critique; applying the Figma quadrant and my own follow-up notes into version 1.1 | The point of view. Final calls on copy and what to cut |
| **Figma MCP** | First scrape of the component library so the prototype reused existing pieces | Tokens. The View-seat quota ran out, so colors were sampled from the packet screenshots instead |
| **Figma / FigJam** | Early wireframes for money as the why and for fit versus skill; the final quadrant chart, which I designed in Figma and then applied in the prototype | The interactive prototype itself |

## Decisions that shaped the sample

- I set out to solve two problems at once: what a skill is worth in money, and how a manager understands which skill is worth the next hour and why.
- I grouped each open deal by the score on its latest live call and by whether the deal had moved, instead of inventing a new metric. Deals with no scored call stay unplaced.
- I put dollar amounts next to those groups, and I showed a forecast as presentation only: if this score moves this many points, about this much more money. Caliber owns the formula.
- I built a coded prototype that uses Skill Intelligence’s chrome, type, and components so the sample would feel like it belongs in the current product.
- I cut standing legal copy and left one correlation note behind an info icon.

## What I would add next

The Deals tab is where a manager decides what to talk about in the upcoming team meeting. I would put the team score in the same ring gauge used on a person, top right of the Value Based Discovery on open deals card, with the opportunity next to it. If the whole team moved this score about this many points, about this much more money. That is the same pairing as on an individual, rolled up. There is room for it, it belongs with the team numbers, and it answers the meeting question without opening anyone. I put that into version 1.1 so it can be walked.

The detailed day-by-day notes stay internal. This is the version meant to travel with the sample.
