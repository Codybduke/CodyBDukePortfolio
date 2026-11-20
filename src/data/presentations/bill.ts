import { withBase } from '../../lib/paths';
import type { RingSlice, Slide, SlideImage, SlideLayout, SlideMetric } from './move-in-scanner';

/** Short reminders read while talking, then the transition and anything to avoid saying. */
export type SpeakerNote = {
  points: string[];
  next: string;
  time: string;
  careful?: string;
};

export type BillImage = SlideImage & {
  caption: string;
};

export type ScreenLayout = 'single' | 'pair' | 'hero' | 'workflow';

export type GallerySlot = {
  src: string;
  alt: string;
  /** Spans both rows of a band. Other photos stack two to a column. */
  wide?: boolean;
};

export type TimelineStop = {
  when: string;
  place: string;
  role: string;
  image: SlideImage;
};

export type ChapterIcon =
  | 'search'
  | 'git-branch'
  | 'smartphone'
  | 'target'
  | 'list-tree'
  | 'pencil-ruler'
  | 'layers'
  | 'chart-no-axes-column';

/** Large background icons on text-only slides. Lucide names. */
export type MotifIcon = 'pencil-sparkles' | 'user-exclamation-point' | 'sparkles' | 'squares-intersect';

export type BillSlide = Omit<Slide, 'layout'> & {
  /** On a text-only slide, a large uncropped icon in the top right that the copy overlaps. */
  motif?: MotifIcon;
  layout: SlideLayout | 'opener' | 'gallery' | 'timeline' | 'feature' | 'screens' | 'close' | 'divider' | 'project' | 'showcase';
  /** Showcase slides: a lighter-weight lead-in before the title, such as “Advanced:”. */
  titleLead?: string;
  /** Project title slides: title beside the image, or title above it. */
  projectLayout?: 'side' | 'stacked';
  notes: SpeakerNote;
  /** Metrics slides: the first metric leads and the rest read as supporting context. */
  metricsLead?: boolean;
  images?: BillImage[];
  screenLayout?: ScreenLayout;
  caption?: string;
  /** Two bands of the photo grid. Each band holds two wide photos and four small ones so the loop stays seamless. */
  gallery?: [GallerySlot[], GallerySlot[]];
  /** Fixed on the left of the gallery. The photo track scrolls underneath it. */
  portrait?: SlideImage;
  timeline?: TimelineStop[];
  /** On a divider, the oversized icon. On a content slide, the small bottom-left indicator. */
  chapter?: ChapterIcon;
  /** Shown over the prototype pane on split slides if the prototype does not load. */
  fallback?: SlideImage;
};

const moveIn = (file: string) => withBase(`/work/move-in-scanner/${file}`);
const billFile = (file: string) => withBase(`/present/bill/${file}`);
const personal = (file: string) => withBase(`/present/bill/personal/${file}`);

function shot(file: string, alt: string, caption: string): BillImage {
  return { src: billFile(file), alt, caption, fit: 'contain' };
}

function frame(src: string, alt: string, caption: string): BillImage {
  return { src, alt, caption, fit: 'contain' };
}

function phone(file: string, alt: string): SlideImage {
  return { src: moveIn(file), alt, fit: 'contain' };
}

function note(
  point: string,
  next: string,
  time: string,
  evidence?: string,
  qualification?: string,
): SpeakerNote {
  return { points: evidence ? [point, evidence] : [point], next, time, careful: qualification };
}

function notes(points: string[], next: string, time: string, careful?: string): SpeakerNote {
  return { points, next, time, careful };
}

function divider(id: string, chapter: ChapterIcon, label: string, point: string, next: string): BillSlide {
  return {
    id,
    layout: 'divider',
    chapter,
    title: label,
    notes: notes([point], next, '0:05'),
  };
}

const rings: RingSlice[] = [
  {
    value: 21,
    display: '~21%',
    label: 'Same day',
    hint: 'Written in Entrata while the resident was still there',
  },
  {
    value: 36,
    display: '~36%',
    label: 'Next morning',
    hint: 'No activity during move-in, caught up the next morning',
  },
  {
    value: 43,
    display: '~43%',
    label: 'Later, or never',
    hint: 'Completed after that, or never completed',
  },
];

const targets: SlideMetric[] = [
  { value: '95%+', label: 'Same-day completion, from about 21%' },
  { value: '<20s', label: 'Time at the table, from about 90 seconds' },
  { value: '-60%', label: 'Morning-after data entry, from about 8 hours' },
];

