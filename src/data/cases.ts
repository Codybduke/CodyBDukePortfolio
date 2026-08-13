export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  role: string;
  timeframe: string;
  highlight: boolean;
  tags: string[];
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
    eyebrow: 'Mobile · Offline-first',
    summary:
      'Staff checked people in on a spreadsheet at the table and entered Entrata later. Site visits, production SQL, and Industry Group interview notes led to a search-first, offline mobile flow, handed off as a SwiftUI module to the OXP mobile team.',
    role: 'Product Lead (PM + UX + prototype handoff)',
    timeframe: 'Mar – May 2026',
    highlight: true,
    tags: ['Field research', 'SQL', 'SwiftUI', 'Offline'],
    problem:
      'At peak turn, staff move in 100–500+ residents a day from a table with unreliable Wi-Fi. They mark people on a spreadsheet, hand over a packet and keys, then spend overtime re-keying move-ins into Entrata later.',
    process: [
      'Three site visits showed printed rolls, laptop sheets, and packets instead of Entrata at the table.',
      'Industry Group interview notes (~20 operators) pushed Search over QR, optional items to escalation, and offline in MVP; PRD rewritten in 48 hours.',
      'Ten SQL queries sized unused Bulk Move-In and kept checklist vs renewal claims directional.',
      'Split day-of mobile from the CSV agent so neither waited on the other’s rollout.',
    ],
    decisions: [
      'Search first after interviews described the line as “Smith, 315,” not a QR scan.',
      'Offline moved into MVP after Industry Group feedback made breezeway Wi-Fi the adoption constraint.',
      'Optional checklist items create an internal escalation instead of blocking the line.',
    ],
    metrics: [
      '~21% of student move-ins at a large operator processed in Entrata in real time on move-in day (production audit).',
      '~36% had zero Entrata activity in the move-in window (caught up overnight).',
      'Near-zero adoption of Bulk Move-In in peak months, even at the largest student operator in the set.',
    ],
    outcome:
      'Scoped table-side flow with offline and escalation rules for the OXP mobile team to implement, not a shrunk desktop Bulk Move-In. Pilot actuals still TBD.',
    handoff:
      'SwiftUI package and demo target for the OXP shell. The in-house mobile team walked the module, found five defects in about 30 minutes, and made small changes to fit the app.',
    builtWith:
      'Field research and SQL; Expo to thrash states, then SwiftUI for handoff to the OXP mobile team.',
    status: 'ready',
  },
  {
    slug: 'familysearch-discovery',
    title: 'FamilySearch Personalized Discovery',
    eyebrow: 'Consumer · Retention',
    summary:
      'FamilySearch could acquire beginners at stadium scale and could not keep them. I led product design for a repeatable discovery loop — Pioneer, Ancestor Calendar, and WWI Draft — that started from a person already in the tree. The 2018 program those campaigns sat inside lifted returning-user retention 101% year over year.',
    role: 'Product designer (led personalized discovery campaigns)',
    timeframe: '2017 – 2019',
    highlight: true,
    tags: ['Retention', 'Personalization', 'Consumer'],
    problem:
      'New accounts arrived in droves and did not come back. Beginners hired FamilySearch to feel a connection to someone who came before them, then met a toolbox built for hobbyists. Generic “come search” campaigns asked them to do the hard part first.',
    process: [
      'Used beginner retention research and discovery comments (~86k) to treat signup volume as a leak, not a win.',
      'Planned Pioneer, Calendar, and WWI with PMs and campaign managers as one loop: named ancestor → relationship in a sentence → one story or record.',
      'Shipped Pioneer as the fullest card, Calendar as the repeating birthday/anniversary habit, WWI Draft as the third hook on the same IA.',
    ],
    decisions: [
      'Start from a person the tree can already name. If relationship cannot be said in a sentence, do not send the campaign.',
      'One next action (photos, story, or the record) instead of teaching search in the first session.',
      'Three campaign instances, one product loop — so the third campaign was cheaper than the first.',
    ],
    metrics: [
      '101% year-over-year returning-user retention lift in 2018 (program-level; I led PD on the campaign loop).',
      '12.4% increase in international reach (24% over goal).',
      '~86k discovery comments steered which hooks to personalize next.',
    ],
    outcome:
      'A discovery system that made an ancestor real before it asked anyone to become a researcher. Retention and reach moved at the program level those campaigns were built to serve.',
    handoff:
      'Email plus in-product discovery surfaces — home cards, ancestor stories, relationship, and notifications — for FamilySearch product, campaign, and records partners.',
    builtWith:
      'Experience planning with PMs and campaign managers; paper flows into in-product UI on FamilySearch.org.',
    status: 'ready',
  },
  {
    slug: 'csv-move-in-agent',
    title: 'CSV-to-Move-In Agent',
    eyebrow: 'AI workflow · Trust UX',
    summary:
      'An AI agent that turns a move-in spreadsheet into processed residents — mapping, matching, and exception handling so next-day overtime becomes a single upload.',
    role: 'Product Lead (hybrid UX/PM) — owned eng team',
    timeframe: 'Q2 2026',
    highlight: true,
    tags: ['AI agents', 'Trust UX', 'Business outcomes'],
    problem:
      'After move-in day, staff re-key every resident from an offline spreadsheet into Entrata. For a 300-unit property that meant 8+ hours of overtime during the busiest week of the year.',
    process: [
      'Framed the business job: bridge offline table behavior to Entrata without forcing staff to change move-in day habits.',
      'Designed upload → map → match preview → process → exceptions so staff see the agent’s work before anything executes.',
      'Partnered with an owned eng team on a design-to-ship cycle aimed at June student turn.',
    ],
    decisions: [
      'Trust UX first: mapping confidence and match buckets are visible before execution — eligible, exceptions, unmatched.',
      'Accept format variation across properties; AI maps columns instead of forcing a rigid template.',
      'Keep as a sibling to Move-In Scanner (next-day vs day-of), not one mega-initiative that blocks both.',
    ],
    metrics: [
      'Goal: 300+ resident property completes processing in under 1 hour (vs. 8+ hours manual).',
      'Goal: 70%+ of uploaded residents processed without manual intervention.',
      'Goal: 90%+ of exceptions include a clear suggested resolution.',
    ],
    outcome:
      'An AI workflow product aimed at eliminating the post-turn processing bottleneck while keeping humans in control of exceptions.',
    handoff:
      'PRD/spec + prototype flows for mapping, match preview, and exception resolution — shipped with an owned eng team against June turn timing.',
    builtWith:
      'Product Lead loop with eng: prototype flows, exception IA, and outcome targets baked into the handoff.',
    status: 'draft',
  },
  {
    slug: 'mobile-strategy-resident-lookup',
    title: 'Mobile Strategy + Resident Lookup',
    eyebrow: 'Strategy · IA · Mobile',
    summary:
      'Desktop OXP is a desk product. Gong-scale call research, beta transcripts, and a competitive scan led to an action-first Command Center and a search-first Resident Lookup wedge, prototyped in Expo and stress-tested in a four-persona usability simulation.',
    role: 'Product Lead / product designer (strategy + IA + prototype)',
    timeframe: 'Apr – May 2026',
    highlight: false,
    tags: ['Research synthesis', 'Mobile IA', 'Usability'],
    problem:
      'Staff walking a property or traveling between sites need the next action and fast resident context. Desktop OXP is a KPI-and-module product. The field-to-desk round-trip is the waste.',
    process: [
      'Synthesized about 4,600 Gong calls, 30-plus feedback transcripts, and a five-vendor scan into three bets with explicit confidence labels.',
      'Prototyped Command Center and Residents in Expo so partners could walk the IA.',
      'Ran a four-persona usability simulation (32 walkthroughs) and logged plate search, property scope, and picker traps as blockers.',
    ],
    decisions: [
      'Action-first home (Daily Briefing + Quick Actions) instead of a KPI dashboard.',
      'Regional manager as the hinge persona: they mandate adoption and they use the app.',
      'Resident Lookup as the daily wedge before heavier analytics.',
    ],
    metrics: [
      '~4,600 Gong calls filtered for mobile and field themes; 30-plus processed feedback transcripts.',
      'Usability sim: all four personas completed a charge dispute; plate-only lookup hesitated or failed.',
      'Blockers logged: vehicle-plate search, wrong-property empty results, All Properties multi-select trap.',
    ],
    outcome:
      'A coherent mobile IA story and a walkable lookup flow for partners, not a shrunk desktop OXP. Pilot actuals still TBD.',
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

export const highlights = cases.filter((c) => c.highlight);
export const moreCases = cases.filter((c) => !c.highlight);

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
