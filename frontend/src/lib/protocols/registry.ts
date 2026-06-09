import type { CpaOffer } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import {
  EARN_ASSETS,
  EARN_CHAINS,
  EARN_PROTOCOLS,
  buildYieldOpportunitiesFromOffers,
} from "@/lib/earn";
import { earnAssetPath } from "@/lib/earn/paths";
import { localePath } from "@/lib/seo/urls";
import { DEFAULT_PROTOCOL_TRUST_SCORE } from "@/lib/protocols/content";
import type {
  Protocol,
  ProtocolCategory,
  ProtocolCategorySlug,
  ProtocolLinkedEarnOpportunity,
  ProtocolLinkedOffer,
  ProtocolSlug,
  ProtocolSupportedAsset,
  ProtocolSupportedChain,
} from "@/lib/protocols/types";
import { PROTOCOL_SLUGS } from "@/lib/protocols/types";

const PROTOCOL_LOGOS: Record<ProtocolSlug, string> = {
  aave: "AA",
  lido: "LD",
  jito: "JT",
};

const PROTOCOL_CATEGORIES: Record<ProtocolSlug, ProtocolCategorySlug> = {
  aave: "lending",
  lido: "liquid_staking",
  jito: "liquid_staking",
};

const CATEGORY_REGISTRY: Record<ProtocolCategorySlug, ProtocolCategory> = {
  lending: {
    slug: "lending",
    name: { en: "Lending", ru: "Lending" },
    description: {
      en: "Non-custodial money markets where suppliers earn borrow-demand yield.",
      ru: "Некастодиальные money markets, где поставщики получают yield от спроса на заём.",
    },
  },
  liquid_staking: {
    slug: "liquid_staking",
    name: { en: "Liquid staking", ru: "Liquid staking" },
    description: {
      en: "Stake native assets and receive liquid receipt tokens composable across DeFi.",
      ru: "Стейкайте нативные активы и получайте ликвидные receipt-токены для DeFi.",
    },
  },
  dex: {
    slug: "dex",
    name: { en: "DEX", ru: "DEX" },
    description: {
      en: "Decentralized exchange and liquidity provision protocols.",
      ru: "Децентрализованные биржи и протоколы ликвидности.",
    },
  },
  restaking: {
    slug: "restaking",
    name: { en: "Restaking", ru: "Restaking" },
    description: {
      en: "Extend staked capital to secure additional networks and services.",
      ru: "Расширение стейкингового капитала для защиты дополнительных сетей.",
    },
  },
  vault: {
    slug: "vault",
    name: { en: "Vault", ru: "Vault" },
    description: {
      en: "Curated yield vaults with automated strategy allocation.",
      ru: "Курируемые yield-vault с автоматическим распределением стратегий.",
    },
  },
};

const PROTOCOL_DESCRIPTIONS: Record<ProtocolSlug, Protocol["description"]> = {
  aave: {
    en: "Aave is a decentralized non-custodial liquidity protocol. Suppliers earn variable APY from borrower demand across multiple chains.",
    ru: "Aave — децентрализованный некастодиальный протокол ликвидности. Поставщики получают переменный APY от спроса заёмщиков на разных сетях.",
  },
  lido: {
    en: "Lido is the leading liquid-staking protocol on Ethereum. stETH accrues validator rewards while staying composable as DeFi collateral.",
    ru: "Lido — ведущий протокол liquid staking на Ethereum. stETH начисляет доход валидаторов и остаётся залогом в DeFi.",
  },
  jito: {
    en: "Jito is a liquid-staking protocol on Solana with MEV-boosted rewards. jitoSOL stays composable while earning validator yield.",
    ru: "Jito — протокол liquid staking на Solana с MEV-бустом. jitoSOL остаётся композируемым и приносит доход валидаторов.",
  },
};

const RISK_EXPLANATION_PLACEHOLDER: Protocol["riskProfile"]["explanation"] = {
  en: "Risk tier reflects catalog ratings today. Full Trust Score methodology and weighted factor analysis are launching soon.",
  ru: "Уровень риска отражает рейтинги каталога. Полная методология Trust Score и взвешенный анализ факторов — скоро.",
};

function protocolNameToSlug(name: string): ProtocolSlug | null {
  const slug = name.toLowerCase().replace(/\s+/g, "-") as ProtocolSlug;
  return PROTOCOL_SLUGS.includes(slug) ? slug : null;
}

