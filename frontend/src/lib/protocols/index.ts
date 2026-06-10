export {
  PROTOCOL_SLUGS,
  isProtocolSlug,
  resolveProtocolLocalized,
  type Protocol,
  type ProtocolCategory,
  type ProtocolCategorySlug,
  type ProtocolLinkedEarnOpportunity,
  type ProtocolLinkedOffer,
  type ProtocolRiskProfile,
  type ProtocolSlug,
  type ProtocolSupportedAsset,
  type ProtocolSupportedChain,
  type ProtocolTrustScorePlaceholder,
  type LocalizedString,
} from "@/lib/protocols/types";

export {
  buildProtocolsFromOffers,
  getAllProtocolSlugs,
  getProtocol,
  getProtocolByOfferProtocol,
} from "@/lib/protocols/registry";

export {
  protocolComparePath,
  protocolDetailPath,
  protocolsHubPath,
} from "@/lib/protocols/paths";

export {
  buildProtocolDetailJsonLd,
  buildProtocolsHubJsonLd,
  protocolDetailMetadataPath,
  protocolsHubMetadataPath,
} from "@/lib/protocols/seo";

export {
  getProtocolComparePlaceholderLinks,
  getProtocolEarnAssetLinks,
  getProtocolEarnOpportunityLinks,
  getProtocolOfferLinks,
  getProtocolReviewLink,
  getProtocolsHubLinkGraph,
  getRelatedProtocolLinks,
} from "@/lib/protocols/internal-links";

export {
  PROTOCOLS_HUB_COPY,
  PROTOCOL_CONTENT_BLOCK_KEYS,
  buildProtocolContentBlocks,
  protocolMetaDescription,
  protocolMetaTitle,
  type ProtocolContentBlock,
  type ProtocolContentBlockKey,
} from "@/lib/protocols/content";

export {
  getProtocolIntelligenceComparisons,
  getProtocolIntelligenceSeed,
  TVL_TIER_LABELS,
} from "@/lib/protocols/intelligence";

export {
  buildTrustBreakdownFromProfile,
  resolveProtocolIntelligence,
} from "@/lib/protocols/intelligence-resolve";

export type {
  ProtocolIntelligenceSeed,
  ProtocolRiskItem,
  ProtocolRiskSeverity,
  ProtocolRiskType,
  ProtocolTvlTier,
  ProtocolTrustBreakdownComponent,
  ResolvedProtocolIntelligence,
  ResolvedProtocolOpportunity,
} from "@/lib/protocols/intelligence-types";
