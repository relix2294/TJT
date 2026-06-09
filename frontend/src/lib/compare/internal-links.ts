import type { CpaOffer } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/seo/urls";
import { earnAssetPath, earnHubPath } from "@/lib/earn/paths";
import { protocolDetailPath } from "@/lib/protocols/paths";
import type { Asset } from "@/lib/earn/types";
import type { Protocol, ProtocolSlug } from "@/lib/protocols/types";
import type {
  CompareInternalLink,
  ComparePage,
  CompareSlug,
  LocalizedString,
} from "@/lib/compare/types";
import { COMPARE_SLUGS, isProtocolComparison } from "@/lib/compare/types";
import { compareDetailPath, compareHubPath } from "@/lib/compare/paths";
import { getCompareSlugTitle } from "@/lib/compare/content";

/** Map domain CompareInternalLink to shared SEO InternalLink shape. */
export function toSeoInternalLinks(
  links: CompareInternalLink[],
): import("@/lib/seo/internal-links").InternalLink[] {
  return links.map((link) => ({
    href: link.href,
    label: link.label,
    type: link.type === "offers" ? "protocols" : link.type,
    slug: link.slug,
    priority: link.priority,
  }));
}

/** Related compare pages — siblings in the same taxonomy. */
export function getRelatedCompareLinks(
  lang: Locale,
  currentSlug: CompareSlug,
  limit = 4,
): CompareInternalLink[] {
  return COMPARE_SLUGS.filter((slug) => slug !== currentSlug)
    .slice(0, limit)
    .map((slug) => ({
      href: compareDetailPath(lang, slug),
      label: getCompareSlugTitle(slug).en,
      type: "compare" as const,
      slug,
      priority: 0.72,
    }));
}

/** Hub graph for compare pages. */
export function getCompareHubLinkGraph(
  lang: Locale,
  currentPath: string,
): CompareInternalLink[] {
  const links: CompareInternalLink[] = [
    {
      href: compareHubPath(lang),
      label: "Compare",
      type: "compare",
      priority: 0.9,
    },
    {
      href: earnHubPath(lang),
      label: "Earn",
      type: "earn",
      priority: 0.88,
    },
    {
      href: localePath(lang, "/protocols"),
      label: "Protocols",
      type: "protocols",
      priority: 0.86,
    },
    {
      href: localePath(lang, "/offers"),
      label: "Yield catalog",
      type: "offers",
      priority: 0.82,
    },
  ];

  for (const slug of COMPARE_SLUGS) {
    const href = compareDetailPath(lang, slug);
    if (href === currentPath) continue;
    links.push({
      href,
      label: getCompareSlugTitle(slug).en,
      type: "compare",
      slug,
      priority: 0.7,
    });
  }

  return links;
}

/** Earn asset page → relevant best-yield compare links. */
export function getEarnCompareLinks(
  lang: Locale,
  asset: Asset,
): CompareInternalLink[] {
  const slugMap: Partial<Record<Asset["slug"], CompareSlug>> = {
    usdt: "best-usdt-yield",
    usdc: "best-usdc-yield",
    eth: "best-eth-staking",
    sol: "best-sol-staking",
  };
  const slug = slugMap[asset.slug];
  if (!slug) return [];

  return [
    {
      href: compareDetailPath(lang, slug),
      label: `${asset.symbol} yield comparison`,
      type: "compare",
      slug,
      priority: 0.78,
    },
    {
      href: earnAssetPath(lang, asset.slug),
      label: `${asset.symbol} Earn`,
      type: "earn",
      slug: asset.slug,
      priority: 0.85,
    },
  ];
}

