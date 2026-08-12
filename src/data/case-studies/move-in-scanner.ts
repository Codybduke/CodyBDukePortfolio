import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/move-in-scanner/${file}`);

export const moveInScannerCase: RichCaseStudy = {
  slug: 'move-in-scanner',
  openingClaim:
    'On student move-in day, most property staff never opened Entrata at the table. They checked people in on a spreadsheet, handed over a packet and keys, and entered the real move-ins later, often the next day. I used site visits, production SQL, and notes from an Industry Group interview with about 20 operators to design a mobile flow for that table: search, review the checklist, verify ID, and move in. We handed the OXP mobile team a SwiftUI module they could run inside the existing app, then worked with them as they reviewed the code and made small changes to fit the shell.',
  collaborators:
    'Customer Workflows eng, OXP mobile team, ~20 student-housing operators (Industry Group interviews), Entrata data team',
  surface: 'SwiftUI module for Entrata’s OXP staff iOS app (Swift Package + demo target)',
  heroFigure: {
    src: img('00-hero-three-up.png'),
    alt: 'Three phone screens from the OXP Expo prototype: Upcoming Move-ins roster, Riley Foster summary, and Confirm Move-in.',
    caption:
      'Roster, summary, and confirm from the Expo OXP prototype we used before rewriting the flow in SwiftUI.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      stage: 'Rough',
      title: 'Move-in happened twice',
      body: [
        'During peak student turn, a property might move in anywhere from about 100 to 500+ residents in a day. Staff set up at a folding table, often in a breezeway, with a laptop or iPad and sometimes just paper. Wi-Fi was unreliable where they stood, and personal phones usually were not allowed on company devices.',
        'The pattern we kept seeing was simple. Someone arrives. Staff mark them moved in on an offline spreadsheet, hand them a physical move-in packet with documents and keys, and keep the line moving. The goal at the table is a good in-person experience. Entrata comes later.',
        'Later often meant the next day: a full stretch of overtime re-keying every resident into the desktop product. That asynchronous gap was the core problem. Residents already felt moved in. The system of record did not.',
        'A less common but still painful path showed up when staff did have Wi-Fi on company iPads, especially at drive-through move-ins that started in COVID and stuck around because they were efficient. Even then, using Entrata’s desktop web UI on a tablet to find each person and complete move-in was slow and awkward. Mobile was meant to cut that path down as well, but most sites never got reliable connectivity at the table in the first place.',
        'A May–Aug 2025 audit at a large student operator made the scale visible. Bulk Move-In barely showed up in peak months, even at the largest operator in the set. More training on the desktop tool was not going to change a workflow built around staying offline until the line was gone.',
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
        'Notes from an Industry Group interview with about 20 operators forced the bigger resets. Search over QR. Optional items should not block the line; they become an internal escalation. Offline belongs in MVP. I rewrote the PRD within 48 hours of that feedback.',
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
      title: 'We cut the mega-initiative',
      body: [
        'Treating “automated student move-in” as one program would have stalled everything on mobile rollout. We split the work.',
        'The CSV agent covered next-day spreadsheet to Entrata, which had the clearest near-term ROI. Homebody owned resident readiness and QR. This app only covers staff at the table on move-in day. Readiness AI stayed upstream with thinner artifacts.',
        'The trade-off was real: two products to explain and two success metrics to own. It was still worth it, because day-of mobile and next-day CSV could ship on different clocks instead of blocking each other.',
      ],
      table: {
        headers: ['Workstream', 'Job'],
        rows: [
          ['CSV-to-Move-In Agent', 'Next day: spreadsheet to Entrata'],
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
        'Move-In sits on Command Center as a Quick Action next to packages and work orders, on the same home staff already open in the field. We talked about burying it under lease admin to match desktop IA. That would have failed the breezeway job, so we kept it on the home surface.',
      ],
      figures: [
        {
          src: img('04-home-move-in-quick-action.png'),
          alt: 'OXP Command Center home with Move-In listed among Quick Actions.',
          caption: 'Command Center to Move-In, from the Expo prototype.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'flow',
      stage: 'Making',
      title: 'The table path',
      body: [
        'The path is meant to match how the table already runs: open the roster, search or tap someone who is already Ready, check required versus optional items, verify ID, then confirm.',
        'QR is still available as a secondary path. It gets more useful once Homebody readiness is live and a property wants a hard express-lane gate. Until then, operator interviews described the line as “Smith, 315,” not “hold still for the camera.”',
        'The screens below are from the Expo prototype. We later rebuilt the same paths in SwiftUI for handoff to the OXP mobile team.',
      ],
      figures: [
        {
          src: img('01-roster.png'),
          alt: 'Upcoming Move-ins roster with search, date filter, and Ready / Optional / Required / Blocked badges.',
          caption:
            'Roster with search as the primary control. Badges mirror how staff already stage express versus cleanup.',
          layout: 'device',
        },
        {
          src: img('02-summary.png'),
          alt: 'Riley Foster resident summary showing complete checklist and Ready badge with Move in CTA.',
          caption:
            'Summary with required versus optional on the checklist. Ready gets visual weight so express residents are easy to spot.',
          layout: 'device',
        },
        {
          src: img('03-confirm.png'),
          alt: 'Confirm Move-in screen with Verify ID callout and Confirm Move-in button.',
          caption:
            'Confirm keeps the ID check above the button, and writes Future to Current so the lease flip is obvious.',
          layout: 'device',
        },
      ],
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
      title: 'Optional open isn’t a stop',
      body: [
        'The first draft treated incomplete checklist items as blockers. Industry Group feedback pushed back hard. Optional follow-ups cannot hold the line when a couple hundred people are outside.',
        'The compromise: move-in stays available, and a second action creates an OXP escalation assigned to the staff member who finished the table. No resident SMS. No portal task. Some properties run zero optional items and need a way to hide that path; that property-level toggle is still open.',
      ],
      figures: [
        {
          src: img('06-summary-optional-open.png'),
          alt: 'Morgan Diaz summary with optional items open notice and dual CTAs: Move in, and Move in and create escalation.',
          caption: 'Optional items still open, but Move in stays available. Escalation is the named follow-up.',
          layout: 'device',
        },
        {
          src: img('07-confirm-escalation.png'),
          alt: 'Confirm screen for move-in with create escalation action.',
          caption: 'Confirm and create escalation, as an internal staff queue item only.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'blocked',
      stage: 'Decisions',
      title: 'Required still means stop',
      body: [
        'Required items are different. There is no override in MVP. Staff send the resident to a resolution station, which matches how operators already route exceptions when one person on site can clear them.',
        'Hard blockers such as unit not ready or balance due use the same stop. We debated a manager PIN override and left it out. It would be too easy to burn on a busy Saturday, and interviews said properties already have a permissioned person for that job offline.',
      ],
      figures: [
        {
          src: img('08-summary-required-blocked.png'),
          alt: 'Jamie Baker summary showing required checklist items still need attention with Move in unavailable.',
          caption: 'Required items still open, so Move in is unavailable.',
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
      title: 'Offline had to be in the first cut',
      body: [
        'I originally had offline on a later milestone. Industry Group feedback corrected that quickly: breezeway Wi-Fi fails often, and staff are on company iPads, not personal phones.',
        'For MVP we scoped a cached roster, queued confirms, and a small Offline chip instead of a full-width banner. Staff still need a place to confirm they are Offline ready before walking out to the table, which lives in the More card cache states. That part of the PRD changed the same weekend we absorbed the Industry Group notes.',
      ],
      figures: [
        {
          src: img('10-roster-offline.png'),
          alt: 'Upcoming Move-ins roster showing Offline status chip instead of Synced.',
          caption: 'Offline chip on the roster while work continues against the cache.',
          layout: 'device',
        },
        {
          src: img('11-summary-offline.png'),
          alt: 'Resident summary with Offline status chip while reviewing checklist.',
          caption: 'Same chip on the summary so offline state stays visible without taking over the screen.',
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
            'Escalation, not resident nudge',
            'Optional follow-up stays internal. Portal or SMS noise was a non-starter in interviews.',
          ],
          [
            'Offline in MVP with a quiet status chip',
            'Banner designs looked safer in mocks and would have been ignored outdoors.',
          ],
          [
            'Ready reads louder than blockers',
            'Express line needs the green path to win a glance. Error-first UI slowed the wrong people.',
          ],
          [
            'Confirm actions stack when labels wrap',
            'Side-by-side looked fine on phone mocks; tablet plus the long escalation label broke it.',
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
        'Escalation rules written down: optional items allow move-in plus create escalation; required items block and redirect.',
        'Offline behavior: cached roster, queued writes, and a status chip instead of a blocking modal.',
        'Left out of MVP on purpose: resident-facing optional nudges, expired-QR demos, and a manager PIN override.',
      ],
    },
    {
      id: 'outcome',
      stage: 'Polished',
      title: 'Where it stands',
      body: [
        'What we left behind was a scoped table-side flow with offline and escalation rules the OXP mobile team could implement, not a shrunk desktop Bulk Move-In screen.',
        'Initiative targets are shared with the CSV agent and Homebody readiness. Pilot actuals are not in yet. Until they are, these are goals, not results.',
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
    label: 'CSV-to-Move-In Agent (next-day spreadsheet bridge)',
  },
  nextCaptures: [
    'More card: Caching to Offline ready to Syncing N',
    'Queued “N to sync” chip after an offline confirm',
    '60–90s happy-path walkthrough',
  ],
};
