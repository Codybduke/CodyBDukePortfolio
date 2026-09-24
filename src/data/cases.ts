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
    title: 'OXP Mobile Move-In Scanner',
    eyebrow: 'Staff iOS, offline on move-in day',
    summary:
      'On student move-in day, staff hand over keys while Entrata often still has no record of the move-in. I designed a search-first, offline mobile flow so they can find the person, see if the checklist is ready, confirm a photo ID, and turn leftover optional items into a follow-up task instead of a void.',
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
      'About 21% of student move-ins at a large operator were processed in Entrata in real time on move-in day.',
      'About 36% had zero Entrata activity in the move-in window and were caught up overnight.',
      'Near-zero use of desktop Bulk Move-In in peak months, even at the largest student operator in the set.',
    ],
    outcome:
      'A scoped table-side flow with offline cache and follow-up tasks for the OXP mobile team to implement, not a shrunk desktop Bulk Move-In. Pilot actuals are not in yet.',
    handoff:
      'A SwiftUI package and demo target for the OXP app. The in-house mobile team walked the module, found five defects in about 30 minutes, and made small changes to fit the app.',
    builtWith:
      'Field research and SQL. Expo to argue about states, then SwiftUI for handoff to the OXP mobile team.',
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
      'A special could carry one incentive. I redesigned staff setup in Entrata Pricing so one special could hold a list — targeted by lease term, dates, space, and applicant type — inside the setup pattern people already knew. After a rough first release settled, 8,290 specials used lease-term rules and 162 on 38 clients ran multi-select that did not exist before.',
    role: 'Product designer (staff setup; first designer on the initiative)',
    timeframe: '2022 (design); shipped through 2024',
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
      'Staff created one special with one incentive — gift or credit. Multiple offers meant multiple specials, which residents could not use as a real choice. Create was an all-at-once screen that forked for student, conventional, and space options.',
    process: [
      'Cut the create flow until critique had to put about 20% back; replaced the mega-form with quieter steps.',
      'Pushed to drop pricing per lease term × space option (~1% of setups, concentrated clients). Lost to PM and eng — existing Pricing users would have been stranded.',
      'Usability testing showed the dated Pricing pattern was the map. We conformed to it instead of shipping a sleek one-off.',
    ],
    decisions: [
      'One special, many incentives — plus restrictions so the list could be honored.',
      'Keep the amounts grid we did not want, then hide it behind Price by Lease Term — including a stacked modal — so the default create path stays quiet.',
      'Match existing Pricing setup to cut change management, not a new visual language.',
    ],
    metrics: [
      '10,204 active specials across 337 clients after the initiative (platform; I designed setup, not the full 1.5-year ship).',
      '8,290 specials / 278 clients used lease-term restrictions.',
      '162 specials / 38 clients had multiple incentives to choose from — zero before.',
    ],
    outcome:
      'Setup became the contract other teams inherited for accept and portal display. Adoption is from after the rough launch and rebuild. Multi-select is the new behavior; lease-term targeting is what scaled.',
    handoff:
      'Staff create in desktop Entrata Pricing. Resident select and prospect-portal display were assisted, then owned by other product teams on this model.',
    builtWith:
      'Figma (click-through prototype, dummy data); usability testing; Pricing design library constraints.',
    status: 'ready',
  },
  {
    slug: 'csv-move-in-agent',
    title: 'Bulk Move-in Smart Upload',
    eyebrow: 'Desktop · AI workflow',
    summary:
      'The first answer to student turn was an overnight upload. An agent matches the spreadsheet to leases and shows three buckets before anything is written. Field work later moved the main bet to a phone in the line. This stayed the next-day bridge.',
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
      'Entrata had never shipped a mobile app for property managers. Resident lookup is the everyday job on desktop, and the number one thing staff already try to do on a phone. We built a quick search and a light profile: enough to answer questions in the field, without the desktop work that does not belong on a phone.',
    role: 'Product Lead / product designer (strategy + information architecture + prototype)',
    timeframe: 'Apr – May 2026',
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
      'Property managers get resident questions on a walk and have no good way to look that person up. Desktop Entrata is the daily tool. The phone path was the web app, a note for later, or a call to the office.',
    process: [
      'Asked staff what they already try to do on a phone. Looking up residents was always first.',
      'Prototyped Command Center and Residents in Expo so partners could walk the information architecture.',
      'Scoped a light resident profile for the field: enough to answer questions and make small adjustments, without desktop work like a financial move-out.',
    ],
    decisions: [
      'Action-first home (Daily Briefing + Quick Actions) instead of a KPI dashboard.',
      'Property managers as the primary users, with regional managers in the mix.',
      'Resident Lookup as the daily wedge: quick search plus a light profile, not a desktop clone.',
    ],
    metrics: [
      '~4,600 Gong calls filtered for mobile and field themes; 30-plus processed feedback transcripts.',
      'Usability sim: all four personas completed a charge dispute; plate-only lookup hesitated or failed.',
      'Blockers logged: vehicle-plate search, wrong-property empty results, All Properties multi-select trap.',
    ],
    outcome:
      'A coherent mobile information architecture story and a walkable lookup flow for partners, not a shrunk desktop profile. Pilot actuals still TBD.',
    handoff:
      'Strategy memo with confidence labels and kill criteria, Expo Command Center + Residents, usability findings, and a SwiftUI lookup module.',
    builtWith:
      'Research synthesis plus Expo to make the strategy testable; a dedicated lookup prototype for the usability sim.',
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
  'familysearch-discovery',
  'mobile-strategy-resident-lookup',
  'pricing-specials',
  'move-in-scanner',
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
