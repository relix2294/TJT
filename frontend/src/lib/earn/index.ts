export {
  EARN_ASSET_SLUGS,
  CHAIN_SLUGS,
  TRUST_SCORE_FACTOR_KEYS,
  isEarnAssetSlug,
  isChainSlug,
  resolveLocalized,
  type Asset,
  type AssetCategory,
  type Chain,
  type ChainLayer,
  type ChainSlug,
  type EarnAssetSlug,
  type LocalizedString,
  type Protocol,
  type TrustScoreFactorKey,
  type TrustScorePlaceholder,
  type YieldOpportunity,
  type YieldOpportunityType,
} from "@/lib/earn/types";

export {
  EARN_ASSETS,
  EARN_CHAINS,
  EARN_PROTOCOLS,
  buildYieldOpportunitiesFromOffers,
  getEarnAsset,
  getEarnChain,
  getEarnProtocol,
  getOpportunitiesForAsset,
  getTopApyForAsset,
} from "@/lib/earn/registry";

export {
  earnHubPath,
  earnAssetPath,
  earnAssetChainPath,
  comparePath,
} from "@/lib/earn/paths";

export {
  buildEarnAssetJsonLd,
  buildEarnHubJsonLd,
  earnAssetMetadataPath,
  earnHubMetadataPath,
} from "@/lib/earn/seo";

export {
  filterOffersForAsset,
  getEarnComparePlaceholderLinks,
  getEarnHubLinkGraph,
  getEarnOfferLinks,
  getEarnToMarketLinks,
  getRelatedEarnAssetLinks,
} from "@/lib/earn/internal-links";

export {
  EARN_CONTENT_BLOCK_KEYS,
  EARN_HUB_COPY,
  buildEarnAssetContentBlocks,
  earnAssetMetaDescription,
  earnAssetMetaTitle,
  type EarnContentBlock,
  type EarnContentBlockKey,
} from "@/lib/earn/content";

export { buildEarnAssetTrustScore } from "@/lib/trust-score";
