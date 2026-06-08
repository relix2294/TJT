import type { MarketAsset } from "@/lib/config";

export type MarketFeedResponse = {
  market: MarketAsset[];
  live: boolean;
  updatedAt: string | null;
};

export type MarketPriceTickResponse = {
  prices: Record<string, number>;
  live: boolean;
  updatedAt: string | null;
};

export function mergePriceTick(
  market: MarketAsset[],
  tick: MarketPriceTickResponse,
): MarketAsset[] {
  if (!tick.live || Object.keys(tick.prices).length === 0) return market;

  return market.map((asset) => {
    const nextPrice = tick.prices[asset.symbol];
    if (nextPrice === undefined) return asset;
    return { ...asset, price: nextPrice };
  });
}
