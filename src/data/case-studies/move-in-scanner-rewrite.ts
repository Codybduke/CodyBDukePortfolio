import type { CaseRewrite } from './types';
import { moveInScannerCase } from './move-in-scanner';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/move-in-scanner/${file}`);
const processImg = (file: string) => withBase(`/work/move-in-scanner-process/${file}`);

export const moveInScannerRewrite: CaseRewrite = {
  sceneNotes: {
    home: 'Move-In sits on the home screen staff already have open. Nobody working a breezeway is going to dig for it under lease admin.',
    roster:
      'The next 30 days of move-ins are already on the device, and each name says Ready, Optional, Required, or Blocked.',
    riley: 'Riley is ready, so the checklist is a quick look and Move in is one tap away.',
    confirm: 'Confirm asks for the photo ID, the one check a person still has to make, and keeps the rest short.',
    morgan:
      'Morgan still has optional items open. Staff can move Morgan in and leave a follow-up for after the rush.',
    jamie:
      'Jamie still has required items open, so there is no Move in button. Staff send Jamie to the resolution station.',
    taylor:
      'Taylor is blocked by validation errors. The table path stops until someone who can clear them takes over.',
    roommates:
      'Searching a unit returns everyone on it, because staff move roommates in back to back.',
    'offline-home':
      'When the connection drops, the home screen keeps Move-In and a short note. That is the job at the table.',
    'offline-roster':
      'Offline, staff can still search and confirm. A small chip says the move-ins are waiting to sync.',
  },
  case: {
    slug: moveInScannerCase.slug,
    openingClaim:
      'During peak student move-in, staff were getting residents in the door faster than Entrata could keep up. I designed a phone flow so they could finish the move-in while the person was still standing there, even when the Wi-Fi dropped.',
    collaborators: moveInScannerCase.collaborators,
    surface: moveInScannerCase.surface,
    sections: [
      {
        id: 'b-problem',
        stone: 1,
        stage: 'Problem',
        title: 'Move-ins happened quickly, but Entrata wasn’t keeping up',
        body: [
          'During peak student move-in, a property can move 100 to more than 500 residents in a single day. Staff are working from breezeways, leasing offices, and drive-through stations. Wi-Fi is unreliable, and the line keeps moving.',
          'To keep things moving, staff often tracked move-ins in a spreadsheet and updated Entrata later. Others tried using the desktop version on their phones. Either way, residents were moving in before the system was updated.',
          'An audit of May through August 2025 at a large student housing operator showed just how big the gap was.',
        ],
        metrics: [
          {
            value: '~21%',
            label: 'Student move-ins recorded in Entrata on move-in day',
          },
          {
            value: '~36%',
            label: 'Move-ins with no activity during the day, but completed by the following morning',
          },
          {
            value: '~43%',
            label: 'Move-ins completed after the following morning, or never recorded',
          },
        ],
      },
      {
        id: 'b-business',
        stage: 'Problem',
        title: 'Why this was a problem for Entrata',
        body: [
          'Student housing made up the majority of Entrata’s clients, and move-in week was their busiest time of year. If properties were relying on spreadsheets instead of Entrata during that week, the product wasn’t supporting customers when they needed it most.',
          'The opportunity was to give staff a way to complete move-ins right from their phones, even without an internet connection. If they could update the system while residents were still standing in front of them, Entrata could become part of the process instead of something they caught up on later.',
        ],
      },
      {
        id: 'b-first-answer',
        stone: 2,
        stage: 'Process',
        title: 'Starting with the spreadsheet problem',
        body: [
          'The first problem we could put a number on was the work happening the morning after move-in. At a 300-resident property, staff spent around eight hours transferring spreadsheet entries into Entrata.',
          'I initially designed an agent that could match spreadsheet rows to leases and show staff what it had found before making any changes.',
          'But after visiting properties, I realized the bigger problem wasn’t the morning-after cleanup. It was that Entrata wasn’t being used while residents were actually moving in. Making the spreadsheet process faster would help, but it wouldn’t solve the underlying issue.',
          'I kept the upload tool as a way to catch up the next morning and shifted the main focus to a mobile move-in experience.',
        ],
        figures: [
          {
            src: withBase('/work/csv-move-in-agent/01-preflight.png'),
            alt: 'Bulk Move-In review after an upload: 277 will be moved in, 30 have follow-up tasks, and 23 unresolved rows, with J. Smith in A-102 listed as an ambiguous name match.',
            caption:
              'Before anything was written to Entrata, the upload separated residents ready to move in from those needing follow-up or further review.',
            layout: 'wide',
          },
        ],
      },
      {
        id: 'b-wrong-first',
        stone: 4,
        stage: 'Process',
        title: 'Research changed my assumptions',
        body: [
          'My first spec was built around three assumptions: QR scanning would be the primary way to find residents, open optional items would prevent a move-in, and offline support could come in a later release.',
          'Site visits at three properties and interviews with about 20 operators challenged all three.',
          'Staff described finding residents by name and unit, not by scanning a code. Optional items couldn’t hold up hundreds of residents waiting in line. And with unreliable Wi-Fi in breezeways, offline support wasn’t something we could put off.',
          'I rewrote the requirements within 48 hours.',
        ],
        table: {
          headers: ['My initial approach', 'What I changed and why'],
          rows: [
            [
              'Name-only search',
              'Added unit search because staff often moved roommates in back to back.',
            ],
            [
              'Offline in a later release',
              'Made offline support part of the first release, with the next 30 days of move-ins cached on the device.',
            ],
            [
              'A large offline banner',
              'Replaced it with a small Offline chip. A large banner looked fine in a mockup but would likely be ignored in a busy outdoor setting.',
            ],
            [
              'A manager PIN override',
              'Removed the override from the first release. It would be too easy to use as a shortcut during a busy Saturday.',
            ],
          ],
        },
      },
      {
        id: 'b-search-first',
        stage: 'Process',
        title: 'Making search the first thing staff see',
        body: [
          'The first SwiftUI build opened directly to a QR scanner, with search tucked behind a button at the bottom.',
          'But that didn’t match how operators actually worked. They were looking for someone by name and unit, so I made the resident roster the first screen and moved QR scanning to an icon in the header.',
        ],
        figures: [
          {
            src: processImg('01-qr-scan.png'),
            alt: 'Scan QR screen with a camera viewfinder and a Search upcoming move-ins button at the bottom.',
            caption: 'The first version opened the camera, forcing staff to leave the screen whenever they needed to search.',
            layout: 'device',
          },
          {
            src: processImg('01-search-roster.png'),
            alt: 'Upcoming Move-ins roster with a search field for name, unit, or email, and a QR icon in the header.',
            caption: 'I moved the roster and search field to the front, keeping QR scanning available as a secondary option.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-badges',
        stage: 'Process',
        title: 'Making ready residents easier to spot',
        body: [
          'In the first roster, Ready was gray while open required items were red. That meant the people who couldn’t move in were getting the most visual attention.',
          'For an express move-in line, that was backwards. I made Ready green and changed the other states to neutral gray so staff could quickly spot who was good to go.',
        ],
        figures: [
          {
            src: processImg('03-badges-before.png'),
            alt: 'Roster with gray Ready badges and red badges for required items still open.',
            caption: 'The original colors drew attention to blockers instead of residents who were ready.',
            layout: 'device',
          },
          {
            src: processImg('03-badges-after.png'),
            alt: 'Roster with green Ready badges and neutral gray badges for open items.',
            caption: 'The updated colors made ready residents much easier to spot at a glance.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-success',
        stage: 'Process',
        title: 'Confirming a move-in without slowing things down',
        body: [
          'I explored three versions of the confirmation message after a move-in.',
          'A custom toast let staff move straight to the next resident. A native system alert felt familiar, but required staff to tap OK before continuing. That extra step would quickly add up when hundreds of people were waiting.',
          'I went back to the toast and added automatic dismissal so staff could keep working without another tap.',
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
            caption: 'The system alert required staff to tap OK before searching for the next resident.',
            layout: 'device',
          },
          {
            src: processImg('02-confirm-autodismiss-toast.png'),
            alt: 'Later roster with a Move-in confirmed toast that dismisses on its own.',
            caption: 'The final version automatically dismissed the confirmation and returned staff to the roster.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-optional-warning',
        stage: 'Process',
        title: 'Handling optional items without holding up move-in',
        body: [
          'Even after optional items stopped blocking a move-in, the screen still made them look like a problem.',
          'An orange warning at the top of the screen and a separate escalation button competed with the main Move in action. I changed the warning to a quieter note and moved the follow-up action below the primary button. The final approach is shown in the Solution section.',
        ],
        figures: [
          {
            src: processImg('03-optional-alert-before.png'),
            alt: 'Morgan Diaz summary with an orange warning about optional follow-up items and side-by-side Create escalation task and Move in buttons.',
            caption:
              'The warning and competing buttons made a resident who was ready to move in look like an exception.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-offline-chip',
        stage: 'Process',
        title: 'Showing staff when they’re working offline',
        body: [
          'The cached roster already worked without a network connection, but there was no indication on screen that the device was offline.',
          'Staff needed to know whether a move-in had actually synced with Entrata or was still waiting on the device. I added a small status chip showing the Offline state and the number of confirmations waiting to sync.',
        ],
        figures: [
          {
            src: processImg('05-offline-before.png'),
            alt: 'Roster with no indication of network status.',
            caption: 'Before, the offline roster looked exactly like the online version.',
            layout: 'device',
          },
          {
            src: processImg('05-offline-chip-swift.png'),
            alt: 'Roster with an Offline, 2 queued chip above the title.',
            caption:
              'The updated version clearly shows when the device is offline and how many move-ins are waiting to sync.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-path',
        stone: 6,
        stage: 'Solution',
        title: 'Search, Review, Confirm',
        body: [
          'The final flow follows the way staff already handled move-in day. Search for the resident by name, take a quick look at their checklist, verify their photo ID, and confirm the move-in.',
          'What previously required navigating desktop Entrata or spending hours catching up the next morning could now be done in seconds.',
          'The Ready badge also reflects a process operators were already using. Many properties had an express line for residents who were ready and a separate line for those with outstanding items. The roster brings that process into the product.',
        ],
        figures: [
          {
            src: img('01-roster.png'),
            alt: 'Upcoming Move-ins roster with search, a date filter, and Ready, Optional, Required, and Blocked badges.',
            caption: 'Staff can see who’s ready to move in without opening every resident’s profile.',
            layout: 'device',
          },
          {
            src: img('02-summary.png'),
            alt: 'Riley Foster resident summary showing a complete checklist, a Ready badge, and a Move in button.',
            caption: 'For a ready resident, staff only need a quick checklist review before continuing.',
            layout: 'device',
          },
          {
            src: img('03-confirm.png'),
            alt: 'Confirm Move-in screen with a Verify ID callout and a Confirm Move-in button.',
            caption: 'The confirmation screen puts the photo ID check front and center before staff complete the move-in.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-edges',
        stage: 'Solution',
        title: 'Handling blockers and exceptions',
        body: [
          'Previously, open optional items could get lost once a resident was moved in. The new flow lets staff complete the move-in and create a follow-up task so those items can be handled after the rush.',
          'Required items normally prevent a move-in, and those residents are sent to a resolution station. There is one exception for offline situations.',
          'If staff are offline and have completed the required checklist items on their end, they can use Save move-in for sync to queue the move-in on the device. Once the device reconnects, Entrata attempts to process it. If the system detects a conflict, the resident is flagged for attention. Staff can then review the issue and, if they’ve verified that the required items were completed, override the status and mark the resident ready to move in.',
          'This gives staff a way to keep the line moving without losing the checks that protect the process.',
        ],
        figures: [
          {
            src: img('06-summary-optional-open.png'),
            alt: 'Morgan Diaz summary with optional items still open and two actions: Move in, or Move in and create escalation.',
            caption: 'Optional items can remain open without preventing the resident from moving in.',
            layout: 'device',
          },
          {
            src: img('08-summary-required-blocked.png'),
            alt: 'Jamie Baker summary showing required checklist items still need attention, with Move in unavailable.',
            caption: 'Required items still need to be resolved before a standard move-in can be completed.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-offline',
        stage: 'Solution',
        title: 'Building for unreliable Wi-Fi from day one',
        body: [
          'Staff use company iPads in breezeways where Wi-Fi isn’t always reliable. The app caches the next 30 days of move-ins before staff head outside.',
          'When the connection drops, the home screen simplifies to focus on Move-In. Staff can still search the roster and complete confirmations, which are queued on the device until a connection is restored.',
        ],
        figures: [
          {
            src: img('13-home-offline.png'),
            alt: 'Command Center home while offline, showing an offline message and Move-In as the only Quick Action.',
            caption:
              'When offline, the home screen displays a short status message and keeps Move-In as the only Quick Action.',
            layout: 'device',
          },
          {
            src: img('10-roster-offline.png'),
            alt: 'Upcoming Move-ins roster showing an Offline status chip instead of Synced.',
            caption: 'The Offline chip lets staff know their changes are waiting to sync.',
            layout: 'device',
          },
        ],
      },
      {
        id: 'b-handoff',
        stone: 7,
        stage: 'Solution',
        title: 'Getting the prototype ready for engineering',
        body: [
          'I first worked through the flow and its different states in an Expo prototype. From there, I rebuilt it as a SwiftUI package with a demo target that the OXP mobile team could drop into their app.',
          'During a review, the team found five actual defects in about 30 minutes. I made the fixes that same day.',
          'The rewrite took additional time, but it gave the native team something they could actually run and review instead of just a collection of Figma frames.',
        ],
      },
      {
        id: 'b-outcome',
        stage: "What's next",
        title: 'Measuring whether it worked',
        body: [
          'The pilot hasn’t happened yet, so these are the targets I’d use to evaluate the solution. The biggest measure is same-day completion. If that number stays close to 21%, we’re not solving the problem.',
        ],
        table: {
          headers: ['Metric', 'Starting point', 'Target'],
          rows: [
            [
              'Same-day completion at pilot properties',
              'About 21% processed in Entrata on move-in day',
              '95% or more',
            ],
            ['Move-ins caught up the next morning', 'About 36%', 'Near zero'],
            [
              'Staff overtime during turn',
              'About 8 hours of re-keying at a 300-resident property',
              'Down 60%',
            ],
            [
              'Time to process a resident at the table',
              'About 90 seconds, anecdotal',
              'Under 20 seconds',
            ],
            [
              'Mobile app adoption at pilot properties',
              'New mobile move-in workflow',
              'Majority of move-ins completed in real time through the app',
            ],
          ],
        },
      },
      {
        id: 'b-reflection',
        stage: "What's next",
        title: 'What I’d do differently',
        bullets: [
          'I’d make offline support part of the first release from the beginning, rather than waiting for interviews to surface how important it was.',
          'I’d bring an engineering partner into the process by the end of the first week. Waiting until week three meant I learned about constraints in the live app later than I should have.',
          'I’d move to SwiftUI earlier. Expo was useful for working through the different states and interactions, but SwiftUI was the better choice for the native team’s final review.',
        ],
      },
    ],
    sibling: moveInScannerCase.sibling,
    nextCaptures: moveInScannerCase.nextCaptures,
  },
};
