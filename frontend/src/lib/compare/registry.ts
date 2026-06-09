import type { CpaOffer } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import {
  buildYieldOpportunitiesFromOffers,
  getEarnAsset,
  getEarnChain,
  getOpportunitiesForAsset,
} from "@/lib/earn";
import { earnAssetPath } from "@/lib/earn/paths";
import type { ChainSlug, EarnAssetSlug } from "@/lib/earn/types";
import { buildProtocolsFromOffers } from "@/lib/protocols/registry";
import { protocolDetailPath } from "@/lib/protocols/paths";
import type { Protocol, ProtocolSlug } from "@/lib/protocols/types";
import { localePath } from "@/lib/seo/urls";
import {
  getTrustProfileOrNull,
  trustProfileToCompareBadge,
} from "@/lib/trust";
import { getProtocolPlaceholderProfile } from "@/lib/trust-score/placeholders";
import {
  COMPARE_LEGAL_DISCLAIMER,
  getCompareSlugTitle,
} from "@/lib/compare/content";
import { buildComparePageInternalLinks } from "@/lib/compare/internal-links";
import type {
  CompareLinkedOffer,
  CompareMetric,
  ComparePage,
  CompareSlug,
  LocalizedString,
  ProtocolCompareSlug,
  ProtocolComparison,
  ProtocolComparisonSide,
  YieldComparison,
  YieldComparisonRow,
} from "@/lib/compare/types";
import {
  COMPARE_SLUGS,
  isCompareSlug,
  isProtocolComparison,
} from "@/lib/compare/types";

const RISK_EXPLANATION: LocalizedString = {
  en: "Risk context reflects catalog ratings and TJT Trust Score v0.1 factor placeholders. Variable APY, smart-contract, liquidity, and market risks apply. Informational comparison only.",
  ru: "Контекст риска отражает рейтинги каталога и заглушки факторов TJT Trust Score v0.1. Применимы переменный APY, смарт-контрактные, ликвидностные и рыночные риски. Только информационное сравнение.",
};

type ProtocolPairSpec = {
  slug: ProtocolCompareSlug;
  left: ProtocolSlug;
  right: ProtocolSlug;
  sharedAsset?: EarnAssetSlug;
};

type YieldSpec = {
  slug: Extract<
    CompareSlug,
    "best-usdt-yield" | "best-usdc-yield" | "best-eth-staking" | "best-sol-staking"
  >;
  asset: EarnAssetSlug;
};

const PROTOCOL_PAIR_SPECS: ProtocolPairSpec[] = [
  { slug: "aave-vs-lido", left: "aave", right: "lido", sharedAsset: "eth" },
  { slug: "aave-vs-jito", left: "aave", right: "jito" },
  { slug: "lido-vs-jito", left: "lido", right: "jito" },
  { slug: "morpho-vs-aave", left: "morpho", right: "aave", sharedAsset: "usdc" },
  { slug: "compound-vs-aave", left: "compound", right: "aave", sharedAsset: "usdc" },
  { slug: "lido-vs-rocket-pool", left: "lido", right: "rocket-pool", sharedAsset: "eth" },
];

const YIELD_SPECS: YieldSpec[] = [
  { slug: "best-usdt-yield", asset: "usdt" },
  { slug: "best-usdc-yield", asset: "usdc" },
  { slug: "best-eth-staking", asset: "eth" },
  { slug: "best-sol-staking", asset: "sol" },
];

