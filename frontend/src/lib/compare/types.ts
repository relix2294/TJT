import type { Locale } from "@/lib/i18n";
import type { EarnAssetSlug } from "@/lib/earn/types";
import type { ProtocolSlug } from "@/lib/protocols/types";
import type { CompareTrustBadge, ProtocolTrustProfile } from "@/lib/trust";
import type { TrustScore } from "@/lib/trust-score";

/** Comparison page taxonomy — powers programmatic SEO expansion. */
export type ComparePageType = "protocol_vs_protocol" | "best_yield";

/** Initial compare slugs shipped in v1 foundation. */
export const COMPARE_SLUGS = [
  "aave-vs-lido",
  "aave-vs-jito",
  "lido-vs-jito",
  "morpho-vs-aave",
  "compound-vs-aave",
  "lido-vs-rocket-pool",
  "spark-vs-aave",
  "pendle-vs-etherfi",
  "compound-vs-morpho",
  "ethena-vs-aave",
  "best-usdt-yield",
  "best-usdc-yield",
  "best-eth-staking",
  "best-sol-staking",
  "best-eth-restaking",
  "best-liquid-staking",
] as const;

/** Protocol-vs-protocol compare slugs only. */
export const PROTOCOL_COMPARE_SLUGS = [
  "aave-vs-lido",
  "aave-vs-jito",
  "lido-vs-jito",
  "morpho-vs-aave",
  "compound-vs-aave",
  "lido-vs-rocket-pool",
  "spark-vs-aave",
  "pendle-vs-etherfi",
  "compound-vs-morpho",
  "ethena-vs-aave",
] as const;

export type ProtocolCompareSlug = (typeof PROTOCOL_COMPARE_SLUGS)[number];

export type CompareSlug = (typeof COMPARE_SLUGS)[number];

export type LocalizedString = Record<Locale, string>;

/** Single metric row for summary blocks and JSON-LD hooks. */
export type CompareMetric = {
  key: string;
  label: LocalizedString;
  value: string | number | null;
  format: "apy" | "tvl" | "score" | "text" | "chain" | "asset";
  available: boolean;
};

/** CPA offer edge on a compare page — conversion path to `/offers/{slug}`. */
export type CompareLinkedOffer = {
  id: string;
  slug: string;
  name: string;
  protocolSlug: string;
  network: string;
  apy: number;
  offerPath: string;
};

/** Crawl-oriented internal link on compare pages. */
export type CompareInternalLink = {
  href: string;
  label: string;
  type:
    | "earn"
    | "protocols"
    | "compare"
    | "offers"
    | "coins"
    | "news"
    | "reviews"
    | "safety"
    | "learn";
  slug?: string;
  priority: number;
};

/** Editorial prose blocks for protocol-vs-protocol compare detail pages. */
export type CompareEditorialFaqItem = {
  question: LocalizedString;
  answer: LocalizedString;
};

export type CompareProtocolOverview = {
  protocolName: string;
  title: LocalizedString;
  body: LocalizedString;
};

export type CompareDetailEditorial = {
  slug: ProtocolCompareSlug;
  leftOverview: CompareProtocolOverview;
  rightOverview: CompareProtocolOverview;
  useCaseComparison: { title: LocalizedString; body: LocalizedString };
  faq: CompareEditorialFaqItem[];
};

/** One side of a protocol-vs-protocol comparison table. */
export type ProtocolComparisonSide = {
  protocolSlug: ProtocolSlug;
  name: string;
  category: LocalizedString;
  apy: number | null;
  tvlUsd: number | null;
  tvlLabel: LocalizedString | null;
  chain: LocalizedString;
  supportedAsset: LocalizedString;
  /** Legacy dynamic score — retained for /protocols parity and fallback. */
  trustScore: TrustScore;
  /** Canonical static Trust Score v0.1 when slug is in TRUST_PROTOCOL_REGISTRY. */
  trustProfile?: ProtocolTrustProfile | null;
  /** Precomputed badge for compare table (static score + category label). */
  trustBadge?: CompareTrustBadge | null;
  riskExplanation: LocalizedString;
  protocolPath: string;
};

/** Protocol-vs-protocol comparison payload. */
export type ProtocolComparison = {
  type: "protocol_vs_protocol";
  left: ProtocolComparisonSide;
  right: ProtocolComparisonSide;
  /** Shared earn context when protocols overlap on an asset. */
  sharedAsset?: EarnAssetSlug;
};

/** Single yield opportunity row on best-yield comparison pages. */
export type YieldComparisonRow = {
  id: string;
  protocolSlug: string;
  protocolName: string;
  apy: number | null;
  tvlUsd: number | null;
  tvlLabel: LocalizedString | null;
  chain: LocalizedString;
  supportedAsset: string;
  /** Legacy dynamic score — retained for /protocols parity and fallback. */
  trustScore: TrustScore;
  /** Canonical static Trust Score v0.1 when slug is in TRUST_PROTOCOL_REGISTRY. */
  trustProfile?: ProtocolTrustProfile | null;
  /** Precomputed badge for compare table (static score + category label). */
  trustBadge?: CompareTrustBadge | null;
  riskExplanation: LocalizedString;
  earnPath: string;
  protocolPath: string;
  offerSlug?: string;
  offerPath?: string;
};

/** Best-yield comparison payload — asset-scoped market context. */
export type YieldComparison = {
  type: "best_yield";
  assetSlug: EarnAssetSlug;
  assetSymbol: string;
  rows: YieldComparisonRow[];
};

/**
 * Full compare page entity — hydrated from earn + protocol registries and CPA catalog.
 * Distinct from hub cards; powers `/compare/{slug}` detail routes.
 */
export type ComparePage = {
  slug: CompareSlug;
  type: ComparePageType;
  title: LocalizedString;
  summary: LocalizedString;
  comparison: ProtocolComparison | YieldComparison;
  metrics: CompareMetric[];
  linkedOffers: CompareLinkedOffer[];
  internalLinks: CompareInternalLink[];
  riskExplanation: LocalizedString;
  disclaimer: LocalizedString;
};

export function resolveCompareLocalized(
  value: LocalizedString,
  lang: Locale,
): string {
  return value[lang];
}

export function isCompareSlug(value: string): value is CompareSlug {
  return (COMPARE_SLUGS as readonly string[]).includes(value);
}

export function isProtocolComparison(
  comparison: ProtocolComparison | YieldComparison,
): comparison is ProtocolComparison {
  return comparison.type === "protocol_vs_protocol";
}

export function isYieldComparison(
  comparison: ProtocolComparison | YieldComparison,
): comparison is YieldComparison {
  return comparison.type === "best_yield";
}
