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
function toSeoLinkType(
  type: CompareInternalLink["type"],
): import("@/lib/seo/internal-links").InternalLink["type"] {
  if (type === "offers" || type === "reviews" || type === "safety") {
    return "protocols";
  }
  if (type === "learn") return "guides";
  return type;
}

export function toSeoInternalLinks(
  links: CompareInternalLink[],
): import("@/lib/seo/internal-links").InternalLink[] {
  return links.map((link) => ({
    href: link.href,
    label: link.label,
    type: toSeoLinkType(link.type),
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
  const extraEthLinks: CompareInternalLink[] =
    asset.slug === "eth"
      ? [
          {
            href: compareDetailPath(lang, "best-liquid-staking"),
            label: "Liquid staking comparison",
            type: "compare",
            slug: "best-liquid-staking",
            priority: 0.76,
          },
          {
            href: compareDetailPath(lang, "best-eth-restaking"),
            label: "ETH restaking comparison",
            type: "compare",
            slug: "best-eth-restaking",
            priority: 0.75,
          },
        ]
      : [];
  const usdcRiskLink: CompareInternalLink[] =
    asset.slug === "usdc"
      ? [
          {
            href: localePath(lang, "/learn/usdc-yield-risks"),
            label: "USDC yield risks guide",
            type: "learn",
            slug: "usdc-yield-risks",
            priority: 0.74,
          },
        ]
      : [];
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
    ...extraEthLinks,
    ...usdcRiskLink,
  ];
}

const PROTOCOL_SEO_SLUGS: Partial<
  Record<ProtocolSlug, { review?: string; safety?: string }>
> = {
  aave: { review: "aave-review", safety: "is-aave-safe" },
  morpho: { review: "morpho-review", safety: "is-morpho-safe" },
  compound: { review: "compound-review", safety: "is-compound-safe" },
  lido: { review: "lido-review", safety: "is-lido-safe" },
  "rocket-pool": { review: "rocket-pool-review", safety: "is-rocket-pool-safe" },
  jito: { review: "jito-review", safety: "is-jito-safe" },
  spark: { review: "spark-review", safety: "is-spark-safe" },
  pendle: { review: "pendle-review", safety: "is-pendle-safe" },
  etherfi: { review: "etherfi-review", safety: "is-etherfi-safe" },
  ethena: { review: "ethena-review", safety: "is-ethena-safe" },
};

const COMPARE_LEARN_LINKS: Partial<Record<CompareSlug, { slug: string; label: LocalizedString }[]>> = {
  "morpho-vs-aave": [
    { slug: "what-is-defi-yield", label: { en: "What is DeFi yield?", ru: "Что такое DeFi yield?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "compound-vs-aave": [
    { slug: "what-is-defi-yield", label: { en: "What is DeFi yield?", ru: "Что такое DeFi yield?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "lido-vs-rocket-pool": [
    { slug: "what-is-liquid-staking", label: { en: "What is liquid staking?", ru: "Что такое liquid staking?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "spark-vs-aave": [
    { slug: "what-is-defi-yield", label: { en: "What is DeFi yield?", ru: "Что такое DeFi yield?" } },
    { slug: "what-is-protocol-tvl", label: { en: "What is protocol TVL?", ru: "Что такое TVL протокола?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "pendle-vs-etherfi": [
    { slug: "what-is-restaking", label: { en: "What is restaking?", ru: "Что такое restaking?" } },
    { slug: "what-is-liquid-restaking", label: { en: "What is liquid restaking?", ru: "Что такое liquid restaking?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "compound-vs-morpho": [
    { slug: "what-is-defi-yield", label: { en: "What is DeFi yield?", ru: "Что такое DeFi yield?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "ethena-vs-aave": [
    { slug: "usdc-yield-risks", label: { en: "USDC yield risks", ru: "Риски USDC yield" } },
    { slug: "what-is-defi-yield", label: { en: "What is DeFi yield?", ru: "Что такое DeFi yield?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "aave-vs-lido": [
    { slug: "what-is-liquid-staking", label: { en: "What is liquid staking?", ru: "Что такое liquid staking?" } },
    { slug: "what-is-defi-yield", label: { en: "What is DeFi yield?", ru: "Что такое DeFi yield?" } },
  ],
  "aave-vs-jito": [
    { slug: "what-is-defi-yield", label: { en: "What is DeFi yield?", ru: "Что такое DeFi yield?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
  "lido-vs-jito": [
    { slug: "what-is-liquid-staking", label: { en: "What is liquid staking?", ru: "Что такое liquid staking?" } },
    { slug: "crypto-yield-risks", label: { en: "Crypto yield risks", ru: "Риски crypto yield" } },
  ],
};

/** Protocol page → protocol-vs-protocol compare links involving this protocol. */
export function getProtocolCompareLinks(
  lang: Locale,
  protocol: Protocol,
): CompareInternalLink[] {
  const pairs: Record<ProtocolSlug, CompareSlug[]> = {
    aave: ["aave-vs-lido", "aave-vs-jito", "morpho-vs-aave", "compound-vs-aave", "spark-vs-aave", "ethena-vs-aave"],
    lido: ["aave-vs-lido", "lido-vs-jito", "lido-vs-rocket-pool", "best-liquid-staking"],
    jito: ["aave-vs-jito", "lido-vs-jito"],
    morpho: ["morpho-vs-aave", "compound-vs-morpho", "best-usdc-yield", "best-usdt-yield"],
    spark: ["spark-vs-aave", "best-usdc-yield", "best-usdt-yield"],
    compound: ["compound-vs-aave", "compound-vs-morpho", "best-usdc-yield", "best-usdt-yield"],
    "rocket-pool": ["lido-vs-rocket-pool", "best-eth-staking", "best-liquid-staking"],
    etherfi: ["pendle-vs-etherfi", "best-eth-staking", "best-eth-restaking", "best-liquid-staking"],
    pendle: ["pendle-vs-etherfi", "best-usdc-yield", "best-eth-staking"],
    ethena: ["ethena-vs-aave", "best-usdt-yield", "best-usdc-yield"],
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
        label: `${side.name} protocol hub`,
        type: "protocols",
        slug: side.protocolSlug,
        priority: 0.84,
      });

      const seo = PROTOCOL_SEO_SLUGS[side.protocolSlug];
      if (seo?.review) {
        links.push({
          href: localePath(lang, `/reviews/${seo.review}`),
          label: `${side.name} review`,
          type: "reviews",
          slug: seo.review,
          priority: 0.82,
        });
      }
      if (seo?.safety) {
        links.push({
          href: localePath(lang, `/safety/${seo.safety}`),
          label: `Is ${side.name} safe?`,
          type: "safety",
          slug: seo.safety,
          priority: 0.81,
        });
      }
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
    for (const learn of COMPARE_LEARN_LINKS[page.slug] ?? []) {
      links.push({
        href: localePath(lang, `/learn/${learn.slug}`),
        label: lang === "ru" ? learn.label.ru : learn.label.en,
        type: "learn",
        slug: learn.slug,
        priority: 0.79,
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