const PROTOCOL_COMPARE_SUMMARIES: Record<ProtocolPairSpec["slug"], LocalizedString> = {
  "aave-vs-lido": {
    en: "Side-by-side informational comparison of Aave (multi-chain lending) and Lido (Ethereum liquid staking). Covers APY snapshots, TVL tiers, chain coverage, supported assets, and TJT Trust Score v0.1 for market context.",
    ru: "Информационное сравнение Aave (multi-chain lending) и Lido (liquid staking на Ethereum). APY, уровни TVL, сети, активы и TJT Trust Score v0.1 для рыночного контекста.",
  },
  "aave-vs-jito": {
    en: "Informational comparison of Aave (lending markets) and Jito (Solana liquid staking). Contrasts chain scope, asset coverage, catalog APY, and Trust Score profiles — not a ranking.",
    ru: "Информационное сравнение Aave (lending) и Jito (liquid staking на Solana). Сети, активы, APY каталога и профили Trust Score — не рейтинг.",
  },
  "lido-vs-jito": {
    en: "Liquid-staking comparison across Ethereum (Lido stETH) and Solana (Jito jitoSOL). Informational APY, TVL tier, and Trust Score context for two distinct staking ecosystems.",
    ru: "Сравнение liquid staking на Ethereum (Lido stETH) и Solana (Jito jitoSOL). Информационный APY, уровень TVL и Trust Score для двух экосистем стейкинга.",
  },
  "morpho-vs-aave": {
    en: "Informational comparison of Morpho (P2P lending optimizer and Morpho Blue markets) and Aave (multi-chain lending). Covers stablecoin supply context, TVL tiers, chain coverage, and TJT Trust Score v0.1 — market context only.",
    ru: "Информационное сравнение Morpho (P2P lending optimizer и Morpho Blue) и Aave (multi-chain lending). Контекст supply стейблкоинов, TVL, сети и TJT Trust Score v0.1 — только рыночный контекст.",
  },
  "compound-vs-aave": {
    en: "Informational comparison of Compound (pioneer lending markets) and Aave (multi-chain lending). Side-by-side APY snapshots, TVL tiers, governance models, and Trust Score profiles for market research.",
    ru: "Информационное сравнение Compound (pioneer lending) и Aave (multi-chain lending). APY, TVL, модели governance и профили Trust Score для исследования рынка.",
  },
  "lido-vs-rocket-pool": {
    en: "Informational Ethereum liquid-staking comparison: Lido stETH vs Rocket Pool rETH. Covers operator models, APY context, TVL tiers, composability, and TJT Trust Score v0.1 — not a ranking.",
    ru: "Информационное сравнение liquid staking Ethereum: Lido stETH vs Rocket Pool rETH. Модели операторов, APY, TVL, composability и TJT Trust Score v0.1 — не рейтинг.",
  },
};

const YIELD_COMPARE_SUMMARIES: Record<YieldSpec["slug"], LocalizedString> = {
  "best-usdt-yield": {
    en: "Informational USDT yield comparison across catalogued DeFi routes. APY snapshots, chain coverage, TVL context, and TJT Trust Score v0.1 — market context only, not financial advice.",
    ru: "Информационное сравнение доходности USDT по маршрутам каталога. Снимки APY, сети, TVL и TJT Trust Score v0.1 — только рыночный контекст.",
  },
  "best-usdc-yield": {
    en: "Informational USDC yield comparison from the TJT CPA catalog. Side-by-side APY, chain, protocol Trust Score, and risk context for market research.",
    ru: "Информационное сравнение доходности USDC из CPA-каталога TJT. APY, сеть, Trust Score протокола и контекст риска для исследования рынка.",
  },
  "best-eth-staking": {
    en: "Informational ETH staking and supply comparison — Lido liquid staking vs Aave lending routes. APY, chain, Trust Score, and risk factors for market context.",
    ru: "Информационное сравнение стейкинга и supply ETH — Lido liquid staking vs маршруты Aave. APY, сеть, Trust Score и факторы риска.",
  },
  "best-sol-staking": {
    en: "Informational SOL staking comparison via Jito liquid staking. Catalog APY, Solana chain context, Trust Score, and risk explanation for market research.",
    ru: "Информационное сравнение стейкинга SOL через Jito liquid staking. APY каталога, контекст Solana, Trust Score и объяснение рисков.",
  },
};

