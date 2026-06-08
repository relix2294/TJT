import type { CpaOffer } from "@/lib/config";

/** Assets selectable in the opportunity-cost calculator. */
export const CALCULATOR_ASSETS = ["USDT", "USDC", "BTC", "ETH", "SOL"] as const;
export type CalculatorAsset = (typeof CALCULATOR_ASSETS)[number];

const ASSET_KEYWORDS: Record<CalculatorAsset, readonly string[]> = {
  USDT: ["usdt", "tether"],
  USDC: ["usdc", "usd coin"],
  BTC: ["btc", "bitcoin", "wbtc"],
  ETH: ["eth", "ethereum", "steth", "weth", "lido"],
  SOL: ["sol", "solana", "jito", "jitosol"],
};

function offerHaystack(offer: CpaOffer): string {
  return `${offer.name} ${offer.slug} ${offer.protocol} ${offer.network} ${offer.description}`.toLowerCase();
}

export function offerMatchesAsset(offer: CpaOffer, asset: CalculatorAsset): boolean {
  const haystack = offerHaystack(offer);
  return ASSET_KEYWORDS[asset].some((keyword) => haystack.includes(keyword));
}

/** Annual net profit vs. a fiat bank deposit at `bankApr` (%). */
export function netProfitVsBank(
  capital: number,
  offerApy: number,
  bankApr: number,
): number {
  if (!Number.isFinite(capital) || capital <= 0) return 0;
  return (capital * (offerApy - bankApr)) / 100;
}

export type SortedOffersResult = {
  offers: CpaOffer[];
  /** Best matching offer for the contextual sniper badge, if any. */
  topMatchId: string | null;
};

/**
 * Prioritises asset-matching pools at the top (best APY first), then the rest.
 * Uses stable sort keys so unrelated slider moves in the calculator do not reshuffle unnecessarily.
 */
export function sortOffersForCalculator(
  offers: CpaOffer[],
  asset: CalculatorAsset,
  capital: number,
): SortedOffersResult {
  const safeCapital = Number.isFinite(capital) && capital > 0 ? capital : 0;

  const ranked = offers
    .map((offer, index) => {
      const matches = offerMatchesAsset(offer, asset);
      const eligible = safeCapital === 0 || offer.minEntryUsd <= safeCapital;
      return { offer, matches, eligible, index };
    })
    .sort((a, b) => {
      if (a.matches !== b.matches) return a.matches ? -1 : 1;
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      if (b.offer.apy !== a.offer.apy) return b.offer.apy - a.offer.apy;
      return a.index - b.index;
    });

  const topMatch =
    ranked.find((row) => row.matches && row.eligible)?.offer ??
    ranked.find((row) => row.matches)?.offer ??
    null;

  return {
    offers: ranked.map((row) => row.offer),
    topMatchId: topMatch?.id ?? null,
  };
}
