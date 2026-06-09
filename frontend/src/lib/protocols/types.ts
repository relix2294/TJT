import type { Locale } from "@/lib/i18n";
import type { EarnAssetSlug, ChainSlug } from "@/lib/earn/types";
import type { ProtocolTrustProfile } from "@/lib/trust";
import type { TrustScore } from "@/lib/trust-score";

/** Supported protocol slugs — powers `/protocols/{slug}` routes. */
export const PROTOCOL_SLUGS = [
  "aave",
  "lido",
  "jito",
  "morpho",
  "spark",
  "rocket-pool",
  "etherfi",
  "pendle",
  "ethena",
  "compound",
] as const;

export type ProtocolSlug = (typeof PROTOCOL_SLUGS)[number];

export type ProtocolCategorySlug =
  | "lending"
  | "liquid_staking"
  | "dex"
  | "restaking"
  | "vault";

/**
 * Taxonomy node for protocol classification.
 * Distinct from earn asset categories — focused on DeFi protocol type.
 */
export type ProtocolCategory = {
  slug: ProtocolCategorySlug;
  name: LocalizedString;
  description: LocalizedString;
};

/**
 * Risk profile for a protocol — mirrors CPA offer risk ratings today.
 * `explanation` is a placeholder slot for future AI-generated risk prose.
 */
export type ProtocolRiskProfile = {
  tier: string;
  label: LocalizedString;
  explanation: LocalizedString;
};

/**
 * Supported asset on a protocol page — links to earn asset hubs.
 */
export type ProtocolSupportedAsset = {
  slug: EarnAssetSlug;
  symbol: string;
  name: LocalizedString;
  earnPath: string;
};

/**
 * Supported chain on a protocol page — resolved from earn chain registry.
 */
export type ProtocolSupportedChain = {
  slug: ChainSlug;
  name: LocalizedString;
  layer: string;
};

/**
 * Live CPA offer linked to a protocol review page.
 * Distinct from earn YieldOpportunity — focused on conversion paths.
 */
export type ProtocolLinkedOffer = {
  id: string;
  slug: string;
  name: string;
  network: string;
  apy: number;
  riskRating: string;
  minEntryUsd: number;
  offerPath: string;
  trackUrl: string;
};

/**
 * Earn opportunity edge on a protocol page — asset × chain with APY.
 */
export type ProtocolLinkedEarnOpportunity = {
  id: string;
  assetSlug: EarnAssetSlug;
  chainSlug: ChainSlug;
  type: string;
  apy: number;
  headline: LocalizedString;
  earnAssetPath: string;
  offerSlug?: string;
};

/**
 * @deprecated Use TrustScore from @/lib/trust-score — kept for backward-compatible imports.
 */
export type ProtocolTrustScorePlaceholder = {
  score: null;
  status: "coming_soon";
  label: LocalizedString;
  factorKeys: readonly string[];
};

/**
 * Full protocol entity for review pages.
 * Hydrated from earn registry + CPA offers — not stored separately in config.json yet.
 */
export type Protocol = {
  slug: ProtocolSlug;
  name: string;
  logo: string;
  category: ProtocolCategory;
  description: LocalizedString;
  riskProfile: ProtocolRiskProfile;
  supportedAssets: ProtocolSupportedAsset[];
  supportedChains: ProtocolSupportedChain[];
  linkedOffers: ProtocolLinkedOffer[];
  earnOpportunities: ProtocolLinkedEarnOpportunity[];
  /** Legacy dynamic score — retained for fallback and /earn parity. */
  trustScore: TrustScore;
  /** Canonical static Trust Score v0.1 when slug is in TRUST_PROTOCOL_REGISTRY. */
  trustProfile?: ProtocolTrustProfile | null;
};

export type LocalizedString = Record<Locale, string>;

export function resolveProtocolLocalized(
  value: LocalizedString,
  lang: Locale,
): string {
  return value[lang];
}

export function isProtocolSlug(value: string): value is ProtocolSlug {
  return (PROTOCOL_SLUGS as readonly string[]).includes(value);
}
