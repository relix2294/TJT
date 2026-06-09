import type { CpaOffer } from "@/lib/config";
import type {
  Asset,
  Chain,
  EarnAssetSlug,
  Protocol,
  YieldOpportunity,
} from "@/lib/earn/types";

/** Static chain registry — grows independently of config.json. */
export const EARN_CHAINS: Chain[] = [
  {
    slug: "ethereum",
    name: { en: "Ethereum", ru: "Ethereum" },
    layer: "L1",
    nativeAssetSymbol: "ETH",
  },
  {
    slug: "arbitrum",
    name: { en: "Arbitrum", ru: "Arbitrum" },
    layer: "L2",
    nativeAssetSymbol: "ETH",
  },
  {
    slug: "solana",
    name: { en: "Solana", ru: "Solana" },
    layer: "alt-L1",
    nativeAssetSymbol: "SOL",
  },
  {
    slug: "polygon",
    name: { en: "Polygon", ru: "Polygon" },
    layer: "L2",
    nativeAssetSymbol: "MATIC",
  },
  {
    slug: "base",
    name: { en: "Base", ru: "Base" },
    layer: "L2",
    nativeAssetSymbol: "ETH",
  },
  {
    slug: "optimism",
    name: { en: "Optimism", ru: "Optimism" },
    layer: "L2",
    nativeAssetSymbol: "ETH",
  },
];

/** Core earn assets — seed nodes for the Knowledge Graph. */
export const EARN_ASSETS: Asset[] = [
  {
    slug: "usdt",
    symbol: "USDT",
    name: { en: "Tether USD", ru: "Tether USD" },
    category: "stablecoin",
    supportedChains: ["ethereum", "arbitrum", "polygon", "base", "optimism"],
    description: {
      en: "Earn yield on USDT across Ethereum L1 and L2 lending markets. Compare vetted non-custodial supply routes.",
      ru: "Получайте доход на USDT в lending-рынках Ethereum L1 и L2. Сравните проверенные некастодиальные маршруты.",
    },
  },
  {
    slug: "usdc",
    symbol: "USDC",
    name: { en: "USD Coin", ru: "USD Coin" },
    category: "stablecoin",
    supportedChains: ["ethereum", "arbitrum", "base", "polygon", "optimism"],
    description: {
      en: "Supply USDC to audited DeFi protocols and earn organic borrow-demand yield on multiple chains.",
      ru: "Поставьте USDC в аудированные DeFi-протоколы и получайте органический yield от спроса на заём на разных сетях.",
    },
  },
  {
    slug: "eth",
    symbol: "ETH",
    name: { en: "Ethereum", ru: "Ethereum" },
    category: "native",
    supportedChains: ["ethereum", "arbitrum", "base", "optimism"],
    description: {
      en: "Stake or supply ETH via liquid-staking and lending protocols. Non-custodial routes with live APY snapshots.",
      ru: "Стейкайте или поставьте ETH через liquid staking и lending. Некастодиальные маршруты с актуальным APY.",
    },
  },
  {
    slug: "sol",
    symbol: "SOL",
    name: { en: "Solana", ru: "Solana" },
    category: "native",
    supportedChains: ["solana"],
    description: {
      en: "Earn SOL staking yield through liquid-staking protocols with MEV-boosted rewards on Solana.",
      ru: "Получайте доход от стейкинга SOL через liquid staking с MEV-бустом на Solana.",
    },
  },
];

