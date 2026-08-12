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
      'Research synthesis into an action-first Command Center and a Resident Lookup wedge so field staff can answer lease and ledger questions without walking back to a desk.',
    role: 'Product Lead / product designer (strategy + IA + prototype)',
    timeframe: 'Spring 2026',
    highlight: true,
    tags: ['Research synthesis', 'Mobile IA', 'Usability'],
    problem:
      'Desktop OXP is not the field job. Staff need “what do I do next?” and fast resident context — not a KPI wall — when conversations start in a breezeway.',
    process: [
      'Synthesized ~4,600 Gong calls, 30+ feedback transcripts, and a competitive scan into three product bets with explicit confidence labels.',
      'Protoyped Command Center + Residents hub in Expo to make the strategy testable.',
      'Ran a four-persona usability simulation and logged blockers for the next iteration.',
    ],
    decisions: [
      'Action-first home (Daily Briefing + Quick Actions) over a KPI dashboard.',
      'Regional manager as hinge persona — both mandates adoption and uses the app.',
      'Resident Lookup as the daily wedge before heavier analytics.',
    ],
    metrics: [
      'Evidence base: ~4,600 Gong calls filtered for mobile/field themes; 30+ processed feedback transcripts.',
      'Usability sim (four personas) validated glanceable profile headers and tile previews.',
      'Surfaced concrete blockers: vehicle-plate search, property-scope mistakes, multi-property picker traps.',
    ],
    outcome:
      'A coherent mobile IA story: mobile as distribution for the AI workforce, with Resident Lookup proving daily value first.',
    handoff:
      'Strategy memo + Expo prototype surfaces (Command Center, Residents hub, drill-ins) for product partners and eng sequencing.',
    builtWith:
      'Research synthesis + Expo prototype — strategy made tangible for partners and usability testing.',
    status: 'draft',
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
