import { SITE } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  type BreadcrumbItem,
} from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/urls";
import {
  EARN_HUB_ASSET_LISTING_TITLES,
  EARN_HUB_FAQ,
} from "@/lib/earn/content";
import type { Asset, YieldOpportunity } from "@/lib/earn/types";
import { resolveLocalized } from "@/lib/earn/types";
import { earnAssetPath, earnHubPath } from "@/lib/earn/paths";
import {
  getSeoPilotPagesByHub,
  resolvePilotLocalized,
  seoPilotDetailPath,
} from "@/lib/seo-pilot";

type JsonLd = Record<string, unknown>;

export type EarnHubMetadataInput = {
  lang: Locale;
  title: string;
  description: string;
};

export function earnHubMetadataPath(lang: Locale): string {
  return earnHubPath(lang);
}

export function earnAssetMetadataPath(lang: Locale, asset: Asset): string {
  return earnAssetPath(lang, asset.slug);
}

export type EarnHubListingItem = {
  name: string;
  url: string;
};

/** Build ordered earn hub listings: guides first, then asset pages. */
export function buildEarnHubListingItems(
  lang: Locale,
  assets: Asset[],
): EarnHubListingItem[] {
  const guides = getSeoPilotPagesByHub("earn").map((page) => ({
    name: resolvePilotLocalized(page.h1, lang),
    url: absoluteUrl(seoPilotDetailPath(lang, page.hubSegment, page.slug)),
  }));

  const assetItems = assets.map((asset) => ({
    name: EARN_HUB_ASSET_LISTING_TITLES[asset.slug][lang],
    url: absoluteUrl(earnAssetPath(lang, asset.slug)),
  }));

  return [...guides, ...assetItems];
}

/** WebPage + ItemList + FAQ + Breadcrumb schema for the earn hub. */
export function buildEarnHubJsonLd(input: {
  lang: Locale;
  title: string;
  description: string;
  assets: Asset[];
  breadcrumbs: BreadcrumbItem[];
}): JsonLd[] {
  const path = earnHubPath(input.lang);
  const listings = buildEarnHubListingItems(input.lang, input.assets);

  const faq = EARN_HUB_FAQ.map((item) => ({
    question: resolvePilotLocalized(item.question, input.lang),
    answer: resolvePilotLocalized(item.answer, input.lang),
  }));

  return [
    buildBreadcrumbList(input.breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: input.title,
      description: input.description,
      url: absoluteUrl(path),
      inLanguage: input.lang,
      isPartOf: {
        "@type": "WebSite",
        name: SITE.name,
        url: absoluteUrl(`/${input.lang}`),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: input.title,
      numberOfItems: listings.length,
      itemListElement: listings.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
    ...(faq.length ? [buildFaqPageSchema(faq)] : []),
  ];
}

/** FinancialProduct + Offer catalog schema for asset earn pages. */
export function buildEarnAssetJsonLd(input: {
  lang: Locale;
  asset: Asset;
  opportunities: YieldOpportunity[];
  topApy: number | null;
}): JsonLd[] {
  const path = earnAssetPath(input.lang, input.asset.slug);
  const description = resolveLocalized(input.asset.description, input.lang);

  const schemas: JsonLd[] = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: `${input.asset.symbol} Earn`,
      description,
      url: absoluteUrl(path),
      inLanguage: input.lang,
      category: "Cryptocurrency Yield",
      identifier: {
        "@type": "PropertyValue",
        name: "ticker",
        value: input.asset.symbol,
      },
      ...(input.topApy != null
        ? {
            interestRate: {
              "@type": "QuantitativeValue",
              value: input.topApy,
              unitText: "APY percent",
            },
          }
        : {}),
    },
  ];

  if (input.opportunities.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${input.asset.symbol} yield opportunities`,
      numberOfItems: input.opportunities.length,
      itemListElement: input.opportunities.map((opp, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: resolveLocalized(opp.headline, input.lang),
          description: resolveLocalized(opp.summary, input.lang),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: opp.apy,
            priceCurrency: "APY",
          },
        },
      })),
    });
  }

  return schemas;
}
