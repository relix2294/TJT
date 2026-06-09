export {
  DEFAULT_OG_IMAGE,
  FALLBACK_BASE_URL,
  getMetadataBase,
  getSiteUrl,
  OG_IMAGE_DIMENSIONS,
} from "@/lib/seo/constants";

export {
  absoluteUrl,
  detailPath,
  hreflangAlternates,
  hubPath,
  languageAlternates,
  localePath,
  SEO_CONTENT_TYPES,
  SEO_HUB_PATH,
  SEO_ROUTE_MAP,
  sitemapLanguageAlternates,
  targetDetailPath,
  type SeoContentType,
} from "@/lib/seo/urls";

export {
  generatePageMetadata,
  noIndexMetadata,
  type PageMetadataInput,
} from "@/lib/seo/metadata";

export {
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildFinancialProductSchema,
  buildNewsArticleSchema,
  buildOrganizationSchema,
  buildProductSchema,
  buildWebSiteSchema,
  serializeJsonLd,
  type BreadcrumbItem,
} from "@/lib/seo/json-ld";

export {
  buildLocalizedHubEntries,
  buildSitemapEntry,
  buildSitemapIndexEntry,
  buildStaticHubEntries,
  chunkSitemapEntries,
  SITEMAP_CHUNK_SIZE,
  type SitemapEntryInput,
} from "@/lib/seo/sitemap";

export {
  calculatorLink,
  dedupeInternalLinks,
  getHubLinks,
  getRelatedCoinLinks,
  getRelatedEarnLinks,
  getRelatedNewsByCategory,
  getRelatedNewsLinks,
  getRelatedOfferLinks,
  type InternalLink,
  type InternalLinkContext,
} from "@/lib/seo/internal-links";
