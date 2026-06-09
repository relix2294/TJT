import type { Locale } from "@/lib/i18n";
import { detailPath, hubPath, localePath } from "@/lib/seo/urls";
import { earnHubPath } from "@/lib/earn/paths";
import type { InternalLink } from "@/lib/seo/internal-links";
import type { Protocol, ProtocolSlug } from "@/lib/protocols/types";
import { resolveProtocolLocalized } from "@/lib/protocols/types";
import { protocolDetailPath, protocolsHubPath } from "@/lib/protocols/paths";

/** Cross-links between protocol review pages. */
export function getRelatedProtocolLinks(
  lang: Locale,
  currentSlug: ProtocolSlug,
  protocols: Protocol[],
  limit = 3,
): InternalLink[] {
  return protocols
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit)
    .map((protocol) => ({
      href: protocolDetailPath(lang, protocol.slug),
      label: `${protocol.name} Review`,
      type: "protocols" as const,
      slug: protocol.slug,
      priority: 0.75,
    }));
}

/** Earn asset hub links for a protocol page. */
export function getProtocolEarnAssetLinks(
  lang: Locale,
  protocol: Protocol,
): InternalLink[] {
  return protocol.supportedAssets.map((asset) => ({
    href: asset.earnPath,
    label: `${asset.symbol} Earn`,
    type: "earn" as const,
    slug: asset.slug,
    priority: 0.85,
  }));
}

/** Linked CPA offers on a protocol page — keeps /offers routes live. */
export function getProtocolOfferLinks(
  lang: Locale,
  protocol: Protocol,
): InternalLink[] {
  return protocol.linkedOffers.map((offer) => ({
    href: offer.offerPath,
    label: offer.name,
    type: "protocols" as const,
    slug: offer.slug,
    priority: 0.8,
  }));
}

/** Hub + sibling protocol links for protocols pages. */
export function getProtocolsHubLinkGraph(
  lang: Locale,
  currentPath: string,
  protocols: Protocol[],
): InternalLink[] {
  const links: InternalLink[] = [
    {
      href: protocolsHubPath(lang),
      label: "Protocols",
      type: "protocols",
      priority: 0.9,
    },
    {
      href: earnHubPath(lang),
      label: "Earn",
      type: "earn",
      priority: 0.88,
    },
    {
      href: localePath(lang, "/offers"),
      label: "Yield catalog",
      type: "protocols",
      priority: 0.82,
    },
    {
      href: hubPath(lang, "coins"),
      label: "Market",
      type: "coins",
      priority: 0.8,
    },
    {
      href: hubPath(lang, "news"),
      label: "News",
      type: "news",
      priority: 0.7,
    },
  ];

  for (const protocol of protocols) {
    const href = protocolDetailPath(lang, protocol.slug);
    if (href === currentPath) continue;
    links.push({
      href,
      label: `${protocol.name} Review`,
      type: "protocols",
      slug: protocol.slug,
      priority: 0.75,
    });
  }

  return links;
}

export { getProtocolComparePlaceholderLinks } from "@/lib/compare/internal-links";

/** Earn opportunity rows with offer deep-links when available. */
export function getProtocolEarnOpportunityLinks(
  lang: Locale,
  protocol: Protocol,
): InternalLink[] {
  return protocol.earnOpportunities.map((opp) => ({
    href: opp.offerSlug
      ? detailPath(lang, "protocols", opp.offerSlug)
      : opp.earnAssetPath,
    label: `${resolveProtocolLocalized(opp.headline, lang)} — ${opp.apy}% APY`,
    type: opp.offerSlug ? ("protocols" as const) : ("earn" as const),
    slug: opp.offerSlug ?? opp.assetSlug,
    priority: 0.78,
  }));
}
