import type { MarketAsset, NewsItem } from "@/lib/config";
import type { CalculatorAsset } from "@/lib/calculator-assets";
import { CALCULATOR_ASSETS } from "@/lib/calculator-assets";

/** URL slug for a market asset — prefers config slug, falls back to symbol. */
export function marketSlug(asset: Pick<MarketAsset, "slug" | "symbol">): string {
  return asset.slug || asset.symbol.toLowerCase();
}

export function marketHref(lang: string, asset: Pick<MarketAsset, "slug" | "symbol"> | string): string {
  const slug = typeof asset === "string" ? asset.toLowerCase() : marketSlug(asset);
  return `/${lang}/market/${slug}`;
}

export function findMarketBySlug(
  assets: MarketAsset[],
  slug: string,
): MarketAsset | undefined {
  const normalized = slug.toLowerCase();
  return assets.find(
    (a) =>
      a.slug === normalized ||
      a.symbol.toLowerCase() === normalized ||
      a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalized,
  );
}

/** Resolve related assets from config related_symbols, excluding the current asset. */
export function resolveRelatedAssets(
  asset: MarketAsset,
  market: MarketAsset[],
  limit = 4,
): MarketAsset[] {
  const fromConfig = asset.relatedSymbols
    .map((sym) => market.find((m) => m.symbol === sym))
    .filter((m): m is MarketAsset => m !== undefined && m.symbol !== asset.symbol);

  if (fromConfig.length >= limit) return fromConfig.slice(0, limit);

  const fallback = market
    .filter((m) => m.symbol !== asset.symbol && !fromConfig.some((r) => r.symbol === m.symbol))
    .slice(0, limit - fromConfig.length);

  return [...fromConfig, ...fallback];
}

const SYMBOL_ALIASES: Record<string, readonly string[]> = {
  BTC: ["btc", "bitcoin", "wbtc"],
  ETH: ["eth", "ethereum", "steth", "weth", "lido"],
  SOL: ["sol", "solana", "jito", "jitosol"],
  USDT: ["usdt", "tether"],
  USDC: ["usdc", "usd coin"],
};

function assetHaystack(news: NewsItem): string {
  return [
    news.title,
    news.description,
    news.content,
    ...news.seoKeywords,
  ]
    .join(" ")
    .toLowerCase();
}

/** Whether a news item mentions the given market asset (symbol or aliases). */
export function newsMentionsAsset(news: NewsItem, asset: MarketAsset): boolean {
  const haystack = assetHaystack(news);
  const aliases = SYMBOL_ALIASES[asset.symbol] ?? [asset.symbol.toLowerCase()];
  const nameLower = asset.name.toLowerCase();
  return (
    aliases.some((alias) => haystack.includes(alias)) ||
    haystack.includes(nameLower)
  );
}

/** Filter news items that mention the given asset. */
export function filterNewsByAsset(
  news: NewsItem[],
  asset: MarketAsset,
): NewsItem[] {
  return news.filter((item) => newsMentionsAsset(item, asset));
}

/** Extract market assets referenced in a news article body. */
export function extractAssetsFromNews(
  news: NewsItem,
  market: MarketAsset[],
): MarketAsset[] {
  return market.filter((asset) => newsMentionsAsset(news, asset));
}

/** Map market symbol to calculator asset when applicable. */
export function symbolToCalculatorAsset(
  symbol: string,
): CalculatorAsset | undefined {
  const upper = symbol.toUpperCase();
  return CALCULATOR_ASSETS.find((a) => a === upper);
}

/** TradingView symbol for the advanced chart widget. */
export function tradingViewSymbol(symbol: string): string {
  const map: Record<string, string> = {
    BTC: "BINANCE:BTCUSDT",
    ETH: "BINANCE:ETHUSDT",
    SOL: "BINANCE:SOLUSDT",
    USDT: "BINANCE:USDTUSDC",
    USDC: "BINANCE:USDCUSDT",
  };
  return map[symbol.toUpperCase()] ?? `BINANCE:${symbol.toUpperCase()}USDT`;
}

/** Replace `{coin}` placeholder in localized UI strings. */
export function interpolateCoin(template: string, coinName: string): string {
  return template.replace(/\{coin\}/g, coinName);
}

/** AI verdict text derived from sentiment + 24h change. */
export function aiVerdict(asset: MarketAsset, lang: "en" | "ru"): string {
  const { aiSentiment, change24h, symbol } = asset;

  if (lang === "ru") {
    if (aiSentiment === "Greed" && change24h > 2)
      return `${symbol}: бычий импульс, ИИ фиксирует жадность`;
    if (aiSentiment === "Fear" && change24h < -1)
      return `${symbol}: давление продавцов, страх на рынке`;
    if (change24h > 0)
      return `${symbol}: умеренный рост, нейтрально-позитивный фон`;
    if (change24h < 0)
      return `${symbol}: коррекция, держать риск под контролем`;
    return `${symbol}: боковик, ждём катализатор`;
  }

  if (aiSentiment === "Greed" && change24h > 2)
    return `${symbol}: bullish momentum, AI reads greed`;
  if (aiSentiment === "Fear" && change24h < -1)
    return `${symbol}: sell pressure, fear in the market`;
  if (change24h > 0)
    return `${symbol}: moderate uptrend, neutral-positive backdrop`;
  if (change24h < 0)
    return `${symbol}: pullback — keep risk in check`;
  return `${symbol}: range-bound, awaiting catalyst`;
}
