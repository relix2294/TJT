"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Dictionary, MarketAsset } from "@/lib/config";
import { fmtCompactUsd, fmtPct, fmtTimeAgo, fmtUsd2 } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { marketHref } from "@/lib/market-utils";
import { useMarket } from "@/lib/use-market";
import { cn } from "@/lib/utils";

type HomeMarketTableProps = {
  lang: Locale;
  dict: Dictionary;
  initialMarket?: MarketAsset[];
};

type MarketFilter = "all" | "gainers" | "losers";

const MARKET_ROW_LIMIT = 15;

const SYMBOL_COLORS: Record<string, string> = {
  BTC: "bg-[#f7931a]",
  ETH: "bg-[#627eea]",
  SOL: "bg-gradient-to-br from-[#9945ff] to-[#14f195]",
  USDT: "bg-[#26a17b]",
  USDC: "bg-[#2775ca]",
  BNB: "bg-[#f3ba2f]",
  XRP: "bg-[#23292f]",
  ADA: "bg-[#0033ad]",
  DOGE: "bg-[#c2a633]",
  AVAX: "bg-[#e84142]",
};

function CoinLogo({ asset }: { asset: MarketAsset }) {
  const fallbackClass = SYMBOL_COLORS[asset.symbol] ?? "bg-slate-700";

  if (asset.imageUrl) {
    return (
      <Image
        src={asset.imageUrl}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0 rounded-full"
        unoptimized
      />
    );
  }

  return (
    <span
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white",
        fallbackClass,
      )}
      aria-hidden
    >
      {asset.symbol.slice(0, 1)}
    </span>
  );
}

export function HomeMarketTable({ lang, dict, initialMarket }: HomeMarketTableProps) {
  const { market: liveMarket, live, updatedAt, tickAt, loading, error } = useMarket();
  const assets = liveMarket ?? initialMarket;
  const t = dict.market;
  const hub = dict.marketHub;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MarketFilter>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filterTabs: { key: MarketFilter; label: string }[] = [
    { key: "all", label: hub.filterAll },
    { key: "gainers", label: hub.filterGainers },
    { key: "losers", label: hub.filterLosers },
  ];

  const filtered = useMemo(() => {
    if (!assets?.length) return [];
    let rows = [...assets];

    if (filter === "gainers") {
      rows = rows.filter((a) => a.change24h > 0);
      rows.sort((a, b) => b.change24h - a.change24h);
    } else if (filter === "losers") {
      rows = rows.filter((a) => a.change24h < 0);
      rows.sort((a, b) => a.change24h - b.change24h);
    } else {
      rows.sort((a, b) => a.rank - b.rank);
    }

    if (deferredQuery) {
      rows = rows.filter(
        (a) =>
          a.symbol.toLowerCase().includes(deferredQuery) ||
          a.name.toLowerCase().includes(deferredQuery),
      );
    }

    return rows.slice(0, MARKET_ROW_LIMIT);
  }, [assets, deferredQuery, filter]);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/80">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white">{t.cardTitle}</h2>
          <p className="text-[11px] text-slate-400">{t.cardDesc}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              live
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                : "border-slate-700 bg-slate-900 text-slate-400",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                live ? "animate-pulse bg-emerald-500" : "bg-slate-500",
              )}
            />
            {hub.terminalBadge}
          </span>
          {live && (tickAt ?? updatedAt) ? (
            <span className="font-numeric text-[10px] text-slate-500">
              {fmtTimeAgo(tickAt ?? updatedAt!, lang)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-2 border-b border-slate-800 px-3 py-2 sm:px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={hub.searchPlaceholder}
            className="h-8 rounded border border-gray-800 bg-gray-950 pl-8 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-green-500 focus-visible:ring-green-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded border px-2.5 py-1 text-[11px] font-medium transition-colors",
                filter === key
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-gray-800 bg-gray-950 text-slate-400 hover:border-gray-700 hover:text-slate-300",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">{t.colAsset}</th>
              <th className="px-3 py-2 text-right font-medium">{t.colPrice}</th>
              <th className="px-3 py-2 text-right font-medium">{t.colChange}</th>
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                {t.colVolume}
              </th>
              <th className="px-3 py-2 text-right font-medium">{t.colAction}</th>
            </tr>
          </thead>
          <tbody>
            {loading && !assets?.length
              ? Array.from({ length: MARKET_ROW_LIMIT }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800/60" aria-hidden>
                    {Array.from({ length: 6 }).map((__, c) => (
                      <td key={c} className="px-3 py-2.5">
                        <div className="h-3.5 animate-pulse rounded bg-slate-800" />
                      </td>
                    ))}
                  </tr>
                ))
              : null}

            {error && !assets?.length ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-sm text-rose-500">
                  {t.error}
                </td>
              </tr>
            ) : null}

            {!loading && filtered.length === 0 && assets?.length ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-[11px] text-slate-400">
                  {hub.noResults}
                </td>
              </tr>
            ) : null}

            {filtered.map((asset) => {
              const href = marketHref(lang, asset);
              const isUp = asset.change24h >= 0;

              return (
                <tr
                  key={asset.symbol}
                  className="group relative border-b border-slate-800/60 transition-colors hover:bg-slate-900/60"
                >
                  <td className="px-3 py-2 font-numeric tabular-nums text-slate-500">
                    {asset.rank}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={href}
                      className="relative z-[2] flex items-center gap-2 transition-colors hover:text-white"
                    >
                      <CoinLogo asset={asset} />
                      <span className="min-w-0">
                        <span className="block font-semibold text-slate-100 group-hover:text-white">
                          {asset.name}
                        </span>
                        <span className="font-numeric text-[10px] text-slate-500">
                          {asset.symbol}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-numeric tabular-nums text-slate-100">
                    {fmtUsd2(asset.price)}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-2 text-right font-numeric font-semibold tabular-nums",
                      isUp ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {fmtPct(asset.change24h)}
                  </td>
                  <td className="hidden px-3 py-2 text-right font-numeric tabular-nums text-slate-400 sm:table-cell">
                    {asset.volume24h ? fmtCompactUsd(asset.volume24h) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={href}
                      className="relative z-[2] inline-flex h-6 items-center rounded border border-slate-700 bg-slate-900 px-2.5 text-[10px] font-semibold text-slate-200 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      {t.colAction}
                    </Link>
                  </td>
                  <Link
                    href={href}
                    className="absolute inset-0 z-[1]"
                    aria-label={`${asset.name} (${asset.symbol})`}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
