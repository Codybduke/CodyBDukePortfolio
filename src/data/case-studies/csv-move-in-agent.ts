import type { RichCaseStudy } from './types';
import { withBase } from '../../lib/paths';

const img = (file: string) => withBase(`/work/csv-move-in-agent/${file}`);

export const csvMoveInAgentCase: RichCaseStudy = {
  slug: 'csv-move-in-agent',
  openingClaim:
    'After student move-in day, the resident already has keys and Entrata often still has a spreadsheet. Staff re-key every name the next morning. For a 300-resident property that was about eight hours of overtime in the busiest week of the year. I designed an agent that would take that file, match each row to a lease, and show the work before anything was written. Field work on the table later moved the main bet to a phone in the line. This upload stayed as the overnight bridge for teams that keep the paper.',
  collaborators:
    'Customer Workflows engineering, the owned delivery team on the agent, and the same student-housing operators who later broke the first mobile spec',
  surface:
    'Desktop Entrata — Residents, then Tools, then Bulk Move-In. A walkable prototype, not a production metric.',
  heroFigure: {
    src: img('01-preflight.png'),
    alt: 'Bulk Move-In review after an upload: 277 will be moved in, 30 have follow-up tasks, and 23 unresolved rows.',
    caption:
      'The check before the write. The agent has already sorted the file. Staff can still change a row, skip it, or turn it into a follow-up.',
    layout: 'hero',
  },
  sections: [
    {
      id: 'problem',
      title: 'The morning after, Entrata was still a spreadsheet',
      body: [
        'On move-in day, staff stay offline so the line can move. They mark names on a printed roll or a laptop sheet, hand over keys, and send the resident on. The next morning someone opens that file and types every person into Entrata. For a 300-resident property that was about eight hours of overtime. Desktop Bulk Move-In, the existing tool for processing many residents at once, barely showed up in peak months.',
        'The first product I designed accepted that workaround. Keep the spreadsheet. Upload it. Let an agent match the rows. Do not force the table to change before we could recover the system of record.',
      ],
      metrics: [
        {
          value: '~8 hrs',
          label: 'Manual re-key after a 300-resident move-in day',
        },
        {
          value: '~0%',
          label: 'Peak-month use of desktop Bulk Move-In at the largest operator in the set',
        },
      ],
    },
    {
      id: 'trust',
      title: 'The agent shows its work before anything is written',
      body: [
        'The walkable prototype treats the spreadsheet as the source of truth. It does not ask staff to map columns by hand. What they have to check is the match. After the file lands, rows go into three buckets: people who will be moved in, people who will be moved in with a follow-up task, and rows the agent will skip unless a person steps in.',
        'A missing pet screening or vehicle registration does not block the move-in. The agent still processes the resident and creates a follow-up. When two people share a name, staff pick the lease. Confidence sits on that choice. They can confirm, skip, or turn the row into a task. Nothing commits until they do.',
      ],
      figures: [
        {
          src: img('01-preflight.png'),
          alt: 'Bulk Move-In review with 277 ready to move in, 30 follow-up tasks, and 23 unresolved rows, starting with J. Smith in A-102.',
          caption:
            'Staff see the three buckets before launch. J. Smith in A-102 is unresolved because two residents match the name.',
          layout: 'wide',
        },
        {
          src: img('02-follow-up.png'),
          alt: 'Follow-up bucket of matched residents missing checklist items, each marked that a task will be created.',
          caption:
            'These people will still move in. The leftover work becomes a task, so the overnight upload does not wait on a perfect checklist.',
          layout: 'wide',
        },
        {
          src: img('03-resolve.png'),
          alt: 'Resolve dialog for J. Smith in A-102, offering James Smith in Bed A or Jennifer Smith in Bed B, both at high confidence.',
          caption:
            'James in Bed A or Jennifer in Bed B. Both matches are high confidence. Staff pick the lease before the agent writes either one.',
          layout: 'wide',
        },
      ],
    },
    {
      id: 'pivot',
      title: 'A faster morning still left the day wrong',
      body: [
        'Site visits and interviews for the table app changed what this product was for. The resident already felt finished at the breezeway. Catching Entrata up overnight, even in under an hour, still left the system of record wrong while keys were going out. We shifted the main bet to a phone in the line. This upload stayed for properties that keep the paper and process it the next day.',
        'The time targets below are the bet for that overnight job. They are not results. Pilot actuals are not in yet.',
      ],
    },
    {
      id: 'outcome',
      title: 'These are the goals, not the results',
      body: [
        'The prototype is the artifact: a file becomes a preview, a person can still correct a match, and then the agent can write. It is not a claim about production time. The table-side case is the product we took further.',
      ],
      table: {
        headers: ['Metric', 'Target (unmeasured)'],
        rows: [
          ['Time to process a 300-resident property', 'Under 1 hour, from about 8 hours of re-key'],
          ['Residents processed without a person stepping in', '70%+'],
          ['Exceptions with a clear suggested resolution', '90%+'],
        ],
      },
    },
  ],
  sibling: {
    href: '/work/move-in-scanner',
    label: 'The table app that became the main bet',
  },
};
