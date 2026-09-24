import { caliberSkillCase } from './caliber-skill';
import { csvMoveInAgentCase } from './csv-move-in-agent';
import { familysearchDiscoveryCase } from './familysearch-discovery';
import { mobileStrategyResidentLookupCase } from './mobile-strategy-resident-lookup';
import { moveInScannerCase } from './move-in-scanner';
import { pricingSpecialsCase } from './pricing-specials';
import type { RichCaseStudy } from './types';

export type {
  RichCaseStudy,
  CaseSection,
  CaseFigure,
  CaseMetric,
  CaseTable,
  CaseEmbed,
} from './types';

const richCases: Record<string, RichCaseStudy> = {
  [moveInScannerCase.slug]: moveInScannerCase,
  [csvMoveInAgentCase.slug]: csvMoveInAgentCase,
  [familysearchDiscoveryCase.slug]: familysearchDiscoveryCase,
  [pricingSpecialsCase.slug]: pricingSpecialsCase,
  [mobileStrategyResidentLookupCase.slug]: mobileStrategyResidentLookupCase,
  [caliberSkillCase.slug]: caliberSkillCase,
};

export function getRichCase(slug: string): RichCaseStudy | undefined {
  return richCases[slug];
}
