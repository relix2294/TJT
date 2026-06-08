import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { MarketAsset } from "@/lib/config";
import type { MarketFeedResponse, MarketPriceTickResponse } from "@/lib/market-types";
import { loadMarketFallback } from "@/lib/server-config";

export type { MarketFeedResponse, MarketPriceTickResponse } from "@/lib/market-types";

const DEFAULT_COINGECKO = {
  marketsEndpoint: "https://api.coingecko.com/api/v3/coins/markets",
  priceEndpoint: "https://api.coingecko.com/api/v3/simple/price",
  vsCurrency: "usd",
  ids: [
    "bitcoin",
    "ethereum",
    "tether",
    "solana",
    "usd-coin",
    "binancecoin",
    "ripple",
    "cardano",
    "dogecoin",
    "avalanche-2",
  ],
  timeoutMs: 10_000,
} as const;

export const COINGECKO_ID_BY_SYMBOL: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  SOL: "solana",
  USDC: "usd-coin",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
};

function resolveCoingeckoApiKey(): string {
  const fromEnv = process.env.COINGECKO_API_KEY?.trim();
  if (fromEnv) return fromEnv;

  const rootEnv = path.resolve(process.cwd(), "..", ".env");
  if (!existsSync(rootEnv)) return "";

  for (const line of readFileSync(rootEnv, "utf-8").split("\n")) {
    const match = line.match(/^COINGECKO_API_KEY=(.+)$/);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function coingeckoHeaders(): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  const apiKey = resolveCoingeckoApiKey();
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
  return headers;
}

function aiSentiment(
  symbol: string,
  change24h: number,
): MarketAsset["aiSentiment"] {
  if (["USDT", "USDC", "DAI", "BUSD"].includes(symbol)) return "Neutral";
  if (change24h >= 0.5) return "Greed";
  if (change24h <= -0.5) return "Fear";
  return "Neutral";
}

function parseCoingeckoPayload(
  payload: unknown,
  fallback: MarketAsset[],
): { market: MarketAsset[]; updatedAt: string | null } {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("Empty or malformed CoinGecko payload");
  }

  const fallbackBySymbol = new Map(fallback.map((a) => [a.symbol, a]));
  let freshestMs = 0;
  const rows: MarketAsset[] = payload.map((coin, index) => {
    const entry = coin as Record<string, unknown>;
    const symbol = String(entry.symbol ?? "").toUpperCase();
    const change24h = Number(entry.price_change_percentage_24h ?? 0);
    const lastUpdated = entry.last_updated;
    if (typeof lastUpdated === "string") {
      const ms = Date.parse(lastUpdated);
      if (Number.isFinite(ms) && ms > freshestMs) freshestMs = ms;
    }

    const base = fallbackBySymbol.get(symbol);
    const name = String(entry.name ?? base?.name ?? symbol);
    const slug =
      base?.slug ??
      (name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || symbol.toLowerCase());

    return {
      rank: Number(entry.market_cap_rank ?? base?.rank ?? index + 1),
      slug,
      symbol,
      name,
      price: Number(entry.current_price ?? base?.price ?? 0),
      marketCap: Number(entry.market_cap ?? base?.marketCap ?? 0),
      change24h: Number.isFinite(change24h) ? change24h : (base?.change24h ?? 0),
      volume24h: Number(entry.total_volume ?? base?.volume24h ?? 0) || undefined,
      imageUrl:
        typeof entry.image === "string" ? entry.image : base?.imageUrl,
      aiSentiment: base?.aiSentiment ?? aiSentiment(symbol, change24h),
      relatedSymbols: base?.relatedSymbols ?? [],
      aiRecommendation:
        base?.aiRecommendation ?? {
          signal: "Hold" as const,
          rationale: `${symbol}: live quote with config-backed AI context.`,
        },
    };
  });

  rows.sort((a, b) => b.marketCap - a.marketCap);
  return {
    market: rows,
    updatedAt: freshestMs > 0 ? new Date(freshestMs).toISOString() : null,
  };
}

/**
 * Live CoinGecko markets feed with silent self-healing to config.json snapshot.
 */
export async function fetchLiveMarket(): Promise<MarketFeedResponse> {
  const fallback = await loadMarketFallback();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_COINGECKO.timeoutMs);

  try {
    const url = new URL(DEFAULT_COINGECKO.marketsEndpoint);
    url.searchParams.set("vs_currency", DEFAULT_COINGECKO.vsCurrency);
    url.searchParams.set("ids", DEFAULT_COINGECKO.ids.join(","));
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", String(DEFAULT_COINGECKO.ids.length));
    url.searchParams.set("page", "1");

    const resp = await fetch(url, {
      headers: coingeckoHeaders(),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!resp.ok) {
      throw new Error(`CoinGecko HTTP ${resp.status}`);
    }

    const parsed = parseCoingeckoPayload(await resp.json(), fallback);
    return { market: parsed.market, live: true, updatedAt: parsed.updatedAt };
  } catch {
    return {
      market: fallback,
      live: false,
      updatedAt: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

function parseSimplePricePayload(payload: unknown): MarketPriceTickResponse {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Malformed CoinGecko simple/price payload");
  }

  const prices: Record<string, number> = {};
  let freshestMs = 0;

  for (const [coinId, raw] of Object.entries(payload as Record<string, unknown>)) {
    const entry = raw as Record<string, unknown>;
    const usd = Number(entry.usd);
    if (!Number.isFinite(usd)) continue;

    const symbol =
      Object.entries(COINGECKO_ID_BY_SYMBOL).find(([, id]) => id === coinId)?.[0] ??
      coinId.toUpperCase();
    prices[symbol] = usd;

    const ts = Number(entry.last_updated_at);
    if (Number.isFinite(ts) && ts * 1000 > freshestMs) freshestMs = ts * 1000;
  }

  if (Object.keys(prices).length === 0) {
    throw new Error("Empty CoinGecko simple/price payload");
  }

  return {
    prices,
    live: true,
    updatedAt: freshestMs > 0 ? new Date(freshestMs).toISOString() : null,
  };
}

/** Fast price tick — lighter CoinGecko endpoint, suitable for ~10s LIVE polling. */
export async function fetchLivePriceTick(): Promise<MarketPriceTickResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_COINGECKO.timeoutMs);

  try {
    const url = new URL(DEFAULT_COINGECKO.priceEndpoint);
    url.searchParams.set("ids", DEFAULT_COINGECKO.ids.join(","));
    url.searchParams.set("vs_currencies", DEFAULT_COINGECKO.vsCurrency);
    url.searchParams.set("include_last_updated_at", "true");

    const resp = await fetch(url, {
      headers: coingeckoHeaders(),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!resp.ok) {
      throw new Error(`CoinGecko HTTP ${resp.status}`);
    }

    return parseSimplePricePayload(await resp.json());
  } catch {
    return { prices: {}, live: false, updatedAt: null };
  } finally {
    clearTimeout(timer);
  }
}