function estimatedTvlLabel(slug: string): LocalizedString | null {
  const profile = getProtocolPlaceholderProfile(slug);
  const tier = profile.tvlTierScore;
  if (tier >= 95) {
    return { en: "~$10B+ est.", ru: "~$10B+ оц." };
  }
  if (tier >= 90) {
    return { en: "~$5B+ est.", ru: "~$5B+ оц." };
  }
  if (tier >= 80) {
    return { en: "~$1B+ est.", ru: "~$1B+ оц." };
  }
  if (tier >= 70) {
    return { en: "~$500M+ est.", ru: "~$500M+ оц." };
  }
  return { en: "Not available", ru: "Недоступно" };
}

function formatAssets(protocol: Protocol, lang: Locale): LocalizedString {
  const symbols = protocol.supportedAssets.map((a) => a.symbol).join(", ");
  return { en: symbols, ru: symbols };
}

function attachStaticTrustFields(protocol: Pick<Protocol, "slug" | "trustProfile">) {
  const trustProfile =
    protocol.trustProfile ?? getTrustProfileOrNull(protocol.slug);
  const trustBadge = trustProfile
    ? trustProfileToCompareBadge(trustProfile)
    : null;
  return { trustProfile, trustBadge };
}

function resolveCanonicalTrustScore(
  side: Pick<
    ProtocolComparisonSide,
    "trustBadge" | "trustProfile" | "trustScore"
  >,
): number {
  return (
    side.trustBadge?.score ??
    side.trustProfile?.score ??
    side.trustScore.score
  );
}

function buildProtocolSide(
  lang: Locale,
  protocol: Protocol,
  offers: CpaOffer[],
  focusAsset?: EarnAssetSlug,
): ProtocolComparisonSide {
  const topOffer = protocol.linkedOffers[0];
  const focusOpp = focusAsset
    ? protocol.earnOpportunities.find((o) => o.assetSlug === focusAsset)
    : protocol.earnOpportunities[0];

  const apy = focusOpp?.apy ?? topOffer?.apy ?? null;
  const chainSlug = focusOpp?.chainSlug ?? protocol.supportedChains[0]?.slug;
  const chain = chainSlug ? getEarnChain(chainSlug) : undefined;

  const chainLabel: LocalizedString = chain
    ? chain.name
    : {
        en: protocol.supportedChains.map((c) => c.name.en).join(", "),
        ru: protocol.supportedChains.map((c) => c.name.ru).join(", "),
      };

  const assetLabel: LocalizedString = focusAsset
    ? {
        en: focusAsset.toUpperCase(),
        ru: focusAsset.toUpperCase(),
      }
    : formatAssets(protocol, lang);

  const { trustProfile, trustBadge } = attachStaticTrustFields(protocol);

  return {
    protocolSlug: protocol.slug,
    name: protocol.name,
    category: protocol.category.name,
    apy,
    tvlUsd: null,
    tvlLabel: estimatedTvlLabel(protocol.slug),
    chain: chainLabel,
    supportedAsset: assetLabel,
    trustScore: protocol.trustScore,
    trustProfile,
    trustBadge,
    riskExplanation: protocol.riskProfile.explanation,
    protocolPath: protocolDetailPath(lang, protocol.slug),
  };
}

function buildProtocolComparison(
  lang: Locale,
  spec: ProtocolPairSpec,
  protocols: Protocol[],
  offers: CpaOffer[],
): ProtocolComparison {
  const left = protocols.find((p) => p.slug === spec.left)!;
  const right = protocols.find((p) => p.slug === spec.right)!;

  return {
    type: "protocol_vs_protocol",
    left: buildProtocolSide(lang, left, offers, spec.sharedAsset),
    right: buildProtocolSide(lang, right, offers, spec.sharedAsset),
    sharedAsset: spec.sharedAsset,
  };
}

