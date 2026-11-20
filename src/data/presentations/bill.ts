import { withBase } from '../../lib/paths';
import type { RingSlice, Slide, SlideImage, SlideLayout, SlideMetric } from './move-in-scanner';

/** Point and next are read while talking. The rest is secondary. */
export type SpeakerNote = {
  point: string;
  next: string;
  time: string;
  evidence?: string;
  qualification?: string;
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

export type BillSlide = Omit<Slide, 'layout'> & {
  layout: SlideLayout | 'opener' | 'gallery' | 'timeline' | 'feature' | 'screens' | 'close' | 'divider';
  notes: SpeakerNote;
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
  return { point, next, time, evidence, qualification };
}

function divider(id: string, chapter: ChapterIcon, label: string, point: string, next: string): BillSlide {
  return {
    id,
    layout: 'divider',
    chapter,
    title: label,
    notes: note(point, next, '0:05', 'Chapter divider. The label is the only type on the slide.'),
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
    notes: note(
      'Say your name, that this is the portfolio presentation, and that you will walk two projects.',
      'A minute on life outside the work, then how the job changed.',
      '0:35',
      'BILL, Lead Product Designer, Spend & Expense. Do not tour the portfolio site.',
      'The stone is the same model as the homepage, printed light on black. It is not a product metaphor. Do not explain it unless someone asks.',
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
    notes: note(
      'I spend most of my time with my family, and the rest on a car and on small machines I build because I want to see if I can.',
      'Where the work has been.',
      '1:10',
      'Family is the cornfield, the porch, the graduation, and Halloween. The car is the silver Subaru. The builds are the button board (wired up, finished, and lit blue), the RetroPie handheld, and the on-air box that lights up when you are in a meeting.',
      'Talk only about the photos on the slide. The slide has no captions, so the names live here.',
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
    notes: note(
      'Graphic design at BYU-Idaho, then FamilySearch, then Entrata. The product-lead year is a wider scope at the same company, not a new employer.',
      'The first project: move-in day, and why the record was late.',
      '1:20',
      'At Entrata the senior product designer role grew into product lead for about the last year. Discovery, prioritization, prototyping, and working with engineering through delivery became part of the job, along with the design.',
      'Do not say you led engineering. Do not add a design-philosophy slide after this.',
    ),
  },

  divider(
    'chapter-move-problem',
    'search',
    'Understanding\nThe Problem',
    'Move-In, part one: understanding the problem.',
    'What was happening at the leasing desk.',
  ),
  {
    id: 'line-problem',
    layout: 'feature',
    chapter: 'search',
    stage: 'Real-time move-ins',
    title: 'Keys went out before Entrata knew',
    body: 'On move-in day, a hundred to five hundred residents show up at a breezeway, an office, or a drive-through. Staff hand over the keys. The resident leaves finished. Often Entrata still has no record that they arrived.',
    image: {
      src: moveIn('line-jeep.jpg'),
      alt: 'A student move-in team member hands a paper to the driver of a white Jeep at a campus drive-through.',
      fit: 'cover',
    },
    caption: 'A drive-through move-in. The conversation happens at the window, not at a desk.',
    notes: note(
      'Paint the line before any product. Keys, then the resident is gone, and the system is still wrong.',
      'What staff used instead, and why the business cared that week.',
      '1:15',
      'Student housing was most of Entrata’s book. This workflow did not launch.',
      'Do not open with the phone. The audience needs the day before the solution.',
    ),
  },
  {
    id: 'line-spreadsheet',
    layout: 'feature',
    chapter: 'search',
    stage: 'The workflow they trusted',
    title: 'The working system was a spreadsheet',
    body: 'Staff marked names on a sheet while the line moved, then someone retyped them into Entrata the next morning. At a 300-resident property that was about eight hours of overtime, in the busiest week of the year. Desktop bulk move-in, the tool built for processing many people at once, barely showed up in those weeks.',
    image: {
      src: moveIn('spreadsheet-laptop.jpg'),
      alt: 'A person types on a laptop showing a spreadsheet of names, lease IDs, checklist status, and a moved-in column.',
      fit: 'cover',
    },
    caption: 'An illustration of the sheet, not a customer export. Name, lease, checklist, and whether someone had been marked moved in.',
    notes: note(
      'The spreadsheet worked where they stood, including when the Wi-Fi was gone. Entrata was the cleanup.',
      'How often the record was actually written the same day.',
      '1:20',
      'Student housing was when the product was either used or replaced. Staff were also reluctant to open a new app during the week it mattered most.',
      'The photo is staged. Do not read the names off it as research. Do not turn the eight hours into a revenue claim.',
    ),
  },
  {
    id: 'line-baseline',
    layout: 'rings',
    chapter: 'search',
    stage: 'What the audit showed',
    title: 'Most move-ins were not written while the resident was still there',
    body: 'A May through August 2025 audit at a large student operator. These are the baseline the flow was designed against. They are not pilot results.',
    rings,
    notes: note(
      'About 21% the same day, 36% the next morning, 43% later or never. Real time was the exception.',
      'What you owned on this one, and what was shared.',
      '1:20',
      'Same-day means written in Entrata while the resident was still there.',
      'Do not say the pilot moved these numbers. It has not come back.',
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
    chapter: 'git-branch',
    stage: 'My role',
    title: 'What I was responsible for',
    body: 'I was the product manager and the UX designer for this workflow. Another designer and I shared the component library the app is built from.',
    bullets: [
      'Mine: the flow, the requirements, and the calls about what the line could handle.',
      'Shared: the component library and the system work underneath it.',
    ],
    notes: note(
      'You held the product calls and the design. You did not run an engineering team.',
      'The first thing you designed was not the phone.',
      '0:50',
      'Product manager and UX designer for this workflow.',
      'Do not describe this as leading the mobile organization.',
    ),
  },
  {
    id: 'line-upload',
    layout: 'screens',
    chapter: 'git-branch',
    screenLayout: 'single',
    stage: 'The first concept',
    title: 'Start with the file they already had',
    body: 'The pain we could measure first was the morning after. I designed an upload that took the spreadsheet, matched each row to a lease, and showed the work before anything was written. A person still handled the rows the match could not settle.',
    images: [
      frame(
        withBase('/work/csv-move-in-agent/01-preflight.png'),
        'Bulk Move-In review with three buckets: 277 will be moved in, 30 have follow-up tasks, and 23 unresolved rows a person still has to resolve.',
        'After the file lands, rows sort into people who will be moved in, people who need a follow-up, and rows a person still has to resolve.',
      ),
    ],
    notes: note(
      'The screen is a review, not a column-mapping exercise. When two residents share a name, a person picks the lease.',
      'Why a faster morning-after was not enough.',
      '1:20',
      'This is the upload prototype. It treats the spreadsheet as the source of truth.',
      'Explored, not a shipped replacement for Bulk Move-In. Do not say this launched.',
    ),
  },
  {
    id: 'line-shift',
    layout: 'feature',
    chapter: 'git-branch',
    stage: 'What the visits changed',
    title: 'The failure was happening in the line',
    body: 'A faster catch-up still left Entrata wrong while the keys were going out. Site visits and operator interviews moved the bet. Staff needed something they could use where they stood, including when the Wi-Fi dropped. The upload stayed as a next-day path for teams that kept the sheet. The table needed its own flow.',
    image: { src: billFile('move-in-roster-phone.png'), alt: 'Upcoming move-ins on a tilted phone, with Ready, Optional, Required, and Blocked on the list.', fit: 'contain' },
    caption: 'Ready, Optional, Required, and Blocked are visible before anyone is opened.',
    notes: note(
      'You changed direction after being on site. A nicer desktop screen of the old flow would still have left the day wrong.',
      'The shape of the phone flow, before you drive it.',
      '1:10',
      'Breezeway Wi-Fi failed often, and staff were on company iPads. The first spec had offline later. Visits pulled it into the first release.',
      'Do not say the upload was thrown away. It was split off so the line did not have to wait. Neither one launched. Move-In also sits on the home screen they already open. This still is the roster, not that home screen.',
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
    stage: 'The flow',
    title: 'Search, then readiness, then confirm',
    body: 'Three steps, short enough for a line, and built to keep working when the network does not. I will drive the prototype on the next few slides. Stop me if you want to poke at a state.',
    bullets: [
      'Search by the name they just heard. The roster for the next 30 days is already on the device.',
      'Readiness is visible before anyone is opened: Ready, Optional, Required, or Blocked.',
      'Confirm is a checklist, a photo ID, and the status change. A full profile never comes to the table.',
    ],
    notes: note(
      'Name the three beats, then give the room permission to interrupt during the prototype.',
      'Search, live. This is the longest stretch. Let it breathe.',
      '0:40',
      'The first build opened on a camera. Operators described the line as a name and a unit, so search became the way in. QR stayed a later path.',
      'Do not claim a launch or a measured time-on-task from the pilot.',
    ),
  },
  {
    id: 'search',
    layout: 'split',
    chapter: 'smartphone',
    stage: 'Search',
    title: 'They type the name they just heard',
    bullets: [
      'The roster for the next 30 days is already on the device.',
      'The first build opened on a camera. The line was a name and a unit, so search is the way in.',
    ],
    fallback: phone('after-roster-phone-sim-on.png', 'Upcoming move-ins roster on a phone, with search and profile photos.'),
    notes: note(
      'Drive to the roster and type a name. Point at search, not at a scanner.',
      'The state of the person, before the record is opened.',
      '2:00',
      'If someone asks about roommates: searching a unit brings the beds on that unit back together, and each roommate keeps their own state.',
      'QR was the first build and is still a later idea, once resident-side readiness exists. Do not demo a camera unless asked.',
    ),
  },
  {
    id: 'readiness',
    layout: 'split',
    chapter: 'smartphone',
    stage: 'Readiness',
    title: 'You can see the state before you open anyone',
    bullets: [
      'Ready, Optional, Required, and Blocked sit on the roster.',
      'Properties already ran an express line and a cleanup line. The screen follows that.',
    ],
    fallback: phone('02-summary.png', 'A resident summary with a complete checklist and a Ready state.'),
    notes: note(
      'Open a resident who is Ready only after you have pointed at the state on the list. The glance is the feature.',
      'Confirm stays short on purpose.',
      '1:20',
      'Four states. Express line and cleanup line already existed on site.',
      'Blocked, such as a unit that is not ready, uses the same stop as a required item. Show it if asked. Do not add a slide for it.',
    ),
  },
  {
    id: 'confirm',
    layout: 'split',
    chapter: 'smartphone',
    stage: 'Confirm',
    title: 'Confirm is a checklist, an ID, and a yes',
    bullets: [
      'Property, unit, date, and the change from Future to Current.',
      'The desktop flow asked for a full profile. The line could not carry that.',
    ],
    fallback: phone('03-confirm.png', 'Confirm Move-in screen with a Verify ID callout.'),
    notes: note(
      'Walk a ready resident through confirm. Keep it as short as the screen is.',
      'What happens when something is still open, but the person can still move in.',
      '1:10',
      'Checklist, photo ID, confirm. Not the desktop profile.',
    ),
  },
  {
    id: 'optional',
    layout: 'split',
    chapter: 'smartphone',
    stage: 'Optional',
    title: 'Optional items do not stop the person',
    bullets: [
      'They still move in.',
      'Open items become a follow-up after the rush.',
    ],
    fallback: phone(
      'after-optional-phone-sim-on.png',
      'Morgan Diaz summary on a phone, with a calm note about optional items and Move in above the follow-up.',
    ),
    notes: note(
      'Show Morgan, or whoever is optional. The note is calm, and Move in stays available.',
      'Required items are the stop, with one offline exception.',
      '0:50',
      'An earlier orange warning made someone who could still move in look like a problem. It became a note, and the follow-up sits under Move in.',
      'Optional items are deferred, not ignored. There is no text to the resident from this screen.',
    ),
  },
  {
    id: 'required',
    layout: 'split',
    chapter: 'smartphone',
    stage: 'Required',
    title: 'Required items stop a normal move-in',
    bullets: [
      'Staff send that person down the path the property already uses.',
      'A manager PIN is not in this release.',
      'Offline is the exception, and it works differently.',
    ],
    fallback: phone(
      '08-summary-required-blocked.png',
      'Jamie Baker summary showing required checklist items still need attention, with Move in unavailable.',
    ),
    notes: note(
      'Show the stop. Say clearly that it is not absolute, because the next slide is the exception.',
      'What Save move-in for sync actually does.',
      '0:55',
      'A permissioned person already handled hard stops on site. A PIN would have been too easy to share on a Saturday.',
      'Do not say there is no override and stop talking. The PIN was left out. The offline path is a different rule.',
    ),
  },
  {
    id: 'offline',
    layout: 'split',
    chapter: 'smartphone',
    stage: 'Offline',
    title: 'A finished checklist can still be saved offline',
    bullets: [
      'The next 30 days are cached. An Offline chip means the write has not reached Entrata.',
      'If the required items were completed on site, Save move-in for sync queues the move-in.',
      'On reconnect, Entrata tries to process it. A conflict flags the resident so staff can review it.',
    ],
    fallback: phone('after-offline-phone-sim-on.png', 'Upcoming move-ins roster on a phone with an Offline chip.'),
    notes: note(
      'Offline is in the first release, including the required-item case. Walk the chip, then the exception.',
      'How AI fit into getting from research to this prototype, and where it did not decide.',
      '1:40',
      'If staff completed the required items on site, they can queue the move-in. After reconnect, Entrata attempts to process it. A conflict flags the resident. Staff can review and, if they verified the items, mark the resident ready.',
      'Reconnect is an attempt, not a guarantee. That review is not a manager PIN. The roster still searches while offline. Confirms wait for a network unless this path queued them.',
    ),
  },
  divider(
    'chapter-move-measure',
    'target',
    'Handoff &\nMeasured Targets',
    'Part four: the handoff and the targets we set.',
    'Where AI fits, then the targets.',
  ),
  {
    id: 'ai',
    layout: 'prose',
    chapter: 'target',
    stage: 'How the work moved',
    title: 'AI shortened the path from research to something people could react to',
    body: 'I still start by writing the problem down. Interviews, site notes, and what we already knew from similar work went into one repo, and that is what I pointed the tools at.',
    bullets: [
      'I rewrite the problem until I trust it. Then AI gets me to a prototype faster than I could by hand.',
      'When something is off, I correct it in Figma and bring that correction back into the prototype.',
      'Developers see it early. What is ready to hand off stays my call.',
    ],
    notes: note(
      'The tools shortened the loop. They did not choose the problem, the offline rule, or the required-item exception.',
      'What you handed engineering, and the numbers that would have told you if it worked.',
      '1:05',
      'Stakeholders see it before usability testing and again after. Testing goes back into the repo. AI drafts a change list, and you edit it before anything runs.',
      'Pricing’s folder does not document an AI workflow. Do not borrow this one for that project.',
    ),
  },
  {
    id: 'targets',
    layout: 'metrics',
    chapter: 'target',
    stage: 'Handoff',
    title: 'What I handed off, and what would have counted',
    body: 'What left my hands was a SwiftUI package the mobile team could drop into the staff app. In review they found five defects in about half an hour. The pilot has not come back, so these are targets. If same-day completion stayed near 21%, the phone had not replaced the spreadsheet.',
    metrics: targets,
    notes: note(
      'Name the artifact, the review, and the one number that would have disproved the bet. Then stop.',
      'A different project: a special that could only hold one incentive.',
      '1:15',
      'Five defects are from the handoff review, not from production. Targets: 95%+ same-day, under 20 seconds at the table, and about 60% less morning-after entry. Do not add a device-share target.',
      'Do not say it launched or that any target was hit.',
    ),
  },

  divider(
    'chapter-pricing-problem',
    'list-tree',
    'The Problem',
    'Second project, Pricing. Start with the problem.',
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
    layout: 'screens',
    chapter: 'layers',
    screenLayout: 'single',
    stage: 'Shipped · Special Details',
    title: 'Start with what the special is',
    body: 'The first step is the name, the descriptions, and a few settings that apply to the special as a whole. Who receives it, and what they are offered, wait until the next steps.',
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
      'The steps across the top are Special Details, Recipients, and Incentives. This is the shipped flow.',
    ),
  },
  {
    id: 'pricing-recipients',
    layout: 'screens',
    chapter: 'layers',
    screenLayout: 'single',
    stage: 'Shipped · Recipients',
    title: 'Then decide who can receive it',
    body: 'Recipients chooses prospects, renewals, or residents, and where the special applies. Lease terms and space options can stay on “all” when the special is not limited to a subset.',
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
      '“Off the common path” means the per-term and per-space amounts, not these fields. Selecting which terms or spaces are eligible still lives here.',
    ),
  },
  {
    id: 'pricing-incentives',
    layout: 'screens',
    chapter: 'layers',
    screenLayout: 'single',
    stage: 'Shipped · Incentives',
    title: 'One special can hold several gifts and concessions',
    body: 'This is the capability the project was for. A single special carries more than one incentive. Gifts stay short. A concession can stay collapsed until someone needs the pricing detail.',
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
      'Two gift rows and one concession. The concession is summarized as 3 Space Options. Price by Lease Term is on that row. Do not name the gifts as a product list. The selection control is not on this screen.',
      'Do not say the selection count is visible here. It shows up when the space options are expanded.',
    ),
  },
  {
    id: 'pricing-space',
    layout: 'screens',
    chapter: 'layers',
    screenLayout: 'single',
    stage: 'Advanced pricing',
    title: 'Space-specific amounts open only when someone needs them',
    body: 'Expanding space options shows a row per space, in this case a private room, a private unit, and a shared room. This is also where you set how many incentives a recipient may select.',
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
      'Private Room, Private Unit, Shared Room. Selection count is 2. Say that this control is on this screen, because it was not on the previous one.',
      'If stacked dialogs come up, that was a component-library constraint.',
    ),
  },
  {
    id: 'pricing-lease',
    layout: 'screens',
    chapter: 'layers',
    screenLayout: 'single',
    stage: 'Advanced pricing',
    title: 'Lease-term amounts open in their own dialog',
    body: 'Price by Lease Term leaves the main step and opens a dialog, one row per term. This screenshot is a student property, so the rows are academic terms. A conventional property would list durations such as 6, 12, or 18 months.',
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
      'The dialog is amount, tax, and total per term. It opens from Price by Lease Term.',
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
