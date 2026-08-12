import { moveInScannerCase } from './move-in-scanner';
import type { RichCaseStudy } from './types';

export type { RichCaseStudy, CaseSection, CaseFigure, CaseMetric, CaseTable } from './types';

const richCases: Record<string, RichCaseStudy> = {
  [moveInScannerCase.slug]: moveInScannerCase,
};

export function getRichCase(slug: string): RichCaseStudy | undefined {
  return richCases[slug];
}
