import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { LOCALES } from "@/lib/i18n";
import { loadAppConfig } from "@/lib/server-config";

/**
 * Dynamic sitemap for the bilingual (en/ru) TJT hub.
 *
 * Reads the live `config.json` on every request so freshly published news and
 * CPA offers are exposed to crawlers without a redeploy. Config reads are
 * fault-tolerant: if the Python backend is mid-write, we still emit the static
 * hub routes so this endpoint never returns 500.
 */
export const dynamic = "force-dynamic";

const FALLBACK_BASE_URL = "https://yourdomain.com";

function getBaseUrl(): string {
  return SITE.url || FALLBACK_BASE_URL;
}

/** `{ en: ".../en/...", ru: ".../ru/..." }` map for a locale-relative path. */
function languageAlternates(
  baseUrl: string,
  pathFor: (lang: string) => string,
) {
  return Object.fromEntries(
    LOCALES.map((lang) => [lang, `${baseUrl}${pathFor(lang)}`]),
  ) as Record<(typeof LOCALES)[number], string>;
}

/** Hub routes that never depend on config.json content. */
function buildStaticHubEntries(baseUrl: string, now: Date): MetadataRoute.Sitemap {
  return LOCALES.flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
      alternates: { languages: languageAlternates(baseUrl, (l) => `/${l}`) },
    },
    {
      url: `${baseUrl}/${lang}/news`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
      alternates: { languages: languageAlternates(baseUrl, (l) => `/${l}/news`) },
    },
    {
      url: `${baseUrl}/${lang}/market`,
      lastModified: now,
      changeFrequency: "always" as const,
      priority: 0.9,
      alternates: { languages: languageAlternates(baseUrl, (l) => `/${l}/market`) },
    },
    {
      url: `${baseUrl}/${lang}/tools/roi-calculator`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: languageAlternates(baseUrl, (l) => `/${l}/tools/roi-calculator`),
      },
    },
    {
      url: `${baseUrl}/${lang}/offers`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: languageAlternates(baseUrl, (l) => `/${l}/offers`) },
    },
  ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const staticEntries = buildStaticHubEntries(baseUrl, now);

  let config: Awaited<ReturnType<typeof loadAppConfig>> | null = null;
  try {
    // Slugs are locale-neutral; a single read is enough for both languages.
    config = await loadAppConfig("en");
  } catch (err) {
    console.error("[sitemap] config.json unavailable, emitting hub routes only:", err);
    return staticEntries;
  }

  const offerEntries: MetadataRoute.Sitemap = config.offers.flatMap((offer) =>
    LOCALES.map((lang) => ({
      url: `${baseUrl}/${lang}/offers/${offer.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: languageAlternates(baseUrl, (l) => `/${l}/offers/${offer.slug}`),
      },
    })),
  );

  const newsEntries: MetadataRoute.Sitemap = config.news.flatMap((item) =>
    LOCALES.map((lang) => ({
      url: `${baseUrl}/${lang}/news/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "daily" as const,
      priority: 0.7,
      alternates: {
        languages: languageAlternates(baseUrl, (l) => `/${l}/news/${item.slug}`),
      },
    })),
  );

  const marketEntries: MetadataRoute.Sitemap = config.market.flatMap((asset) =>
    LOCALES.map((lang) => ({
      url: `${baseUrl}/${lang}/market/${asset.slug}`,
      lastModified: now,
      changeFrequency: "always" as const,
      priority: 0.75,
      alternates: {
        languages: languageAlternates(
          baseUrl,
          (l) => `/${l}/market/${asset.slug}`,
        ),
      },
    })),
  );

  return [...staticEntries, ...offerEntries, ...newsEntries, ...marketEntries];
}
