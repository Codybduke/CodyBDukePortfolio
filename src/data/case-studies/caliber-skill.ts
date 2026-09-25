import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/caliber-skill-on-deals/${file}`);

export const caliberSkillCase: RichCaseStudy = {
  slug: 'caliber-skill-on-deals',
  openingClaim:
    'A front-line manager can see a skill score. He cannot see which deals that score is failing, whether the stall is the skill or the companies, or which skill is worth the next hour. Caliber asked for that connection because they sell skill as a way to move revenue, and the product still cannot show it. This was a design exercise, not a shipped product. The brief was a focused day. I used about ten hours, a few hours at a time, from August 29 to September 3, 2026.',
  collaborators: 'Reviewed with Britton Broderick during the working sample',
  surface: 'Caliber Skill Intelligence, on the manager\'s book of open deals',
  heroFigure: {
    src: img('08-version-11-team.png'),
    alt: 'Skill Intelligence Deals tab for a mid-market team. Open deals are grouped by the latest call score and whether the deal moved, with a team score of 53 and about $65K beside a four-point gain.',
    caption:
      'The meeting view after the work. Ellis can see who has money sitting behind a weak call, and what a realistic gain on this skill has gone with across similar books.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'background',
      stage: 'Problem',
      title: 'What Caliber already measures',
      body: [
        'Caliber trains sales teams. They sell expert-led courses, AI practice calls that let a seller rehearse a conversation, and a dashboard called Skill Intelligence. A customer is a company that wants its sellers to get better at the conversations that create pipeline and close it.',
        'A skill is a named selling behavior, scored from real calls and from practice against a checklist. Value Based Discovery is the example already on their screens. It means the seller finds the buyer\'s problem and what it costs them if nothing changes, instead of jumping to a product pitch.',
        'The dashboard\'s one number is an Overall Skill Rating, from 0 to 100, rolled up from those scored calls over a time window. Under 20 is Novice. 20 to 39 is Developing. 40 to 69 is Proficient. 70 to 89 is Strong. 90 to 100 is Expert. In the product they handed me, the team sat at 65 on Value Based Discovery. That is Proficient. A later screen shows Tara at 34, which is Developing.',
      ],
      metrics: [
        { value: '0-19', label: 'Novice' },
        { value: '20-39', label: 'Developing. Tara is here at 34.' },
        { value: '40-69', label: 'Proficient. The team sat here at 65.' },
      ],
    },
    {
      id: 'why-caliber',
      stage: 'Problem',
      title: 'Why this gap matters to the business',
      body: [
        'Caliber asked for this sample because they sell revenue skill. If a score never sits on a named deal, the product is a course catalog plus role-play. Their marketing already says Skill Intelligence quantifies revenue upside. The product cannot. That gap is also how they renew. A customer success conversation needs a story the buyer can take to a director, and the current dashboard does not give them one.',
      ],
      callout:
        'The business problem is not a prettier heatmap. It is making skill visible on the deals that money sits on, so a coaching hour and a renewal story have the same honest join.',
    },
    {
      id: 'the-problem',
      stage: 'Problem',
      title: 'What the manager cannot see',
      body: [
        'Ellis manages about eight mid-market reps. He opens Skill Intelligence with one hour before a one-on-one or a team meeting. He can already see that Tara is Developing at Value Based Discovery. He cannot tell whether she booked the wrong companies or cannot run the skill, and he cannot say which skill is worth that hour.',
        'Tara creates a lot of deals and does not have pipeline coverage. Close dates slip. His director asks what he is coaching and how he is measuring it. Eight different plans, one per rep, is more than he can run. He said they are mostly missing the same basics. His workaround is to paste transcripts into a language model, distrust the score, and go back to listening to calls himself.',
        'Two questions had to be answered together. Which skill is worth the next hour, and why. The why is the money sitting on the deals behind that skill.',
      ],
      metrics: [
        { value: '10 hrs', label: 'The whole sample, a few hours a day across six days' },
        { value: '1 hour', label: 'What Ellis actually has before the meeting or the one-on-one' },
        { value: 'Empty', label: 'Priority action on the Skill Report he already uses' },
      ],
    },
    {
      id: 'before',
      stage: 'Problem',
      title: 'The current screens stop at a number',
      body: [
        'This is the Skill Intelligence a manager could already open. Filters pick a role, a skill, a team, and a time window. The page then shows one Overall Skill Rating and a heatmap of who moved since last period. There are no named deals, no amounts, and no next step.',
        'The Skill Report can name strengths and growth areas, then it stops. Priority action is empty. "No actions have been identified." Diagnosis without a plan is another report to distrust.',
      ],
      figures: [
        {
          src: img('01-current-dashboard.png'),
          alt: 'Caliber Skill Intelligence dashboard. Value Based Discovery overall is 65, Proficient, above a team heatmap for the last 30 days.',
          caption:
            'Before. A score and a heatmap. The page does not show which deals sit behind the 65, what those deals are worth, or what to coach next.',
          layout: 'wide',
        },
        {
          src: img('02-empty-priority.png'),
          alt: 'Skill Report for Value Based Discovery. The team is outperforming 75 percent of the organization, with strengths and growth areas listed, and Priority action empty.',
          caption:
            'Before. The report can list strengths and growth areas. Priority action for the team still says no actions have been identified.',
          layout: 'center',
        },
      ],
      callout:
        'A manager who can see that a number is bad, and cannot see why, does not have a coaching tool.',
    },
    {
      id: 'research',
      stage: 'Process',
      title: 'Research',
      body: [
        'I started in the packet, the current product, and three customer conversations, before I drew a screen.',
        'On September 1, Britton Broderick walked the product with me. He confirmed the manager as the first user, and that the screen should show the monetary value of a skill.',
      ],
      bullets: [
        'Ellis, a front-line manager, can see that Tara is Developing and still cannot tell a bad-fit book from a weak skill, or which skill is worth his one hour.',
        'Reid, in enablement, cannot tell whether training spend moved performance, so the default stays one-size-fits-all.',
        'Jordan, a revenue leader, already overlaid skill on results by hand and saw a correlation. He still cannot say where the pipeline leaks, or trust coverage numbers that feel like a wet thumb.',
      ],
    },
    {
      id: 'the-model',
      stage: 'Process',
      title: 'What the screen can claim',
      body: [
        'My first pass treated deal value, win and loss, and stage movement as missing. They are not missing. Skill Intelligence already knows the score and a lightweight deal. It is aware of amount and outcome, and it does not use them yet. Joining them shows that skill and revenue go together. It does not prove the score caused the money. Caliber already has a formula for that value. The screen presents the number. It does not invent one.',
        'The unit is a live scored call, the deal it sits on, whether that deal moved, and what it is worth. Every open deal lands in one of four groups: the latest call on this skill was proficient or not, and the deal stalled or moved. Deals with no scored call stay out. The view refuses to characterize a book it cannot see.',
        'I kept the sample on one surface: the front-line manager, inside Skill Intelligence, on named deals. Enablement and the revenue leader still need the story. They get it when the manager can defend the hour.',
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
      stage: 'Process',
      title: 'The first version',
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
      id: 'early-figma',
      stage: 'Process',
      title: 'Wireframes and ideation',
      body: [
        'The first sketches put money next to the score in the most literal way. Each seller got a line for call scores, a line for wins, and a line for revenue, so a rise in skill and a rise in money would show up on the same chart.',
        'The four groups were harder. A filled quadrant read as four information cards with dots in them, not as a chart. I redrew those groups as horizontal bars, and I tried a spider chart, to see if another shape would make the skill gap obvious.',
        'I also moved the large blocks of the page around. Score, breakdown, bars, and the deal list changed order until the scan matched the hour: what is wrong, then which deals, then what to do.',
        'The frame I kept is the later graph. Gray is the hover. The filled cell is the one Ellis has selected. Proficient or better stays on top, stalled stays on the left, and the skill-gap cell is the one that has to be obvious. For Tara that is 8 deals and about $349K.',
      ],
      figures: [
        {
          src: img('09-line-graph.png'),
          alt: 'Early Skill Overview wireframe. Call scores, wins, and revenue are three yellow line charts for the team, with the same three stats repeated on John, Sarah, Kevin, and James.',
          caption:
            'An early line chart. Call scores, wins, and revenue sit on the same shape so skill and money look like they move together.',
          layout: 'wide',
        },
        {
          src: img('10-quadrant-cards.png'),
          alt: 'Early quadrant wireframe. Four large tinted rectangles meet at a crosshair, with a few dots in each, above person cards for John, Sarah, Kevin, and James.',
          caption:
            'An early quadrant. The four groups are filled blocks, and they read as cards more than as a graph.',
          layout: 'wide',
        },
        {
          src: img('11-bar-chart.png'),
          alt: 'Horizontal bar study for Value Based Discovery. Four colored bars count stalled and progressing deals after weak and strong calls, with a thinner stacked bar underneath.',
          caption:
            'The same four groups as bars. Stalled after a weak call is the long bar, and the thin bar underneath is the mix.',
          layout: 'wide',
        },
        {
          src: img('12-layout-orders.jpg'),
          alt: 'Three Figma layouts of Tara Whitfield side by side, reordering the score, the breakdown, the bars, and the deal list. The right-hand frame replaces the chart with four dollar cells.',
          caption:
            'Three orders of the same page. The right-hand frame tries a different quadrant, with dollars in each cell instead of one chart.',
          layout: 'wide',
        },
        {
          src: img('05-figma-quadrant.png'),
          alt: 'Figma study of the quadrant. The below-proficient, stalled cell is filled brown: 8 deals, $349K, consistent with a skill gap.',
          caption:
            'The graph I kept. Gray is the hover. The filled cell is the selection, and it is the skill gap.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'quadrant',
      stage: 'Solution',
      title: 'The quadrant chart',
      body: [
        'Version 1.1 is that chart, plus the cuts from my own critique. The forecast collapsed to a pair next to the gauge, +9 pts to about $70K, with the explanation behind the info icon. The paragraph under the chart became a small status: skill problem. Coverage is a fraction of scored deals, so a missing call does not look like a bad score.',
      ],
      figures: [
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
      stage: 'Solution',
      title: 'Creating a plan',
      body: [
        'Priority action was the hole in the current product. After the diagnosis, Ellis needs a dated focus he can describe to his director: what she will practice, how often, which live deals are watched, and what a plan like that has gone with.',
        'Changing the sub-skill, the window, or the practice cadence changes the pair on the modal. Six weeks on her lowest sub-skill, twice a week, sits next to about 12 points and about $95K. The numbers are a placeholder so the idea can be reviewed. Caliber already has the formula, and it replaces the math.',
        'Deals to watch start checked when they stalled after a weak call. He can see the recommendation. He does not have to rebuild the list from memory.',
      ],
      figures: [
        {
          src: img('07-focus.png'),
          alt: 'Set a 6-week focus for Tara Whitfield. Negative Consequence Development is marked lowest, practice is twice a week, and the plan sits beside plus 12 points and about $95K.',
          caption:
            'The focus. One sub-skill, a window, a practice cadence, and the deals the next live calls will be scored against.',
          layout: 'center',
        },
      ],
      table: {
        headers: ['What feedback changed', 'What I did with it'],
        rows: [
          [
            'Britton: the four groups are right, and the missing piece is money.',
            'Amounts stay on. Dollars sit next to the counts. The forecast presents the formula Caliber already has.',
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
      stage: 'Solution',
      title: 'Try it in the prototype',
      body: [
        'Tara is the skill problem. Priya\'s stalls show up after stronger calls, so the same chart points at the book instead of the skill. Nate is the fairness case: a newer rep running a better process than the scoreboard suggests. Simone has too thin a sample to characterize. Devon has no scored call on an open deal, and the page says so.',
        'Use it the way Ellis would. Start on the team, open Tara, and change the skill. Set a focus if you want to see the plan. The bar along the bottom is mine, so you can move between version 1.0 and 1.1 and between those people. It is not part of the product.',
      ],
      embed: {
        src: withBase('/proto/caliber-skill-on-deals'),
        query: 'play=1&v=1.1',
        title: 'Caliber Skill on Deals prototype',
        caption:
          'Version 1.1 is open on the team. Scroll inside the frame, use the bottom bar to switch version and person, and open Tara for the skill problem, Priya when the stalls are not the skill, or Devon when there is no scored call to judge.',
      },
    },
    {
      id: 'success',
      stage: "What's next",
      title: 'How we would know it worked',
      body: [
        'The sample did not produce these numbers. They are the measures I would put on a shipped version, so a later pass can tell whether the hour is actually getting easier and whether Caliber can defend the product.',
        'A manager should leave the page able to name the skill and the deals for the next hour without opening a call. After a one-on-one, Priority action should no longer be empty: a sub-skill, a practice cadence, and watched deals are set. When another skill has more money behind it than the weakest score, managers should open that skill too.',
        'Over six weeks, practice should be completed and the live score on that skill should move. Watched deals should be scored again. Stalled dollars behind weak calls should stay visible as a share of the book, so fit and skill stay separate. Caliber should be able to put that association in a renewal or enablement review. The screen still does not claim the score caused the revenue.',
      ],
      table: {
        headers: ['What we would watch', 'What would not count as success'],
        rows: [
          [
            'After a visit, the manager can name the skill and the deals for the next hour without listening to a call.',
            'He still has to open transcripts to decide what to coach.',
          ],
          [
            'Priority action is filled after a one-on-one: one sub-skill, a cadence, and watched deals.',
            'The Skill Report still ends on "No actions have been identified."',
          ],
          [
            'Managers switch off the weakest skill when another skill has more money behind it.',
            'Everyone is coached on the lowest score by default.',
          ],
          [
            'Over six weeks, practice is completed, the live score moves, and watched deals are scored again.',
            'Overall Skill Rating goes up with no watched deals and no practice evidence.',
          ],
          [
            'Stalled dollars behind weak calls are a visible share of the open book.',
            'A dollar claim that this plan will produce that money for one person.',
          ],
        ],
      },
    },
    {
      id: 'the-room',
      stage: "What's next",
      title: 'What is still needed',
      body: [
        'I walked this with the founders after the sample was in. The hour and the money landed. The quadrant and the colored bar in the team table did not, at least not cold. Someone meeting that chart for the first time had to be told what the axes were, out loud, before the fill meant "skill" or "the book."',
        'I would say the sentence the chart is for, before I point at a cell. Eight of Tara\'s scored open deals, about $349K, stalled after a weak discovery call. That is the coaching hour, unless another skill has more behind it. The bar in the table is the same four groups, drawn small, and it should not be the first time he learns the legend.',
        'I stopped at version 1.1. Another pass would put that sentence on the team row, and would treat the quadrant as something a director can read without a tour. The point of the sample was to find the problem and put an honest first answer on the product they already have.',
      ],
    },
  ],
};
