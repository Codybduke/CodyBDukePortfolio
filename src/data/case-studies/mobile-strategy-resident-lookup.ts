import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/mobile-strategy-resident-lookup/${file}`);

export const mobileStrategyResidentLookupCase: RichCaseStudy = {
  slug: 'mobile-strategy-resident-lookup',
  openingClaim:
    'Entrata had never built a native mobile app for property managers. Staff were still using desktop Entrata on their phones, even to look up a resident while walking the property. I helped shape the mobile strategy and designed a first experience around that job: find the person, see what you need, and take action without going back to the office.',
  collaborators:
    'OXP product partners, Customer Workflows, customer feedback program',
  surface:
    'Expo prototype of Entrata’s staff iOS app (Command Center + Residents), plus a SwiftUI resident lookup module',
  heroFigure: {
    src: img('00-hero-three-up.png'),
    alt: 'Three phone screens from the OXP Expo prototype: Command Center home, resident search results for Marcus Johnson, and his profile hub.',
    caption:
      'Command Center, search, and the resident profile come from the Expo prototype we used to walk the strategy with partners.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      stage: 'Problem',
      title: 'The mobile experience was missing',
      body: [
        'Entrata had a mobile app for facilities teams, and nothing native for property managers. Resident lookup was already everyday work in Entrata. On desktop, staff pull a person up whenever a resident has a question.',
        'On a phone, that same profile was the web app. It is a poor way to answer someone at the door, so the lookup often waited until a manager got back to a desk.',
        'A resident might ask about a balance while a manager was walking the property. Staff wrote the question down, called the office, or struggled through the mobile site.',
        'We asked property managers what they actually needed to do on their phones. Looking up residents came first.',
        'The opportunity was to make the common field tasks easier, and to learn which of those tasks would make someone open the app a second time. Fitting all of desktop Entrata onto a smaller screen was not the goal.',
      ],
    },
    {
      id: 'evidence',
      stage: 'Process',
      title: 'Research changed our direction',
      body: [
        'Our early concepts leaned toward a performance dashboard. That matched how the desktop product talks about the business. It did not match someone standing in a parking lot. Staff wanted to know what needed their attention, and they wanted a fast way to find the people they were working with.',
        'I used call recordings, customer feedback, competing staff apps, and a usability simulation to reset the direction. Regional managers mattered more than the first concepts assumed. They travel between communities, so they would use the app, and they would be the ones asking their teams to use it.',
        'We had also been treating resident lookup like a directory you browse. A conversation usually starts with a name or a unit. Parking and fire-lane work starts with a car. Search had to lead, and it had to include a license plate. The first fields were only name, unit, and email.',
        'We did not have our own usage data yet. The strategy memo said how confident we were in each claim, because the first release was there to teach us.',
      ],
      table: {
        headers: ['Source', 'What it changed'],
        rows: [
          [
            'About 4,600 Gong calls. Gong records customer conversations.',
            'Looking people up on a phone was the workflow staff remembered from other products. The waste was the trip back to the desk. Maintenance work was already happening on a phone.',
          ],
          [
            '30+ customer feedback transcripts, from regional and community managers.',
            'Regional managers would be heavy users because they travel, and they needed balances and approvals in the field. A thin app after a mandate would burn the manager who had pushed it.',
          ],
          [
            '5 staff apps from competitors.',
            'The market was a set of single-purpose apps. Copying desktop navigation would not set Entrata apart. The advantage is work Entrata already owns, such as escalations, playbooks, and staffing.',
          ],
          [
            '32 usability walkthroughs across 4 personas.',
            'Short headers and previews were enough to hold a conversation. Plate search, empty results from the wrong property, and the All Properties picker were the failures.',
          ],
        ],
      },
      callout:
        'Entrata had already watched a version of this fail. A tablet product was rolled out from the top and then sat unused. A mandate can put the icon on the phone. The job still has to be worth opening.',
    },
    {
      id: 'strategy',
      stage: 'Process',
      title: 'Three decisions for the first release',
      body: [
        'I helped set three priorities so the first version would not become a smaller copy of desktop Entrata.',
        '1. The home screen should start with the work in front of someone: what needs attention today, and the actions staff repeat. Performance charts could wait until we trusted the numbers behind them. This version had to hold up a conversation in the field.',
        '2. It had to work for regional managers too. They need to see which property they are in, and they need a view across the communities they cover. They are also the people most likely to ask their teams to adopt the app. If they pushed something that did not help, their credibility would take the hit along with ours. That was an inference from the research, and the memo said we had not measured it.',
        '3. Resident lookup had to be a core path. Staff needed to search, see enough for the question in front of them, and take a common action. Charge disputes, walk-up questions, and after-hours calls do not wait for a desk.',
      ],
    },
    {
      id: 'home',
      stage: 'Solution',
      title: 'A home screen built around daily work',
      body: [
        'Command Center is that home screen. Daily Briefing sits at the top, so the next piece of work is visible, along with the role and the property, without a hunt through navigation. Quick Actions are the tasks people repeat: packages, messaging, move-ins, work orders, and adding a lead.',
        'We talked about filing those actions under the same modules as desktop. That would have buried the reason someone opened the app, so they stay on the first screen. Performance snapshots sit lower. For someone in the field, the next task matters more than another dashboard.',
        'We also planned for a dropped connection. When service goes, the actions left on screen should be the ones staff can still finish. Move-in is the extreme version of that. The everyday version is the rest of this case: look someone up and answer the question in front of you.',
      ],
      figures: [
        {
          src: img('01-command-center.png'),
          alt: 'OXP Command Center home with Daily Briefing 2.0: a Do Next escalation for Daniel Park, plus escalated threads, schedule, and approvals.',
          caption:
            'Daily Briefing leads the home screen, with the next escalation, the schedule, and approvals before any chart.',
          layout: 'device',
        },
        {
          src: img('02-quick-actions.png'),
          alt: 'Command Center Quick Actions grid with Packages, Properties, Move-In, Work Order, and related field verbs.',
          caption:
            'Quick Actions are the tasks staff repeat, and the performance snapshot waits below them.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'lookup',
      stage: 'Solution',
      title: 'Finding a resident starts with search',
      body: [
        'I designed the Residents tab around search. Recent searches are a way back to someone familiar. They are not a rent roll to scroll, which is the pattern from the desk.',
        'From a result, the profile hub puts the useful facts up front: how to reach the person, the lease, the balance, and a way into financials, household, vehicles, and work orders. Message, call, and a new work order stay on that profile.',
        'Financials and household are read-only in this version. Staff can answer the question and make a small adjustment. Heavier work, like a financial move-out, still belongs at a desk, where there is time to get the details right.',
      ],
      figures: [
        {
          src: img('03-residents-idle.png'),
          alt: 'Residents tab with search field and recent searches, not a full directory list.',
          caption: 'The Residents tab opens on search and recent people.',
          layout: 'device',
        },
        {
          src: img('05-search-marcus.png'),
          alt: 'Search results for Marcus showing Marcus Johnson at Westwood Commons with a balance due.',
          caption: 'A name search returns the resident, the property, the unit, and the balance in one row.',
          layout: 'device',
        },
        {
          src: img('06-profile-hub.png'),
          alt: 'Marcus Johnson resident profile hub with contact actions, lease snapshot, balance due, and drill-in rows.',
          caption:
            'The profile leads with contact actions, the lease, and the balance. Financials, household, vehicles, and work orders are one step further in.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'financials',
      stage: 'Solution',
      title: 'A late fee you can explain on the spot',
      body: [
        'One scenario we tested was a resident disputing a late fee. The manager had to find the person, see the balance and the recent charges, and know enough to talk about it while they were still standing there.',
        'All four personas finished that scenario. A short summary and the recent charges were enough for the conversation. We did not need the full desktop accounts receivable screen on the phone.',
        'The ledger was still thin in one place that matters. People who use the desktop ledger expect a running balance beside each charge, and the first mobile design did not have it.',
      ],
      figures: [
        {
          src: img('07-financials.png'),
          alt: 'Financials drill-in for Marcus Johnson with summary cards, ledger tabs, and recent charges including a late fee.',
          caption:
            'Financials shows the account summary and recent charges, which is enough to talk through a fee on site.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'plate',
      stage: 'Solution',
      title: 'Search cannot start from a license plate',
      body: [
        'The larger gap was the license plate. Parking and fire-lane problems start with a vehicle. Search accepted a name, a unit, or an email, and every persona hesitated or failed when the plate was the only clue.',
        'The vehicle is already on the profile, plate included. That only helps after you have found the resident. In a parking lot, the plate is the search. Plate search stayed on the list of fixes.',
        'So did the empty result when someone is looking at the wrong property. A quiet note that you are searching one community, with no way to widen it, looks like the resident does not exist.',
      ],
      figures: [
        {
          src: img('04-search-plate-miss.png'),
          alt: 'Residents search for a license plate returning no results.',
          caption: 'A plate search comes back empty, so the parking-lot job ends on this screen.',
          layout: 'device',
        },
        {
          src: img('08-vehicles-pets.png'),
          alt: 'Vehicles and Pets screen for Marcus Johnson showing a silver Toyota Camry and plate EWX-4429.',
          caption:
            'The plate is on the vehicle screen, which helps only after you already know who the resident is.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'prototype',
      stage: 'Solution',
      title: 'A prototype the team could walk',
      body: [
        'I put the strategy into a working prototype, built in Expo, so partners could try the flows on a phone instead of reviewing still screens.',
        'The prototype includes Command Center and Residents. A separate lookup prototype carried the usability simulation: 32 walkthroughs across four personas, with the findings grouped and a queue of what to fix. A SwiftUI module showed the native iOS team the same lookup flow. That is the handoff pattern we used on Move-In.',
        'The plate gap is still in the build. We left it there so the miss stayed visible while people were trying the rest of the flow.',
      ],
      embed: {
        src: withBase('/prototypes/oxp-mobile/'),
        title: 'Interactive OXP resident lookup prototype',
        caption:
          'Start on Home, open Residents, search for Marcus Johnson, and open Financials. A plate like EWX-4429 still returns nothing.',
      },
    },
    {
      id: 'decisions',
      stage: 'Solution',
      title: 'What we prioritized and what we left out',
      body: [
        'The research and the test made the first version smaller on purpose. A few problems stayed open: license plate search, empty results from the wrong property, and the All Properties picker, which could trap someone in a multi-select.',
      ],
      table: {
        headers: ['In the first version', 'Left for later'],
        rows: [
          [
            'The home screen leads with the day’s work, because staff on their feet need the next task.',
            'Performance charts as the main experience. Those can wait until we trust the numbers.',
          ],
          [
            'Daily Briefing and Quick Actions on the first screen.',
            'Desktop-style modules, which would bury those tasks.',
          ],
          [
            'Resident lookup that starts with search.',
            'A directory of every resident, scrolled like a rent roll.',
          ],
          [
            'A profile hub, with financials, household, vehicles, and work orders one step in.',
            'A full desktop profile on a phone.',
          ],
          [
            'Financials and household you can read, enough to talk through a charge.',
            'Editing complex financials, including a move-out, which needs a desk.',
          ],
          [
            'The property you are searching is always visible.',
            'A search that hides that scope and comes back empty.',
          ],
        ],
      },
    },
    {
      id: 'handoff',
      stage: 'Solution',
      title: 'What we handed to partners',
      body: [
        'The strategy memo named the three decisions, how sure we were about each one, and what we would check in the first 90 days after general availability. The checks were there so we could tell if the bet was wrong. We did not have usage yet, so they were criteria, not a result.',
        'Entrata was also shipping agent features in this same app. The memo kept how often staff opened it separate from outcomes those agents touched, so a weak phone experience would not get mistaken for an agent problem.',
      ],
    },
    {
      id: 'outcome',
      stage: "What's next",
      title: 'What came out of the work',
      body: [
        'The team walked away with a mobile direction they could argue from, and prototypes they could try. I turned the research into the three priorities, decided which information belonged on the phone, and built the home screen, the lookup flow, and the native handoff.',
        'We also set targets for a group of customers their success managers would bring onto the app. Until our own usage exists, these are goals. They are not measured results.',
      ],
      table: {
        headers: ['Success measure', 'Target'],
        rows: [
          [
            'Weekly active staff',
            'More than half of staff at customers on OXP, Entrata’s new staff app, within 12 months of general availability.',
          ],
          [
            'Regional managers',
            'More than half active across a rolling 7 days, at 30 days in the pilot group.',
          ],
          [
            'Community managers',
            'More than 40% active on at least 3 of the past 7 days, 30 days after a mandate.',
          ],
        ],
      },
    },
    {
      id: 'reflection',
      stage: "What's next",
      title: 'What I would do differently',
      body: [
        'The biggest miss was license plate search. The research already said a lot of field work starts from a vehicle, and the simulation confirmed it. I would have put plate search in the first version, instead of using a test cycle to relearn something we already knew.',
        'I would also treat the wrong property as a usability problem from the start. A search that returns nothing because you are looking at the wrong community is easy to read as a missing resident.',
        'I would keep resident lookup and performance analytics as separate efforts. They serve different moments. Putting them in one project would have made it harder to get the everyday mobile experience right.',
      ],
    },
  ],
  sibling: {
    href: '/work/move-in-scanner',
    label: 'Real-time Move-ins',
  },
  nextCaptures: [
    'Wrong-property empty results with a widen CTA',
    'All Properties → multi-select trap',
    'Daily Briefing 2.x next to Original',
  ],
};
