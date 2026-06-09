import { SITE } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo/urls";
import type { Asset, YieldOpportunity } from "@/lib/earn/types";
import { resolveLocalized } from "@/lib/earn/types";
import { earnAssetPath, earnHubPath } from "@/lib/earn/paths";

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

/** WebPage + ItemList schema for the earn hub. */
export function buildEarnHubJsonLd(input: {
  lang: Locale;
  title: string;
  description: string;
  assets: Asset[];
}): JsonLd[] {
  const path = earnHubPath(input.lang);
  return [
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
      numberOfItems: input.assets.length,
      itemListElement: input.assets.map((asset, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: asset.symbol,
        url: absoluteUrl(earnAssetPath(input.lang, asset.slug)),
      })),
    },
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
