import type { MetadataRoute } from "next";
import type { Locale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/seo/constants";
import { sitemapLanguageAlternates } from "@/lib/seo/urls";

/** Google recommends ≤ 50,000 URLs per sitemap file; chunk below that for headroom. */
export const SITEMAP_CHUNK_SIZE = 10_000;

export type SitemapEntryInput = {
  baseUrl?: string;
  lang: Locale;
  path: string;
  lastModified?: Date | string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
  /** When set, emits hreflang alternates for all locales. */
  localeNeutralPath?: (lang: Locale) => string;
};

function toDate(value: Date | string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  return value instanceof Date ? value : new Date(value);
}

/** Build a single sitemap entry with bilingual hreflang alternates. */
export function buildSitemapEntry(
  input: SitemapEntryInput,
  now: Date,
): MetadataRoute.Sitemap[number] {
  const baseUrl = input.baseUrl ?? getSiteUrl();
  const pathForLang =
    input.localeNeutralPath ?? ((l: Locale) => input.path.replace(`/${input.lang}`, `/${l}`));

  return {
    url: `${baseUrl}${input.path}`,
    lastModified: toDate(input.lastModified, now),
    changeFrequency: input.changeFrequency ?? "weekly",
    priority: input.priority ?? 0.5,
    alternates: {
      languages: sitemapLanguageAlternates(baseUrl, pathForLang),
    },
  };
}

/** Emit the same URL for every supported locale (hub routes). */
export function buildLocalizedHubEntries(
  options: {
    baseUrl?: string;
    pathSegment: string;
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  },
  now: Date,
): MetadataRoute.Sitemap {
  const baseUrl = options.baseUrl ?? getSiteUrl();
  return LOCALES.map((lang) =>
    buildSitemapEntry(
      {
        baseUrl,
        lang,
        path: `/${lang}${options.pathSegment}`,
        lastModified: options.lastModified ?? now,
        changeFrequency: options.changeFrequency,
        priority: options.priority,
        localeNeutralPath: (l) => `/${l}${options.pathSegment}`,
      },
      now,
    ),
  );
}

/** Static hub routes that never depend on config.json. */
export function buildStaticHubEntries(baseUrl: string, now: Date): MetadataRoute.Sitemap {
  return [
    ...buildLocalizedHubEntries(
      { baseUrl, pathSegment: "", changeFrequency: "daily", priority: 1.0 },
      now,
    ),
    ...buildLocalizedHubEntries(
      { baseUrl, pathSegment: "/news", changeFrequency: "daily", priority: 0.85 },
      now,
    ),
    ...buildLocalizedHubEntries(
      { baseUrl, pathSegment: "/market", changeFrequency: "always", priority: 0.9 },
      now,
    ),
    ...buildLocalizedHubEntries(
      {
        baseUrl,
        pathSegment: "/tools/roi-calculator",
        changeFrequency: "monthly",
        priority: 0.8,
      },
      now,
    ),
    ...buildLocalizedHubEntries(
      { baseUrl, pathSegment: "/offers", changeFrequency: "weekly", priority: 0.8 },
      now,
    ),
  ];
}

/** Split a large URL list into chunks for sitemap index files (future scale). */
export function chunkSitemapEntries<T>(entries: T[], chunkSize = SITEMAP_CHUNK_SIZE): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }
  return chunks;
}

/** Sitemap index entry pointing at a child sitemap file. */
export function buildSitemapIndexEntry(
  sitemapPath: string,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  return [
    {
      url: `${baseUrl}${sitemapPath}`,
      lastModified: lastModified ?? new Date(),
    },
  ];
}
