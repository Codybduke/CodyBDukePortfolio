export type CaseFigureLayout = 'hero' | 'device' | 'pair' | 'trio' | 'wide' | 'center';

export type CaseFigure = {
  src: string;
  alt: string;
  caption: string;
  layout?: CaseFigureLayout;
};

export type CaseMetric = {
  value: string;
  label: string;
};

export type CaseTable = {
  headers: string[];
  rows: string[][];
};

export type CaseEmbed = {
  src: string;
  title: string;
  caption: string;
  hint?: string;
  /** Query string without `?`. When set, replaces the default phone-lab parameters. */
  query?: string;
};

export type CaseSection = {
  id: string;
  /** Parent shown once per group: Problem, Process, Solution, What's next. Results when the case shipped with measured outcomes. */
  stage?: string;
  title: string;
  body?: string[];
  bullets?: string[];
  metrics?: CaseMetric[];
  table?: CaseTable;
  figures?: CaseFigure[];
  /** Optional callout after body */
  callout?: string;
  /** Walkable coded prototype, rendered in a device-sized iframe */
  embed?: CaseEmbed;
};

export type RichCaseStudy = {
  slug: string;
  openingClaim: string;
  collaborators?: string;
  surface?: string;
  /** Public product URL if the work is still live and anyone can open it */
  live?: { href: string; label: string; note?: string };
  heroFigure?: CaseFigure;
  sections: CaseSection[];
  sibling?: { href: string; label: string };
  nextCaptures?: string[];
};
