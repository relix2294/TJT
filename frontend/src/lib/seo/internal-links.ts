import type { CpaOffer, MarketAsset, NewsItem } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { detailPath, hubPath, localePath, type SeoContentType } from "@/lib/seo/urls";
import {
  filterNewsByAsset,
  resolveRelatedAssets,
} from "@/lib/market-utils";

export type InternalLink = {
  href: string;
  label: string;
  type: SeoContentType | "hub" | "tool";
  slug?: string;
  priority: number;
};

export type InternalLinkContext = {
  lang: Locale;
  currentPath: string;
};

/** Hub pages every detail page should link back to (breadcrumb + footer parity). */
export function getHubLinks(lang: Locale): InternalLink[] {
  const hubs: { type: SeoContentType; label: string; priority: number }[] = [
    { type: "coins", label: "Market", priority: 0.9 },
    { type: "earn", label: "Yield", priority: 0.85 },
    { type: "news", label: "News", priority: 0.8 },
  ];

  return hubs.map(({ type, label, priority }) => ({
    href: hubPath(lang, type),
    label,
    type: "hub",
    priority,
  }));
}

/** Related offers on a coin page — same asset, sorted by APY. */
export function getRelatedEarnLinks(
  lang: Locale,
  offers: CpaOffer[],
  assetSymbol: string,
  limit = 4,
): InternalLink[] {
  const sym = assetSymbol.toUpperCase();
  return offers
    .filter(
      (o) =>
        o.network.toUpperCase().includes(sym) ||
        o.name.toUpperCase().includes(sym) ||
        o.protocol.toUpperCase().includes(sym),
    )
    .sort((a, b) => b.apy - a.apy)
    .slice(0, limit)
    .map((o) => ({
      href: detailPath(lang, "earn", o.slug),
      label: o.name,
      type: "earn" as const,
      slug: o.slug,
      priority: 0.7,
    }));
}

/** News mentioning a coin — contextual internal links for market detail. */
export function getRelatedNewsLinks(
  lang: Locale,
  news: NewsItem[],
  asset: MarketAsset,
  limit = 4,
): InternalLink[] {
  return filterNewsByAsset(news, asset)
    .slice(0, limit)
    .map((item) => ({
      href: detailPath(lang, "news", item.slug),
      label: item.title,
      type: "news" as const,
      slug: item.slug,
      priority: 0.65,
    }));
}

/** Similar coins from config `related_symbols`. */
export function getRelatedCoinLinks(
  lang: Locale,
  asset: MarketAsset,
  market: MarketAsset[],
  limit = 4,
): InternalLink[] {
  return resolveRelatedAssets(asset, market, limit).map((a) => ({
    href: detailPath(lang, "coins", a.slug),
    label: `${a.name} (${a.symbol})`,
    type: "coins" as const,
    slug: a.slug,
    priority: 0.6,
  }));
}

/** Same-category news on article pages. */
export function getRelatedNewsByCategory(
  lang: Locale,
  news: NewsItem[],
  category: NewsItem["category"],
  excludeSlug: string,
  limit = 3,
): InternalLink[] {
  return news
    .filter((n) => n.category === category && n.slug !== excludeSlug)
    .slice(0, limit)
    .map((item) => ({
      href: detailPath(lang, "news", item.slug),
      label: item.title,
      type: "news" as const,
      slug: item.slug,
      priority: 0.6,
    }));
}

/** Other offers in the earn catalog. */
export function getRelatedOfferLinks(
  lang: Locale,
  offers: CpaOffer[],
  excludeSlug: string,
  limit = 3,
): InternalLink[] {
  return offers
    .filter((o) => o.slug !== excludeSlug)
    .slice(0, limit)
    .map((o) => ({
      href: detailPath(lang, "earn", o.slug),
      label: o.name,
      type: "earn" as const,
      slug: o.slug,
      priority: 0.55,
    }));
}

/**
 * Merge and dedupe links by href, keeping the highest-priority entry.
 * Use when composing a page's internal link graph for crawl budget analysis.
 */
export function dedupeInternalLinks(links: InternalLink[]): InternalLink[] {
  const byHref = new Map<string, InternalLink>();
  for (const link of links) {
    const existing = byHref.get(link.href);
    if (!existing || link.priority > existing.priority) {
      byHref.set(link.href, link);
    }
  }
  return [...byHref.values()].sort((a, b) => b.priority - a.priority);
}

/** ROI calculator deep-link from any content page. */
export function calculatorLink(lang: Locale): InternalLink {
  return {
    href: localePath(lang, "/tools/roi-calculator"),
    label: "ROI Calculator",
    type: "tool",
    priority: 0.5,
  };
}
