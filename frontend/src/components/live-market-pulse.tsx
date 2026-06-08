"use client";

import Link from "next/link";
import { ArrowUpRight, LineChart } from "lucide-react";
import type { Dictionary } from "@/lib/config";
import { fmtPct, fmtUsd2, fmtTimeAgo } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { useMarket } from "@/lib/use-market";
import { cn } from "@/lib/utils";

type LiveMarketPulseProps = {
  lang: Locale;
  dict: Dictionary;
  limit?: number;
};

export function LiveMarketPulse({ lang, dict, limit = 6 }: LiveMarketPulseProps) {
  const { market, live, updatedAt, tickAt, loading, error } = useMarket();
  const t = dict.homeTeasers;
  const assets = (market ?? []).slice(0, limit);

  if (loading && assets.length === 0) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="h-6 animate-pulse rounded bg-white/5" aria-hidden />
        ))}
      </ul>
    );
  }

  if (error && assets.length === 0) {
    return <p className="text-xs text-loss">{dict.market.error}</p>;
  }

  if (assets.length === 0) {
    return <p className="text-xs text-muted-foreground">{dict.market.error}</p>;
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs leading-relaxed text-muted-foreground">{t.marketDesc}</p>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            live
              ? "border-profit/30 bg-profit/10 text-profit"
              : "border-primary/30 bg-[--neon-soft] text-primary",
          )}
        >
          {live ? "LIVE · 10s" : "Fallback"}
        </span>
      </div>
      {live && (tickAt ?? updatedAt) ? (
        <p className="mb-2 text-[10px] text-muted-foreground/80">
          CoinGecko · {fmtTimeAgo(tickAt ?? updatedAt!, lang)}
        </p>
      ) : null}
      <ul className="divide-y divide-border/60">
        {assets.map((asset) => (
          <li
            key={asset.symbol}
            className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="w-10 shrink-0 font-numeric text-xs font-bold text-foreground">
                {asset.symbol}
              </span>
              <span className="truncate font-numeric text-xs text-muted-foreground">
                {fmtUsd2(asset.price)}
              </span>
            </div>
            <span
              className={cn(
                "shrink-0 font-numeric text-xs font-semibold tabular-nums",
                asset.change24h >= 0 ? "text-profit" : "text-loss",
              )}
            >
              {fmtPct(asset.change24h)}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={`/${lang}/market`}
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-foreground"
      >
        <LineChart className="size-3" />
        {t.marketCta}
        <ArrowUpRight className="size-3" />
      </Link>
    </>
  );
}
