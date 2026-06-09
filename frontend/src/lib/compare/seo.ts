import { SITE } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo/urls";
import type { CompareDetailEditorial, ComparePage } from "@/lib/compare/types";
import {
  isProtocolComparison,
  isYieldComparison,
  resolveCompareLocalized,
} from "@/lib/compare/types";
import { compareDetailPath, compareHubPath } from "@/lib/compare/paths";

type JsonLd = Record<string, unknown>;

export function compareHubMetadataPath(lang: Locale): string {
  return compareHubPath(lang);
}

export function compareDetailMetadataPath(
  lang: Locale,
  page: ComparePage,
): string {
  return compareDetailPath(lang, page.slug);
}

/** WebPage + ItemList schema for the compare hub. */
export function buildCompareHubJsonLd(input: {
  lang: Locale;
  title: string;
  description: string;
  pages: ComparePage[];
}): JsonLd[] {
  const path = compareHubPath(input.lang);
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
      numberOfItems: input.pages.length,
      itemListElement: input.pages.map((page, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: resolveCompareLocalized(page.title, input.lang),
        url: absoluteUrl(compareDetailPath(input.lang, page.slug)),
      })),
    },
  ];
}

/** WebPage + comparison ItemList schema for compare detail pages. */
export function buildCompareDetailJsonLd(input: {
  lang: Locale;
  page: ComparePage;
  editorial?: CompareDetailEditorial | null;
}): JsonLd[] {
  const path = compareDetailPath(input.lang, input.page.slug);
  const description = resolveCompareLocalized(input.page.summary, input.lang);
  const title = resolveCompareLocalized(input.page.title, input.lang);

  const schemas: JsonLd[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: absoluteUrl(path),
      inLanguage: input.lang,
      about: {
        "@type": "Thing",
        name: title,
        description: resolveCompareLocalized(input.page.disclaimer, input.lang),
      },
    },
  ];

  if (isProtocolComparison(input.page.comparison)) {
    const { left, right } = input.page.comparison;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: title,
      numberOfItems: 2,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "FinancialService",
            name: left.name,
            url: absoluteUrl(left.protocolPath),
            ...(left.apy != null
              ? {
                  interestRate: {
                    "@type": "QuantitativeValue",
                    value: left.apy,
                    unitText: "APY percent",
                  },
                }
              : {}),
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "FinancialService",
            name: right.name,
            url: absoluteUrl(right.protocolPath),
            ...(right.apy != null
              ? {
                  interestRate: {
                    "@type": "QuantitativeValue",
                    value: right.apy,
                    unitText: "APY percent",
                  },
                }
              : {}),
          },
        },
      ],
    });
  }

  if (isYieldComparison(input.page.comparison)) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${input.page.comparison.assetSymbol} yield comparison`,
      numberOfItems: input.page.comparison.rows.length,
      itemListElement: input.page.comparison.rows.map((row, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: `${row.protocolName} — ${row.supportedAsset}`,
          url: absoluteUrl(row.protocolPath),
          ...(row.apy != null
            ? {
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: row.apy,
                  priceCurrency: "APY",
                },
              }
            : {}),
        },
      })),
    });
  }

  if (input.editorial?.faq.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: input.editorial.faq.map((item) => ({
        "@type": "Question",
        name: resolveCompareLocalized(item.question, input.lang),
        acceptedAnswer: {
          "@type": "Answer",
          text: resolveCompareLocalized(item.answer, input.lang),
        },
      })),
    });
  }

  if (input.page.linkedOffers.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Linked CPA offers",
      numberOfItems: input.page.linkedOffers.length,
      itemListElement: input.page.linkedOffers.map((offer, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: offer.name,
          url: absoluteUrl(offer.offerPath),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: offer.apy,
            priceCurrency: "APY",
          },
        },
      })),
    });
  }

  return schemas;
}
