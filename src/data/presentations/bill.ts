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
        'I start with a researched, validated problem. People own the intent and the priorities.',
        'With Cursor and reusable design skills, I turn research, requirements, initiatives, and epics into working high-fidelity prototypes.',
        'I test the prototype with users and refine the experience.',
        'For the handoff, an engineer built a workflow that translates prototype work into Swift.',
        'I keep working with engineering through implementation and validation.',
      ],
      'The handoff and the targets.',
      '1:05',
      'AI speeds up the making. It didn’t decide the problem, the offline rule, or the required-item exception.',
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
    notes: notes(
      [
        'Second project: multi-incentive specials in Entrata Pricing.',
        'One special that can hold several offers. This one shipped.',
      ],
      'The problem.',
      '0:10',
      'Save the adoption numbers for the results.',
    ),
  },
  divider(
    'chapter-pricing-problem',
    'list-tree',
    'The Problem',
    'Pricing, part one: the problem.',
    'The one-incentive limit.',
  ),
  {
    id: 'pricing-problem',
    layout: 'prose',
    chapter: 'list-tree',
    title: 'One special could only have one incentive.',
    body: 'Properties wanted to combine gifts, concessions, and discounts. Entrata allowed one incentive per special.',
    notes: notes(
      [
        'This was the core product problem.',
        'Customers also wanted to offer a choice, like a gift or a concession.',
        'Setup was split across two tools too. That’s the next slide.',
      ],
      'How a special was set up.',
      '0:50',
      'Don’t preview the adoption numbers yet.',
    ),
  },
  {
    id: 'pricing-original',
    layout: 'screens',
    chapter: 'list-tree',
    screenLayout: 'workflow',
    title: 'Setting up a special meant using two different workflows.',
    body: 'Save the special, then open the pricing editor.',
    images: [
      shot(
        'original-edit-special.png',
        'Edit Special, with fields for name, recipients, a single special type, dates, coupon, cap, and description.',
        'First, the special, with a single type.',
      ),
      shot(
        'original-bulk-pricing-editor.png',
        'Bulk Edit Pricing for prospect rents, with a toast that special settings were saved and an empty charge grid.',
        'Then the general pricing editor.',
      ),
    ],
    notes: notes(
      [
        'Left is the special. Right is where the pricing actually happened.',
        'The editor was a general charge tool, not a flow built for creating a special.',
        'The left image is Edit Special. Add Special used essentially the same fields.',
      ],
      'Exploration and testing.',
      '1:10',
      'You designed the special, not the bulk editor. The grid in this capture is empty.',
    ),
  },
  divider(
    'chapter-pricing-explore',
    'pencil-ruler',
    'Exploration\n& Testing',
    'Part two: exploration and testing.',
    'The first exploration.',
  ),
  {
    id: 'pricing-v1',
    layout: 'screens',
    chapter: 'pencil-ruler',
    screenLayout: 'single',
    title: 'I started by simplifying everything.',
    body: 'A name, a value, and a cap.',
    images: [
      shot(
        'wizard-v1-step-2.png',
        'An early Add Special step listing gifts and a rent discount, each with a name, a value, and a cap.',
        'Several incentives in one special, added while creating it.',
      ),
    ],
    notes: notes(
      [
        'My hypothesis was that the pricing editor’s complexity was the main problem.',
        'So I explored adding incentives directly while creating the special.',
        'The goal was to make the common incentives much easier to set up.',
      ],
      'What a flat list couldn’t hold.',
      '1:00',
      'This is an exploration, not the shipped design.',
    ),
  },
  {
    id: 'pricing-v2',
    layout: 'screens',
    chapter: 'pencil-ruler',
    screenLayout: 'single',
    title: 'But different incentives needed different controls.',
    body: 'Gifts and rent discounts weren’t interchangeable.',
    images: [
      shot(
        'wizard-v2-step-2.png',
        'Later incentives table with a special type, an item, value fields, and an edit control on each row.',
        'Each row got a type, and a rent discount could open more detail.',
      ),
    ],
    notes: notes(
      [
        'A flat list was too limited.',
        'This version added incentive types and optional advanced details.',
        'It was slowly bringing back the complexity I had tried to remove.',
      ],
      'What usability testing showed.',
      '1:00',
      'Some of this came from working through requirements, not from testing.',
    ),
  },
  {
    id: 'pricing-testing',
    layout: 'prose',
    motif: 'sparkles',
    chapter: 'pencil-ruler',
    stage: 'Usability testing',
    title: 'We were simplifying the wrong thing.',
    body: 'Users understood the pricing editor. Switching between workflows was the bigger problem.',
    notes: notes(
      [
        'Users were already familiar with the pricing editor.',
        'Separating creation from detailed setup is what confused them.',
        'A simpler UI didn’t help if it broke up a workflow they already knew.',
        'So we changed direction: one consolidated workflow that keeps the complexity it needs.',
      ],
      'Deciding which advanced options to keep.',
      '1:10',
      'No participant quotes, session counts, or scores.',
    ),
  },
  {
    id: 'pricing-tradeoff',
    layout: 'prose',
    motif: 'user-exclamation-point',
    chapter: 'pencil-ruler',
    stage: 'Working with my PM',
    title: 'Low usage didn’t mean low value.',
    body: 'We simplified the common path without removing advanced capabilities.',
    notes: notes(
      [
        'Space-specific and lease-term pricing had very low usage, roughly 1%.',
        'I suggested removing some of it. My PM pointed out that strategically important customers relied on it.',
        'Removing it would also have added research and scope.',
        'We agreed to keep it and keep the common path simple.',
      ],
      'The final design.',
      '1:10',
      'Tell it as a decision you reached together, not a disagreement you lost.',
    ),
  },
  divider(
    'chapter-pricing-design',
    'layers',
    'The Final\nDesign',
    'Part three: the final design, one step at a time.',
    'Starting with the special.',
  ),
  {
    id: 'pricing-details',
    layout: 'showcase',
    chapter: 'layers',
    title: 'Start with the special.',
    body: 'Set up the basics first.',
    images: [
      shot(
        'final-step-1-special-details.png',
        'Add Special on the Special Details step, with a name and description fields.',
        'Special Details names the special and holds the descriptions and a few global settings.',
      ),
    ],
    notes: notes(
      [
        'Name, internal notes, marketing description, and terms.',
        'Active and the manual-apply settings live here because they describe the whole special.',
        'The steps across the top are Special Details, Recipients, and Incentives.',
      ],
      'Who can receive it.',
      '0:45',
    ),
  },
  {
    id: 'pricing-recipients',
    layout: 'showcase',
    chapter: 'layers',
    title: 'Then choose who can receive it.',
    body: 'Keep recipients in the same workflow.',
    images: [
      shot(
        'final-step-2-recipients.png',
        'Add Special on the Recipients step, with Prospects checked and lease terms and space options set to all.',
        'Recipients sets who qualifies, which lease terms and spaces are included, and a few limits such as a move-in date or a promo code.',
      ),
    ],
    notes: notes(
      [
        'Prospects, renewals, or residents, and where the special applies.',
        'Lease terms and space options can stay on all.',
        'Choosing eligible terms and spaces happens here. Per-term and per-space amounts come later.',
      ],
      'The incentives.',
      '0:45',
    ),
  },
  {
    id: 'pricing-incentives',
    layout: 'showcase',
    chapter: 'layers',
    title: 'One special, multiple incentives.',
    body: 'Combine gifts and concessions.',
    images: [
      shot(
        'final-step-3-incentives.png',
        'Add Special on Incentives, with two gift rows and a concession summarized as three space options.',
        'Two gifts and a concession in one special. Space-level amounts stay collapsed on “3 Space Options.” Price by Lease Term sits on that row.',
      ),
    ],
    notes: notes(
      [
        'This is the capability the project was for.',
        'Two gifts and one concession in a single special.',
        'The concession stays collapsed as 3 Space Options until someone needs the detail.',
      ],
      'Advanced options.',
      '0:55',
      'The selection count isn’t on this screen.',
    ),
  },
  {
    id: 'pricing-space',
    layout: 'showcase',
    chapter: 'layers',
    title: 'Advanced options when you need them.',
    body: 'Configure space-specific amounts without cluttering the common path.',
    images: [
      shot(
        'final-space-options.png',
        'A concession expanded to Private Room, Private Unit, and Shared Room, with the number of incentives a recipient may select set to 2.',
        'Each space can carry its own amount. The control at the bottom sets how many incentives a recipient may select. Here it is 2.',
      ),
    ],
    notes: notes(
      [
        'Expanding shows a row per space: private room, private unit, and shared room.',
        'This is also where you set how many incentives a recipient can pick. Here it’s 2.',
        'This is the tradeoff on screen. The option stayed, one step off the common path.',
      ],
      'Lease-term pricing.',
      '0:55',
      'If stacked dialogs come up, that was a component-library constraint.',
    ),
  },
  {
    id: 'pricing-lease',
    layout: 'showcase',
    chapter: 'layers',
    title: 'Lease-term pricing stays available.',
    body: 'Detailed amounts open in a dedicated dialog.',
    images: [
      shot(
        'final-lease-term-rates.png',
        'Lease Terms Rates dialog with a row for each academic term, plus amount, tax, and total.',
        'Each term has its own amount. The season names are this property’s lease terms, not a separate seasonal feature.',
      ),
    ],
    notes: notes(
      [
        'Price by Lease Term opens this dialog, with one row per term.',
        'This is a student property, so the terms are academic. Conventional properties list 6, 12, or 18 months.',
        'Each term has an amount, tax, and total.',
      ],
      'The results.',
      '0:50',
      'Don’t call these rows seasons.',
    ),
  },
  divider(
    'chapter-pricing-results',
    'chart-no-axes-column',
    'Results &\nTakeaways',
    'Part four: results and takeaways.',
    'How many specials used multiple incentives.',
  ),
  {
    id: 'pricing-results',
    layout: 'metrics',
    chapter: 'chart-no-axes-column',
    stage: 'After launch',
    title: '162 specials used multiple incentives.',
    metricsLead: true,
    metrics: [
      { value: '38', label: 'Clients adopted multi-incentive specials' },
      { value: '8,290', label: 'Specials still used lease-term restrictions, across 278 clients' },
    ],
    notes: notes(
      [
        'Lead with 162 specials across 38 clients. That’s the new capability in use.',
        '8,290 specials across 278 clients used lease-term restrictions. Advanced pricing stayed relevant.',
        'The release had implementation issues. Engineering resolved them before a relaunch.',
      ],
      'What I’d measure next time.',
      '0:55',
      'Adoption only. No claims about speed, errors, or revenue. If asked for one more cut, 1,563 specials across 155 clients are limited by move-in date.',
    ),
  },
  {
    id: 'pricing-lessons',
    layout: 'prose',
    chapter: 'chart-no-axes-column',
    stage: 'Reflection',
    title: 'I wish we’d measured more than adoption.',
    body: 'We could see that customers were using the functionality, but not whether the workflow was easier.',
    notes: notes(
      [
        'We tracked adoption.',
        'We hadn’t defined measures for time to create a special, configuration errors, or common versus advanced path usage.',
        'Next time I’d set those with the PM and engineering before development starts.',
      ],
      'Thank them and open it up for questions.',
      '0:45',
    ),
  },
  {
    id: 'close',
    layout: 'close',
    stage: 'Thank you',
    title: 'Happy to take questions',
    lead: 'Either project, or how the work was done.',
    notes: notes(
      [
        'Stop and let them pick the thread.',
        'Move-in didn’t launch. Pricing did.',
        'AI is only documented on the move-in work.',
      ],
      'Questions.',
      '0:30',
    ),
  },
];
