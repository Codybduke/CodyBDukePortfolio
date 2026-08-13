import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/mobile-strategy-resident-lookup/${file}`);

export const mobileStrategyResidentLookupCase: RichCaseStudy = {
  slug: 'mobile-strategy-resident-lookup',
  openingClaim:
    'Desktop OXP is built for a desk. Property staff spend their days walking units, traveling between sites, and answering questions in a breezeway. I synthesized about 4,600 Gong calls, more than 30 customer feedback transcripts, and a five-vendor competitive scan into three product bets: an action-first Command Center, the regional manager as the hinge persona, and Resident Lookup as the daily wedge. We prototyped those bets in Expo, then ran a four-persona usability simulation that confirmed glanceable profiles and named the blockers still in the way: plate search, property-scope mistakes, and a multi-property picker trap.',
  collaborators:
    'OXP product partners, Customer Workflows, customer feedback program, four staff personas in a usability simulation',
  surface: 'Expo prototype of Entrata’s OXP staff iOS app (Command Center + Residents) plus a SwiftUI lookup module',
  heroFigure: {
    src: img('00-hero-three-up.png'),
    alt: 'Three phone screens from the OXP Expo prototype: Command Center home, resident search results for Marcus Johnson, and his profile hub.',
    caption:
      'Command Center, search, and profile from the Expo prototype we used to make the strategy testable.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      stage: 'Rough',
      title: 'The job is not at a desk',
      body: [
        'Property staff lose time to the round-trip between the field and a desktop. A community manager finds a problem on a walk, goes back to the office, logs in, and re-enters details from memory. Customer estimates put that loop at about 8 to 12 minutes per work order. Regional managers spend most of the week traveling. Approvals, ledger checks, and resident questions wait until they are back at a screen.',
        'Desktop OXP is not that job. Staff on their feet need “what do I do next?” and fast resident context, not a KPI wall, when a conversation starts in a breezeway. Competitive pressure made the gap concrete. Operators coming off other systems remembered looking people up on a phone. Entrata’s own tablet product had been deployed and then ignored. A mandate gets the download. A daily job gets retention.',
        'The product OXP sells is an AI workforce: agents, playbooks, and escalations. Mobile is how that workforce earns a place in daily work. Without a field surface, the agents stay on a desktop nobody opens between units.',
        'The question was not whether to ship a mobile app. It was which IA earns a second open, and which wedge proves it first, before we had any first-party usage data of our own.',
      ],
      metrics: [
        {
          value: '~4,600',
          label: 'Gong calls filtered for mobile and field themes',
        },
        {
          value: '30+',
          label: 'Processed customer feedback transcripts across the beta program',
        },
        {
          value: '5',
          label: 'Staff-facing competitor apps scanned for moat versus parity',
        },
      ],
    },
    {
      id: 'evidence',
      stage: 'Evidence',
      title: 'What we got wrong first',
      body: [
        'Early home concepts leaned toward a performance dashboard. That matched how desktop OXP talks about the business, and it would have failed the person standing in a parking lot. Gong and beta notes kept repeating next action, not portfolio charts.',
        'We also treated Resident Lookup as a directory you browse. Field conversations start from a name, a unit, or a car. Search had to lead. Even then, the first search fields were name, unit, and email. Fire-lane and parking scenarios stall without a plate, and the usability simulation made that impossible to ignore.',
        'Every major claim in the strategy memo carried an explicit confidence label. We had interviews, call research, and competitors. We did not have our own retention curve. That gap is why the first ship was sized to learn, not to complete a vision.',
      ],
      table: {
        headers: ['Input', 'What it changed'],
        rows: [
          [
            'Gong (~4,600 calls)',
            '“Look up people on the phone” was the remembered competitor workflow. Field-to-desk round-trip was the waste. Maintenance is already phone-only.',
          ],
          [
            'Feedback transcripts (30+)',
            'Regional managers would be the heaviest users because of travel. Ledger and approvals from the field. A hollow app after a mandate burns the manager who pushed it.',
          ],
          [
            'Competitive scan (5 vendors)',
            'The market is fragmented single-function apps. Cloning desktop IA would not win. Platform-owner workflows (escalations, playbooks, workforce) are the moat; a KPI wall is not.',
          ],
          [
            'Usability sim (4 personas, 32 walkthroughs)',
            'Glanceable headers and tile previews worked. Plate search, wrong-property empty results, and the All Properties picker were ship-stoppers.',
          ],
        ],
      },
      callout:
        'Entrata had already proved the failure mode. A tablet product got deployed from the top and then sat unused. Top-down distribution gets the icon. Bottom-up job-fit keeps it.',
    },
    {
      id: 'strategy',
      stage: 'Decisions',
      title: 'Three bets, not a desktop port',
      body: [
        'Treating mobile as “OXP, but smaller” would have shipped a KPI wall and a nav tree nobody could use outdoors. We cut that framing and kept three bets.',
        'The regional manager is the hinge. They mandate adoption and they use the app themselves. If the app is great for them, they push it. If they mandate a hollow app, their credibility takes the hit with ours. That mechanism was inferred, not measured, and the memo said so.',
        'Resident Lookup is the daily wedge for on-site staff. Charge disputes, walk-ins, and after-hours questions do not wait for a desk. Heavier analytics waited until attribution quality was trustworthy. The trade-off was real: the home looks less like a command dashboard, and the first ship proves a conversation, not a portfolio review.',
      ],
      table: {
        headers: ['Bet', 'Product consequence'],
        rows: [
          ['Action-first home', 'Command Center: Daily Briefing + Quick Actions, not a KPI dashboard'],
          [
            'Regional manager as hinge',
            'Scope, multi-property, and “across my portfolio” language on home and search',
          ],
          [
            'Resident Lookup as daily wedge',
            'Search → profile hub → drill-ins for financials, lease, household, vehicles, work orders',
          ],
        ],
      },
    },
    {
      id: 'home',
      stage: 'Making',
      title: 'What do I do next?',
      body: [
        'Daily Briefing sits at the top of home so role and scope are visible without hunting nav. Quick Actions are the verbs: packages, message, move-in, work order, add lead. We talked about burying those under desktop-shaped modules. That would have failed the field job, so they stay on the first surface.',
        'When connectivity drops, Quick Actions collapse toward the work that can still run offline. Move-In is the extreme version of that rule. The rest of this case is the everyday version: look someone up and answer the question in front of you.',
      ],
      figures: [
        {
          src: img('01-command-center.png'),
          alt: 'OXP Command Center home with Daily Briefing summarizing overdue tasks, a stalled playbook, and open escalations.',
          caption: 'Daily Briefing as the home anchor. Scope and next work, not a chart wall.',
          layout: 'device',
        },
        {
          src: img('02-quick-actions.png'),
          alt: 'Command Center Quick Actions grid with Packages, New Message, Move-In, Work Order, and related field verbs.',
          caption:
            'Quick Actions as primary verbs. The snapshot sits below, so charts wait until after the field jobs.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'lookup',
      stage: 'Making',
      title: 'Lookup, not a directory',
      body: [
        'The Residents tab stays quiet until you search. Recent people are a shortcut, not a rent roll to scroll. That matches how a conversation starts: a name at the door, a unit on a package, a question about a balance.',
        'The path is search, open the hub, then drill in only if the header is not enough. Message, work order, and note stay available without leaving the person. Ledger and household stay read-only in this cut. Field utility without premature write surfaces.',
      ],
      figures: [
        {
          src: img('03-residents-idle.png'),
          alt: 'Residents tab with search field and recent searches, not a full directory list.',
          caption: 'Search first. The directory stays quiet until there is a query.',
          layout: 'device',
        },
        {
          src: img('05-search-marcus.png'),
          alt: 'Search results for Marcus showing Marcus Johnson at Westwood Commons with a balance due.',
          caption: 'Name search returns the person, the property, the unit, and the balance in one row.',
          layout: 'device',
        },
        {
          src: img('06-profile-hub.png'),
          alt: 'Marcus Johnson resident profile hub with contact actions, lease snapshot, balance due, and drill-in rows.',
          caption:
            'Hub with balance, status, and lease snapshot on first glance. Contact, call, and work order stay on the person.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'financials',
      stage: 'Making',
      title: 'The breezeway dispute',
      body: [
        'The charge-dispute path is why lookup had to ship before analytics. Someone is standing there asking about a late fee. Staff need the balance, the last charge, and enough ledger detail to talk, not a full AR workstation.',
        'The usability simulation walked that scenario with four personas. All four completed it. Glanceable headers did the work. What still hurt was a running balance on each ledger line, which desktop AR users expect, and getting to the person at all when the only clue is a car.',
      ],
      figures: [
        {
          src: img('07-financials.png'),
          alt: 'Financials drill-in for Marcus Johnson with summary cards, ledger tabs, and recent charges including a late fee.',
          caption:
            'Financials as a conversation aid. Enough to dispute a charge on site. Not a desktop ledger clone.',
          layout: 'device',
        },
      ],
    },
    {
      id: 'plate',
      stage: 'Decisions',
      title: 'The line is sometimes a license plate',
      body: [
        'Search fields said name, unit, or email. Parking and fire-lane work starts from a car. In the simulation, that path hesitated or failed for every persona. Gong had already described looking people up in the field. We still shipped a search box that could not see a plate.',
        'The vehicle is on the profile. The plate is in Vehicles & Pets. None of that helps if you cannot get to the person from the parking lot. Plate search is still on the fix list. So is the empty-results pattern when property scope is wrong: a quiet chip that says you are searching one community, with no way to widen, looks like “no resident.”',
      ],
      figures: [
        {
          src: img('04-search-plate-miss.png'),
          alt: 'Residents search for a license plate returning no results.',
          caption: 'Plate query, empty list. The parking-lot job dies here.',
          layout: 'device',
        },
        {
          src: img('08-vehicles-pets.png'),
          alt: 'Vehicles and Pets screen for Marcus Johnson showing a silver Toyota Camry and plate EWX-4429.',
          caption: 'The plate lives one drill-in deep. Useful after you have the person. Useless as the query.',
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
            'Action-first home, not a KPI dashboard',
            'Staff on feet optimize for next action. Portfolio charts belong later, after attribution is trustworthy.',
          ],
          [
            'Daily Briefing as the home anchor',
            'Role and scope without hunting nav. A module tree copied from desktop would have buried the day.',
          ],
          [
            'Quick Actions as primary verbs',
            'Move-in, work order, packages, add lead. Two taps from the same home staff already open.',
          ],
          [
            'Search-first lookup, not a browseable directory',
            'Conversations start from a name or unit. A rent roll to scroll is the desk pattern.',
          ],
          [
            'Hub plus drill-in sheets',
            'Act (message, work order, note) without leaving the person. Align with desktop concepts, do not clone desktop IA.',
          ],
          [
            'Read-only ledger and household',
            'Field utility without premature write surfaces. AR still completes a charge dispute in view-only.',
          ],
          [
            'Property scope always visible on search',
            'Wrong scope returns empty results that look like “no resident.” The chip is the start of that fix, not the end.',
          ],
        ],
      },
    },
    {
      id: 'handoff',
      stage: 'Polished',
      title: 'What partners got',
      body: [
        'The strategy memo named the bets, the confidence on each claim, and the kill criteria for the first 90 days after GA. That was the artifact for product partners: mobile as distribution for the AI workforce, with owned engagement metrics sitting beside shared agent-touched outcomes so a surface problem and an agent-layer problem stay distinguishable.',
        'The Expo app made Command Center and Residents walkable. A dedicated lookup prototype carried the four-persona simulation: 32 walkthroughs, clustered findings, and a validation queue. A SwiftUI module mirrored the lookup flow for a native-team audience, the same handoff pattern we used on Move-In.',
      ],
      bullets: [
        'Three bets written down with UI consequences: action-first home, RM as hinge, lookup as daily wedge.',
        'Usability blockers logged: plate search, property-scope empty states, All Properties multi-select trap.',
        'Left out of this cut on purpose: performance analytics on home, ledger writes, and treating lookup as a desktop profile clone.',
      ],
    },
    {
      id: 'outcome',
      stage: 'Polished',
      title: 'Where it stands',
      body: [
        'What we left behind was a coherent mobile IA story and a lookup flow staff could actually try, not a shrunk desktop OXP. The work shaped roadmap sequencing and prototype direction. It is not a measured GA retention curve.',
        'Initiative targets were set as learning goals for a CSM-activated cohort, with explicit kill criteria. Until first-party usage lands, these are goals, not results.',
      ],
      table: {
        headers: ['Metric', 'Target (unmeasured)'],
        rows: [
          ['Weekly active staff use (habit, not installs)', '>50% of staff at OXP customers, 12 months after GA'],
          ['Regional manager DAU at 30 days (pilot cohort)', '>50% rolling 7-day'],
          ['Community manager DAU at 30 days post-mandate', '>40% (3+ days in the past 7)'],
          ['Charge dispute completable on device (sim)', '4 of 4 personas completed'],
          ['Plate-only parking lookup (sim)', 'Hesitated or failed across personas'],
        ],
      },
    },
    {
      id: 'reflection',
      title: 'What I’d change',
      bullets: [
        'Put plate search in the first lookup cut. Waiting for the simulation to prove a Gong theme we already had wasted a cycle.',
        'Treat wrong-property empty states as a blocker, not polish. A quiet scope chip without a widen action looks like a missing resident.',
        'Keep lookup and performance analytics in separate stories. Mixing them would have turned the daily wedge into another dashboard.',
      ],
    },
  ],
  sibling: {
    href: '/work/move-in-scanner',
    label: 'OXP Mobile Move-In Scanner (Quick Action depth)',
  },
  nextCaptures: [
    'Wrong-property empty results with a widen CTA',
    'All Properties → multi-select trap',
    'Daily Briefing 2.x next to Original',
    '60–90s lookup walkthrough (search → hub → financials)',
  ],
};