function buildSupportedAssets(
  lang: Locale,
  assetSlugs: Protocol["supportedAssets"][number]["slug"][],
): ProtocolSupportedAsset[] {
  return assetSlugs.flatMap((slug) => {
    const asset = EARN_ASSETS.find((a) => a.slug === slug);
    if (!asset) return [];
    return [
      {
        slug: asset.slug,
        symbol: asset.symbol,
        name: asset.name,
        earnPath: earnAssetPath(lang, asset.slug),
      },
    ];
  });
}

function buildSupportedChains(chainSlugs: ProtocolSupportedChain["slug"][]): ProtocolSupportedChain[] {
  return chainSlugs.flatMap((slug) => {
    const chain = EARN_CHAINS.find((c) => c.slug === slug);
    if (!chain) return [];
    return [
      {
        slug: chain.slug,
        name: chain.name,
        layer: chain.layer,
      },
    ];
  });
}

function buildLinkedOffers(
  lang: Locale,
  offers: CpaOffer[],
  protocolName: string,
): ProtocolLinkedOffer[] {
  return offers
    .filter((o) => o.protocol.toLowerCase() === protocolName.toLowerCase())
    .sort((a, b) => b.apy - a.apy)
    .map((offer) => ({
      id: offer.id,
      slug: offer.slug,
      name: offer.name,
      network: offer.network,
      apy: offer.apy,
      riskRating: offer.riskRating,
      minEntryUsd: offer.minEntryUsd,
      offerPath: localePath(lang, `/offers/${offer.slug}`),
      trackUrl: `/api/click-track?offerId=${encodeURIComponent(offer.id)}&lang=${lang}`,
    }));
}

function buildEarnOpportunities(
  lang: Locale,
  offers: CpaOffer[],
  protocolSlug: ProtocolSlug,
): ProtocolLinkedEarnOpportunity[] {
  const opportunities = buildYieldOpportunitiesFromOffers(offers).filter(
    (o) => o.protocolSlug === protocolSlug,
  );

  return opportunities
    .sort((a, b) => b.apy - a.apy)
    .map((opp) => ({
      id: opp.id,
      assetSlug: opp.assetSlug,
      chainSlug: opp.chainSlug,
      type: opp.type,
      apy: opp.apy,
      headline: opp.headline,
      earnAssetPath: earnAssetPath(lang, opp.assetSlug),
      offerSlug: opp.offerSlug,
    }));
}

/** Hydrate full protocol entities from earn registry + live CPA offers. */
export function buildProtocolsFromOffers(
  offers: CpaOffer[],
  lang: Locale,
): Protocol[] {
  return EARN_PROTOCOLS.map((seed) => {
    const slug = seed.slug as ProtocolSlug;
    const categorySlug = PROTOCOL_CATEGORIES[slug];
    const category = CATEGORY_REGISTRY[categorySlug];

    return {
      slug,
      name: seed.name,
      logo: PROTOCOL_LOGOS[slug],
      category,
      description: PROTOCOL_DESCRIPTIONS[slug],
      riskProfile: {
        tier: seed.riskTier,
        label: {
          en: `Risk tier ${seed.riskTier}`,
          ru: `Уровень риска ${seed.riskTier}`,
        },
        explanation: RISK_EXPLANATION_PLACEHOLDER,
      },
      supportedAssets: buildSupportedAssets(lang, seed.assets),
      supportedChains: buildSupportedChains(seed.chains),
      linkedOffers: buildLinkedOffers(lang, offers, seed.name),
      earnOpportunities: buildEarnOpportunities(lang, offers, slug),
      trustScore: DEFAULT_PROTOCOL_TRUST_SCORE,
    };
  });
}

export function getProtocol(
  protocols: Protocol[],
  slug: ProtocolSlug,
): Protocol | undefined {
  return protocols.find((p) => p.slug === slug);
}

export function getProtocolByOfferProtocol(
  protocols: Protocol[],
  protocolName: string,
): Protocol | undefined {
  const slug = protocolNameToSlug(protocolName);
  if (!slug) return undefined;
  return getProtocol(protocols, slug);
}

export function getAllProtocolSlugs(): ProtocolSlug[] {
  return [...PROTOCOL_SLUGS];
}
