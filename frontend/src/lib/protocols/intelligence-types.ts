import type { CompareSlug } from "@/lib/compare/types";
import type { Locale } from "@/lib/i18n";
import type { LocalizedString, ProtocolSlug } from "@/lib/protocols/types";

export type ProtocolTvlTier = "tier_1" | "tier_2" | "tier_3";

export type ProtocolRiskType =
  | "smart_contract"
  | "governance"
  | "liquidity"
  | "depeg"
  | "validator";

export type ProtocolRiskSeverity = "low" | "medium" | "high";

export type ProtocolRiskItem = {
  type: ProtocolRiskType;
  severity: ProtocolRiskSeverity;
  description: LocalizedString;
};

export type ProtocolTrustBreakdownComponent = {
  key: "audits" | "tvl_stability" | "track_record" | "liquidity" | "governance";
  label: LocalizedString;
  score: number;
  rationale: LocalizedString;
};

export type ProtocolIntelligenceSeed = {
  keyFacts: {
    launchYear: number;
    tvlTier: ProtocolTvlTier;
    primaryUseCase: LocalizedString;
  };
  whyUsersChoose: LocalizedString[];
  mainRisks: ProtocolRiskItem[];
  bestFor: LocalizedString[];
  notIdealFor: LocalizedString[];
  alternatives: ProtocolSlug[];
  relatedComparisons: CompareSlug[];
  /** CPA offer slugs — resolved at runtime against linked offers. */
  relatedOpportunitySlugs: string[];
};

export type ResolvedProtocolOpportunity = {
  slug: string;
  label: string;
  apy: number;
  href: string;
  type: "offer" | "earn";
};

export type ResolvedProtocolIntelligence = {
  keyFacts: {
    category: string;
    launchYear: number;
    chains: string;
    tvlTier: string;
    primaryUseCase: string;
  };
  whyUsersChoose: string[];
  mainRisks: Array<{
    type: ProtocolRiskType;
    typeLabel: string;
    severity: ProtocolRiskSeverity;
    severityLabel: string;
    description: string;
  }>;
  bestFor: string[];
  notIdealFor: string[];
  trustBreakdown: Array<{
    key: ProtocolTrustBreakdownComponent["key"];
    label: string;
    score: number;
    rationale: string;
  }>;
  compositeScore: number | null;
  alternatives: Array<{ slug: ProtocolSlug; name: string; href: string }>;
  relatedComparisons: Array<{ slug: CompareSlug; label: string; href: string }>;
  relatedOpportunities: ResolvedProtocolOpportunity[];
  suggestedNextStep: {
    compareAlternatives: { label: string; href: string };
    reviewRisks: { label: string; href: string };
    viewOpportunities: { label: string; href: string };
  };
};

export function resolveIntelligenceString(
  value: LocalizedString,
  lang: Locale,
): string {
  return value[lang];
}
