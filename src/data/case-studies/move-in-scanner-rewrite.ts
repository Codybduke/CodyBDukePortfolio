import type { CaseRewrite } from './types';
import { moveInScannerCase } from './move-in-scanner';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/move-in-scanner/${file}`);
const processImg = (file: string) => withBase(`/work/move-in-scanner-process/${file}`);

export const moveInScannerRewrite: CaseRewrite = {
  sceneNotes: {
    home: 'Move-In is a Quick Action on the home screen staff already open, because burying it under lease admin would have failed the breezeway.',
    roster:
      'The next 30 days of move-ins are on the device before staff walk outside, and every name already says Ready, Optional, Required, or Blocked.',
    riley:
      'Riley is ready, so the checklist gets a glance instead of a full profile review, and Move in is one tap away.',
    confirm:
      'Confirm asks for the one check a person has to make, the photo ID, and keeps everything else to a few lines.',
    morgan:
      'Morgan still has optional items open, so the move-in goes ahead and staff can leave themselves a follow-up task for after the rush.',
    jamie:
      'Jamie still has required items open, so there is no Move in button, and staff send Jamie to the resolution station instead of overriding.',
    taylor:
      'Taylor is hard blocked by validation errors, and the table path stops here until someone who can clear them takes over.',
    roommates:
      'Searching 204 returns everyone on the unit, because staff move roommates in back to back and retyping is where wrong-unit mistakes happen.',
    'offline-home':
      'When the network drops, home collapses to Move-In and a short note, because nothing else on Command Center is the job at the table.',
    'offline-roster':
      'Offline, the roster still searches and confirms queue, and a small chip says so instead of a banner nobody outdoors would read.',
  },
  case: {
    slug: moveInScannerCase.slug,
    openingClaim:
      'On move-in day at a student property, hundreds of residents walk away with keys while Entrata still says they never moved in. I designed the phone flow that records the move-in while the resident is still standing at the table, even when the Wi-Fi is gone.',
    collaborators: moveInScannerCase.collaborators,
    surface: moveInScannerCase.surface,
    sections: [
      {
        id: 'b-problem',
        stage: 'Problem',
        title: 'Keys went out. Entrata never heard about it.',
        body: [
          'Peak student turn moves 100 to more than 500 residents in a day, from a breezeway, the office, or a drive-through. The Wi-Fi is unreliable, and the line does not stop for it.',
          'So staff marked a spreadsheet and caught Entrata up later, or fought desktop Entrata on a phone. Either way, the resident felt moved in and the system of record did not.',
          'An audit of May through August 2025 at a large student operator put numbers on that gap.',
        ],
        metrics: moveInScannerCase.sections[0].metrics,
      },
      {
        id: 'b-business',
        stage: 'Problem',
        title: 'Why that gap matters to Entrata',
        body: [
          'Student housing was a majority of Entrata’s clients, and move-in week is their busiest week of the year. If that week runs on a spreadsheet, Entrata is optional on the days that matter most, for the customers who make up most of the book.',
          'A phone in the line writes the record while the resident is still there. That was the bet: a property that can move someone in offline, in seconds, has a reason to run the day in Entrata.',
        ],
      },
      {
        id: 'b-first-answer',
        stage: 'Process',
        title: 'The first answer was an overnight upload',
        body: [
          'The pain we could measure first was the morning after. A 300-resident property spent about eight hours re-keying a spreadsheet into Entrata. So I designed an agent that matched each row to a lease and showed its work before writing anything.',
          'Site visits moved the bet. The failure happened while the resident was still in line, and a faster catch-up still left Entrata wrong all day. The upload stayed as the next-morning bridge, and the main bet moved to the table.',
        ],
        figures: [
          {
            src: withBase('/work/csv-move-in-agent/01-preflight.png'),
            alt: 'Bulk Move-In review after an upload: 277 will be moved in, 30 have follow-up tasks, and 23 unresolved rows, with J. Smith in A-102 listed as an ambiguous name match.',
            caption:
              'Before anything was written, the upload sorted the file into people who would move in, people who needed a follow-up, and rows it would skip.',
            layout: 'wide',
          },
        ],
      },
      {
        id: 'b-wrong-first',
        stage: 'Process',
        title: 'Wrong first. Then the table told us.',
        body: [
          'My first spec assumed a QR scan would lead, open optional items would block the move-in, and offline could wait for a later release. Site visits at three properties and interviews with about 20 operators corrected all three.',
          'Operators described the line as “Smith, 315,” not a code on a phone. Optional items could not hold up a couple hundred people outside. Breezeway Wi-Fi fails often enough that offline had to ship first. I rewrote the requirements within 48 hours.',
        ],
        table: {
          headers: ['What I tried first', 'What replaced it, and why'],
          rows: [
            ['Name-only search', 'A unit search returns every roommate, because staff move roommates in back to back.'],
            ['Offline in a later release', 'Offline in the first release, with the next 30 days of move-ins cached on the device.'],
            ['A large offline banner', 'A quiet Offline chip. The banner looked safe in mocks and would have been ignored outdoors.'],
            ['A manager PIN override', 'No override in the first release. It would be too easy to burn on a busy Saturday.'],
          ],
        },
      },
      {
        id: 'b-search-first',
        stage: 'Process',
        title: 'Search replaced the camera',
        body: [
          'The first SwiftUI build opened on a QR scanner, and search was the button at the bottom. Operators described the line as a name and a unit, so I made the roster the first screen and moved the scanner to an icon in the header.',
        ],
        figures: [
          {
            src: processImg('01-qr-scan.png'),
            alt: 'Scan QR screen with a camera viewfinder and a Search upcoming move-ins button at the bottom.',
            caption: 'In the first build, staff landed on a camera and had to tap out of it to search.',
            layout: 'device',
          },
          {
            src: processImg('01-search-roster.png'),
            alt: 'Upcoming Move-ins roster with a search field for name, unit, or email, and a QR icon in the header.',
            caption: 'The roster and its search field became the first screen, with QR as a secondary icon.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-badges',
        stage: 'Process',
        title: 'Making Ready the loudest badge',
        body: [
          'In the first roster, Ready was gray and every open required item was red, so the people who could not move in were the ones that caught the eye. The express line needs the opposite. I made Ready green and turned every other state neutral.',
        ],
        figures: [
          {
            src: processImg('03-badges-before.png'),
            alt: 'Roster with gray Ready badges and red badges for required items still open.',
            caption: 'Before, the red blockers were the loudest thing on the list.',
            layout: 'device',
          },
          {
            src: processImg('03-badges-after.png'),
            alt: 'Roster with green Ready badges and neutral gray badges for open items.',
            caption: 'After, a glance down the list finds the residents who are ready to go.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-success',
        stage: 'Process',
        title: 'The success message after confirm',
        body: [
          'I tried three versions of the moment after confirm. A custom toast let staff start the next student right away. A system alert was more familiar, but it made staff tap OK before anything else, and that stops a line. The toast came back, and it now dismisses itself.',
        ],
        figures: [
          {
            src: processImg('02-confirm-custom-toast.png'),
            alt: 'Roster with a Move-in confirmed toast at the top of the screen.',
            caption: 'The first toast confirmed the move-in without blocking the roster.',
            layout: 'device',
          },
          {
            src: processImg('02-confirm-native-alert.png'),
            alt: 'Roster dimmed behind a Move-in confirmed system alert with an OK button.',
            caption: 'The system alert made staff tap OK before they could search again.',
            layout: 'device',
          },
          {
            src: processImg('02-confirm-autodismiss-toast.png'),
            alt: 'Later roster with a Move-in confirmed toast that dismisses on its own.',
            caption: 'The final toast returns on the later roster and disappears on its own.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-optional-warning',
        stage: 'Process',
        title: 'The optional-items warning',
        body: [
          'Once optional items stopped blocking the move-in, the screen still treated them like a problem. An orange warning sat at the top, and the escalation task competed with Move in on the same row. The warning became a calm note, and the follow-up became a second action under Move in, as shown in Solution.',
        ],
        figures: [
          {
            src: processImg('03-optional-alert-before.png'),
            alt: 'Morgan Diaz summary with an orange warning about optional follow-up items and side-by-side Create escalation task and Move in buttons.',
            caption: 'The orange warning and the side-by-side buttons made a resident who could move in look like an exception.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-offline-chip',
        stage: 'Process',
        title: 'An offline chip on the roster',
        body: [
          'The cached roster already worked without a network, but nothing on screen said so. Staff could not tell whether a confirm had reached Entrata or was waiting on the device. I added a small chip that says Offline and how many confirms are queued.',
        ],
        figures: [
          {
            src: processImg('05-offline-before.png'),
            alt: 'Roster with no indication of network status.',
            caption: 'Before, the offline roster looked exactly like the online one.',
            layout: 'device',
          },
          {
            src: processImg('05-offline-chip-swift.png'),
            alt: 'Roster with an Offline, 2 queued chip above the title.',
            caption: 'After, the chip says the device is offline and two confirms are waiting.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-path',
        stage: 'Solution',
        title: 'Name, checklist, confirm, next',
        body: [
          'The flow follows the line staff already ran. They type the name they just heard, glance at the checklist, check a photo ID, and confirm. What used to take minutes in desktop Entrata, or overtime the next day, now takes seconds.',
          'The Ready badge is not a new policy. Operators already ran an express line for ready residents and a cleanup line for everyone else, and the roster puts that rule on a screen.',
        ],
        figures: [
          {
            src: img('01-roster.png'),
            alt: 'Upcoming Move-ins roster with search, a date filter, and Ready, Optional, Required, and Blocked badges.',
            caption: 'The roster shows who is ready before staff open anyone.',
            layout: 'device',
          },
          {
            src: img('02-summary.png'),
            alt: 'Riley Foster resident summary showing a complete checklist, a Ready badge, and a Move in button.',
            caption: 'A ready resident gets a checklist glance, not a profile review.',
            layout: 'device',
          },
          {
            src: img('03-confirm.png'),
            alt: 'Confirm Move-in screen with a Verify ID callout and a Confirm Move-in button.',
            caption: 'Confirm puts the photo ID check above the button.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-edges',
        stage: 'Solution',
        title: 'Keep the line moving, and still stop when you must',
        body: [
          'Optional items that were still open at confirm used to disappear once the person was moved in. Now staff can move the resident in and leave themselves a follow-up task, so someone comes back to those items after the rush.',
          'Required items and hard blocks stop the line, with no override. Staff send that person to the resolution station, which is how properties already handled exceptions.',
        ],
        figures: [
          {
            src: img('06-summary-optional-open.png'),
            alt: 'Morgan Diaz summary with optional items still open and two actions: Move in, or Move in and create escalation.',
            caption: 'Optional items are open, and Move in is still available.',
            layout: 'device',
          },
          {
            src: img('08-summary-required-blocked.png'),
            alt: 'Jamie Baker summary showing required checklist items still need attention, with Move in unavailable.',
            caption: 'Required items are open, so Move in is gone.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-offline',
        stage: 'Solution',
        title: 'Offline is the day, not a later cut',
        body: [
          'Staff are on company iPads in a breezeway, and the Wi-Fi drops. The next 30 days of move-ins are cached before they walk outside. When the network goes, home collapses to Move-In, the roster still searches, and confirms wait for a connection.',
        ],
        figures: [
          {
            src: img('13-home-offline.png'),
            alt: 'Command Center home while offline, showing an offline message and Move-In as the only Quick Action.',
            caption: 'Offline, home shows a short note and Move-In, and nothing else.',
            layout: 'device',
          },
          {
            src: img('10-roster-offline.png'),
            alt: 'Upcoming Move-ins roster showing an Offline status chip instead of Synced.',
            caption: 'A small Offline chip tells staff the writes are waiting.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-handoff',
        stage: 'Solution',
        title: 'What the mobile team received',
        body: [
          'I worked out the states in an Expo prototype, then rebuilt the flow as a SwiftUI package with a demo target the OXP mobile team could drop into their app. Their review found five real defects in about half an hour, and the fixes went back the same day.',
          'The rewrite cost time. It also meant the native team reviewed a module they could run, not a stack of frames.',
        ],
      },
      {
        id: 'b-outcome',
        stage: "What's next",
        title: 'How we would know it worked',
        body: [
          'Pilot results are not in yet, so these are the targets that would prove the bet or disprove it. If same-day completion stays near one in five, the spreadsheet won.',
        ],
        table: {
          headers: ['Signal', 'What we already knew', 'Target'],
          rows: [
            ['Same-day completion at pilot properties', 'About 21% processed in Entrata on the day', '95% or more'],
            ['Move-ins caught up the next morning', 'About 36%', 'Near zero'],
            ['Staff overtime during turn', 'About 8 hours of re-key on a 300-resident property', 'Down 60%'],
            ['Time to process someone at the table', 'About 90 seconds, anecdotal', 'Under 20 seconds'],
            ['Share of pilot move-ins done on the device', 'About 0% peak-month use of desktop Bulk Move-In', '30% or more'],
            ['Wrong-resident incidents', 'A known risk when roommates share a unit', 'Zero'],
          ],
        },
      },
      {
        id: 'b-reflection',
        stage: "What's next",
        title: 'What I would change',
        bullets: [
          'I would put offline in the first release from week one, instead of waiting for interviews to force it.',
          'I would bring the engineering partner in by the end of week one. Week three was too late to learn the live app’s constraints.',
          'I would move to SwiftUI sooner. Expo was right for arguing about states and wrong for a native team’s final review.',
        ],
      },
    ],
    sibling: moveInScannerCase.sibling,
    nextCaptures: [
      'Draft where open optional items blocked the move-in',
      'Offline banner mock, against the quiet chip',
    ],
  },
};