export const billSlides: BillSlide[] = [
  {
    id: 'intro-title',
    layout: 'opener',
    title: 'Hey Bill!',
    notes: notes(
      [
        'Introduce yourself. This is the portfolio presentation.',
        'Role: Lead Product Designer, Spend & Expense.',
        'Two projects: real-time move-ins, then multi-incentive specials.',
      ],
      'A minute on life outside work.',
      '0:35',
      'Don’t tour the portfolio site. The stone is the homepage model, so only explain it if someone asks.',
    ),
  },
  {
    id: 'intro-gallery',
    layout: 'gallery',
    title: 'I’m Cody',
    portrait: {
      src: personal('cody-plaid.png'),
      alt: 'Cody Duke in a plaid shirt, in black and white.',
      fit: 'cover',
    },
    gallery: [
      [
        { src: personal('car.png'), alt: "Cody's silver Subaru at night.", wide: true },
        { src: personal('graduation.png'), alt: 'Cody and his family at a graduation.' },
        { src: personal('button-board.png'), alt: 'A finished five-key button board on a desk.' },
        { src: personal('halloween.png'), alt: 'Cody and his family in costume in front of a Stranger Things alphabet wall.', wide: true },
        { src: personal('playing-cards.png'), alt: 'A stack of playing-card decks.' },
        { src: personal('blue-led.png'), alt: 'A five-key button board lit blue in the dark.' },
      ],
      [
        { src: personal('retropie.png'), alt: 'A handheld Raspberry Pi game console showing a Super Nintendo menu.' },
        { src: personal('wiring.png'), alt: 'A button board in progress, wired up on a workbench.' },
        { src: personal('family.png'), alt: 'Cody with his family in a cornfield.', wide: true },
        { src: personal('on-air.png'), alt: 'A white on-air box with a motion sensor on the front.' },
        { src: personal('porch.png'), alt: 'Cody and his family on a front porch.' },
        { src: personal('batman-ferrari.png'), alt: 'A young boy in a Batman costume beside a black Ferrari.', wide: true },
      ],
    ],
    notes: notes(
      [
        'Most of my time goes to my family: the cornfield, the porch, the graduation, Halloween.',
        'The rest goes to the silver Subaru and small machines I build to see if I can.',
        'The button board (wired, finished, lit blue), the RetroPie handheld, and the on-air box that lights up during meetings.',
      ],
      'Where the work has been.',
      '1:10',
      'Only talk about photos on the slide.',
    ),
  },
  {
    id: 'intro-timeline',
    layout: 'timeline',
    title: 'Where have I been all\nyour life',
    timeline: [
      {
        when: '4 years',
        place: 'BYU-Idaho',
        role: 'Graphic Design',
        image: { src: billFile('path/byu-idaho-play-labs.png'), alt: 'An invitation to Play Labs, a BFA exhibit at BYU-Idaho.' },
      },
      {
        when: '3 years',
        place: 'FamilySearch',
        role: 'UX Designer',
        image: { src: billFile('path/familysearch.png'), alt: 'The FamilySearch logo.' },
      },
      {
        when: '6 years',
        place: 'Entrata',
        role: 'Sr. Product Designer',
        image: { src: billFile('path/entrata.png'), alt: 'The Entrata logo.' },
      },
      {
        when: '1 year',
        place: 'Entrata',
        role: 'Product Lead',
        image: { src: billFile('path/entrata.png'), alt: 'The Entrata logo.' },
      },
    ],
    notes: notes(
      [
        'Graphic design at BYU-Idaho, then FamilySearch, then Entrata.',
        'At Entrata, senior product designer grew into product lead for about the last year.',
        'That year added discovery, prioritization, prototyping, and delivery with engineering.',
      ],
      'The first project: real-time move-ins.',
      '1:20',
      'Same company, wider scope. Don’t say you led engineering.',
    ),
  },

  {
    id: 'project-move-in',
    layout: 'project',
    projectLayout: 'side',
    title: 'Real-time\nMove-ins',
    image: { src: billFile('project/move-in-phone.png'), alt: 'The Upcoming Move-ins roster on a phone, with Blocked, Required, Optional, and Ready on each resident.' },
    notes: notes(
      [
        'A phone flow for finishing a move-in while the resident is still at the desk.',
        'The phone shows the prototype roster, not a shipped screen.',
      ],
      'Understanding the problem.',
      '0:10',
      'It didn’t launch.',
    ),
  },
  divider(
    'chapter-move-problem',
    'search',
    'Understanding\nThe Problem',
    'Part one: understanding the problem.',
    'What was happening at the leasing desk.',
  ),
  {
    id: 'line-problem',
    layout: 'feature',
    chapter: 'search',
    title: 'Keys went out before Entrata knew.',
    body: 'Staff handed over keys and the resident left. Often Entrata still had no record that they arrived.',
    image: {
      src: moveIn('line-jeep.jpg'),
      alt: 'A student move-in team member hands a paper to the driver of a white Jeep at a campus drive-through.',
      fit: 'cover',
    },
    notes: notes(
      [
        'On student move-in day, 100 to 500 residents arrive at a breezeway, an office, or a drive-through.',
        'Student housing was most of Entrata’s book.',
        'The photo is a drive-through move-in. The conversation happens at the car window.',
      ],
      'What staff used instead.',
      '1:15',
      'Set the scene before showing any product.',
    ),
  },
  {
    id: 'line-spreadsheet',
    layout: 'feature',
    chapter: 'search',
    title: 'The real system was a spreadsheet.',
    body: 'Staff marked names during the rush, and someone retyped them into Entrata the next morning.',
    image: {
      src: moveIn('spreadsheet-laptop.jpg'),
      alt: 'A person types on a laptop showing a spreadsheet of names, lease IDs, checklist status, and a moved-in column.',
      fit: 'cover',
    },
    notes: notes(
      [
        'The sheet worked where they stood, even when the Wi-Fi dropped.',
        'At a 300-resident property, retyping took about eight hours of overtime in the busiest week.',
        'Desktop bulk move-in barely showed up in those weeks.',
        'Staff didn’t want to learn a new app during the week it mattered most.',
      ],
      'How often move-ins were recorded the same day.',
      '1:20',
      'The photo is a staged illustration, not customer data. Don’t turn the eight hours into a revenue claim.',
    ),
  },
  {
    id: 'line-baseline',
    layout: 'rings',
    chapter: 'search',
    title: 'Most move-ins weren’t recorded while the resident was there.',
    body: 'Baseline from a May to August 2025 audit at a large student operator.',
    rings,
    notes: notes(
      [
        'About 21% the same day, 36% the next morning, and 43% later or never.',
        'Same day means written in Entrata while the resident was still there.',
        'This is the baseline the flow was designed against.',
      ],
      'My role.',
      '1:20',
      'These aren’t pilot results. The pilot hasn’t reported back.',
    ),
  },
  divider(
    'chapter-move-approach',
    'git-branch',
    'Finding a\nBetter Approach',
    'Part two: finding a better approach.',
    'My role on the project.',
  ),
  {
    id: 'line-role',
    layout: 'prose',
    motif: 'squares-intersect',
    chapter: 'git-branch',
    stage: 'My role',
    title: 'I was the product manager and the designer.',
    body: 'I owned the flow, the requirements, and the calls about what the line could handle.',
    notes: notes(
      [
        'Product manager and UX designer for this workflow.',
        'Another designer and I shared the component library and the system work under it.',
      ],
      'The first concept wasn’t on the phone.',
      '0:50',
      'Don’t describe this as leading the mobile organization or an engineering team.',
    ),
  },
  {
    id: 'line-upload',
    layout: 'screens',
    chapter: 'git-branch',
    screenLayout: 'single',
    title: 'My first idea fixed the morning after.',
    body: 'Upload the spreadsheet, match each row to a lease, and review before anything is saved.',
    images: [
      frame(
        withBase('/work/csv-move-in-agent/01-preflight.png'),
        'Bulk Move-In review with three buckets: 277 will be moved in, 30 have follow-up tasks, and 23 unresolved rows a person still has to resolve.',
        'Rows sort into ready, needs a follow-up, and needs a person.',
      ),
    ],
    notes: notes(
      [
        'The morning after was the pain we could measure first.',
        'The upload treats the spreadsheet as the source of truth.',
        'When two residents share a name, a person picks the lease.',
      ],
      'Why fixing the morning after wasn’t enough.',
      '1:20',
      'This is a prototype, not a shipped replacement for Bulk Move-In.',
    ),
  },
  {
    id: 'line-shift',
    layout: 'feature',
    chapter: 'git-branch',
    title: 'The real problem was happening in the line.',
    body: 'A faster cleanup still left Entrata wrong while keys went out. Staff needed something that worked where they stood.',
    image: { src: billFile('project/move-in-phone.png'), alt: 'The Upcoming Move-ins roster on a phone, with Blocked, Required, Optional, and Ready on each resident.', fit: 'contain' },
    notes: notes(
      [
        'Site visits and operator interviews changed the direction.',
        'Breezeway Wi-Fi failed often, so offline moved into the first release.',
        'The upload stayed as a next-day path for teams that kept the sheet.',
        'The roster shows Ready, Optional, Required, or Blocked before anyone is opened.',
      ],
      'The shape of the phone flow.',
      '1:10',
      'Neither the upload nor the phone flow launched.',
    ),
  },
  divider(
    'chapter-move-experience',
    'smartphone',
    'Designing\nThe Experience',
    'Part three: designing the experience in the prototype.',
    'The shape of the flow.',
  ),
  {
    id: 'line-shape',
    layout: 'prose',
    chapter: 'smartphone',
    title: 'Search, check readiness, confirm.',
    body: 'Three short steps that fit a line and keep working when the network doesn’t.',
    notes: notes(
      [
        'Name the three steps, then drive the prototype.',
        'The first build opened on a camera. Operators described the line as a name and a unit, so search became the way in.',
        'Invite them to interrupt during the prototype.',
      ],
      'Search, live in the prototype.',
      '0:40',
      'No launch and no measured time on task.',
    ),
  },
  {
    id: 'search',
    layout: 'split',
    chapter: 'smartphone',
    title: 'Staff search the name they just heard.',
    body: 'The next 30 days of move-ins are already on the device.',
    fallback: phone('after-roster-phone-sim-on.png', 'Upcoming move-ins roster on a phone, with search and profile photos.'),
    notes: notes(
      [
        'Drive to the roster and type a name.',
        'Searching a unit brings roommates together, and each keeps their own state.',
        'QR is a later idea, once residents can get ready on their side.',
      ],
      'Readiness on the roster.',
      '2:00',
      'Don’t demo a camera unless someone asks.',
    ),
  },
  {
    id: 'readiness',
    layout: 'split',
    chapter: 'smartphone',
    title: 'Readiness shows before you open anyone.',
    body: 'Ready, Optional, Required, and Blocked sit right on the roster.',
    fallback: phone('02-summary.png', 'A resident summary with a complete checklist and a Ready state.'),
    notes: notes(
      [
        'Point at the states on the list before opening anyone.',
        'Properties already ran an express line and a cleanup line. The states follow that.',
        'Blocked, like a unit that isn’t ready, stops the same way a required item does.',
      ],
      'Confirming a ready resident.',
      '1:20',
    ),
  },
  {
    id: 'confirm',
    layout: 'split',
    chapter: 'smartphone',
    title: 'Confirming is a checklist, an ID, and a yes.',
    body: 'The desktop flow asked for a full profile. The line couldn’t carry that.',
    fallback: phone('03-confirm.png', 'Confirm Move-in screen with a Verify ID callout.'),
    notes: notes(
      [
        'Walk a ready resident through confirm.',
        'It shows the property, unit, date, and the change from Future to Current.',
        'Keep it as quick as the screen is.',
      ],
      'When an open item is optional.',
      '1:10',
    ),
  },
  {
    id: 'optional',
    layout: 'split',
    chapter: 'smartphone',
    title: 'Optional items don’t stop a move-in.',
    body: 'Open items become a follow-up after the rush.',
    fallback: phone(
      'after-optional-phone-sim-on.png',
      'Morgan Diaz summary on a phone, with a calm note about optional items and Move in above the follow-up.',
    ),
    notes: notes(
      [
        'Open Morgan or another optional resident. Move in stays available.',
        'An earlier orange warning made this look like a problem, so it became a calm note.',
        'Optional items are deferred, not ignored.',
      ],
      'Required items.',
      '0:50',
      'There’s no text to the resident from this screen.',
    ),
  },
  {
    id: 'required',
    layout: 'split',
    chapter: 'smartphone',
    title: 'Required items stop a normal move-in.',
    body: 'Staff send the resident down the path the property already uses.',
    fallback: phone(
      '08-summary-required-blocked.png',
      'Jamie Baker summary showing required checklist items still need attention, with Move in unavailable.',
    ),
    notes: notes(
      [
        'Show the stop.',
        'Hard stops were already handled by a permissioned person on site.',
        'A manager PIN was left out. It would be too easy to share on a busy Saturday.',
        'Offline is the one exception, on the next slide.',
      ],
      'Saving a move-in offline.',
      '0:55',
    ),
  },
  {
    id: 'offline',
    layout: 'split',
    chapter: 'smartphone',
    title: 'A finished checklist still saves offline.',
    body: 'If the required items are done on site, the move-in is queued for when the connection returns.',
    fallback: phone('after-offline-phone-sim-on.png', 'Upcoming move-ins roster on a phone with an Offline chip.'),
    notes: notes(
      [
        'The next 30 days are cached. The Offline chip means Entrata hasn’t received the change yet.',
        'Save move-in for sync queues it. On reconnect, Entrata tries to process it.',
        'A conflict flags the resident so staff can review it.',
      ],
      'Where AI fit into the work.',
      '1:40',
      'Reconnect is an attempt, not a guarantee, and the review isn’t a manager PIN.',
    ),
  },
  divider(
    'chapter-move-measure',
    'target',
    'Handoff &\nMeasured Targets',
    'Part four: the handoff and the targets we set.',
    'Where AI fit, then the targets.',
  ),
  {
    id: 'ai',
    layout: 'prose',
    motif: 'pencil-sparkles',
    chapter: 'target',
    title: 'AI got me to a testable prototype faster.',
    body: 'I still define the problem first. AI shortened the path from research to something people could react to.',
    notes: notes(
      [
        'Interviews, site notes, and past work went into one repo that I pointed the tools at.',
        'When something is off, I fix it in Figma and carry the fix back into the prototype.',
        'Developers and stakeholders see it early. What’s ready to hand off stays my call.',
      ],
      'The handoff and the targets.',
      '1:05',
      'AI didn’t choose the problem, the offline rule, or the required-item exception. Don’t borrow this story for Pricing.',
    ),
  },
  {
    id: 'targets',
    layout: 'metrics',
    chapter: 'target',
    title: 'These numbers would tell us it worked.',
    body: 'The pilot hasn’t reported back, so these are targets, not results.',
    metrics: targets,
    notes: notes(
      [
        'The handoff was a SwiftUI package the mobile team could drop into the staff app.',
        'Their review found five defects in about half an hour.',
        'If same-day completion stayed near 21%, the phone hadn’t replaced the spreadsheet.',
      ],
      'Second project: multi-incentive specials.',
      '1:15',
      'Don’t say it launched or that any target was hit. No device-share target.',
    ),
  },

  {
    id: 'project-specials',
    layout: 'project',
    projectLayout: 'stacked',
    title: 'Multi-incentive specials',
    image: { src: billFile('project/specials-laptop.png'), alt: 'Entrata Pricing on a laptop, with a special expanded to show three incentives.' },
    notes: note(
      'Second project: multi-incentive specials in Entrata Pricing. One special that can hold several offers.',
      'Start with the problem.',
      '0:10',
      'This one shipped. Save the adoption number for the results.',
    ),
  },
  divider(
    'chapter-pricing-problem',
    'list-tree',
    'The Problem',
    'Pricing, part one: the problem.',
    'The problem with specials.',
  ),
  {
    id: 'pricing-problem',
    layout: 'prose',
    chapter: 'list-tree',
    stage: 'Pricing Specials',
    title: 'A special could hold only one incentive',
    body: 'In Entrata Pricing, a special was a single offer. Customers needed several incentives in the same special, including a choice between a gift and a concession. Setup was also split across two tools. That was a real annoyance, and it was the smaller problem.',
    notes: note(
      'Say the one-incentive limit first. Say the fragmented setup second, on purpose.',
      'The two screens that made up the old path.',
      '1:00',
      'This one shipped. The adoption number comes later. Do not preview 162 yet.',
      'Do not open with the tiered-offer workaround or the journey map. Those are side artifacts.',
    ),
  },
  {
    id: 'pricing-original',
    layout: 'screens',
    chapter: 'list-tree',
    screenLayout: 'workflow',
    stage: 'The original path',
    title: 'Save the special, then open the pricing editor',
    body: 'Someone configured the special and saved it. Pricing continued in a separate bulk editor. That editor could handle detailed charges and credits. It was a general pricing tool, not a flow built for creating a special.',
    images: [
      shot(
        'original-edit-special.png',
        'Edit Special, with fields for name, recipients, a single special type, dates, coupon, cap, and description.',
        'The add screen was not captured. Edit Special used essentially the same fields, so this is the stand-in, not an Add Special screenshot.',
      ),
      shot(
        'original-bulk-pricing-editor.png',
        'Bulk Edit Pricing for prospect rents, with a toast that special settings were saved and an empty charge grid.',
        'After the save, this toast confirms the settings stuck, and the next surface is the general pricing editor. The grid in this capture is empty.',
      ),
    ],
    notes: note(
      'Left is the special. Right is where pricing actually happened. One type on the special. The grid is a general charge editor.',
      'What you were actually trying to change.',
      '1:25',
      'Special Type is one dropdown. The editor has charge timing, charge code, amount, tax, lease terms, and schedule updates, outside the special.',
      'Do not call the left image an add screen. Do not describe charge rows. The grid is empty. You designed the special, not the bulk editor. Do not use the file named Original add screen.',
    ),
  },
  divider(
    'chapter-pricing-explore',
    'pencil-ruler',
    'Exploration\n& Testing',
    'Exploration and testing.',
    'The design challenge.',
  ),
  {
    id: 'pricing-challenge',
    layout: 'prose',
    chapter: 'pencil-ruler',
    stage: 'The design problem',
    title: 'One special had to carry more than one offer',
    body: 'The limit was the product problem. A property wanted gifts and a concession together, and sometimes a choice between them, without creating a new special for each. I also wanted that configuration to live in the creation flow, in fields a pricing person could finish, instead of sending every incentive through the general editor.',
    notes: note(
      'Restate the priority in your own words: multiple incentives first, a less fragmented setup second.',
      'The first time you tried to put incentive setup inside the special.',
      '1:00',
      'Customers needed choices between gifts and concessions, not only a list of discounts.',
      'Frame 425, the tiered-offer AND/OR sketch, is a side conversation. It is not the original workflow and not a research finding. Leave it out.',
    ),
  },
  {
    id: 'pricing-v1',
    layout: 'screens',
    chapter: 'pencil-ruler',
    screenLayout: 'single',
    stage: 'First exploration',
    title: 'The first pass was a name, a value, and a cap',
    body: 'This was my first serious attempt to pull incentive setup into the special. I cut it down hard, so adding a gift or a rent discount was much simpler than filling out the pricing editor.',
    images: [
      shot(
        'wizard-v1-step-2.png',
        'An early Add Special step listing gifts and a rent discount, each with a name, a value, and a cap.',
        'Step two let one special hold several items. Each row was a name, a value, and a cap, plus how many items a person could select.',
      ),
    ],
    notes: note(
      'You were simplifying on purpose. Name, value, cap. The pricing editor’s charge grid is gone from this step.',
      'The next version had to hold more of the real requirements.',
      '1:00',
      'There is an earlier details step in the folder. It is optional color. This incentives step is the one that matters.',
      'This is an exploration, not the shipped design, and not a usability result.',
    ),
  },
  {
    id: 'pricing-v2',
    layout: 'screens',
    chapter: 'pencil-ruler',
    screenLayout: 'pair',
    stage: 'The next pass',
    title: 'The rows had to know what kind of offer they were',
    body: 'A flat list was too thin once gifts and rent discounts needed different treatment. The next version gave each row a type, an item, a value, and a cap, and an edit control for the detail that did not belong on every row. A rent discount could open more pricing controls.',
    images: [
      shot(
        'wizard-v1-step-2.png',
        'Earlier incentives step with a name, value, and cap on each row.',
        'First pass. Every row is a name, a value, and a cap.',
      ),
      shot(
        'wizard-v2-step-2.png',
        'Later incentives table with a special type, an item, value fields, and an edit control on each row.',
        'Next pass. Type, item, value, and cap, with edit on the row. A rent discount can open more pricing detail.',
      ),
    ],
    notes: note(
      'Walk the difference: the left side is the simplification, the right side is you putting structure back as the requirements got specific.',
      'What testing changed, and what it did not.',
      '1:15',
      'Types in this version include a gift, a rent discount, and a choice. The second value column is the cap.',
      'Some of this change is design working through requirements. Do not attribute it to the usability test. V3, the later General and Incentives pass, stays in the folder unless someone asks.',
    ),
  },
  {
    id: 'pricing-testing',
    layout: 'prose',
    motif: 'sparkles',
    chapter: 'pencil-ruler',
    stage: 'Usability testing',
    title: 'A new pattern in one workflow asked people to relearn Pricing',
    body: 'The wizard was meant to be simpler. Testing showed that people were already comfortable with the concession patterns used across Entrata. A different interaction model, in this workflow only, created relearning we did not need. The final design kept more of that existing language. Other changes along the way came from working through the requirements, not from the test.',
    notes: note(
      'The finding is familiarity, not a score. People knew concessions. A local reinvention made them learn Pricing twice.',
      'The argument about advanced pricing, and the compromise.',
      '1:00',
      'Changing the concession pattern everywhere would have been its own project, with its own change management.',
      'No participant quotes, no session count, no score. Do not say a tester asked for three steps. Do not show Frame 422 or Frame 328 as findings. The sheet with your PM was a working draft. The journey map was an edge case about coupon codes.',
    ),
  },
  {
    id: 'pricing-tradeoff',
    layout: 'prose',
    motif: 'user-exclamation-point',
    chapter: 'pencil-ruler',
    stage: 'A disagreement',
    title: 'We kept advanced pricing, and moved it off the common path',
    body: 'I wanted to remove lease-term pricing and space-option pricing. They added a lot of complexity, and most people creating a special did not need them on the way through. My PM pushed back. Important customers depended on those capabilities, and taking them out was outside the project’s scope. We kept both, and we put the detailed configuration where someone goes only when they need it.',
    notes: note(
      'You argued for removal. You did not get it. The compromise was placement, and that was the right product call once the dependency was clear.',
      'The shipped flow, one step at a time, big enough to read.',
      '1:10',
      'Lease term and space option stayed. They are not on the default path as expanded pricing grids.',
      'No 1% figure. Do not say you led the team or that engineering was overruled. Do not call lease terms seasons.',
    ),
  },
  divider(
    'chapter-pricing-design',
    'layers',
    'The Final\nDesign',
    'The final design, one step at a time.',
    'Step one, the special details.',
  ),
  {
    id: 'pricing-details',
    layout: 'showcase',
    chapter: 'layers',
    title: '1. Special Details',
    images: [
      shot(
        'final-step-1-special-details.png',
        'Add Special on the Special Details step, with a name and description fields.',
        'Special Details names the special and holds the descriptions and a few global settings.',
      ),
    ],
    notes: note(
      'Give people a second to read it. Name, internal notes, marketing description, terms. Active and the manual-apply toggles are here because they describe the special, not the offer.',
      'Who the special is for.',
      '1:00',
      'Start with what the special is. The first step is the name, the descriptions, and a few settings that apply to the special as a whole. Who receives it, and what they are offered, wait until the next steps. The steps across the top are Special Details, Recipients, and Incentives. This is the shipped flow.',
    ),
  },
  {
    id: 'pricing-recipients',
    layout: 'showcase',
    chapter: 'layers',
    title: '2. Recipients',
    images: [
      shot(
        'final-step-2-recipients.png',
        'Add Special on the Recipients step, with Prospects checked and lease terms and space options set to all.',
        'Recipients sets who qualifies, which lease terms and spaces are included, and a few limits such as a move-in date or a promo code.',
      ),
    ],
    notes: note(
      'Audience first. Prospects are on in this example. Lease terms and space options default to all.',
      'The step the project existed to add: more than one incentive.',
      '0:55',
      'Then decide who can receive it. Recipients chooses prospects, renewals, or residents, and where the special applies. Lease terms and space options can stay on “all” when the special is not limited to a subset. “Off the common path” means the per-term and per-space amounts, not these fields. Selecting which terms or spaces are eligible still lives here.',
    ),
  },
  {
    id: 'pricing-incentives',
    layout: 'showcase',
    chapter: 'layers',
    title: '3. Incentives',
    images: [
      shot(
        'final-step-3-incentives.png',
        'Add Special on Incentives, with two gift rows and a concession summarized as three space options.',
        'Two gifts and a concession in one special. Space-level amounts stay collapsed on “3 Space Options.” Price by Lease Term sits on that row.',
      ),
    ],
    notes: note(
      'Point at the three incentives. This is the multiple-incentive special. The concession is summarized, not expanded.',
      'Where the advanced pricing went, and the control for how many incentives someone may pick.',
      '1:15',
      'One special can hold several gifts and concessions. This is the capability the project was for. A single special carries more than one incentive. Gifts stay short. A concession can stay collapsed until someone needs the pricing detail. Two gift rows and one concession. The concession is summarized as 3 Space Options. Price by Lease Term is on that row. Do not name the gifts as a product list. The selection control is not on this screen.',
      'Do not say the selection count is visible here. It shows up when the space options are expanded.',
    ),
  },
  {
    id: 'pricing-space',
    layout: 'showcase',
    chapter: 'layers',
    titleLead: 'Advanced:',
    title: 'Space options',
    images: [
      shot(
        'final-space-options.png',
        'A concession expanded to Private Room, Private Unit, and Shared Room, with the number of incentives a recipient may select set to 2.',
        'Each space can carry its own amount. The control at the bottom sets how many incentives a recipient may select. Here it is 2.',
      ),
    ],
    notes: note(
      'This is the compromise on screen. The detail is one click away, and the selection count lives with it.',
      'Lease-term amounts, in their own dialog.',
      '0:55',
      'Space-specific amounts open only when someone needs them. Expanding space options shows a row per space, in this case a private room, a private unit, and a shared room. This is also where you set how many incentives a recipient may select. Private Room, Private Unit, Shared Room. Selection count is 2. Say that this control is on this screen, because it was not on the previous one.',
      'If stacked dialogs come up, that was a component-library constraint.',
    ),
  },
  {
    id: 'pricing-lease',
    layout: 'showcase',
    chapter: 'layers',
    titleLead: 'Advanced:',
    title: 'Lease terms',
    images: [
      shot(
        'final-lease-term-rates.png',
        'Lease Terms Rates dialog with a row for each academic term, plus amount, tax, and total.',
        'Each term has its own amount. The season names are this property’s lease terms, not a separate seasonal feature.',
      ),
    ],
    notes: note(
      'Say “lease term,” then immediately say why the rows look like seasons. Conventional properties use month counts.',
      'What shipped, as adoption, kept separate from how many specials exist overall.',
      '0:50',
      'Lease-term amounts open in their own dialog. Price by Lease Term leaves the main step and opens a dialog, one row per term. This screenshot is a student property, so the rows are academic terms. A conventional property would list durations such as 6, 12, or 18 months. The dialog is amount, tax, and total per term. It opens from Price by Lease Term.',
      'Do not describe these rows as seasons the product invented.',
    ),
  },
  divider(
    'chapter-pricing-results',
    'chart-no-axes-column',
    'Results &\nTakeaways',
    'Results and takeaways.',
    'The adoption numbers.',
  ),
  {
    id: 'pricing-results',
    layout: 'metrics',
    chapter: 'chart-no-axes-column',
    stage: 'After launch',
    title: '162 specials used more than one incentive',
    body: 'That is the new capability in use, across 38 clients. Lease-term limits, which we kept and moved off the common path, are on 8,290 specials across 278 clients. The release shipped with implementation issues. Engineering resolved them under the PM’s leadership.',
    metrics: [
      { value: '162', label: 'Specials with more than one incentive, across 38 clients' },
      { value: '8,290', label: 'Specials limited by lease term, across 278 clients' },
    ],
    notes: note(
      'Lead with 162 across 38. That is the new behavior. Then 8,290 across 278: specials limited to specific lease terms.',
      'What you would set up before the next build.',
      '0:55',
      'Usage was collected after the launch issues were stabilized. If asked for one more cut, 1,563 specials across 155 clients are limited by move-in date. Do not use the older R1 2024 applicant-type count of 1,266. Do not read the other cuts unless asked. Do not volunteer the resume’s older 8,000 line.',
      'Adoption only. Do not claim faster setup, fewer errors, or more revenue. You did not lead the bug fixes.',
    ),
  },
  {
    id: 'pricing-lessons',
    layout: 'prose',
    chapter: 'chart-no-axes-column',
    stage: 'What I would do again',
    title: 'Three things I would set before the build',
    bullets: [
      'Stay consistent with the rest of the product. A new pattern in one workflow makes people learn it twice.',
      'Keep the rare configuration available, and keep it off the path everyone walks.',
      'Agree on the success metric before development. We could see adoption. We could not see time to create a special, errors, or which path people took.',
    ],
    notes: note(
      'Consistency, progressive disclosure, and a metric chosen early enough to instrument. Then you are done with the project.',
      'Thank them, and open for questions.',
      '0:55',
      'The metric gap is real. Adoption was visible. Speed, errors, and path were not.',
      'Do not turn the lesson into a claim that the redesign saved time.',
    ),
  },
  {
    id: 'close',
    layout: 'close',
    stage: 'Thank you',
    title: 'Happy to take questions',
    lead: 'Either project, or how the work was done.',
    notes: note(
      'Stop. Let them choose the thread.',
      'Questions.',
      '0:30',
      'Move-in did not launch. Pricing did. AI is documented on the move-in work only.',
      'Do not close on a general statement about design or about AI.',
    ),
  },
];
