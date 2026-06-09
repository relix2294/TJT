import { LOCALES, type Locale } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/seo/constants";

/**
 * Target SEO URL taxonomy for 10,000+ programmatic pages.
 *
 * These are the *canonical content types* TJT will scale. Each maps to an
 * existing or planned App Router segment under `/{lang}/…`. Legacy paths
 * (`/market`, `/offers`) remain live — see `SEO_ROUTE_MAP` for aliases.
 */
export const SEO_CONTENT_TYPES = [
  "coins",
  "protocols",
  "compare",
  "earn",
  "news",
  "guides",
] as const;

export type SeoContentType = (typeof SEO_CONTENT_TYPES)[number];

/** Hub path segment per content type (locale-relative, without leading lang). */
export const SEO_HUB_PATH: Record<SeoContentType, string> = {
  coins: "/coins",
  protocols: "/protocols",
  compare: "/compare",
  earn: "/earn",
  news: "/news",
  guides: "/guides",
};

/**
 * Maps target SEO taxonomy → current live App Router paths.
 * Use `resolveLivePath` in metadata/sitemap until alias routes ship.
 */
export const SEO_ROUTE_MAP: Record<
  SeoContentType,
  { hub: string; detail: (slug: string) => string }
> = {
  coins: {
    hub: "/market",
    detail: (slug) => `/market/${slug}`,
  },
  protocols: {
    hub: "/protocols",
    detail: (slug) => `/offers/${slug}`,
  },
  compare: {
    hub: "/compare",
    detail: (slug) => `/compare/${slug}`,
  },
  earn: {
    hub: "/earn",
    detail: (slug) => `/earn/${slug}`,
  },
  news: {
    hub: "/news",
    detail: (slug) => `/news/${slug}`,
  },
  guides: {
    hub: "/news",
    detail: (slug) => `/news/${slug}`,
  },
};

/** Build a locale-prefixed path: `/en/market/bitcoin`. */
export function localePath(lang: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${normalized}`;
}

/** Absolute URL for a locale-prefixed path. */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

/** Canonical path for a content detail page (uses live route map). */
export function detailPath(
  lang: Locale,
  type: SeoContentType,
  slug: string,
): string {
  return localePath(lang, SEO_ROUTE_MAP[type].detail(slug));
}

/** Canonical path for a content hub page (uses live route map). */
export function hubPath(lang: Locale, type: SeoContentType): string {
  return localePath(lang, SEO_ROUTE_MAP[type].hub);
}

/**
 * Future canonical path under the target taxonomy (for docs / migration).
 * Does NOT reflect live routes until alias rewrites are enabled.
 */
export function targetDetailPath(
  lang: Locale,
  type: SeoContentType,
  slug: string,
): string {
  return localePath(lang, `${SEO_HUB_PATH[type]}/${slug}`);
}

/** `{ en: "/en/…", ru: "/ru/…" }` hreflang alternates for a locale-neutral path. */
export function languageAlternates(
  pathForLang: (lang: Locale) => string,
): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((lang) => [lang, pathForLang(lang)]),
  ) as Record<Locale, string>;
}

/** hreflang map with optional `x-default` pointing at English. */
export function hreflangAlternates(
  pathForLang: (lang: Locale) => string,
  options?: { includeXDefault?: boolean },
): Record<string, string> {
  const langs = languageAlternates(pathForLang);
  if (options?.includeXDefault) {
    return { ...langs, "x-default": pathForLang("en") };
  }
  return langs;
}

/** Bilingual alternates as absolute URLs (for sitemap `alternates.languages`). */
export function sitemapLanguageAlternates(
  baseUrl: string,
  pathForLang: (lang: Locale) => string,
): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((lang) => [lang, `${baseUrl}${pathForLang(lang)}`]),
  ) as Record<Locale, string>;
}
