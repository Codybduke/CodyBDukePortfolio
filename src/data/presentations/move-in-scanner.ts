export type SceneId =
  | 'home'
  | 'roster'
  | 'riley'
  | 'confirm'
  | 'morgan'
  | 'jamie'
  | 'taylor'
  | 'roommates'
  | 'offline-home'
  | 'offline-roster';

export type SlideMetric = {
  value: string;
  label: string;
};

export type Slide = {
  id: string;
  stage?: string;
  title: string;
  kicker?: string;
  body?: string;
  bullets?: string[];
  metrics?: SlideMetric[];
  cue?: string;
  scene: SceneId;
};

export const scenes: { id: SceneId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'roster', label: 'Roster' },
  { id: 'riley', label: 'Riley · Ready' },
  { id: 'confirm', label: 'Confirm' },
  { id: 'morgan', label: 'Morgan · Optional' },
  { id: 'jamie', label: 'Jamie · Required' },
  { id: 'taylor', label: 'Taylor · Blocked' },
  { id: 'roommates', label: 'Unit 204' },
  { id: 'offline-home', label: 'Offline home' },
  { id: 'offline-roster', label: 'Offline roster' },
];

export const slides: Slide[] = [
  {
    id: 'problem',
    stage: 'Problem',
    title: 'The day was long. The work was still incomplete.',
    kicker: 'OXP Mobile · Product Lead · Mar–May 2026',
    body: 'Peak student turn is 100 to 500+ people at a breezeway, an office, or a drive-through. Staff marked a spreadsheet or fought desktop Entrata on a phone. The resident left with keys. Entrata did not.',
    metrics: [
      { value: '~21%', label: 'Processed in Entrata in real time on move-in day' },
      { value: '~36%', label: 'Zero activity in the window — caught up overnight' },
      { value: '~0%', label: 'Peak-month adoption of Bulk Move-In' },
    ],
    scene: 'home',
  },
  {
    id: 'solution',
    stage: 'Solution',
    title: 'Name, checklist, confirm, next',
    body: 'A search-first table path. Find them, see if the checklist is ready, confirm photo ID, tap confirm. Ready residents are express. Preparedness already lives on the checklist — no full profile at the line.',
    bullets: [
      'Search is primary — the line sounds like “Smith, 315,” not a QR scan',
      'Ready / Optional / Required / Blocked on the roster, not only at confirm',
      'Seconds at the table instead of overtime later',
    ],
    cue: 'Open Move-In, search Foster, walk Riley through confirm.',
    scene: 'riley',
  },
  {
    id: 'offline',
    stage: 'Solution',
    title: 'Offline is the day, not a later cut',
    body: 'Breezeway Wi-Fi fails. Staff are on company iPads. The next 30 days of move-ins are cached before they walk outside.',
    bullets: [
      'Home collapses to Move-In and a short note',
      'Roster still searches. Confirms queue',
      'A quiet Offline chip — not a blocking modal',
    ],
    cue: 'Lab panel → Network → Offline, or use the Offline chips.',
    scene: 'offline-home',
  },
  {
    id: 'path',
    stage: 'How we got there',
    title: 'Wrong first. Then the table told us.',
    body: 'The first spec assumed QR would lead, optional items could wait, and offline could ship later.',
    bullets: [
      'Three site visits: printed rolls, laptop sheets, packets — spreadsheet was the working product',
      '~20 operators: search over QR, optional items escalate, offline in MVP',
      'SQL sized unused Bulk Move-In. More desktop training was not the fix',
      'PRD rewrite in 48 hours. Split this from the next-day spreadsheet upload so neither waited',
    ],
    scene: 'roster',
  },
  {
    id: 'edges',
    stage: 'Edge cases',
    title: 'Keep the line moving. Still stop when you must.',
    bullets: [
      'Optional leftovers: still move in, create an internal task — they used to disappear',
      'Required items and hard blocks: no Move in, no manager PIN in MVP',
      'Unit search returns the whole unit — roommates process back to back',
    ],
    cue: 'Morgan · Optional, Jamie · Required, Taylor · Blocked, Unit 204.',
    scene: 'morgan',
  },
  {
    id: 'results',
    stage: 'Results',
    title: 'A table-side flow the mobile team could run',
    body: 'Expo to argue about states, then a SwiftUI package in the live OXP shell. They found five defects in about 30 minutes. Pilot actuals are not in yet — these are the targets, not results.',
    bullets: [
      'Same-day completion 95%+ · table-side under 20s · overtime –60%',
      'Left out of MVP: resident nudges, QR, manager PIN',
      'I would put offline and the eng partner in week one, and bias to SwiftUI earlier',
    ],
    scene: 'roster',
  },
];
