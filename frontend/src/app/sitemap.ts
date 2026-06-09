import type { MetadataRoute } from "next";
import { loadAppConfig } from "@/lib/server-config";
import { LOCALES } from "@/lib/i18n";
import { EARN_ASSET_SLUGS } from "@/lib/earn";
import {
  buildSitemapEntry,
  buildStaticHubEntries,
  getSiteUrl,
} from "@/lib/seo";

/**
 * Dynamic sitemap for the bilingual (en/ru) TJT hub.
 *
 * Reads live `config.json` on every request so freshly published news and
 * CPA offers are exposed to crawlers without a redeploy. At 10,000+ URLs,
 * split into child sitemaps via `chunkSitemapEntries` — see `/docs/SEO_ARCHITECTURE.md`.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const staticEntries = buildStaticHubEntries(baseUrl, now);

  let config: Awaited<ReturnType<typeof loadAppConfig>> | null = null;
  try {
    config = await loadAppConfig("en");
  } catch (err) {
    console.error("[sitemap] config.json unavailable, emitting hub routes only:", err);
    return staticEntries;
  }

  const offerEntries: MetadataRoute.Sitemap = config.offers.flatMap((offer) =>
    LOCALES.map((lang) =>
      buildSitemapEntry(
        {
          baseUrl,
          lang,
          path: `/${lang}/offers/${offer.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
          localeNeutralPath: (l) => `/${l}/offers/${offer.slug}`,
        },
        now,
      ),
    ),
  );

  const newsEntries: MetadataRoute.Sitemap = config.news.flatMap((item) =>
    LOCALES.map((lang) =>
      buildSitemapEntry(
        {
          baseUrl,
          lang,
          path: `/${lang}/news/${item.slug}`,
          lastModified: item.publishedAt,
          changeFrequency: "daily",
          priority: 0.7,
          localeNeutralPath: (l) => `/${l}/news/${item.slug}`,
        },
        now,
      ),
    ),
  );

  const earnAssetEntries: MetadataRoute.Sitemap = EARN_ASSET_SLUGS.flatMap(
    (asset) =>
      LOCALES.map((lang) =>
        buildSitemapEntry(
          {
            baseUrl,
            lang,
            path: `/${lang}/earn/${asset}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.78,
            localeNeutralPath: (l) => `/${l}/earn/${asset}`,
          },
          now,
        ),
      ),
  );

  const marketEntries: MetadataRoute.Sitemap = config.market.flatMap((asset) =>
    LOCALES.map((lang) =>
      buildSitemapEntry(
        {
          baseUrl,
          lang,
          path: `/${lang}/market/${asset.slug}`,
          lastModified: now,
          changeFrequency: "always",
          priority: 0.75,
          localeNeutralPath: (l) => `/${l}/market/${asset.slug}`,
        },
        now,
      ),
    ),
  );

  return [
    ...staticEntries,
    ...earnAssetEntries,
    ...offerEntries,
    ...newsEntries,
    ...marketEntries,
  ];
}
