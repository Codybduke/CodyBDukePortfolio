import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/pricing-specials/${file}`);

export const pricingSpecialsCase: RichCaseStudy = {
  slug: 'pricing-specials',
  openingClaim:
    'In Entrata Pricing, a special could carry one incentive — a gift or a credit. Two offers meant two specials, and the resident path got weird. I was the first designer on a rewrite of staff setup: property managers and regional admins needed one special that could hold a list of incentives, targeted by lease term, move-in date, space, applicant type, and whether it was for prospects, renewals, or both. I spent a few months in 2022 cutting the create flow until critique put some of it back, then usability testing pulled us toward the Pricing setup pattern people already knew instead of a sleeker one-off. Other teams built accept and prospect-portal display on that model. Engineering spent the next year shipping and repairing. After a rough first release settled, 10,204 active specials sat on 337 clients. 8,290 used lease-term rules. 162 specials on 38 clients ran the multi-select path that did not exist before.',
  collaborators:
    'Entrata Pricing PM and engineering; other product teams who built resident accept and prospect-portal display on the setup model',
  surface: 'Desktop Entrata Pricing — staff setup for property, regional, and admin users',
  heroFigure: {
    src: img('01-specials-list.png'),
    alt: 'Entrata Pricing Specials list for Lofts at Lorien, with Add Special and rows that mix concessions and gifts on one special.',
    caption:
      'The hub. Type icons show when one special carries more than one incentive — Concession (2), Gift (2) — which the old model could not do.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      stage: 'Rough',
      title: 'One special, one incentive',
      body: [
        'Specials are how properties lease and retain: a month free, a gift card, a reduced rate. In Pricing, creating one meant choosing a single incentive type. Gift or credit. If a property wanted a resident to pick from more than one, staff made multiple specials and hoped the downstream path made sense. It did not. The setup person was confused. The resident path was worse.',
        'The hard part was not the marketing copy. It was the grid of properties those specials had to live on. Student housing especially: lease terms, move-in windows, space options or not. Conventional properties had a different creation path. The existing screen asked staff to do all of that at once.',
        'The job was to increase what a special could do without asking an entrenched Pricing user to learn a new product. Capability up. Complexity down — or at least not up.',
      ],
      metrics: [
        {
          value: '1',
          label: 'Incentive per special in the old model — gift or credit, not both',
        },
        {
          value: '2',
          label: 'Property types the create flow had to cover: student and conventional',
        },
        {
          value: 'Staff',
          label: 'Primary user: property manager, regional, or admin setting up Pricing',
        },
      ],
      callout:
        'Multiple specials were not a workaround for multiple incentives. They were a different product, and residents could not use them that way.',
    },
    {
      id: 'evidence',
      stage: 'Evidence',
      title: 'The old screen was ugly. It was also the map.',
      body: [
        'I started by cutting. The philosophy was to remove so much that collaboration and critique would have to put about 20% back. That is how I knew we had actually reduced noise instead of rearranging it. A three-step wizard replaced the all-at-once create screen. Each step held less. The special itself could hold more: a list of incentives, then rules for lease terms, move-in dates, space options, applicant types, promo codes, manual-only, and whether prospects and renewals shared it.',
        'The piece I pushed hardest to leave out was pricing per lease term and per space option. A space option is a student-housing fact: a room with two beds can be sold as private, shared, or as two rooms — and each of those can carry a different concession. I could set a $50 monthly discount, then a grid of different amounts for summer vs fall, private vs shared. About 1% of people priced at that grain. Those people sat on a significant set of clients. Pulling the grid would have broken how they already used Pricing the moment we added multi-incentive specials. I lost that argument to PM and engineering. I still think the default create path should not have been built around that 1%. I also had to design the grid well once it was in.',
        'Usability testing is what stopped me from shipping a cleaner product that did not belong in Pricing. Testers were used to how Pricing is set up everywhere else in Entrata. The old UI looked dated. It was also the format they already trusted. A sleek, simple shell would have been a change-management project on top of a capability project. We went back toward that paradigm — quieter steps, same family as the rest of Pricing — so the new special was learnable.',
        'The screens still look like Entrata of that era: heavy red, a design library we were not going to break for one flow. Belonging mattered more than a portfolio-friendly UI. I would still make that call. I would also still say the library was holding the product back.',
      ],
      table: {
        headers: ['Input', 'What it changed'],
        rows: [
          [
            'Old model: one incentive per special',
            'Creation had to support a list on a single special, not a pile of specials.',
          ],
          [
            'Student vs conventional, space options vs not',
            'One create process with forked steps, not four products.',
          ],
          [
            'Pricing per lease term × space option (~1% of setups, concentrated clients)',
            'Pushed to cut it. Lost. Keeping it meant multi-incentive could not strand existing Pricing users.',
          ],
          [
            'Usability: Pricing setup is a habit',
            'Dropped the sleek one-off. Kept the quieter steps inside the existing paradigm.',
          ],
          [
            'Design library and brand red',
            'Shipped looking like Entrata so it would get used. Did not pretend this was a visual redesign.',
          ],
        ],
      },
      callout:
        'The first instinct was a nicer wizard. The useful instinct was: do not orphan specials from Pricing.',
    },
    {
      id: 'strategy',
      stage: 'Decisions',
      title: 'Setup is the product other teams inherit',
      body: [
        'I owned staff create. That was the first design on the initiative, and it became the contract. Resident accept, incentive select, and prospect-portal display were assisted and then taken by other product teams — they had to follow how setup named incentives, stacked them, and restricted them. If setup was a mess, every downstream surface would be a mess.',
        'The targeting model is what made multi-select safe to offer. A resident can only choose from a list the property can honor: this lease term, this move-in window, this space option, this applicant type, sometimes a promo code, sometimes staff-only. Without those restrictions, a list of incentives is a promise accounting cannot keep.',
        'I was not on the channel for the full year and a half. Design was a few months in mid-2022, with follow-ups. Release, the rough first launch, the R1 re-implementation of applicant types, Anil’s differential rebuild, and the drop in incoming bugs were engineering’s chapter. The adoption numbers are from after that chapter. I designed the setup those diagnostics count. I did not personally ship the rebuild.',
      ],
      table: {
        headers: ['Choice', 'Why / what we dropped'],
        rows: [
          [
            'One special, many incentives',
            'Multiple specials could not produce a real choice for the resident.',
          ],
          [
            'Three quieter steps, not one mega-form',
            'Staff still had to do the work. They did not have to see all of it at once.',
          ],
          [
            'Match Pricing setup, not a new visual language',
            'Usability: entrenched users. Change management was the hidden cost of “sleek.”',
          ],
          [
            'Restrictions as part of create',
            'Lease term, dates, space, applicant type — or the list would over-promise.',
          ],
          [
            'Cut until critique added ~20% back — then lost the grid fight',
            'Wanted lease-term × space-option amounts as an advanced path, not the main create. PM and eng kept it. About 1% priced there; those clients already depended on it.',
          ],
          [
            'Stacked modal for lease-term rates',
            'Textbook anti-pattern. Best option under the library and the grid we had to keep: one more surface, same create context, not a new page.',
          ],
          [
            'Look like Entrata',
            'A prettier island would have been skipped. The library was the constraint.',
          ],
        ],
      },
    },
    {
      id: 'simple',
      stage: 'Making',
      title: 'Most of the time it stays three steps',
      body: [
        'Details, Recipients, Incentives. Name it, say who it is for, add the list. Floor-plan and space-option pickers stay collapsed as “all” or “selected.” Toggles for date caps sit off until someone needs them. That is the default path — quieter than the old mega-form, still in Pricing’s chrome, still dummy data.',
        'Complexity is available. It is not in your face. If they never price by space option and lease term, they never see the grid. If they do, the UI gets denser on purpose. That was the trade: still simpler than original create, honest about the 1% path we lost the fight to keep out of the default.',
      ],
      figures: [
        {
          src: img('02-details.png'),
          alt: 'Add Special modal on step Special Details: name, descriptions, and a few toggles.',
          caption: 'Step 1 — Special Details. The required work is a name. The rest can wait.',
          layout: 'wide',
        },
        {
          src: img('03-recipients.png'),
          alt: 'Add Special modal on step Recipients, with Prospects and Renewals checked and Selected Floor Plans active.',
          caption:
            'Step 2 — Recipients. Prospects and renewals, not current residents. Targeting stays in dropdowns until it has to expand.',
          layout: 'wide',
        },
        {
          src: img('04-incentives.png'),
          alt: 'Add Special modal on step Incentives, with two gifts and one concession summarizing three space options.',
          caption:
            'Step 3 — Incentives. Two gifts and a concession on one special. The concession row is still a summary: 3 space options, $50 monthly. Price by Lease Term is a door, not the room.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'making',
      stage: 'Making',
      title: 'The rabbit hole is optional, and it is stacked',
      body: [
        'This is the shape we ended up having to support. A special could be for prospects and renewals but not current residents; limited by date range and renewal start; assigned to selected properties, and then to selected floor plans, unit types, or even specific units. On that special, three incentives: two gifts with different values, and one concession. That concession could itself be a stack — a one-time $100 plus $50 a month — and those amounts could differ for a shared room versus a private room, and again for summer term versus fall. That is one special. That is why setup could not be a pretty three-field form.',
        'When someone opens the concession, the summary becomes a row per space option: private room, private unit, shared room. Price by Lease Term then opens a second dialog on top of Add Special — Lease Terms Rates — so spring vs fall can differ without dumping that table into the already-full create modal. A lot of UX writing says never stack dialogs. It depends. Under this design library, with create already a modal, a new page would have dropped the special context. A second small modal kept the grid in the same session. I would still defend that here. I would not make it a house rule.',
        'I assisted how a resident accepts and selects, and how specials show in the prospect portal. Those screens are supporting. Setup is the case.',
      ],
      callout:
        'If they want it complicated, it can be. The default path does not start there. We simplified the workflow. We did not simplify the domain.',
      figures: [
        {
          src: img('05-space-options.png'),
          alt: 'Concession incentive expanded to Private Room, Private Unit, and Shared Room rows, each with Price by Lease Term.',
          caption:
            'The 1% path in the create modal. Amounts per space option. Still not lease terms — that is the next door.',
          layout: 'wide',
        },
        {
          src: img('06-lease-term-rates.png'),
          alt: 'Lease Terms Rates dialog stacked on Add Special, with a row per spring lease term for amount, tax, and total.',
          caption:
            'Modal on modal. Spring terms at $50 monthly, still inside create. The anti-pattern was the least-bad way to keep context under library constraints.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'inherit',
      stage: 'Making',
      title: 'What other teams inherited',
      body: [
        'I did not own the resident-profile surface. I helped. Other product teams designed this version. It is here because it is the same object: Gift (2) on one row, Concession plus Gift on another — the setup model showing up where staff actually apply a special.',
        'If a resident called the office to pick an incentive, the person on the phone could accept it here instead of sending them through a portal. Status is active or inactive. Received is a date, or a button to mark it received. That is office-side completion of a choice that started in Pricing setup.',
      ],
      figures: [
        {
          src: img('07-resident-profile.png'),
          alt: 'Resident profile Specials tab showing a Summer Renewal gift special as active with a Received button, and an inactive Winter Move-In special with concession and gifts.',
          caption:
            'Lease → Specials on a resident profile (dummy data). I assisted; I did not lead this screen. The type mix is the setup contract landing in the office workflow.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'outcome',
      stage: 'Polished',
      title: 'What moved after the rough launch',
      body: [
        'The first release was rough. I would not lead with that, and I would not hide it. After R1 2024, incoming bugs dropped sharply. Applicant types had to be re-implemented. A differential rebuild made a large difference for customers. That is the engineering story that made the setup usable in production.',
        'The snapshot that closed the channel: 10,204 active specials across 337 clients. That is how much of the client base was relying on specials for leasing and retention — the platform, not a claim that I caused 337 logos. Inside that base, the capabilities I designed setup for actually got used.',
        'Lease-term restrictions showed up on 8,290 specials across 278 clients. Move-in date restrictions on 1,563 specials across 155. Applicant types on 1,266 specials across 118. Shared prospect and renewal on 432 specials across 57. Multi-select — the new behavior — on 162 specials across 38 clients. That last number is small because it is a new way to lease, not a default toggle. Zero clients could do it before.',
      ],
      metrics: [
        {
          value: '10,204',
          label: 'Active specials across 337 clients after the initiative (platform)',
        },
        {
          value: '8,290',
          label: 'Specials using lease-term restrictions (278 clients)',
        },
        {
          value: '1,266',
          label: 'Specials for specific applicant types (118 clients), after the R1 re-implementation',
        },
        {
          value: '162',
          label: 'Specials with multiple incentives to choose from (38 clients) — did not exist before',
        },
      ],
      callout:
        'I designed the setup those diagnostics measure. The 1.5-year ship, the rebuild, and the bug drop were a multi-team release. I do not claim the 337-client base as a personal conversion.',
    },
    {
      id: 'reflection',
      title: 'What I’d change',
      bullets: [
        'Instrument setup itself: time-to-create, error on publish, which branch (student / conventional / space options) actually got used. Channel diagnostics counted live specials. They did not tell us if the wizard was faster than the old mega-form.',
        'Keep a before screenshot in the design file on purpose. The all-at-once create screen is the argument. I am still hunting it in the recovered file.',
        'I would still conform to Pricing’s setup pattern. I would still have cut per-lease-term × space-option pricing from the default create path — make it advanced, not the main story. I lost that one. I would push harder, earlier, on the design library. Belonging was right. Shipping a red, dated shell as the cost of belonging was a company constraint I would not pretend was taste.',
      ],
    },
  ],
  nextCaptures: [
    'Before: old all-at-once create screen — if it is in the file; otherwise omit rather than fake it',
    'Click-through prototype: create → add incentives → Price by Lease Term → done, plus a path that never opens the grid',
  ],
};
