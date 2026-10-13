import { withBase } from '../../lib/paths';

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

export type SlideLayout =
  | 'title'
  | 'chapter'
  | 'statement'
  | 'split'
  | 'prose'
  | 'metrics'
  | 'feature'
  | 'rings'
  | 'compare';

export type SlideImage = {
  src: string;
  alt: string;
  fit?: 'cover' | 'contain';
  wide?: boolean;
};

export type RingSlice = {
  value: number;
  display: string;
  label: string;
  hint: string;
};

export type ComparePair = {
  label: string;
  before: SlideImage;
  after: SlideImage;
};

export type Slide = {
  id: string;
  layout: SlideLayout;
  stage?: string;
  kicker?: string;
  title?: string;
  lead?: string;
  body?: string;
  bullets?: string[];
  metrics?: SlideMetric[];
  scene?: SceneId;
  image?: SlideImage;
  rings?: RingSlice[];
  pairs?: ComparePair[];
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

const img = (file: string) => withBase(`/work/move-in-scanner/${file}`);
const processImg = (file: string) => withBase(`/work/move-in-scanner-process/${file}`);

const jeep: SlideImage = {
  src: img('line-jeep.jpg'),
  alt: 'A student move-in team member in a neon shirt hands a paper to the driver of a white Jeep Gladiator at a campus drive-through.',
  fit: 'cover',
};

const cherokee: SlideImage = {
  src: img('line-cherokee.jpg'),
  alt: 'A staff member in a maroon polo leans into the window of a dark Grand Cherokee during a drive-through move-in.',
  fit: 'cover',
};

const spreadsheet: SlideImage = {
  src: img('spreadsheet-laptop.jpg'),
  alt: 'A laptop on someone’s lap outdoors, open to a move-in spreadsheet with name, lease ID, checklist, and moved-in columns.',
  fit: 'cover',
};

const shot = (file: string, alt: string): SlideImage => ({
  src: processImg(file),
  alt,
  fit: 'cover',
});

export const slides: Slide[] = [
  {
    id: 'title',
    layout: 'title',
    stage: 'OXP Mobile · 2026',
    title: 'Real-time move-ins',
    image: jeep,
  },
  {
    id: 'role',
    layout: 'prose',
    stage: 'My role',
    title: 'What I owned, and what we shared',
    body: 'I was the product manager and the UX designer for this workflow. I partnered with another designer on the system, the component library the app is built from.',
    bullets: [
      'Mine: the flow, the requirements, and the calls about what the line could bear.',
      'Shared: the component library and the system work underneath it.',
    ],
  },
  {
    id: 'chapter-problem',
    layout: 'chapter',
    stage: '01 · Problem',
    title: 'The line.',
    lead: 'Move-in day, and Entrata still says they never arrived.',
  },
  {
    id: 'business',
    layout: 'statement',
    stage: 'The business opportunity',
    lead: 'Move-in week is when student housing either uses Entrata or replaces it with a spreadsheet.',
    body: 'The staff app was new, and the people who needed it most were reluctant to open it. This was the week to earn the habit, on a problem they already felt, while smaller tools were getting close enough to take it.',
    image: spreadsheet,
  },
  {
    id: 'line',
    layout: 'rings',
    stage: 'Problem',
    title: 'Entrata often had no record of the move-in',
    body: 'A hundred to five hundred people show up at a breezeway, the office, or a drive-through. Staff hand over keys, and the resident walks away finished. The record does not follow.',
    rings: [
      {
        value: 21,
        display: '~21%',
        label: 'Real time',
        hint: 'Written in Entrata in real time on move-in day',
      },
      {
        value: 36,
        display: '~36%',
        label: 'Next morning',
        hint: 'No activity in the window, caught up the next morning',
      },
      {
        value: 43,
        display: '~43%',
        label: 'Later, or never',
        hint: 'Completed later than that, or never completed',
      },
    ],
  },
  {
    id: 'chapter-solution',
    layout: 'chapter',
    stage: '02 · Solution',
    title: 'A mobile flow that fits the line.',
    lead: 'In seconds, online or off.',
    bullets: ['Search', 'Readiness', 'Confirm'],
  },
  {
    id: 'home',
    layout: 'split',
    stage: 'Solution',
    title: 'Move-In lives on the home screen',
    bullets: [
      'Quick Action on the home screen they already open.',
      'Next to packages and work orders.',
      'Buried under lease admin would fail the breezeway.',
    ],
    scene: 'home',
  },
  {
    id: 'search',
    layout: 'split',
    stage: 'Solution',
    title: 'Search leads',
    bullets: [
      'They type the name they just heard.',
      'Search leads. QR can wait.',
      'The roster for the next 30 days is already on the device.',
    ],
    scene: 'roster',
  },
  {
    id: 'readiness',
    layout: 'split',
    stage: 'Solution',
    title: 'One glance, four states',
    bullets: [
      'Ready, Optional, Required, and Blocked, before anyone is opened.',
      'Operators already ran an express line and a cleanup line by hand.',
    ],
    scene: 'riley',
  },
  {
    id: 'confirm',
    layout: 'split',
    stage: 'Solution',
    title: 'Confirm stays short',
    bullets: [
      'Glance at the checklist, match a photo ID, confirm.',
      'Confirm stays short: property, unit, date, Future to Current.',
      'A full profile never shows up at the table.',
    ],
    scene: 'confirm',
  },
  {
    id: 'optional',
    layout: 'split',
    stage: 'Solution',
    title: 'Optional items become a follow-up',
    bullets: [
      'They still move in.',
      'Open items become a task after the rush.',
      'No text to the resident, and no blocker on the line.',
    ],
    scene: 'morgan',
  },
  {
    id: 'required',
    layout: 'split',
    stage: 'Solution',
    title: 'Required items stop the line',
    bullets: [
      'Required items end the table path.',
      'No override in the first release.',
      'Staff route them to the resolution station, the way the property already does.',
    ],
    scene: 'jamie',
  },
  {
    id: 'roommates',
    layout: 'split',
    stage: 'Solution',
    title: 'Unit search brings the roommates back together',
    bullets: [
      'Student units are beds, not apartments.',
      'Searching 204 returns everyone on that unit.',
      'Each roommate keeps their own state.',
    ],
    scene: 'roommates',
  },
  {
    id: 'offline',
    layout: 'split',
    stage: 'Solution',
    title: 'Wi-Fi was scarce',
    bullets: [
      'The next 30 days are cached before they walk outside.',
      'Home collapses to Move-In. The roster still searches, and confirms stay queued.',
      'A small Offline chip says the write has not reached Entrata.',
    ],
    scene: 'offline-home',
  },
  {
    id: 'chapter-process',
    layout: 'chapter',
    stage: '03 · How we got there',
    title: 'The first spec was wrong.',
    lead: 'Then the table told us what to build.',
  },
  {
    id: 'first-bet',
    layout: 'compare',
    stage: 'The first bet',
    title: 'Meet them at the spreadsheet',
    body: 'The simplest path was the file they already had. Upload it, let AI move people in, and a person handles the exceptions. Visits later moved that bet to the phone.',
    pairs: [
      {
        label: 'Meet them at the spreadsheet',
        before: {
          src: withBase('/work/csv-move-in-agent/01-preflight.png'),
          alt: 'Desktop Bulk Move-In review with three buckets: 277 will be moved in, 30 have follow-up tasks, and 23 unresolved rows a person still has to resolve.',
          fit: 'contain',
          wide: true,
        },
        after: {
          src: img('after-home-phone-sim-on.png'),
          alt: 'The staff app home screen on a phone, with Move-In as a Quick Action.',
          fit: 'contain',
        },
      },
    ],
  },
  {
    id: 'iteration-search',
    layout: 'compare',
    stage: 'Iteration',
    title: 'Search replaced the camera',
    body: 'The first build opened on a QR scanner. Operators described the line as a name and a unit, so the roster became the first screen.',
    pairs: [
      {
        label: 'Search replaced the camera',
        before: shot(
          '01-qr-scan.png',
          'The first SwiftUI build opened on a QR scanner, with search as a button at the bottom.',
        ),
        after: {
          src: img('after-roster-phone-sim-on.png'),
          alt: 'Upcoming move-ins roster on a phone, with search and profile photos, and no camera as the way in.',
          fit: 'contain',
        },
      },
    ],
  },
  {
    id: 'iteration-optional',
    layout: 'compare',
    stage: 'Iteration',
    title: 'Optional items stopped blocking',
    body: 'An orange warning made someone who could still move in look like an exception. It became a calm note, and the follow-up sits under Move in.',
    pairs: [
      {
        label: 'Optional items stopped blocking',
        before: shot(
          '03-optional-alert-before.png',
          'Morgan Diaz summary with an orange warning and Move in beside Create escalation task.',
        ),
        after: {
          src: img('after-optional-phone-sim-on.png'),
          alt: 'Morgan Diaz summary on a phone, with her profile photo, a calm note about optional items, and Move in above the follow-up.',
          fit: 'contain',
        },
      },
    ],
  },
  {
    id: 'iteration-offline',
    layout: 'compare',
    stage: 'Iteration',
    title: 'The offline roster has to say so',
    body: 'The cached roster already worked without a network, and it looked exactly like the online one. The chip says the write has not reached Entrata.',
    pairs: [
      {
        label: 'The offline roster has to say so',
        before: shot(
          '05-offline-before.png',
          'The earlier roster with no sign that the device is offline.',
        ),
        after: {
          src: img('after-offline-phone-sim-on.png'),
          alt: 'Upcoming move-ins roster on a phone, with profile photos and an Offline chip.',
          fit: 'contain',
        },
      },
    ],
  },
  {
    id: 'chapter-next',
    layout: 'chapter',
    stage: "04 · What's next",
    title: 'Pilot results are not in.',
    lead: 'Here is what would prove the bet.',
  },
  {
    id: 'targets',
    layout: 'metrics',
    stage: 'The targets',
    title: 'The targets, not the pilot',
    body: 'What left my hands was a SwiftUI package the mobile team could drop into the staff app. If same-day stays near 21%, the spreadsheet won.',
    metrics: [
      { value: '95%+', label: 'Same-day completion, from about 21%' },
      { value: '<20s', label: 'Time to process someone at the table, from about 90s' },
      { value: '−60%', label: 'Overtime re-key, from about 8 hours' },
      { value: '30%+', label: 'Share of move-ins done on the device, from about 0%' },
    ],
  },
  {
    id: 'chapter-craft',
    layout: 'chapter',
    stage: '05 · Process',
    title: 'Design process.',
    lead: 'It got faster. I still start in words.',
  },
  {
    id: 'ai',
    layout: 'prose',
    stage: 'AI',
    title: 'Faster, and the start is the same',
    body: 'I still define the problem in words. AI shortens the distance from that research to a prototype people can react to. The judgment stays mine.',
  },
  {
    id: 'ai-research',
    layout: 'prose',
    stage: 'AI',
    title: 'The research goes in one repo',
    bullets: [
      'Interviews, contextual inquiry, and the workflow they already run.',
      'Research we already have from other users on a similar problem.',
      'I put all of it in one research repo, and that is what I point AI at.',
    ],
  },
  {
    id: 'ai-prototype',
    layout: 'prose',
    stage: 'AI',
    title: 'A solid problem, then a high-fidelity prototype',
    bullets: [
      'AI analyzes the problem. I rewrite it until it is solid, and I vet it.',
      'Wireframes set the direction, in Figma or a quick pass with AI.',
      'The next build is high fidelity, so we can react to the real thing.',
    ],
  },
  {
    id: 'ai-early',
    layout: 'prose',
    stage: 'AI',
    title: 'I fix it in Figma, and I show it early',
    bullets: [
      'I go through the prototype thoroughly.',
      'When something is off, I design it in Figma and bring it back into the coded prototype.',
      'Developers see it as soon as there is something to show. They catch edge cases I am not thinking through, and their ideas go in the repo.',
    ],
  },
  {
    id: 'ai-test',
    layout: 'prose',
    stage: 'AI',
    title: 'Test, then let AI draft the changes',
    body: 'Everything goes in the repo. I use it with judgment.',
    bullets: [
      'Stakeholders see it before usability testing, and again after.',
      'Testing is in person when I can. I record, transcribe, and add it to the repo.',
      'AI turns that into a change list. I edit the list, then let it run, until it is good enough to release.',
    ],
  },
  {
    id: 'learned',
    layout: 'statement',
    stage: 'What I learned',
    lead: 'Entrata becomes the record when the write happens at the table.',
    body: 'The spreadsheet was the product they trusted, because it worked where they stood, including when the Wi-Fi was gone. A nicer screen of the desktop flow still leaves the day wrong.',
    image: cherokee,
  },
];
