export type FunItem = {
  title: string;
  kind: 'Hobby' | 'Side project' | 'Experiment';
  blurb: string;
};

export const funItems: FunItem[] = [
  {
    title: 'Personal Product OS',
    kind: 'Side project',
    blurb:
      'How I run discovery, writing, research synthesis, and portfolio prep as a system — same ownership muscle as the day job, applied to myself.',
  },
  {
    title: 'Cursor skills & rules',
    kind: 'Side project',
    blurb:
      'Reusable agent skills, project rules, and workflows for UI/UX, research analysis, SQL pulls, and documentation — the tooling layer behind how I ship.',
  },
  {
    title: 'Prototype sandboxes',
    kind: 'Experiment',
    blurb:
      'Small coded prototypes and AI experiments that never need a PRD — places to test interaction ideas and agent patterns before they earn a case study.',
  },
  {
    title: 'Making & tinkering',
    kind: 'Hobby',
    blurb:
      'Placeholder for non-work hobbies you want public — swap this for whatever feels like you.',
  },
];
