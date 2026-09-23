import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/move-in-scanner/${file}`);

export const moveInScannerCase: RichCaseStudy = {
  slug: 'move-in-scanner',
  openingClaim:
    'On student move-in day, a hundred to five hundred people show up at a breezeway table, the office, or a drive-through. Staff take a name and an ID, hand over keys, and the resident walks away feeling finished — while Entrata, the property’s system of record, often still has no idea they moved in. I designed a search-first mobile flow for that line, including when Wi-Fi is down: find the person, see if their checklist is ready, confirm a photo ID, and go on to the next student. Optional leftovers become a follow-up task instead of disappearing, and we handed Entrata’s OXP mobile team a native iOS module they could drop into the staff app they already ship.',
  collaborators:
    'Customer Workflows engineering, the OXP mobile team, about 20 student-housing operators from industry interviews, and Entrata’s data team',
  surface: 'A SwiftUI module inside Entrata’s OXP staff iOS app, shipped as a package with a demo target',
  heroFigure: {
    src: img('00-hero-three-up.png'),
    alt: 'Three phone screens from the move-in prototype: the upcoming roster, Riley Foster’s ready summary, and the confirm step.',
    caption:
      'These three screens are the table path: the roster of people due to move in, a resident who is ready, and the confirm step. They come from the Expo prototype we used to argue the flow before we rewrote it in SwiftUI for the native iOS team.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      title: 'Residents left with keys. The system of record did not.',
      body: [
        'Peak student turn is a full-day operation. Properties move in anywhere from about 100 to more than 500 residents, and staff set up in a breezeway, pull people through the office, or run a drive-through that stuck around after COVID because it kept the line moving. Wi-Fi is unreliable where they stand. The next few days are hectic too, because most of the work in Entrata still has not happened.',
        'Two workarounds showed up over and over. When they stayed offline, staff found the student on a spreadsheet, marked them moved in, handed over keys and a packet, and had almost no live view of the move-in checklist — the list of required and optional items that says whether someone is actually prepared. When they tried to stay online, they opened Entrata on a laptop, an iPad, or a phone. The web product is not built for that surface. It asks them to review a full profile, extra steps that student turn does not have time for, because readiness was supposed to be handled in advance.',
        'By the time someone is in line, staff should be able to see ready or not ready at a glance, then either move them in or send them to a different line. The old table did not give them that. Residents felt moved in. Entrata did not.',
        'A May through August 2025 audit at a large student operator made the scale visible. Only about one in five student move-ins hit Entrata in real time on the day. About a third had zero activity in the window and got caught up overnight. Bulk Move-In, the existing desktop tool for processing many residents at once, barely showed up in peak months. More training on desktop was not going to change a day built around staying offline until the line was gone.',
      ],
      metrics: [
        {
          value: '~21%',
          label: 'Student move-ins processed in Entrata in real time on move-in day',
        },
        {
          value: '~36%',
          label: 'Move-ins with zero Entrata activity in the window, then caught up overnight',
        },
        {
          value: '~0%',
          label: 'Peak-month use of desktop Bulk Move-In at the largest operator in the set',
        },
      ],
    },
    {
      id: 'evidence',
      title: 'Site visits and operator interviews broke the first spec',
      body: [
        'The first spec assumed a QR code would lead — staff would scan a code on the resident’s phone — and that optional checklist items could wait for a later pass. Site visits at three properties pointed somewhere else: printed rolls, laptop sheets, and physical packets. At one site, roughly one in three residents hit a resell or exception path we had not modeled.',
        'Notes from an industry interview with about 20 operators forced the bigger resets. Search had to come before QR. Optional items should not block the line; they become an internal follow-up. Offline belongs in the first release, not a later milestone. I rewrote the product requirements within 48 hours of that feedback.',
        'SQL work across ten queries sized how unused Bulk Move-In really was, and looked at whether checklist completion went with renewals. That second link stayed directional. I would not treat it as proof that a complete checklist causes someone to renew.',
      ],
      table: {
        headers: ['What we looked at', 'What it changed'],
        rows: [
          [
            'Site visits at three properties',
            'A nicer Entrata screen alone would not win the table. The spreadsheet was the working product, and we had undercounted how often someone hit an exception.',
          ],
          [
            'Discovery write-up',
            'Bulk tooling can hide residents who are not actually ready. Future to Current — flipping a lease from an upcoming status to a current one — is a staff judgment call, not a silent status change.',
          ],
          [
            'Industry interviews with about 20 operators',
            'Search first. Optional items become a follow-up instead of blocking the line. Offline in the first release. I rewrote the requirements in two days.',
          ],
          [
            'Ten SQL queries on production data',
            'We could finally put a size on unused Bulk Move-In. The link between checklist completion and renewals stayed directional, not causal.',
          ],
        ],
      },
      callout:
        'Operators already ran an express line and a cleanup line by hand. Ready residents grab keys and go; everyone else gets routed. The Ready badge on the roster is that existing rule on a screen, not a new policy we invented.',
    },
    {
      id: 'strategy',
      title: 'The next-day upload and the table app are not the same product',
      body: [
        'Bulk Move-in Smart Upload and this mobile flow recover the same gap on different clocks. The upload accepts the workaround: keep the spreadsheet or the photo of the paper, then process everyone the next day. This app is the day itself — name and ID at the table, even with no Wi-Fi.',
        'Treating “automated student move-in” as one program would have stalled both. We split them. Homebody, a separate resident-facing effort, kept readiness and QR on the student side. This module only covers staff at the table. The trade-off was two products to explain. It was still worth it, because neither had to wait on the other’s rollout.',
      ],
      table: {
        headers: ['Workstream', 'What it is for'],
        rows: [
          ['Bulk Move-in Smart Upload', 'The next day: turn a spreadsheet into Entrata records.'],
          ['Homebody Move-In Readiness', 'Help the resident get ready, including a QR code they can show.'],
          ['OXP Move-In Day Execution', 'Staff at the table. This case.'],
          ['Resident Readiness AI', 'Nudges before turn. Thinner artifacts, not this product.'],
        ],
      },
    },
    {
      id: 'entry',
      title: 'Move-in had to live on the home screen staff already open',
      body: [
        'Move-In sits on Command Center as a Quick Action, on the same home screen staff already open in the field. We talked about burying it under lease admin so it would match the desktop information architecture. That would have failed the breezeway job, so we kept it on the home surface.',
      ],
      figures: [
        {
          src: img('04-home-move-in-quick-action.png'),
          alt: 'OXP Command Center home with Move-In listed among Quick Actions.',
          caption:
            'Staff start from the same home screen they already use for packages and work orders. Move-In is a Quick Action, not a buried lease-admin screen.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'flow',
      title: 'The table path is a name, a checklist, confirm, then the next person',
      body: [
        'The path is meant to match how the line already runs. Staff open upcoming move-ins, type a name, and open the resident. The checklist shows required versus optional, and complete versus still open. If the required items are done, they can move the person in. They confirm a photo ID, glance at a few move-in details, and tap confirm. A short success message appears, then the roster is ready for the next student.',
        'That used to take several minutes in desktop Entrata, or it did not happen until overtime. Here it is seconds. Student turn does not need a full profile review at the table. Preparedness already lives on the checklist. Ready or not ready is the decision.',
        'QR is still a secondary path for later, once resident-side readiness is live. Operators described the line as “Smith, 315,” not “hold still for the camera.” The screens below are from the Expo prototype. We later rebuilt the same paths in SwiftUI for the native team.',
      ],
      figures: [
        {
          src: img('01-roster.png'),
          alt: 'Upcoming Move-ins roster with search, a date filter, and Ready, Optional, Required, and Blocked badges.',
          caption:
            'The roster of upcoming move-ins is cached for the next 30 days, so it is already on the device when staff walk outside.',
          layout: 'device',
        },
        {
          src: img('05-search-name.png'),
          alt: 'Search results for Foster showing Riley Foster on the upcoming move-ins roster.',
          caption:
            'Staff type the name they just heard. Search is the primary control, not a camera scan.',
          layout: 'device',
        },
        {
          src: img('02-summary.png'),
          alt: 'Riley Foster resident summary showing a complete checklist, a Ready badge, and a Move in button.',
          caption:
            'Required versus optional is visible on the checklist. If required work is done, Move in is available, and Ready is the express-line signal.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'confirm',
      title: 'Confirm stays short so the next person can start',
      body: [
        'Confirm is short on purpose. Staff check that the government ID matches, glance at the property, unit, date, and whether the lease should flip from Future to Current, then tap confirm. A success message lands on the roster so the next student can start immediately.',
      ],
      figures: [
        {
          src: img('03-confirm.png'),
          alt: 'Confirm Move-in screen with a Verify ID callout and a Confirm Move-in button.',
          caption:
            'Photo ID sits above the button. Move-in details stay short — property, unit, date, and Future to Current — then confirm.',
          layout: 'device',
        },
        {
          src: img('12-success-toast.png'),
          alt: 'Upcoming Move-ins roster with a success message that the move-in was confirmed.',
          caption:
            'A short confirmation appears, then the roster is ready for the next person in line.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'prototype',
      title: 'Walk the same path staff would use at the table',
      body: [
        'This is the Expo prototype we used before rewriting the flow in SwiftUI. Open Move-In from Quick Actions, search a name, then walk a Ready resident through confirm. Optional items still let you move in. Required items stop the line.',
      ],
      embed: {
        src: withBase('/prototypes/oxp-mobile/'),
        title: 'Interactive OXP Move-In Scanner prototype',
        caption:
          'Start on Home. Open Move-In from Quick Actions, search Foster, then confirm Riley Foster.',
        hint: 'Use the settings beside the phone. Toggle Network to Offline to see home collapse to Move-In, then keep moving people in from the cache.',
      },
    },
    {
      id: 'search',
      title: 'Searching a unit has to bring the roommates back together',
      body: [
        'Student units are beds, not single apartments. Searching “204” has to return everyone on that unit, not one name and a dead end.',
        'We almost shipped name-only search first. Operator feedback shut that down. Staff process roommates back to back, and retyping between beds is where wrong-unit mistakes happen.',
      ],
      figures: [
        {
          src: img('05-search-unit-roommates.png'),
          alt: 'Search results for unit 204 showing Jamie Baker and Jordan Lee as roommates in Building A, Unit 204.',
          caption:
            'A search for “204” returns two residents on the same unit, each with their own readiness state, so staff can process roommates back to back.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'escalation',
      title: 'Optional leftovers used to disappear after confirm',
      body: [
        'The first draft treated incomplete checklist items as blockers. Industry interviews pushed back hard. Optional follow-ups cannot hold the line when a couple hundred people are outside.',
        'If required items are done and a couple of optional items are still open, staff can still move the resident in. They can also create an escalation — a task on their own list — so someone comes back to those items after the rush. There is no text to the resident and no assignment in the resident portal. The line keeps moving.',
        'Before this, optional items that were still open at confirm went into a void. Once the person was moved in, there was no reliable way to know whether those non-required items ever got done. The task is the tracking system that was missing, not extra policy on move-in day.',
      ],
      figures: [
        {
          src: img('06-summary-optional-open.png'),
          alt: 'Morgan Diaz summary with optional items still open and two actions: Move in, or Move in and create escalation.',
          caption:
            'Required work is complete and optional work is not. Move in stays available. Staff can create an escalation if they want a reminder after the rush.',
          layout: 'device',
        },
        {
          src: img('07-confirm-escalation.png'),
          alt: 'Confirm screen for a move-in that also creates an escalation task.',
          caption:
            'Confirm can also create an escalation. That is an internal task for staff, not a to-do sent to the resident.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'blocked',
      title: 'Required items still stop the line',
      body: [
        'Required items are different. There is no override in the first release. Staff send the resident to a resolution station, or tell them to come back when the item is done, which matches how operators already route exceptions when one person on site can clear them.',
        'Hard blockers such as a unit that is not ready or a balance due use the same stop. We debated a manager PIN override and left it out. It would be too easy to burn on a busy Saturday, and interviews said properties already have a permissioned person for that job offline.',
      ],
      figures: [
        {
          src: img('08-summary-required-blocked.png'),
          alt: 'Jamie Baker summary showing required checklist items still need attention, with Move in unavailable.',
          caption:
            'Required items are still open, so Move in is unavailable. Staff pull that person off the express line.',
          layout: 'device',
        },
        {
          src: img('09-summary-hard-blocked.png'),
          alt: 'Taylor Anderson summary showing a hard Blocked state with validation errors.',
          caption:
            'A hard Blocked state lists the validation errors. The table path ends here until someone who can clear them takes over.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'offline',
      title: 'Offline had to be part of the first release, not a later milestone',
      body: [
        'I originally had offline on a later cut. Industry interviews corrected that: breezeway Wi-Fi fails often, and staff are on company iPads, not personal phones. The roster for the next 30 days of move-ins is cached on the device before they walk outside.',
        'When the network is down, Command Center drops to Move-In and a short offline note. Everything else can wait. The roster still searches. Confirms still queue. A small Offline chip stays visible so nobody wonders whether they are writing to Entrata live or to the cache.',
      ],
      figures: [
        {
          src: img('13-home-offline.png'),
          alt: 'Command Center home while offline, showing an offline message and Move-In as the only Quick Action.',
          caption:
            'When the device is offline, home shows a short message and Move-In. The rest of Command Center is not the job at the table.',
          layout: 'device',
        },
        {
          src: img('10-roster-offline.png'),
          alt: 'Upcoming Move-ins roster showing an Offline status chip instead of Synced.',
          caption:
            'The same roster stays searchable against the cache. An Offline chip makes the state obvious without blocking the work.',
          layout: 'device',
        },
        {
          src: img('11-summary-offline.png'),
          alt: 'Resident summary with an Offline status chip while reviewing the checklist.',
          caption:
            'Checklist review and confirm still work while offline. The writes wait for a network.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'decisions',
      title: 'These are the choices that held after the research',
      table: {
        headers: ['What we chose', 'Why, and what we dropped'],
        rows: [
          [
            'Search first, QR second',
            'The line sounds like a name plus a unit. A QR scan waits until resident-side readiness is actually in use.',
          ],
          [
            'A unit search returns everyone on the unit',
            'Staff process roommates back to back. Name-only search was the tempting shortcut and the source of wrong-unit mistakes.',
          ],
          [
            'Required versus optional on the roster, summary, and confirm',
            'If only the confirm screen knew the difference, the roster would lie about who was actually ready.',
          ],
          [
            'An escalation task instead of a void',
            'Optional leftovers used to disappear after move-in. The task is how staff come back to them.',
          ],
          [
            'Offline in the first release, with a 30-day cache and a quiet chip',
            'A large offline banner looked safer in mocks and would have been ignored outdoors.',
          ],
          [
            'Ready reads louder than blockers',
            'The express line needs the green path to win a glance. An error-first screen slowed the people we wanted to move fastest.',
          ],
          [
            'Skip the full profile at the table',
            'Desktop Entrata asked for a review that student turn does not have time for. The checklist is the readiness signal.',
          ],
        ],
      },
    },
    {
      id: 'handoff',
      title: 'The mobile team got a module they could run, not a deck of screens',
      body: [
        'Flow work started in Expo against the OXP design system so we could change states quickly. Expo is a way to prototype on a phone without writing native iOS first. Final handoff was a SwiftUI package plus a demo target for the in-house OXP mobile team to drop into the live app.',
        'That order cost us a rewrite, but it meant the mobile team could walk every path in a runnable module. Their review found five real defects in about half an hour: alert copy, the count pill, the property filter, and the cache and sync indicators. They made small changes to fit the app, and the fixes went back the same day.',
      ],
      bullets: [
        'Escalation rules are written down: optional items allow move-in and can create a follow-up task; required items block and redirect.',
        'Offline behavior is specified: a 30-day cached roster, queued writes, home collapsed to Move-In, and a status chip instead of a blocking modal.',
        'We left out of the first release on purpose: nudges to the resident about optional items, expired-QR demos, and a manager PIN override.',
      ],
    },
    {
      id: 'outcome',
      title: 'Pilot results are not in yet. These are the goals.',
      body: [
        'What we left behind was a scoped table-side flow with offline and follow-up rules the OXP mobile team could implement. It is not a shrunk desktop Bulk Move-In screen, and it is not a next-day spreadsheet upload wearing phone chrome.',
        'Initiative targets are shared with Bulk Move-in Smart Upload and Homebody readiness. Pilot actuals are not in yet. Until they are, these are goals, not results.',
      ],
      table: {
        headers: ['Metric', 'Target (unmeasured)'],
        rows: [
          ['Same-day completion at pilot properties', '95%+'],
          ['Staff overtime during turn', '–60%'],
          ['Median time from next-in-line to the correct record', 'Under 10 seconds'],
          ['Time to process someone at the table', 'Under 20 seconds (anecdotal baseline was about 90 seconds)'],
          ['Share of pilot move-ins done on the device', '30%+'],
          ['Wrong-resident incidents', '0'],
        ],
      },
    },
    {
      id: 'reflection',
      title: 'What I would change if we started again',
      bullets: [
        'I would put offline in the first release from week one. Waiting until industry interviews forced it wasted sequencing time.',
        'I would bring the delivery engineering partner in by the end of week one. Week three was too late to learn the constraints of the live app shell.',
        'I would bias to SwiftUI earlier for an iOS mobile-team audience. Expo was useful for arguing about states, but it was the wrong artifact to hand a native team for final review.',
      ],
    },
  ],
  sibling: {
    href: '/work/csv-move-in-agent',
    label: 'Bulk Move-in Smart Upload, the next-day spreadsheet bridge',
  },
  nextCaptures: [
    'More card: Caching to Offline ready to Syncing N',
    'Queued “N to sync” chip after an offline confirm',
    '60–90s happy-path walkthrough',
  ],
};
