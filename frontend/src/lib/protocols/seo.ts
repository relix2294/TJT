import { SITE } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo/urls";
import type { Protocol } from "@/lib/protocols/types";
import { resolveProtocolLocalized } from "@/lib/protocols/types";
import { protocolDetailPath, protocolsHubPath } from "@/lib/protocols/paths";

type JsonLd = Record<string, unknown>;

export function protocolsHubMetadataPath(lang: Locale): string {
  return protocolsHubPath(lang);
}

export function protocolDetailMetadataPath(
  lang: Locale,
  protocol: Protocol,
): string {
  return protocolDetailPath(lang, protocol.slug);
}

/** WebPage + ItemList schema for the protocols hub. */
export function buildProtocolsHubJsonLd(input: {
  lang: Locale;
  title: string;
  description: string;
  protocols: Protocol[];
}): JsonLd[] {
  const path = protocolsHubPath(input.lang);
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
      numberOfItems: input.protocols.length,
      itemListElement: input.protocols.map((protocol, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: protocol.name,
        url: absoluteUrl(protocolDetailPath(input.lang, protocol.slug)),
      })),
    },
  ];
}

/** FinancialService + Offer catalog schema for protocol detail pages. */
export function buildProtocolDetailJsonLd(input: {
  lang: Locale;
  protocol: Protocol;
}): JsonLd[] {
  const path = protocolDetailPath(input.lang, input.protocol.slug);
  const description = resolveProtocolLocalized(
    input.protocol.description,
    input.lang,
  );

  const schemas: JsonLd[] = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: `${input.protocol.name} Protocol`,
      description,
      url: absoluteUrl(path),
      inLanguage: input.lang,
      category: resolveProtocolLocalized(
        input.protocol.category.name,
        input.lang,
      ),
      provider: {
        "@type": "Organization",
        name: input.protocol.name,
      },
    },
  ];

  if (input.protocol.linkedOffers.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${input.protocol.name} linked offers`,
      numberOfItems: input.protocol.linkedOffers.length,
      itemListElement: input.protocol.linkedOffers.map((offer, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: offer.name,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: offer.apy,
            priceCurrency: "APY",
          },
        },
      })),
    });
  }

  if (input.protocol.earnOpportunities.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${input.protocol.name} earn opportunities`,
      numberOfItems: input.protocol.earnOpportunities.length,
      itemListElement: input.protocol.earnOpportunities.map((opp, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: resolveProtocolLocalized(opp.headline, input.lang),
        url: absoluteUrl(opp.earnAssetPath),
      })),
    });
  }

  return schemas;
}
