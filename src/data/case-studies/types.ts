export type CaseFigureLayout = 'hero' | 'device' | 'pair' | 'trio' | 'wide';

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

export type CaseSection = {
  id: string;
  /** Quiet stage crumb — Rough / Evidence / Decisions / Making / Polished */
  stage?: string;
  title: string;
  body?: string[];
  bullets?: string[];
  metrics?: CaseMetric[];
  table?: CaseTable;
  figures?: CaseFigure[];
  /** Optional callout after body */
  callout?: string;
};

export type RichCaseStudy = {
  slug: string;
  openingClaim: string;
  collaborators?: string;
  surface?: string;
  heroFigure?: CaseFigure;
  sections: CaseSection[];
  sibling?: { href: string; label: string };
  nextCaptures?: string[];
};
