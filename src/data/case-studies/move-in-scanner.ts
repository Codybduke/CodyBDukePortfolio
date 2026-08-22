import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/move-in-scanner/${file}`);

export const moveInScannerCase: RichCaseStudy = {
  slug: 'move-in-scanner',
  openingClaim:
    'Student move-in day is long, loud, and unfinished. A hundred to five hundred residents show up at a breezeway table, the office, or a drive-through. Staff take a name and an ID, then either hunt the person in desktop Entrata on a phone, or mark a spreadsheet and do the real move-ins later. The resident leaves with keys. Entrata does not. I designed a search-first, offline mobile flow for that line: find them, see if the checklist is ready, confirm photo ID, tap confirm, next person. Optional leftovers become a follow-up task instead of disappearing. We handed the OXP mobile team a SwiftUI module they could run in the existing app.',
  collaborators:
    'Customer Workflows eng, OXP mobile team, ~20 student-housing operators (Industry Group interviews), Entrata data team',
  surface: 'SwiftUI module for Entrata’s OXP staff iOS app (Swift Package + demo target)',
  heroFigure: {
    src: img('00-hero-three-up.png'),
    alt: 'Three phone screens from the OXP Expo prototype: Upcoming Move-ins roster, Riley Foster summary, and Confirm Move-in.',
    caption:
      'Roster, ready summary, and confirm — the table path, from the Expo prototype we used before rewriting it in SwiftUI.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      stage: 'Rough',
      title: 'The day was long. The work was still incomplete.',
      body: [
        'Peak student turn is a full-day operation. Properties move in anywhere from about 100 to 500+ residents. Staff set up in a breezeway, pull people through the office, or run a drive-through that stuck around after COVID because it kept the line moving. Wi-Fi is unreliable where they stand. The next few days are hectic too, because most of the system-of-record work still has not happened.',
        'Two workarounds showed up over and over. Offline, staff find the student on a spreadsheet, mark them moved in, hand over keys and a packet, and have almost no live view of the move-in checklist. Online, they try Entrata on a laptop, an iPad, or a phone. The web product is not built for that surface. It asks them to review a full profile — extra steps that student turn does not have time for, because readiness was supposed to be handled in advance.',
        'In a student scenario the checklist is the preparedness signal. By the time someone is in line, staff should be able to see ready or not ready in a glance, then either move them in or send them to a different line. The old table did not give them that. Residents felt moved in. Entrata did not.',
        'A May–Aug 2025 audit at a large student operator made the scale visible. Only about one in five student move-ins hit Entrata in real time on the day. About a third had zero activity in the window and got caught up overnight. Bulk Move-In barely showed up in peak months. More training on desktop was not going to change a day built around staying offline until the line was gone.',
      ],
      metrics: [
        {
          value: '~21%',
          label: 'Student move-ins processed in Entrata in real time on move-in day',
        },
        {
          value: '~36%',
          label: 'Zero Entrata activity in the move-in window (caught up overnight)',
        },
        {
          value: '~0%',
          label: 'Peak-month adoption of Bulk Move-In at the largest operator in the set',
        },
      ],
    },
    {
      id: 'evidence',
      stage: 'Evidence',
      title: 'What we got wrong first',
      body: [
        'Early specs assumed QR would lead and that optional checklist items could wait for a later pass. Site visits at three properties pointed somewhere else: printed rolls, laptop sheets, and physical packets. At one site, roughly one in three residents hit a resell or exception path we had not modeled.',
        'Notes from an Industry Group interview with about 20 operators forced the bigger resets. Search over QR. Optional items should not block the line; they become an internal follow-up. Offline belongs in MVP. I rewrote the PRD within 48 hours of that feedback.',
        'SQL work across 10 queries sized how unused Bulk Move-In really was, and looked at checklist completion versus renewals. That second link stayed directional and bias-controlled. I would not treat it as a causal claim.',
      ],
      table: {
        headers: ['Input', 'What it changed'],
        rows: [
          [
            'Site visits (3 properties)',
            'Dropped the idea that a nicer Entrata UI alone would win the table. Spreadsheet was the working product. Exception rate was under-specced.',
          ],
          [
            'Discovery write-up',
            'Caught stale assumptions: bulk tooling can hide incomplete residents; Future to Current is a staff judgment call, not a silent status flip.',
          ],
          [
            'Industry Group interviews (~20 operators)',
            'Search first. Optional items escalate instead of blocking. Offline in MVP. PRD rewrite in two days.',
          ],
          [
            'SQL (10 queries)',
            'Put a size on unused Bulk Move-In. Checklist and renewal link stayed directional.',
          ],
        ],
      },
      callout:
        'Operators already ran express versus cleanup by hand. Ready residents grab keys and go; everyone else gets routed. The roster Ready badge is that existing rule on a screen, not a new policy we invented.',
    },
    {
      id: 'strategy',
      stage: 'Decisions',
      title: 'Two clocks on the same failure',
      body: [
        'Bulk Move-in Smart Upload and mobile move-in are not the same product with extra steps. They recover the same gap on different clocks. The upload accepts the workaround: keep the spreadsheet or the photo of the paper, then process everyone the next day. This app is the day itself: name and ID at the table, even with no Wi-Fi.',
        'Treating “automated student move-in” as one program would have stalled both. We split them. Homebody kept resident readiness and QR. This module only covers staff at the table. The trade-off was two products to explain. It was still worth it, because neither had to wait on the other’s rollout.',
      ],
      table: {
        headers: ['Workstream', 'Job'],
        rows: [
          ['Bulk Move-in Smart Upload', 'Next day: spreadsheet to Entrata'],
          ['Homebody Move-In Readiness', 'Resident ready / not ready + QR'],
          ['OXP Move-In Day Execution', 'Staff at the table (this case)'],
          ['Resident Readiness AI', 'Pre-turn nudges (thinner artifacts)'],
        ],
      },
    },
    {
      id: 'entry',
      stage: 'Making',
      title: 'Where staff start',
      body: [
        'Move-In sits on Command Center as a Quick Action, on the same home staff already open in the field. We talked about burying it under lease admin to match desktop IA. That would have failed the breezeway job, so we kept it on the home surface.',
      ],
      figures: [
        {
          src: img('04-home-move-in-quick-action.png'),
          alt: 'OXP Command Center home with Move-In listed among Quick Actions.',
          caption: 'Home to Move-In. The table path starts from the same screen as packages and work orders.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'flow',
      stage: 'Making',
      title: 'Name, checklist, confirm, next',
      body: [
        'The path is meant to match how the line already runs. Open upcoming move-ins. Type a name. Open the resident. The checklist shows required versus optional, complete versus still open. If the required items are done, they can move in. Confirm photo ID, glance at move-in details, tap confirm. A short success message, then the roster is ready for the next student.',
        'That used to take several minutes in desktop Entrata, or it did not happen until overtime. Here it is seconds. Student turn does not need a full profile review at the table. Preparedness already lives on the checklist. Ready or not ready is the decision.',
        'QR is still a secondary path for later, once resident-side readiness is live. Operator interviews described the line as “Smith, 315,” not “hold still for the camera.” The screens below are from the Expo prototype. We later rebuilt the same paths in SwiftUI.',
      ],
      figures: [
        {
          src: img('01-roster.png'),
          alt: 'Upcoming Move-ins roster with search, date filter, and Ready / Optional / Required / Blocked badges.',
          caption:
            'Upcoming move-ins, cached for the next 30 days, so the roster is already on the device when staff walk outside.',
          layout: 'device',
        },
        {
          src: img('05-search-name.png'),
          alt: 'Search results for Foster showing Riley Foster on the upcoming move-ins roster.',
          caption: 'Type the name they just heard. Search is the primary control, not a scan.',
          layout: 'device',
        },
        {
          src: img('02-summary.png'),
          alt: 'Riley Foster resident summary showing complete checklist and Ready badge with Move in CTA.',
          caption:
            'Required versus optional on the checklist. If required is done, Move in is available. Ready is the express signal.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'confirm',
      stage: 'Making',
      title: 'Photo ID, then the next person',
      body: [
        'Confirm stays short on purpose. Check that the government ID matches, glance at property, unit, date, and Future to Current, then tap confirm. A success message lands on the roster so the next student can start immediately.',
      ],
      figures: [
        {
          src: img('03-confirm.png'),
          alt: 'Confirm Move-in screen with Verify ID callout and Confirm Move-in button.',
          caption:
            'Photo ID sits above the button. Move-in details stay short — property, unit, date, Future to Current — then confirm.',
          layout: 'device',
        },
        {
          src: img('12-success-toast.png'),
          alt: 'Upcoming Move-ins roster with a success toast that the move-in was confirmed.',
          caption: 'Short confirmation, then the roster is ready for the next person in line.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'prototype',
      stage: 'Making',
      title: 'Walk the table path',
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
      stage: 'Making',
      title: 'Roommates have to come back together',
      body: [
        'Student units are beds. Searching “204” has to return everyone on that unit, not one name and a dead end.',
        'We almost shipped name-only search first. Operator feedback shut that down. Staff process roommates back to back, and retyping between beds is where wrong-unit mistakes happen.',
      ],
      figures: [
        {
          src: img('05-search-unit-roommates.png'),
          alt: 'Search results for unit 204 showing Jamie Baker and Jordan Lee as roommates in Bldg A · Unit 204.',
          caption: 'Search for “204” returns two residents on the same unit, each with their own readiness state.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'escalation',
      stage: 'Decisions',
      title: 'Optional leftovers used to disappear',
      body: [
        'The first draft treated incomplete checklist items as blockers. Industry Group feedback pushed back hard. Optional follow-ups cannot hold the line when a couple hundred people are outside.',
        'If required items are done and a couple of optional items are still open, staff can still move the resident in. They can also create an escalation — a task on their own list — so someone comes back to those items after the rush. No resident SMS. No portal assignment. The line keeps moving.',
        'Before this, optional items that were still open at confirm went into a void. Once the person was moved in, there was no reliable way to know whether those non-required items ever got done. The task is the tracking system that was missing, not extra policy on move-in day.',
      ],
      figures: [
        {
          src: img('06-summary-optional-open.png'),
          alt: 'Morgan Diaz summary with optional items open notice and dual CTAs: Move in, and Move in and create escalation.',
          caption:
            'Required is complete, optional is not. Move in stays available. Create escalation if you want the reminder.',
          layout: 'device',
        },
        {
          src: img('07-confirm-escalation.png'),
          alt: 'Confirm screen for move-in with create escalation action.',
          caption: 'Confirm and create escalation — an internal task, not a resident-facing to-do.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'blocked',
      stage: 'Decisions',
      title: 'Required still means stop',
      body: [
        'Required items are different. There is no override in MVP. Staff send the resident to a resolution station, or tell them to come back when the item is done, which matches how operators already route exceptions when one person on site can clear them.',
        'Hard blockers such as unit not ready or balance due use the same stop. We debated a manager PIN override and left it out. It would be too easy to burn on a busy Saturday, and interviews said properties already have a permissioned person for that job offline.',
      ],
      figures: [
        {
          src: img('08-summary-required-blocked.png'),
          alt: 'Jamie Baker summary showing required checklist items still need attention with Move in unavailable.',
          caption: 'Required items still open, so Move in is unavailable. Pull them off the express line.',
          layout: 'device',
        },
        {
          src: img('09-summary-hard-blocked.png'),
          alt: 'Taylor Anderson summary showing hard Blocked state with validation errors.',
          caption: 'Hard Blocked state with validation errors listed. The table path ends here.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'offline',
      stage: 'Decisions',
      title: 'Offline had to be the day, not a later milestone',
      body: [
        'I originally had offline on a later cut. Industry Group feedback corrected that: breezeway Wi-Fi fails often, and staff are on company iPads, not personal phones. The roster for the next 30 days of move-ins is cached on the device before they walk outside.',
        'When the network is down, Command Center drops to Move-In and a short offline note. Everything else can wait. The roster still searches. Confirms still queue. A small Offline chip stays visible so nobody wonders whether they are writing to Entrata live or to the cache.',
      ],
      figures: [
        {
          src: img('13-home-offline.png'),
          alt: 'Command Center home while offline, showing an offline message and Move-In as the only Quick Action.',
          caption: 'Offline home: the message, then Move-In. The rest of Command Center is not the job at the table.',
          layout: 'device',
        },
        {
          src: img('10-roster-offline.png'),
          alt: 'Upcoming Move-ins roster showing Offline status chip instead of Synced.',
          caption: 'Same roster, Offline chip, still searchable against the cache.',
          layout: 'device',
        },
        {
          src: img('11-summary-offline.png'),
          alt: 'Resident summary with Offline status chip while reviewing checklist.',
          caption: 'Checklist and confirm still work. Writes wait for a network.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'decisions',
      stage: 'Decisions',
      title: 'What we chose instead',
      table: {
        headers: ['Choice', 'Why / what we dropped'],
        rows: [
          [
            'Search first; QR second',
            'The line sounds like name plus unit. QR waits on resident-side readiness adoption.',
          ],
          [
            'Unit search returns the whole unit',
            'Roommate batching. Name-only search was the tempting shortcut.',
          ],
          [
            'Required vs optional on roster, summary, and confirm',
            'If only confirm knew the difference, the roster would lie.',
          ],
          [
            'Escalation task, not a void',
            'Optional leftovers used to disappear after move-in. The task is how staff come back to them.',
          ],
          [
            'Offline in MVP, 30-day cache, quiet chip',
            'Banner designs looked safer in mocks and would have been ignored outdoors.',
          ],
          [
            'Ready reads louder than blockers',
            'Express line needs the green path to win a glance. Error-first UI slowed the wrong people.',
          ],
          [
            'Skip the full profile at the table',
            'Desktop Entrata asked for a review student turn does not have time for. Checklist is the readiness signal.',
          ],
        ],
      },
    },
    {
      id: 'handoff',
      stage: 'Polished',
      title: 'What the mobile team got',
      body: [
        'Flow work started in Expo against the OXP design system so we could change states quickly. Final handoff was a SwiftUI package plus a demo target for the in-house OXP mobile team to drop into the live shell.',
        'That order cost us a rewrite, but it meant the mobile team could walk every path in a runnable module. Their review found five real defects in about half an hour: alert copy, the count pill, property filter, and cache and sync indicators. They made small changes to fit the app, and the fixes went back the same day.',
      ],
      bullets: [
        'Escalation rules written down: optional items allow move-in plus create a follow-up task; required items block and redirect.',
        'Offline behavior: 30-day cached roster, queued writes, home collapsed to Move-In, and a status chip instead of a blocking modal.',
        'Left out of MVP on purpose: resident-facing optional nudges, expired-QR demos, and a manager PIN override.',
      ],
    },
    {
      id: 'outcome',
      stage: 'Polished',
      title: 'Where it stands',
      body: [
        'What we left behind was a scoped table-side flow with offline and follow-up rules the OXP mobile team could implement, not a shrunk desktop Bulk Move-In screen, and not a next-day CSV upload wearing a phone chrome.',
        'Initiative targets are shared with Bulk Move-in Smart Upload and Homebody readiness. Pilot actuals are not in yet. Until they are, these are goals, not results.',
      ],
      table: {
        headers: ['Metric', 'Target (unmeasured)'],
        rows: [
          ['Same-day completion (pilot properties)', '95%+'],
          ['Staff overtime during turn', '–60%'],
          ['Median next-in-line to correct record', '<10s'],
          ['Table-side time-to-process', '<20s (anecdotal baseline ~90s)'],
          ['Share of pilot move-ins done on device', '30%+'],
          ['Wrong-resident incidents', '0'],
        ],
      },
    },
    {
      id: 'reflection',
      title: 'What I’d change',
      bullets: [
        'Put offline in MVP from week one. Waiting until Industry Group feedback forced it wasted sequencing time.',
        'Bring the delivery eng partner in by the end of week one. Week three was too late for shell constraints.',
        'Bias to SwiftUI earlier for an iOS mobile-team audience. Expo was useful for arguing about states, but it was the wrong artifact to hand a native team for final review.',
      ],
    },
  ],
  sibling: {
    href: '/work/csv-move-in-agent',
    label: 'Bulk Move-in Smart Upload (next-day spreadsheet bridge)',
  },
  nextCaptures: [
    'More card: Caching to Offline ready to Syncing N',
    'Queued “N to sync” chip after an offline confirm',
    '60–90s happy-path walkthrough',
  ],
};
