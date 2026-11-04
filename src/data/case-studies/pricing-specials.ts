import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/pricing-specials/${file}`);

export const pricingSpecialsCase: RichCaseStudy = {
  slug: 'pricing-specials',
  openingClaim:
    'In Entrata Pricing, a special could include only one incentive, a gift or a credit. If a property wanted residents to have a choice, staff created another special and tried to keep the two straight. I redesigned staff setup so one special could hold several incentives, and still follow the pricing rules student and conventional properties already used.',
  collaborators:
    'Pricing product manager, engineering, and the product teams responsible for resident-facing experiences',
  surface: 'Entrata Pricing, desktop staff setup',
  heroFigure: {
    src: img('01-specials-list.png'),
    alt: 'Entrata Pricing Specials list for Lofts at Lorien, with Add Special and rows that mix concessions and gifts on one special.',
    caption:
      'The list shows when one special carries more than one incentive, such as Concession (2) and Gift (2).',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      stage: 'Problem',
      title: 'One special could offer one incentive',
      body: [
        'Creating a special meant picking a single incentive. A property could offer a gift or a credit. It could not offer both on the same special.',
        'When residents were supposed to choose, staff created a second special and managed it on its own. The person doing the setup was already confused. The resident trying to understand the options had it worse.',
        'Operators who had used Yardi expected a choice. RentCafe could present a set of incentives during the online application, and the resident picked one. They wanted that same experience in Entrata. Separate specials were the workaround, and they did not feel like a choice.',
      ],
      callout:
        'For some customers, a choice of incentives was a leasing and retention tool they already relied on, and one reason they wanted Pricing to improve.',
    },
    {
      id: 'properties',
      stage: 'Problem',
      title: 'Student and conventional housing needed different setup',
      body: [
        'Pricing had to support a wide range of property configurations, and those configurations did not share one creation path.',
        'Student housing added lease terms, move-in dates, floor plans, and space options. The same unit might be offered as a private room, a shared room, or the whole unit, and each of those could be priced differently. Conventional properties had their own requirements and their own workflow.',
        'The existing screen tried to hold all of that at once. Adding a list of incentives on top of it, without changing the steps, would have made a hard task harder.',
      ],
      callout:
        'Staff needed one place to create a special with several incentives, without walking through every configuration just to start.',
    },
    {
      id: 'cutting',
      stage: 'Process',
      title: 'I started by taking the form apart',
      body: [
        'My first move was to simplify the creation screen as far as I could. I wanted critique to show us what actually had to come back, so I was willing to cut fields and restore the ones the work still needed.',
        'I explored a three-step wizard in place of the all-in-one form. The steps were the special’s details, who would receive it, and the incentives on it.',
        'A special could now hold more than one incentive. It could also carry rules for lease terms, move-in dates, space options, applicant types, promo codes, and whether the offer applied to prospects, renewals, or both. The goal was a shorter path for the common case, with the flexibility customers still needed.',
      ],
    },
    {
      id: 'tradeoff',
      stage: 'Process',
      title: 'We kept pricing by lease term and space option',
      body: [
        'The sharpest disagreement was pricing by lease term and space option. In student housing, the same unit can be a private room, a shared room, or the whole unit. Each configuration can have its own price and its own incentive, and those amounts can change again by lease term.',
        'About 1% of setups priced at that level of detail. I wanted it off the main creation flow, because it was making the screen heavy for everyone else. Product and engineering kept it. The customers using it were an important group of existing clients, and removing it would have broken a workflow they already depended on.',
        'I understood why it had to stay. From there, I focused on keeping it available when someone needed it, without letting it run the rest of the workflow.',
      ],
    },
    {
      id: 'testing',
      stage: 'Process',
      title: 'Testing sent us back to the Pricing people already knew',
      body: [
        'Usability testing changed the look of the work. My early concepts were cleaner and more modern than the rest of Pricing. Customers were used to how Pricing worked everywhere else in Entrata.',
        'The existing interface looked dated, and people trusted it because they already knew it. A new visual pattern would have been a second thing to learn, on top of the new capability.',
        'We kept the three steps and brought the screens back in line with the rest of Pricing. I had wanted a more modern interface. The priority was making the new capability easier to adopt.',
      ],
    },
    {
      id: 'simple',
      stage: 'Solution',
      title: 'Details, recipients, and incentives',
      body: [
        'The creation flow is three steps: Details, Recipients, and Incentives. Details covers the name and description. Other settings are available, and staff can leave them for later.',
        'Recipients is the audience. A special can apply to prospects, renewals, or both. Staff can also limit it to specific properties, floor plans, unit types, or individual units.',
        'Incentives is where one special holds more than one offer. Staff can group a gift and a concession together and give residents a choice.',
        'Less common options stay closed. Floor plan and space option selections open when someone needs them. Date restrictions turn on when they matter.',
      ],
      callout:
        'The common path stays short. The advanced configuration is still there for the people who need it.',
      figures: [
        {
          src: img('02-details.png'),
          alt: 'Add Special modal on step Special Details: name, descriptions, and a few toggles.',
          caption: 'On Special Details, the required work is a name, and the rest can wait.',
          layout: 'wide',
        },
        {
          src: img('03-recipients.png'),
          alt: 'Add Special modal on step Recipients, with Prospects and Renewals checked and Selected Floor Plans active.',
          caption:
            'On Recipients, prospects and renewals are the audience, and narrower targeting stays closed until someone needs it.',
          layout: 'wide',
        },
        {
          src: img('04-incentives.png'),
          alt: 'Add Special modal on step Incentives, with two gifts and one concession summarizing three space options.',
          caption:
            'On Incentives, two gifts and a concession sit on one special, and Price by Lease Term stays closed until the amounts need to vary.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'making',
      stage: 'Solution',
      title: 'Amounts can still vary by room and by lease term',
      body: [
        'Customers who needed more control could still price by lease term and space option. A single concession can include more than one amount, such as a one-time $100 credit and $50 off each month. Those amounts can differ for a private room and a shared room, and they can change again by lease term.',
        'I put that grid on its own surface, so it never sat in the main steps. It opens as a second dialog on top of the creation dialog.',
        'I try to avoid stacked dialogs. Creation was already a modal, and the design library was built that way, so a second dialog kept people on the special they were configuring. A new page would have taken them away from it. What shipped is a manageable way through a complicated set of requirements.',
      ],
      figures: [
        {
          src: img('05-space-options.png'),
          alt: 'Concession incentive expanded to Private Room, Private Unit, and Shared Room rows, each with Price by Lease Term.',
          caption:
            'A concession can carry a different amount for a private room, a private unit, and a shared room.',
          layout: 'wide',
        },
        {
          src: img('06-lease-term-rates.png'),
          alt: 'Lease Terms Rates dialog stacked on Add Special, with a row per spring lease term for amount, tax, and total.',
          caption:
            'Lease-term rates open in a second dialog, so spring and fall can differ without leaving the special.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'inherit',
      stage: 'Solution',
      title: 'Other teams built on the same special',
      body: [
        'I owned the staff creation experience. Other product teams owned what residents and prospects saw next, including choosing an incentive, accepting it, and seeing the special in the prospect portal. I helped on some of those screens. Other designers led them.',
        'They needed the same incentive structure, the same names, and the same restrictions. A special configured in Pricing had to show up accurately everywhere else it appeared.',
        'When a resident called the office to pick an incentive, staff had to manage that choice from the resident profile. The special from setup had to survive that handoff. Getting the model right mattered as much as making the form easier to use.',
      ],
      figures: [
        {
          src: img('07-resident-profile.png'),
          alt: 'Resident profile Specials tab showing a Summer Renewal gift special as active with a Received button, and an inactive Winter Move-In special with concession and gifts.',
          caption:
            'The same special shows up on the resident profile, where staff can mark an incentive received.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'outcome',
      stage: 'Results',
      title: 'How specials were used after the improvements',
      body: [
        'The first release had problems. Engineering kept improving it over the following year. Applicant type handling was reworked, and a later rebuild addressed issues customers were feeling.',
        'After that, usage showed how widely specials were used, and which of the newer options people actually turned on. These counts describe the platform after those improvements. They are not a conversion rate, and they are not a measure of my work alone.',
      ],
      metrics: [
        {
          value: '10,204',
          label: 'Active specials across 337 clients.',
        },
        {
          value: '8,290',
          label: 'Specials limited by lease term, across 278 clients.',
        },
        {
          value: '1,563',
          label: 'Specials limited by move-in date, across 155 clients.',
        },
        {
          value: '1,266',
          label: 'Specials aimed at specific applicant types, across 118 clients.',
        },
        {
          value: '432',
          label: 'Specials shared by prospects and renewals, across 57 clients.',
        },
        {
          value: '162',
          label: 'Specials with more than one incentive, across 38 clients.',
        },
      ],
      callout:
        'Those 162 specials are the new behavior: a resident can choose among incentives on a single special. I designed the staff setup that made that configuration possible.',
    },
    {
      id: 'reflection',
      stage: 'Results',
      title: 'What I would do differently',
      body: [
        'I would measure the setup experience itself. We could see how customers used specials. We could not see how long a special took to create, where people hit errors, or which configuration paths they actually took.',
        'I would separate the advanced path more clearly. We did move lease-term and space-option pricing out of the main steps. People who did not need it could skip it, and people who did could open it while they configured an incentive. I would still make that door easier to tell apart from the default, so the complex path never feels like the way everyone has to work.',
        'I would have pushed on the design library sooner. Staying consistent with the rest of Pricing was the right call. The library also limited how much the interface could improve, and I treated that limit as fixed for too long.',
      ],
      callout:
        'Simplifying this product meant knowing which complexity mattered, who needed it, and how to keep it from getting in everyone else’s way.',
    },
  ],
  nextCaptures: [
    'Before: old all-at-once create screen — if it is in the file; otherwise omit rather than fake it',
    'Click-through prototype: create → add incentives → Price by Lease Term → done, plus a path that never opens the grid',
  ],
};
