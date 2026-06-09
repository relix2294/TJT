import type { Locale } from "@/lib/i18n";
import type { EarnAssetSlug } from "@/lib/earn/types";
import type { ProtocolSlug } from "@/lib/protocols/types";
import type { TrustScore } from "@/lib/trust-score";

/** Comparison page taxonomy — powers programmatic SEO expansion. */
export type ComparePageType = "protocol_vs_protocol" | "best_yield";

/** Initial compare slugs shipped in v1 foundation. */
export const COMPARE_SLUGS = [
  "aave-vs-lido",
  "aave-vs-jito",
  "lido-vs-jito",
  "best-usdt-yield",
  "best-usdc-yield",
  "best-eth-staking",
  "best-sol-staking",
] as const;

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
  type: "earn" | "protocols" | "compare" | "offers" | "coins" | "news";
  slug?: string;
  priority: number;
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
  trustScore: TrustScore;
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
  trustScore: TrustScore;
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
