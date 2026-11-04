export type CaseCover = {
  src: string;
  alt: string;
  /** Hover preview (mp4). Poster stays in `src`. */
  video?: string;
  /** Reversed copy of `video`, played on pointer leave. */
  videoReverse?: string;
  /** CSS object-position for the tile crop */
  position?: string;
  /** Extra zoom on the crop. 1 = none. */
  scale?: number;
  /** How the cover sits in the plate. Default cover. */
  fit?: 'cover' | 'contain';
};

/** Cut-face mineral field for tiles and later case bands */
export type CaseField = 'brass' | 'obsidian' | 'terracotta' | 'labradorite';

export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  role: string;
  timeframe: string;
  highlight: boolean;
  tags: string[];
  field?: CaseField;
  cover?: CaseCover;
  problem: string;
  process: string[];
  decisions: string[];
  metrics: string[];
  outcome: string;
  handoff: string;
  builtWith?: string;
  status: 'draft' | 'ready';
};

export const cases: CaseStudy[] = [
  {
    slug: 'move-in-scanner',
    title: 'Real-time Move-ins',
    eyebrow: 'Staff iOS, offline on move-in day',
    summary:
      'On move-in day, staff were getting residents in the door and catching Entrata up later. I designed a phone flow so they could find the person, check the list, confirm a photo ID, and record the move-in while they were still standing there.',
    role: 'Product Lead (PM + UX + prototype handoff)',
    timeframe: 'Mar – May 2026',
    highlight: true,
    tags: ['Field research', 'SQL', 'SwiftUI', 'Offline'],
    field: 'labradorite',
    cover: {
      src: '/work/move-in-scanner/cover.webp',
      alt: 'Three iPhone screens: Upcoming Move-ins roster, Riley Foster summary, and Confirm Move-in.',
      video: '/work/move-in-scanner/cover.mp4',
      videoReverse: '/work/move-in-scanner/cover-reverse.mp4',
    },
    problem:
      'At peak student turn, staff move in 100 to 500 or more residents from a breezeway, the office, or a drive-through. Offline they mark a spreadsheet and lose sight of the checklist. Online they fight desktop Entrata on a phone. Either way the resident leaves with keys and Entrata catches up later.',
    process: [
      'Three site visits showed printed rolls, laptop sheets, and packets instead of Entrata at the table.',
      'Interviews with about 20 operators pushed search over QR, optional items into a follow-up task, and offline into the first release. I rewrote the requirements in 48 hours.',
      'Ten SQL queries sized unused Bulk Move-In and kept checklist-versus-renewal claims directional, not causal.',
      'The first answer was an overnight upload. Field work moved the bet to the table, and we split the two so neither waited.',
    ],
    decisions: [
      'Search first, after interviews described the line as “Smith, 315,” not a QR scan.',
      'Offline moved into the first release: a 30-day cached roster, queued confirms, and a home screen that collapses to Move-In.',
      'Optional checklist items create an internal follow-up task instead of disappearing after confirm.',
    ],
    metrics: [
      'About 21% of student move-ins at a large operator were completed in Entrata in real time on move-in day.',
      'About 36% had no activity in the move-in window and were completed by the next morning.',
      'The other 43% were completed later than the next morning, or were no-shows and never completed.',
      'Near-zero use of desktop Bulk Move-In in peak months, even at the largest student operator in the set.',
    ],
    outcome:
      'A scoped table-side flow with offline cache and follow-up tasks for the OXP mobile team to implement, not a shrunk desktop Bulk Move-In. Pilot actuals are not in yet.',
    handoff:
      'A SwiftUI package and demo target for the OXP app. The in-house mobile team walked the module, found five defects in about 30 minutes, and made small changes to fit the app.',
    builtWith:
      'Field research, an Expo prototype to work through the states, then SwiftUI for the mobile team.',
    status: 'ready',
  },
  {
    slug: 'familysearch-discovery',
    title: 'FamilySearch Personalized Discovery',
    eyebrow: 'Consumer · Retention',
    summary:
      'FamilySearch could acquire beginners at stadium scale and could not keep them. I led product design for a repeatable discovery loop — Pioneer, Ancestor Calendar, and WWI Draft among 26 campaigns — that started from a person already in the tree. Versus the previous year we retained 95% more members and 107% more other patrons; 1.1 million patrons outside the US engaged in a campaign.',
    role: 'Product designer (led personalized discovery campaigns)',
    timeframe: '2017 – 2019',
    highlight: true,
    tags: ['Retention', 'Personalization', 'Consumer'],
    field: 'brass',
    cover: {
      src: '/work/familysearch-discovery/cover.webp',
      alt: 'FamilySearch Pioneer card for William Davis Robinson, 2nd cousin five times removed, with View Photos and Stories.',
      video: '/work/familysearch-discovery/cover.mp4',
      videoReverse: '/work/familysearch-discovery/cover-reverse.mp4',
    },
    problem:
      'New accounts arrived in droves and did not come back. Beginners hired FamilySearch to feel a connection to someone who came before them, then met a toolbox built for hobbyists. Generic “come search” campaigns asked them to do the hard part first.',
    process: [
      'Used beginner retention research and 86K campaign comments (90% positive) to treat signup volume as a leak, not a win.',
      'Planned Pioneer, Calendar, and WWI with PMs and campaign managers as one loop: named ancestor → relationship in a sentence → one story or record.',
      'Shipped Pioneer as the fullest card, Calendar as the repeating birthday/anniversary habit, WWI Draft as the third hook on the same IA.',
    ],
    decisions: [
      'Start from a person the tree can already name. If relationship cannot be said in a sentence, do not send the campaign.',
      'One next action (photos, story, or the record) instead of teaching search in the first session.',
      'Three campaign instances, one product loop — so the third campaign was cheaper than the first.',
    ],
    metrics: [
      '95% more members retained than the previous year; 107% more other patrons retained than the previous year.',
      '1.1 million patrons outside the US engaged in a campaign.',
      '26 campaigns sent; 86K feedback comments received, 90% positive.',
    ],
    outcome:
      'A discovery system that made an ancestor real before it asked anyone to become a researcher. Retention versus the previous year and international campaign engagement are the campaign actuals.',
    handoff:
      'Email plus in-product discovery surfaces — home cards, ancestor stories, relationship, and notifications — for FamilySearch product, campaign, and records partners.',
    builtWith:
      'Experience planning with PMs and campaign managers; paper flows into in-product UI on FamilySearch.org.',
    status: 'ready',
  },
  {
    slug: 'pricing-specials',
    title: 'Entrata Pricing Specials',
    eyebrow: 'Desktop · Systems',
    summary:
      'In Entrata Pricing, a special could include only one incentive. I redesigned staff setup so one special could hold several, and still follow the pricing rules student and conventional properties already used. After later engineering improvements, 162 specials across 38 clients offered residents that choice.',
    role: 'Product designer',
    timeframe: 'Design in 2022, releases through 2024',
    highlight: true,
    tags: ['Setup', 'Systems', 'Pricing'],
    field: 'terracotta',
    cover: {
      src: '/work/pricing-specials/cover.webp',
      alt: 'Add Special create flow: Details, Recipients, and Incentives steps, with gifts and a concession on one special.',
      video: '/work/pricing-specials/cover.mp4',
      videoReverse: '/work/pricing-specials/cover-reverse.mp4',
    },
    problem:
      'A special could include one incentive, a gift or a credit. Properties that wanted to offer a choice had to create separate specials. Student and conventional housing also needed different pricing rules on the same setup screen.',
    process: [
      'I replaced the all-in-one form with three steps: details, recipients, and incentives, and cut until critique showed what had to come back.',
      'I wanted lease-term and space-option pricing off the default path. About 1% of setups used it. Product and engineering kept it because those clients already depended on it.',
      'Usability testing showed customers trusted the existing Pricing patterns. We kept the three steps and brought the interface back in line with the rest of the product.',
    ],
    decisions: [
      'One special can hold several incentives, with restrictions for who can receive them.',
      'Advanced pricing stays available from the incentive, including a second dialog for lease-term amounts.',
      'The screens follow existing Pricing patterns so the new capability is easier to adopt.',
    ],
    metrics: [
      '10,204 active specials across 337 clients, after later engineering improvements. Platform usage, not a personal conversion.',
      '8,290 specials across 278 clients used lease-term restrictions.',
      '162 specials across 38 clients offered more than one incentive. I designed the staff setup that made that possible.',
    ],
    outcome:
      'Staff can create one special with several incentives, and other teams used that same model for resident selection and the prospect portal. The adoption counts come after a rough first release and a later engineering rebuild.',
    handoff:
      'Staff creation in desktop Entrata Pricing. Other product teams owned resident selection, acceptance, and prospect-portal display on this model.',
    builtWith:
      'Figma (click-through prototype, dummy data); usability testing; Pricing design library constraints.',
    status: 'ready',
  },
  {
    slug: 'caliber-skill-on-deals',
    title: 'Ten hours on what a skill is worth',
    eyebrow: 'Design exercise · Caliber',
    summary:
      'A front-line manager can see a skill score. He cannot see which deals that score is failing, whether the stall is the skill or the companies, or which skill is worth the next hour. Caliber asked for that connection because they sell skill as a way to move revenue, and the product still cannot show it.',
    role: 'Product designer, working sample',
    timeframe: 'Aug 29 – Sep 3, 2026 · about 10 hours',
    highlight: false,
    tags: ['Design exercise', 'Coaching', 'Prototype'],
    field: 'obsidian',
    cover: {
      src: '/work/caliber-skill-on-deals/cover.png',
      alt: 'Caliber Skill Intelligence Deals tab, with open deals sorted by call score and a team gain of about $65K.',
      position: 'center top',
    },
    problem:
      'A manager can see a skill score and cannot see which deals it is failing, whether the stall is the skill or the companies, or which skill is worth the next hour. Caliber sells that score as a way to move revenue, and Skill Intelligence still cannot show the join.',
    process: [
      'Read the packet, the current product, and three customer conversations before drawing a screen.',
      'Joined the latest scored call to the deal, to whether it moved, and to the amount. Left the formula with Caliber.',
      'Built a coded prototype, then cut version 1.1 after Britton’s walkthrough and my own critique of the extra sentences.',
    ],
    decisions: [
      'One manager surface, on named deals, instead of a new revenue dashboard.',
      'Four groups plus an unscored bucket, so the view does not characterize a call it never saw.',
      'Forecast as a number pair beside the score. The explanation sits behind an info icon.',
    ],
    metrics: [
      'About ten hours, a few hours a day, from August 29 to September 3.',
      'Tara: 8 open deals, about $349K, stalled after a below-Proficient discovery call.',
      'Closing had more money behind it than her weakest skill. The hour and the low score were different answers.',
    ],
    outcome:
      'A walkable manager view that puts skill, the deal, and an honest dollar association on one surface. Founder feedback: the money and the hour landed. The quadrant and the color bar still needed a sentence said out loud.',
    handoff:
      'A written model, a time-and-tools log, and a coded prototype with version 1 and 1.1 so the cuts stay visible.',
    builtWith:
      'The packet and customer conversations. FigJam and Figma for the quadrant. A coded prototype in Skill Intelligence’s chrome. AI organized the reading and applied revision passes. I kept the point of view.',
    status: 'ready',
  },
  {
    slug: 'csv-move-in-agent',
    title: 'Bulk Move-in Smart Upload',
    eyebrow: 'Desktop · AI workflow',
    summary:
      'Student housing was a majority of Entrata’s clients, and the morning after move-in those properties were still a spreadsheet. An agent matches the file to leases and shows three buckets before anything is written. Field work later moved the main bet to a phone in the line. This stayed the next-day bridge.',
    role: 'Product Lead (hybrid UX/PM) — owned eng team',
    timeframe: 'Q2 2026',
    highlight: false,
    tags: ['AI agents', 'Trust UX', 'Business outcomes'],
    field: 'terracotta',
    cover: {
      src: '/work/csv-move-in-agent/01-preflight.png',
      alt: 'Bulk Move-In review after an upload, with ready, follow-up, and unresolved buckets.',
      position: 'center top',
    },
    problem:
      'After move-in day, staff re-key every resident from an offline spreadsheet into Entrata. For a 300-resident property that was about eight hours of overtime in the busiest week of the year.',
    process: [
      'Started from the morning-after job: keep the spreadsheet, recover Entrata, do not force the table to change first.',
      'Designed upload, match preview, and exception review so staff see the agent’s work before anything is written.',
      'After field work on the line, kept this as the next-day bridge and shifted the main bet to the table app.',
    ],
    decisions: [
      'Treat the spreadsheet as the source of truth. Confidence sits on the resident match, not on a mapping grid.',
      'Three buckets before launch: will move in, will move in with a follow-up, or skip until a person steps in.',
      'Split from the table app so a faster overnight job did not stall the day-of product.',
    ],
    metrics: [
      'Goal: a 300-resident property finishes in under 1 hour, from about 8 hours of re-key.',
      'Goal: 70%+ of uploaded residents processed without a person stepping in.',
      'Goal: 90%+ of exceptions include a clear suggested resolution.',
    ],
    outcome:
      'A walkable overnight agent that shows its work. The table-side case is the product we took further. Pilot actuals are not in yet.',
    handoff:
      'Prototype flows for upload, match preview, and exception resolution, plus a spec for an owned engineering team.',
    builtWith:
      'Product Lead loop with engineering: a walkable desktop prototype, exception buckets, and outcome targets marked as goals.',
    status: 'ready',
  },
  {
    slug: 'mobile-strategy-resident-lookup',
    title: 'Mobile Strategy + Resident Lookup',
    eyebrow: 'Strategy · Information architecture · Mobile',
    summary:
      'Entrata had never built a native mobile app for property managers. I helped shape the mobile strategy and designed resident lookup so staff could find a person and handle the request in the field.',
    role: 'Product Lead / Product Designer (strategy, research, information architecture, prototyping)',
    timeframe: 'April – May 2026',
    highlight: true,
    tags: ['Research synthesis', 'Information architecture', 'Mobile'],
    field: 'obsidian',
    cover: {
      src: '/work/mobile-strategy-resident-lookup/cover.webp',
      alt: 'Three iPhone screens: Command Center home, resident search for Marcus Johnson, and his profile hub.',
      video: '/work/mobile-strategy-resident-lookup/cover.mp4',
      videoReverse: '/work/mobile-strategy-resident-lookup/cover-reverse.mp4',
      position: 'center center',
    },
    problem:
      'Property managers were asked resident questions while walking the property, and the phone path was desktop Entrata in a browser. They wrote the question down, called the office, or struggled through the web app.',
    process: [
      'Asked property managers what they needed on a phone. Looking up residents came first.',
      'Used Gong calls, customer feedback, competitor apps, and a four-persona usability simulation to move off an early dashboard direction.',
      'Prototyped Command Center and Residents in Expo, plus a SwiftUI lookup module for the native team.',
    ],
    decisions: [
      'The home screen leads with Daily Briefing and Quick Actions.',
      'Regional managers both drive adoption and use the app, so property scope has to be obvious.',
      'Resident lookup starts with search and a short profile, including read-only financials.',
    ],
    metrics: [
      'About 4,600 Gong calls, 30+ feedback transcripts, 5 competitor apps, and 32 walkthroughs across 4 personas.',
      'All four personas completed a charge-dispute scenario. Every persona hesitated or failed on a plate-only search.',
      'Targets, not results: more than half of staff active weekly within 12 months of general availability.',
    ],
    outcome:
      'A mobile direction, a walkable Command Center and Residents prototype, and a resident lookup flow the team could try. The usage targets are not measured yet.',
    handoff:
      'A strategy memo with confidence on each claim and checks for the first 90 days, an Expo prototype, usability findings, and a SwiftUI resident lookup module.',
    builtWith:
      'Research synthesis, an Expo prototype of Command Center and Residents, and a SwiftUI lookup module for the native team.',
    status: 'ready',
  },
  {
    slug: 'agent-activity-audit',
    title: 'Agent Activity Audit',
    eyebrow: 'AI console · Trust IA',
    summary:
      'Customer voice → information architecture that separates activity, performance, and escalations so operators can trust what agents did.',
    role: 'Product designer',
    timeframe: '2026',
    highlight: false,
    tags: ['IA', 'AI trust', 'Customer voice'],
    problem:
      'Operators needed a clear audit trail for agent work without conflating activity logs, performance metrics, and escalation queues.',
    process: [
      'Grounded IA in customer feedback themes about trust and visibility.',
      'Separated activity, performance, and escalations into distinct jobs.',
    ],
    decisions: [
      'Activity ≠ performance ≠ escalations — three jobs, three surfaces.',
    ],
    metrics: [
      'Customer-voice themes on trust and visibility drove the IA split (qualitative).',
    ],
    outcome: 'Clearer mental model for “what did the agent do?” vs “is it working?” vs “what needs a human.”',
    handoff: 'IA recommendations and prototype screens for the agent console audit experience.',
    status: 'draft',
  },
  {
    slug: 'my-agents-catalog',
    title: 'My Agents / Catalog',
    eyebrow: 'JTBD · Console reorg',
    summary:
      'Reorganized the agent console around operate / discover / prove value — so roster, marketplace, and impact aren’t one undifferentiated list.',
    role: 'Product designer',
    timeframe: '2026',
    highlight: false,
    tags: ['JTBD', 'AI console', 'Activation'],
    problem:
      'Agent surfaces mixed day-to-day operation, discovery, and value proof into one confusing experience.',
    process: [
      'Teardown of Performance / Admin Insights patterns.',
      'Split jobs: operate agents you own, discover new ones, prove AI impact.',
    ],
    decisions: [
      'JTBD split — operate / discover / prove value — instead of one flat roster.',
    ],
    metrics: [
      'Framed for activation storytelling; quantitative activation metrics to be filled when available.',
    ],
    outcome: 'A JTBD-shaped console structure ready for activation storytelling in interviews.',
    handoff: 'Console IA + prototype roster/marketplace structure for eng and product partners.',
    status: 'draft',
  },
  {
    slug: 'voice-and-tone',
    title: 'Agent Voice & Tone Settings',
    eyebrow: 'Systems · Cascade IA',
    summary:
      'Systems thinking for voice and tone controls that cascade across agents without burying operators in one-off settings.',
    role: 'Product designer',
    timeframe: '2026',
    highlight: false,
    tags: ['Systems design', 'IA', 'Settings'],
    problem:
      'Voice and tone needed to be configurable at the right altitude — global defaults with sensible overrides, not a settings maze.',
    process: [
      'Mapped cascade / inheritance for brand voice across agent surfaces.',
      'Designed migration-friendly settings IA.',
    ],
    decisions: [
      'Cascade defaults with overrides — configure at the right altitude, not per-agent sprawl.',
    ],
    metrics: [
      'Systems case — lighter on research/results; strength is IA clarity.',
    ],
    outcome: 'A systems supplement case — strong on IA, lighter on research/results.',
    handoff: 'Settings IA and cascade model for voice/tone across agent surfaces.',
    status: 'draft',
  },
];

/** Ready cases only — drafts stay in `cases` for later, not on the public site. */
export const publicCases = cases.filter((c) => c.status === 'ready');

const highlightOrder = [
  'move-in-scanner',
  'pricing-specials',
  'mobile-strategy-resident-lookup',
  'familysearch-discovery',
] as const;

export const highlights = highlightOrder
  .map((slug) => publicCases.find((c) => c.slug === slug))
  .filter((c): c is CaseStudy => Boolean(c));

export const moreCases = publicCases.filter(
  (c) => !(highlightOrder as readonly string[]).includes(c.slug),
);

export function getCase(slug: string) {
  return publicCases.find((c) => c.slug === slug);
}
