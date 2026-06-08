"use client";

import { useEffect, useState } from "react";
import type { MarketAsset } from "@/lib/config";
import type {
  MarketFeedResponse,
  MarketPriceTickResponse,
} from "@/lib/market-types";
import { mergePriceTick } from "@/lib/market-types";

type MarketState = {
  market: MarketAsset[] | null;
  live: boolean;
  /** Last full market snapshot (cap, 24h %). */
  updatedAt: string | null;
  /** Last fast price tick from simple/price. */
  tickAt: string | null;
  loading: boolean;
  error: string | null;
};

/** Fast LIVE price polling via CoinGecko simple/price. */
const TICK_MS = 10_000;
/** Full snapshot (market cap, 24h change, sentiment) refresh. */
const FULL_MS = 60_000;

/**
 * LIVE market stream: full CoinGecko snapshot every 60s + price ticks every 10s.
 */
export function useMarket(): MarketState {
  const [state, setState] = useState<MarketState>({
    market: null,
    live: false,
    updatedAt: null,
    tickAt: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let tickTimer: ReturnType<typeof setInterval> | undefined;
    let fullTimer: ReturnType<typeof setInterval> | undefined;

    const loadFull = async () => {
      try {
        const res = await fetch(`/api/market?_=${Date.now()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error ?? `HTTP ${res.status}`);
        }
        const payload = (await res.json()) as MarketFeedResponse;
        setState((prev) => ({
          market: payload.market,
          live: payload.live,
          updatedAt: payload.updatedAt ?? null,
          tickAt: payload.live ? (payload.updatedAt ?? prev.tickAt) : prev.tickAt,
          loading: false,
          error: null,
        }));
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          live: false,
          loading: false,
          error: (err as Error).message,
        }));
      }
    };

    const loadTick = async () => {
      try {
        const res = await fetch(`/api/market/tick?_=${Date.now()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;

        const tick = (await res.json()) as MarketPriceTickResponse;
        if (!tick.live) return;

        setState((prev) => {
          if (!prev.market?.length) return prev;
          return {
            ...prev,
            market: mergePriceTick(prev.market, tick),
            live: true,
            tickAt: tick.updatedAt ?? new Date().toISOString(),
            error: null,
          };
        });
      } catch {
        /* silent — keep last known prices */
      }
    };

    void loadFull();
    void loadTick();
    tickTimer = setInterval(loadTick, TICK_MS);
    fullTimer = setInterval(loadFull, FULL_MS);

    return () => {
      controller.abort();
      if (tickTimer) clearInterval(tickTimer);
      if (fullTimer) clearInterval(fullTimer);
    };
  }, []);

  return state;
}
