export {
  COMPARE_SLUGS,
  PROTOCOL_COMPARE_SLUGS,
  isCompareSlug,
  isProtocolComparison,
  isYieldComparison,
  resolveCompareLocalized,
  type CompareDetailEditorial,
  type CompareInternalLink,
  type CompareLinkedOffer,
  type CompareMetric,
  type ComparePage,
  type ComparePageType,
  type CompareSlug,
  type LocalizedString,
  type ProtocolCompareSlug,
  type ProtocolComparison,
  type ProtocolComparisonSide,
  type YieldComparison,
  type YieldComparisonRow,
} from "@/lib/compare/types";

export {
  getCompareDetailEditorial,
  hasCompareDetailEditorial,
} from "@/lib/compare/detail-content";

export {
  buildComparePagesFromOffers,
  getAllCompareSlugs,
  getComparePage,
  resolveComparePageSlug,
} from "@/lib/compare/registry";

export { compareDetailPath, compareHubPath } from "@/lib/compare/paths";

export {
  buildCompareDetailJsonLd,
  buildCompareHubJsonLd,
  compareDetailMetadataPath,
  compareHubMetadataPath,
} from "@/lib/compare/seo";

export {
  COMPARE_HUB_COPY,
  COMPARE_LEGAL_DISCLAIMER,
  comparePageMetaDescription,
  comparePageMetaTitle,
  comparePageTitle,
  getCompareSlugTitle,
} from "@/lib/compare/content";

export {
  buildComparePageInternalLinks,
  dedupeCompareInternalLinks,
  getCompareHubLinkGraph,
  getEarnCompareLinks,
  getEarnComparePlaceholderLinks,
  getProtocolCompareLinks,
  getProtocolComparePlaceholderLinks,
  getRelatedCompareLinks,
  toSeoInternalLinks,
} from "@/lib/compare/internal-links";