function buildYieldRow(
  lang: Locale,
  protocol: Protocol,
  opportunity: {
    id: string;
    apy: number;
    chainSlug: string;
    assetSlug: EarnAssetSlug;
    offerSlug?: string;
  } | null,
  assetSymbol: string,
): YieldComparisonRow {
  const chainSlug =
    (opportunity?.chainSlug as ChainSlug | undefined) ??
    protocol.supportedChains[0]?.slug;
  const chain = chainSlug ? getEarnChain(chainSlug) : undefined;

  const chainLabel: LocalizedString = chain
    ? chain.name
    : { en: "—", ru: "—" };

  const { trustProfile, trustBadge } = attachStaticTrustFields(protocol);

  return {
    id: opportunity?.id ?? `${protocol.slug}-informational`,
    protocolSlug: protocol.slug,
    protocolName: protocol.name,
    apy: opportunity?.apy ?? protocol.linkedOffers[0]?.apy ?? null,
    tvlUsd: null,
    tvlLabel: estimatedTvlLabel(protocol.slug),
    chain: chainLabel,
    supportedAsset: assetSymbol,
    trustScore: protocol.trustScore,
    trustProfile,
    trustBadge,
    riskExplanation: protocol.riskProfile.explanation,
    earnPath: earnAssetPath(lang, (opportunity?.assetSlug ?? protocol.supportedAssets[0]?.slug)!),
    protocolPath: protocolDetailPath(lang, protocol.slug),
    offerSlug: opportunity?.offerSlug,
    offerPath: opportunity?.offerSlug
      ? localePath(lang, `/offers/${opportunity.offerSlug}`)
      : undefined,
  };
}

function buildYieldComparison(
  lang: Locale,
  spec: YieldSpec,
  protocols: Protocol[],
  offers: CpaOffer[],
): YieldComparison {
  const asset = getEarnAsset(spec.asset)!;
  const opportunities = getOpportunitiesForAsset(
    buildYieldOpportunitiesFromOffers(offers),
    spec.asset,
  );

  const relevantProtocols = protocols.filter((p) =>
    p.supportedAssets.some((a) => a.slug === spec.asset),
  );

  const rows: YieldComparisonRow[] = relevantProtocols
    .map((protocol) => {
      const opp =
        opportunities.find((o) => o.protocolSlug === protocol.slug) ?? null;
      return buildYieldRow(
        lang,
        protocol,
        opp
          ? {
              id: opp.id,
              apy: opp.apy,
              chainSlug: opp.chainSlug,
              assetSlug: opp.assetSlug,
              offerSlug: opp.offerSlug,
            }
          : null,
        asset.symbol,
      );
    })
    .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0));

  return {
    type: "best_yield",
    assetSlug: spec.asset,
    assetSymbol: asset.symbol,
    rows,
  };
}

function buildLinkedOffers(
  lang: Locale,
  comparison: ProtocolComparison | YieldComparison,
  offers: CpaOffer[],
): CompareLinkedOffer[] {
  if (comparison.type === "best_yield") {
    return comparison.rows
      .filter((row) => row.offerSlug)
      .map((row) => {
        const offer = offers.find((o) => o.slug === row.offerSlug)!;
        return {
          id: offer.id,
          slug: offer.slug,
          name: offer.name,
          protocolSlug: row.protocolSlug,
          network: offer.network,
          apy: offer.apy,
          offerPath: localePath(lang, `/offers/${offer.slug}`),
        };
      });
  }

  const slugs = new Set([comparison.left.protocolSlug, comparison.right.protocolSlug]);
  return offers
    .filter((o) => {
      const pSlug = o.protocol.toLowerCase().replace(/\s+/g, "-");
      return slugs.has(pSlug as ProtocolSlug);
    })
    .sort((a, b) => b.apy - a.apy)
    .map((offer) => ({
      id: offer.id,
      slug: offer.slug,
      name: offer.name,
      protocolSlug: offer.protocol.toLowerCase().replace(/\s+/g, "-"),
      network: offer.network,
      apy: offer.apy,
      offerPath: localePath(lang, `/offers/${offer.slug}`),
    }));
}

