import { SITE } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo/urls";

type JsonLd = Record<string, unknown>;

/** Safely serialize JSON-LD for inline `<script type="application/ld+json">`. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data);
}

export type BreadcrumbItem = { label: string; href?: string };

export function buildBreadcrumbList(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export type NewsArticleSchemaInput = {
  lang: Locale;
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  articleSection?: string;
  keywords?: string[];
  authorName?: string;
  publisherName?: string;
};

export function buildNewsArticleSchema(input: NewsArticleSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    inLanguage: input.lang,
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    ...(input.keywords?.length
      ? { keywords: input.keywords.join(", ") }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.path),
    },
    author: {
      "@type": "Organization",
      name: input.authorName ?? "TJT AI Research",
    },
    publisher: {
      "@type": "Organization",
      name: input.publisherName ?? SITE.name,
    },
  };
}

export type ProductSchemaInput = {
  path: string;
  name: string;
  description: string;
  brandName?: string;
};

export function buildProductSchema(input: ProductSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    ...(input.brandName
      ? { brand: { "@type": "Brand", name: input.brandName } }
      : {}),
    url: absoluteUrl(input.path),
  };
}

export type FinancialProductSchemaInput = {
  path: string;
  name: string;
  description: string;
  symbol?: string;
};

/** Schema for coin / market asset detail pages. */
export function buildFinancialProductSchema(
  input: FinancialProductSchemaInput,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.symbol
      ? { identifier: { "@type": "PropertyValue", name: "ticker", value: input.symbol } }
      : {}),
  };
}

export type WebSiteSchemaInput = {
  lang: Locale;
  path: string;
  name?: string;
  description?: string;
};

/** Site-wide WebSite schema — inject once per locale layout when ready. */
export function buildWebSiteSchema(input: WebSiteSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name ?? SITE.name,
    url: absoluteUrl(input.path),
    inLanguage: input.lang,
    ...(input.description ? { description: input.description } : {}),
  };
}

export type OrganizationSchemaInput = {
  name?: string;
  url: string;
  description?: string;
};

export function buildOrganizationSchema(input: OrganizationSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name ?? SITE.name,
    url: absoluteUrl(input.url),
    ...(input.description ? { description: input.description } : {}),
  };
}
