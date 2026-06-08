"use client";

import Link from "next/link";
import type { Dictionary, MarketAsset } from "@/lib/config";
import { fmtPct, fmtUsd2 } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { marketHref } from "@/lib/market-utils";
import { useMarket } from "@/lib/use-market";
import { cn } from "@/lib/utils";

type PriceTickerTapeProps = {
  lang: Locale;
  dict: Dictionary;
  limit?: number;
};

export function PriceTickerTape({ lang, dict, limit = 5 }: PriceTickerTapeProps) {
  const { market, live, loading } = useMarket();
  const assets = (market ?? []).slice(0, limit);
  const t = dict.priceTicker;

  if (loading && assets.length === 0) {
    return (
      <div className="glass overflow-hidden rounded-xl border border-white/[0.06]">
        <div className="flex h-10 animate-pulse items-center gap-6 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-24 rounded bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (assets.length === 0) return null;

  const tapeItems = [...assets, ...assets];

  return (
    <div className="glass group/ticker relative overflow-hidden rounded-xl border border-white/[0.06]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0B0E11] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0B0E11] to-transparent" />

      <div className="flex h-10 items-center border-b border-white/[0.05] px-3">
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider",
            live ? "text-profit" : "text-primary",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              live ? "animate-pulse-dot bg-profit" : "bg-primary",
            )}
          />
          {t.liveLabel}
        </span>
      </div>

      <div className="relative flex overflow-hidden py-2.5">
        <div className="animate-ticker-scroll flex shrink-0 items-center gap-8 px-4">
          {tapeItems.map((asset, idx) => (
            <TickerItem key={`${asset.symbol}-${idx}`} lang={lang} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TickerItem({ lang, asset }: { lang: Locale; asset: MarketAsset }) {
  const isUp = asset.change24h >= 0;

  return (
    <Link
      href={marketHref(lang, asset)}
      className="group inline-flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <span className="font-numeric text-xs font-bold text-foreground">{asset.symbol}</span>
      <span className="font-numeric text-xs tabular-nums text-muted-foreground">
        {fmtUsd2(asset.price)}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 font-numeric text-xs font-semibold tabular-nums",
          isUp ? "text-profit" : "text-loss",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            isUp ? "animate-pulse-dot bg-profit" : "animate-pulse-dot bg-loss",
          )}
        />
        {fmtPct(asset.change24h)}
      </span>
    </Link>
  );
}
