import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/caliber-skill-on-deals/${file}`);

export const caliberSkillCase: RichCaseStudy = {
  slug: 'caliber-skill-on-deals',
  openingClaim:
    'Ellis manages about eight reps and has one hour before a one-on-one or a team meeting. Skill Intelligence can already tell him Tara is Developing at Value Based Discovery. It cannot tell him whether she booked the wrong companies or cannot run the skill, and it cannot tell him which skill is worth that hour. This was a design exercise, not a shipped product. The brief was a focused day. I used about ten hours, a few hours at a time, from August 29 to September 3, 2026.',
  collaborators: 'Reviewed with Britton Broderick during the working sample',
  surface: "Caliber Skill Intelligence, on the manager\'s book of open deals",
  heroFigure: {
    src: img('08-version-11-team.png'),
    alt: 'Skill Intelligence Deals tab for a mid-market team. Open deals are grouped by the latest call score and whether the deal moved, with a team score of 53 and about $65K beside a four-point gain.',
    caption:
      'The meeting view. Ellis can see who has money sitting behind a weak call, and what a realistic gain on this skill has gone with across similar books.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'the-score',
      title: 'A 65 does not tell him what to say on Monday',
      body: [
        'Caliber teaches revenue skill: courses, AI role-play, and Skill Intelligence. The dashboard\'s one number is an Overall Skill Rating, from 0 to 100, rolled up from scored live calls and practice. In the product they handed me, Value Based Discovery sat at 65, which the scale calls Proficient. The team heatmap showed who was up and who was down.',
        'The Skill Report could name strengths and growth areas, then stopped. Priority action was empty. "No actions have been identified." Ellis already had a workaround. He pasted transcripts into a language model, did not trust the score, and went back to listening to calls himself.',
        'I started in the packet, the current product, and three customer conversations, before I drew a screen. The score was real. The job it was supposed to do was missing.',
      ],
      figures: [
        {
          src: img('01-current-dashboard.png'),
          alt: 'Caliber Skill Intelligence dashboard. Value Based Discovery overall is 65, Proficient, above a team heatmap for the last 30 days.',
          caption:
            'What a manager could already open. One skill, one score, and a heatmap of who moved since last period.',
          layout: 'wide',
        },
        {
          src: img('02-empty-priority.png'),
          alt: 'Skill Report for Value Based Discovery. The team is outperforming 75 percent of the organization, with strengths and growth areas listed, and Priority action empty.',
          caption:
            'The report can diagnose. Priority action for the team still says no actions have been identified.',
          layout: 'wide',
        },
      ],
      callout:
        'A manager who can see that a number is bad, and cannot see why, does not have a coaching tool. He has another report to distrust.',
    },
    {
      id: 'the-hour',
      title: 'The exercise was one day. The job was one hour.',
      body: [
        'Ellis\'s question about Tara was specific. She creates a lot of deals and does not have pipeline coverage. Close dates slip. He cannot tell a bad-fit book from weak discovery, urgency, or multi-threading. His director asks what he is coaching and how he is measuring it. Eight different plans, one per rep, is more than he can run. He said they are mostly missing the same basics.',
        'Two problems had to be solved together. Which skill is worth the next hour, and why. The why is the money sitting on the deals behind that skill. A score by itself does not answer either question. A dollar column by itself does not either.',
        'I kept the sample on one surface: the front-line manager, inside Skill Intelligence, on named deals. Enablement and the revenue leader still need the story. They get it when the manager can defend the hour.',
      ],
      metrics: [
        { value: '10 hrs', label: 'The whole sample, a few hours a day across six days' },
        { value: '1 hour', label: 'What Ellis actually has before the meeting or the one-on-one' },
        { value: 'Empty', label: 'Priority action on the Skill Report he already uses' },
      ],
    },
    {
      id: 'the-model',
      title: 'Show the money beside the call. Leave the formula alone.',
      body: [
        'My first pass treated deal value, win and loss, and stage movement as missing. They are not missing. Skill Intelligence already knows the score and a lightweight deal. It is aware of amount and outcome, and it does not use them yet. Joining them shows that skill and revenue go together. It does not prove the score caused the money.',
        'The unit is a live scored call, the deal it sits on, whether that deal moved, and what it is worth. Every open deal lands in one of four groups: the latest call on this skill was proficient or not, and the deal stalled or moved. Deals with no scored call stay out. The view refuses to characterize a book it cannot see.',
        'On September 1, Britton confirmed the manager and the four groups. He also tightened the brief. A user should be able to see the monetary value of a skill. He asked me to make that tie-in explicit, and not to invent the mathematical model. Caliber owns the formula. The screen presents it.',
      ],
      table: {
        headers: ['The screen can say', 'The screen should hold back'],
        rows: [
          [
            'These open deals stalled after a below-Proficient call. They are worth this much.',
            'This score caused those stalls.',
          ],
          [
            'Across customers, moving this score about this many points has gone with about this much more of a book like this closing.',
            'This plan will produce that money for Tara.',
          ],
          [
            'Most of her stall sits behind weak calls, so this looks like the skill.',
            'A dollar figure, by itself, splits fit from skill.',
          ],
        ],
      },
      callout:
        'The language on the page is "if this score goes up, we have seen about this much more close." Claiming proof is how you lose a manager who already argues correlation and causation for a living.',
    },
    {
      id: 'first-pass',
      title: 'Version 1 could answer the question, if he was willing to read',
      body: [
        'I built the manager flow as a coded prototype instead of a slide of frames. The idea is a classification of a whole book. Static screens cannot show deals regrouping when you change the person or the skill. The chrome, type, and color came from the shipping product, sampled from the packet screenshots when the component library export ran out of calls.',
        'The first version put the four groups on the page, with dollars, and a forecast in three places: beside the score, on the empty Priority action, and inside the focus. It also explained each of those numbers in a paragraph. Under the groups, another paragraph restated the chart and then told Ellis this was the question he came in with.',
        'I walked it and the page felt crowded. The idea was right. The words were doing work the chart had already done. The forecast sat in its own box, away from the score it was talking about.',
      ],
      figures: [
        {
          src: img('03-version-1-team.png'),
          alt: 'Version 1 of the Deals tab. A team table shows each rep\'s open book as a multicolor bar, with stalled-after-weak-call counts and an Opportunity column.',
          caption:
            'Version 1, team. The money is on the page. The color bar in each row restates the four groups, and it is easy to skip past what the colors mean.',
          layout: 'wide',
        },
        {
          src: img('04-version-1-tara.png'),
          alt: 'Version 1 of Tara Whitfield. Her discovery score is 34, with plus 9 points beside about $70K, and four separate cards for stalled and moving deals.',
          caption:
            'Version 1, Tara. Four cards, a status pill, and a forecast that still reads as a separate idea from the 34.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'quadrant',
      title: 'The same four facts had to read as one chart',
      body: [
        'I drew the groups in Figma before I asked for them to be rebuilt. Proficient or better on top. Stalled on the left, moved on the right, so the best outcome is the top right. The cell a manager should feel first is the bottom left: weak call, deal stuck, and the dollars on it. For Tara that is 8 deals and about $349K.',
        'Color stays on a rail in each cell, the way the product already marks a score. Filling the whole cell is reserved for the group you are looking at. I tried which cell should carry that fill. The skill-gap cell is the one that answers Ellis. The others stay quiet until he asks.',
        'Version 1.1 is that chart, plus the cuts from my own critique. The forecast collapsed to a pair next to the gauge, +9 pts to about $70K, with the explanation behind the info icon. The paragraph under the chart became a small status: skill problem. Coverage is a fraction of scored deals, so a missing call does not look like a bad score.',
      ],
      figures: [
        {
          src: img('05-figma-quadrant.png'),
          alt: 'Figma study of the quadrant. The below-proficient, stalled cell is filled brown: 8 deals, $349K, consistent with a skill gap.',
          caption:
            'The Figma pass. I was deciding which cell gets the fill. The skill-gap cell is the one that has to be obvious.',
          layout: 'wide',
        },
        {
          src: img('06-version-11-tara.png'),
          alt: 'Version 1.1 of Tara Whitfield. The quadrant marks 8 deals and $349K as a skill problem, and the score of 34 sits beside plus 9 points and about $70K.',
          caption:
            'Version 1.1. Same facts, less essay. The 34 and the money sit together. The status says this looks like the skill.',
          layout: 'wide',
        },
      ],
      callout:
        'Switching skills is how he spends the hour. Tara\'s weakest skill is discovery. Closing has more money behind it on this book. Those are different answers, and the page has to show both.',
    },
    {
      id: 'the-plan',
      title: 'Once he picks the skill, the empty action has to become a plan',
      body: [
        'Priority action was the hole in the current product. After the diagnosis, Ellis needs a dated focus he can describe to his director: what she will practice, how often, which live deals are watched, and what a plan like that has gone with.',
        'Changing the sub-skill, the window, or the practice cadence changes the pair on the modal. Six weeks on her lowest sub-skill, twice a week, sits next to about 12 points and about $95K. The numbers are a placeholder so the idea can be reviewed. The sentence shape is the product decision. Caliber replaces the math.',
        'Deals to watch start checked when they stalled after a weak call. He can see the recommendation. He does not have to rebuild the list from memory.',
      ],
      figures: [
        {
          src: img('07-focus.png'),
          alt: 'Set a 6-week focus for Tara Whitfield. Negative Consequence Development is marked lowest, practice is twice a week, and the plan sits beside plus 12 points and about $95K.',
          caption:
            'The focus. One sub-skill, a window, a practice cadence, and the deals the next live calls will be scored against.',
          layout: 'wide',
        },
      ],
      table: {
        headers: ['What feedback changed', 'What I did with it'],
        rows: [
          [
            'Britton: the four groups are right, and the missing piece is money.',
            'Amounts stay on. Dollars sit next to the counts. The forecast is presentation, not a model I invented.',
          ],
          [
            'He described a rep they were about to train on discovery, when closing was the higher-leverage hour.',
            'A skill switcher on the person, defaulting to the weakest score, with the money visible so the hour can land somewhere else.',
          ],
          [
            'My critique: the page restated the chart in paragraphs.',
            'Number pair and info icon. A short status instead of a recap. Version 1 stays in the prototype so the cut is visible.',
          ],
          [
            'The team meeting still required opening someone to see the opportunity.',
            'The Deals tab carries the team score and the same kind of gain, plus an Opportunity column on each person.',
          ],
        ],
      },
    },
    {
      id: 'play',
      title: 'The book only makes sense if you can move through it',
      body: [
        'Tara is the skill problem. Priya\'s stalls show up after stronger calls, so the same chart points at the book instead of the skill. Nate is the fairness case: a newer rep running a better process than the scoreboard suggests. Simone has too thin a sample to characterize. Devon has no scored call on an open deal, and the page says so.',
        'Use it the way Ellis would. Start on the team, open Tara, and change the skill. Set a focus if you want to see the plan. The bar along the bottom is mine, so you can move between version 1.0 and 1.1 and between those people. It is not part of the product.',
      ],
      embed: {
        src: withBase('/proto/caliber-skill-on-deals'),
        query: 'play=1&v=1.1',
        title: 'Caliber Skill on Deals prototype',
        caption:
          'Version 1.1 is open on the team. Scroll inside the frame. The bottom bar switches version and person.',
        hint: 'Open Tara for the skill problem, Priya when the stalls are not the skill, and Devon when there is no scored call to judge.',
      },
    },
    {
      id: 'the-room',
      title: 'In the room, the color bar still needed a sentence',
      body: [
        'I walked this with the founders after the sample was in. The hour, the money, and the refusal to invent a formula landed. The quadrant and the colored bar in the team table did not, at least not cold. Someone meeting that chart for the first time had to be told what the axes were, out loud, before the fill meant "skill" or "the book."',
        'I would say the sentence the chart is for, before I point at a cell. Eight of Tara\'s scored open deals, about $349K, stalled after a weak discovery call. That is the coaching hour, unless another skill has more behind it. The bar in the table is the same four groups, drawn small, and it should not be the first time he learns the legend.',
        'I stopped at version 1.1. Another pass would put that sentence on the team row, and would treat the quadrant as something a director can read without a tour. The point of the sample was to find the problem and put an honest first answer on the product they already have.',
      ],
    },
  ],
};
