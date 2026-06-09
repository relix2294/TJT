import type { Locale } from "@/lib/i18n";

/** Supported earn asset slugs — powers `/earn/{asset}` routes. */
export const EARN_ASSET_SLUGS = ["usdt", "usdc", "eth", "sol"] as const;

export type EarnAssetSlug = (typeof EARN_ASSET_SLUGS)[number];

/** Chain slugs for future `/earn/{asset}/{chain}` routes. */
export const CHAIN_SLUGS = [
  "ethereum",
  "arbitrum",
  "solana",
  "polygon",
  "base",
  "optimism",
] as const;

export type ChainSlug = (typeof CHAIN_SLUGS)[number];

export type AssetCategory = "stablecoin" | "native";

/**
 * Earn Knowledge Graph node — a yieldable crypto asset.
 * Distinct from `MarketAsset` (price terminal) — focused on yield taxonomy.
 */
export type Asset = {
  slug: EarnAssetSlug;
  symbol: string;
  name: LocalizedString;
  category: AssetCategory;
  /** Chains where this asset can earn yield today or in planned expansion. */
  supportedChains: ChainSlug[];
  /** Short SEO description for asset hub pages. */
  description: LocalizedString;
};

export type ChainLayer = "L1" | "L2" | "alt-L1";

/**
 * Blockchain network node in the Earn Knowledge Graph.
 * Enables future `/earn/{asset}/{chain}` programmatic pages.
 */
export type Chain = {
  slug: ChainSlug;
  name: LocalizedString;
  layer: ChainLayer;
  /** Native gas token symbol, when applicable. */
  nativeAssetSymbol?: string;
};

/**
 * DeFi protocol node — bridges assets, chains, and yield opportunities.
 * Maps to CPA offer `protocol` field where available.
 */
export type Protocol = {
  slug: string;
  name: string;
  chains: ChainSlug[];
  assets: EarnAssetSlug[];
  /** Risk tier label (AAA, AA, etc.) — mirrors CPA offer risk ratings. */
  riskTier: string;
};

export type YieldOpportunityType =
  | "staking"
  | "lending"
  | "liquidity"
  | "restaking"
  | "vault";

/**
 * A single earnable position in the Knowledge Graph.
 * Links asset × chain × protocol; may reference a live CPA offer slug.
 */
export type YieldOpportunity = {
  id: string;
  assetSlug: EarnAssetSlug;
  chainSlug: ChainSlug;
  protocolSlug: string;
  type: YieldOpportunityType;
  apy: number;
  minDepositUsd: number;
  /** Live CPA offer slug when catalogued — powers internal links to `/offers/{slug}`. */
  offerSlug?: string;
  headline: LocalizedString;
  summary: LocalizedString;
};

/**
 * Placeholder for future Trust Score integration.
 * No scoring logic — structure only for AI-generated pages and JSON-LD hooks.
 */
export type TrustScorePlaceholder = {
  /** Always null until Trust Score ships. */
  score: null;
  status: "coming_soon";
  label: LocalizedString;
  /** Factor keys for future weighted scoring model. */
  factorKeys: readonly TrustScoreFactorKey[];
};

export const TRUST_SCORE_FACTOR_KEYS = [
  "audit_status",
  "tvl_depth",
  "smart_contract_age",
  "governance_decentralization",
  "historical_exploit_record",
  "liquidity_exit_speed",
] as const;

export type TrustScoreFactorKey = (typeof TRUST_SCORE_FACTOR_KEYS)[number];

/** Bilingual string leaf — resolved at page render time. */
export type LocalizedString = Record<Locale, string>;

export function resolveLocalized(
  value: LocalizedString,
  lang: Locale,
): string {
  return value[lang];
}

export function isEarnAssetSlug(value: string): value is EarnAssetSlug {
  return (EARN_ASSET_SLUGS as readonly string[]).includes(value);
}

export function isChainSlug(value: string): value is ChainSlug {
  return (CHAIN_SLUGS as readonly string[]).includes(value);
}
