import { familysearchDiscoveryCase } from './familysearch-discovery';
import { mobileStrategyResidentLookupCase } from './mobile-strategy-resident-lookup';
import { moveInScannerCase } from './move-in-scanner';
import type { RichCaseStudy } from './types';

export type { RichCaseStudy, CaseSection, CaseFigure, CaseMetric, CaseTable } from './types';

const richCases: Record<string, RichCaseStudy> = {
  [moveInScannerCase.slug]: moveInScannerCase,
  [familysearchDiscoveryCase.slug]: familysearchDiscoveryCase,
  [mobileStrategyResidentLookupCase.slug]: mobileStrategyResidentLookupCase,
};

export function getRichCase(slug: string): RichCaseStudy | undefined {
  return richCases[slug];
}