function buildMetrics(
  comparison: ProtocolComparison | YieldComparison,
): CompareMetric[] {
  if (isProtocolComparison(comparison)) {
    return [
      {
        key: "apy_left",
        label: { en: `${comparison.left.name} APY`, ru: `APY ${comparison.left.name}` },
        value: comparison.left.apy,
        format: "apy",
        available: comparison.left.apy != null,
      },
      {
        key: "apy_right",
        label: { en: `${comparison.right.name} APY`, ru: `APY ${comparison.right.name}` },
        value: comparison.right.apy,
        format: "apy",
        available: comparison.right.apy != null,
      },
      {
        key: "trust_left",
        label: { en: `${comparison.left.name} Trust Score`, ru: `Trust Score ${comparison.left.name}` },
        value: resolveCanonicalTrustScore(comparison.left),
        format: "score",
        available: true,
      },
      {
        key: "trust_right",
        label: { en: `${comparison.right.name} Trust Score`, ru: `Trust Score ${comparison.right.name}` },
        value: resolveCanonicalTrustScore(comparison.right),
        format: "score",
        available: true,
      },
    ];
  }

  const topRow = comparison.rows[0];
  return [
    {
      key: "asset",
      label: { en: "Asset", ru: "Актив" },
      value: comparison.assetSymbol,
      format: "asset",
      available: true,
    },
    {
      key: "routes",
      label: { en: "Catalogued routes", ru: "Маршруты каталога" },
      value: comparison.rows.filter((r) => r.apy != null).length,
      format: "text",
      available: true,
    },
    {
      key: "top_apy",
      label: { en: "Top catalog APY", ru: "Макс. APY каталога" },
      value: topRow?.apy ?? null,
      format: "apy",
      available: topRow?.apy != null,
    },
  ];
}

function buildComparePage(
  lang: Locale,
  slug: CompareSlug,
  protocols: Protocol[],
  offers: CpaOffer[],
): ComparePage {
  const pairSpec = PROTOCOL_PAIR_SPECS.find((s) => s.slug === slug);
  const yieldSpec = YIELD_SPECS.find((s) => s.slug === slug);

  const comparison = pairSpec
    ? buildProtocolComparison(lang, pairSpec, protocols, offers)
    : buildYieldComparison(lang, yieldSpec!, protocols, offers);

  const page: ComparePage = {
    slug,
    type: pairSpec ? "protocol_vs_protocol" : "best_yield",
    title: getCompareSlugTitle(slug),
    summary: pairSpec
      ? PROTOCOL_COMPARE_SUMMARIES[pairSpec.slug]
      : YIELD_COMPARE_SUMMARIES[yieldSpec!.slug],
    comparison,
    metrics: buildMetrics(comparison),
    linkedOffers: buildLinkedOffers(lang, comparison, offers),
    internalLinks: [],
    riskExplanation: RISK_EXPLANATION,
    disclaimer: COMPARE_LEGAL_DISCLAIMER,
  };

  page.internalLinks = buildComparePageInternalLinks(lang, page, protocols, offers);
  return page;
}

/** Hydrate all compare pages from earn + protocol registries and CPA catalog. */
export function buildComparePagesFromOffers(
  offers: CpaOffer[],
  lang: Locale,
): ComparePage[] {
  const protocols = buildProtocolsFromOffers(offers, lang);
  return COMPARE_SLUGS.map((slug) =>
    buildComparePage(lang, slug, protocols, offers),
  );
}

export function getComparePage(
  pages: ComparePage[],
  slug: CompareSlug,
): ComparePage | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getAllCompareSlugs(): CompareSlug[] {
  return [...COMPARE_SLUGS];
}

export function resolveComparePageSlug(value: string): CompareSlug | null {
  return isCompareSlug(value) ? value : null;
}