/** Protocol nodes derived from catalog + planned expansion slots. */
export const EARN_PROTOCOLS: Protocol[] = [
  {
    slug: "aave",
    name: "Aave",
    chains: ["ethereum", "arbitrum", "polygon", "base", "optimism"],
    assets: ["usdc", "usdt", "eth"],
    riskTier: "AA",
  },
  {
    slug: "lido",
    name: "Lido",
    chains: ["ethereum"],
    assets: ["eth"],
    riskTier: "AAA",
  },
  {
    slug: "jito",
    name: "Jito",
    chains: ["solana"],
    assets: ["sol"],
    riskTier: "AAA",
  },
  {
    slug: "morpho",
    name: "Morpho",
    chains: ["ethereum", "base", "arbitrum"],
    assets: ["usdc", "usdt", "eth"],
    riskTier: "AA",
  },
  {
    slug: "spark",
    name: "Spark",
    chains: ["ethereum"],
    assets: ["usdc", "usdt", "eth"],
    riskTier: "AA",
  },
  {
    slug: "rocket-pool",
    name: "Rocket Pool",
    chains: ["ethereum"],
    assets: ["eth"],
    riskTier: "AA",
  },
  {
    slug: "etherfi",
    name: "EtherFi",
    chains: ["ethereum", "arbitrum", "base"],
    assets: ["eth"],
    riskTier: "AA",
  },
  {
    slug: "pendle",
    name: "Pendle",
    chains: ["ethereum", "arbitrum"],
    assets: ["usdc", "eth"],
    riskTier: "A",
  },
  {
    slug: "ethena",
    name: "Ethena",
    chains: ["ethereum"],
    assets: ["usdt", "usdc"],
    riskTier: "A",
  },
  {
    slug: "compound",
    name: "Compound",
    chains: ["ethereum", "arbitrum", "base", "polygon"],
    assets: ["usdc", "usdt", "eth"],
    riskTier: "AA",
  },
];

const NETWORK_TO_CHAIN: Record<string, YieldOpportunity["chainSlug"]> = {
  ethereum: "ethereum",
  arbitrum: "arbitrum",
  solana: "solana",
  polygon: "polygon",
  base: "base",
  optimism: "optimism",
};

function inferAssetFromOffer(offer: CpaOffer): EarnAssetSlug | null {
  const haystack = `${offer.name} ${offer.network} ${offer.protocol}`.toUpperCase();
  if (haystack.includes("USDC")) return "usdc";
  if (haystack.includes("USDT")) return "usdt";
  if (haystack.includes("ETH") || haystack.includes("ETHEREUM")) return "eth";
  if (haystack.includes("SOL") || haystack.includes("SOLANA")) return "sol";
  return null;
}

function inferOpportunityType(offer: CpaOffer): YieldOpportunity["type"] {
  const name = offer.name.toLowerCase();
  if (name.includes("staking") || name.includes("steth") || name.includes("jito")) {
    return "staking";
  }
  if (name.includes("supply") || name.includes("market") || name.includes("aave")) {
    return "lending";
  }
  return "vault";
}

/** Map live CPA offers into Knowledge Graph yield opportunities. */
export function buildYieldOpportunitiesFromOffers(
  offers: CpaOffer[],
): YieldOpportunity[] {
  return offers.flatMap((offer) => {
    const assetSlug = inferAssetFromOffer(offer);
    const chainSlug = NETWORK_TO_CHAIN[offer.network.toLowerCase()];
    if (!assetSlug || !chainSlug) return [];

    const protocolSlug = offer.protocol.toLowerCase().replace(/\s+/g, "-");

    return [
      {
        id: offer.id,
        assetSlug,
        chainSlug,
        protocolSlug,
        type: inferOpportunityType(offer),
        apy: offer.apy,
        minDepositUsd: offer.minEntryUsd,
        offerSlug: offer.slug,
        headline: { en: offer.name, ru: offer.name },
        summary: { en: offer.description, ru: offer.description },
      },
    ];
  });
}

/** Lookup helpers — O(n) today; swap for indexed maps at 10k+ scale. */
export function getEarnAsset(slug: EarnAssetSlug): Asset | undefined {
  return EARN_ASSETS.find((a) => a.slug === slug);
}

export function getEarnChain(slug: YieldOpportunity["chainSlug"]): Chain | undefined {
  return EARN_CHAINS.find((c) => c.slug === slug);
}

export function getEarnProtocol(slug: string): Protocol | undefined {
  return EARN_PROTOCOLS.find((p) => p.slug === slug);
}

export function getOpportunitiesForAsset(
  opportunities: YieldOpportunity[],
  assetSlug: EarnAssetSlug,
): YieldOpportunity[] {
  return opportunities
    .filter((o) => o.assetSlug === assetSlug)
    .sort((a, b) => b.apy - a.apy);
}

export function getTopApyForAsset(
  opportunities: YieldOpportunity[],
  assetSlug: EarnAssetSlug,
): number | null {
  const rows = getOpportunitiesForAsset(opportunities, assetSlug);
  return rows.length ? rows[0].apy : null;
}