/** Protocol page → protocol-vs-protocol compare links involving this protocol. */
export function getProtocolCompareLinks(
  lang: Locale,
  protocol: Protocol,
): CompareInternalLink[] {
  const pairs: Record<ProtocolSlug, CompareSlug[]> = {
    aave: ["aave-vs-lido", "aave-vs-jito"],
    lido: ["aave-vs-lido", "lido-vs-jito"],
    jito: ["aave-vs-jito", "lido-vs-jito"],
    morpho: ["best-usdc-yield", "best-usdt-yield"],
    spark: ["best-usdc-yield", "best-usdt-yield"],
    compound: ["best-usdc-yield", "best-usdt-yield"],
    "rocket-pool": ["best-eth-staking", "aave-vs-lido"],
    etherfi: ["best-eth-staking"],
    pendle: ["best-usdc-yield", "best-eth-staking"],
    ethena: ["best-usdt-yield", "best-usdc-yield"],
  };

  return (pairs[protocol.slug] ?? []).map((slug) => ({
    href: compareDetailPath(lang, slug),
    label: getCompareSlugTitle(slug).en,
    type: "compare",
    slug,
    priority: 0.76,
  }));
}

/** Compose internal links for a compare detail page. */
export function buildComparePageInternalLinks(
  lang: Locale,
  page: ComparePage,
  protocols: Protocol[],
  offers: CpaOffer[],
): CompareInternalLink[] {
  const links: CompareInternalLink[] = [
    {
      href: compareHubPath(lang),
      label: "Compare hub",
      type: "compare",
      priority: 0.92,
    },
    ...getRelatedCompareLinks(lang, page.slug),
  ];

  if (isProtocolComparison(page.comparison)) {
    for (const side of [page.comparison.left, page.comparison.right]) {
      links.push({
        href: side.protocolPath,
        label: `${side.name} Review`,
        type: "protocols",
        slug: side.protocolSlug,
        priority: 0.84,
      });
    }
    if (page.comparison.sharedAsset) {
      links.push({
        href: earnAssetPath(lang, page.comparison.sharedAsset),
        label: `${page.comparison.sharedAsset.toUpperCase()} Earn`,
        type: "earn",
        slug: page.comparison.sharedAsset,
        priority: 0.83,
      });
    }
  } else {
    links.push({
      href: earnAssetPath(lang, page.comparison.assetSlug),
      label: `${page.comparison.assetSymbol} Earn`,
      type: "earn",
      slug: page.comparison.assetSlug,
      priority: 0.86,
    });
    for (const row of page.comparison.rows) {
      links.push({
        href: row.protocolPath,
        label: `${row.protocolName} Review`,
        type: "protocols",
        slug: row.protocolSlug,
        priority: 0.8,
      });
      if (row.offerPath && row.offerSlug) {
        links.push({
          href: row.offerPath,
          label: row.offerSlug.replace(/-/g, " "),
          type: "offers",
          slug: row.offerSlug,
          priority: 0.78,
        });
      }
    }
  }

  for (const offer of page.linkedOffers.slice(0, 3)) {
    links.push({
      href: offer.offerPath,
      label: offer.name,
      type: "offers",
      slug: offer.slug,
      priority: 0.77,
    });
  }

  return dedupeCompareInternalLinks(links);
}

export function dedupeCompareInternalLinks(
  links: CompareInternalLink[],
): CompareInternalLink[] {
  const byHref = new Map<string, CompareInternalLink>();
  for (const link of links) {
    const existing = byHref.get(link.href);
    if (!existing || link.priority > existing.priority) {
      byHref.set(link.href, link);
    }
  }
  return [...byHref.values()].sort((a, b) => b.priority - a.priority);
}

/** @deprecated Use getEarnCompareLinks — kept for earn engine import parity. */
export function getEarnComparePlaceholderLinks(
  lang: Locale,
  asset: Asset,
): import("@/lib/seo/internal-links").InternalLink[] {
  return toSeoInternalLinks(getEarnCompareLinks(lang, asset));
}

/** @deprecated Use getProtocolCompareLinks — kept for protocols engine import parity. */
export function getProtocolComparePlaceholderLinks(
  lang: Locale,
  protocol: Protocol,
): import("@/lib/seo/internal-links").InternalLink[] {
  return toSeoInternalLinks(getProtocolCompareLinks(lang, protocol));
}
