"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Dictionary, MarketAsset } from "@/lib/config";
import { useMarket } from "@/lib/use-market";
import { fmtUsd2, fmtCompactUsd, fmtPct, fmtTimeAgo } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { marketHref } from "@/lib/market-utils";
import { cn } from "@/lib/utils";

type SentimentFilter = "all" | MarketAsset["aiSentiment"];
type SortKey = "rank" | "change24h" | "price" | "marketCap";

type MarketTerminalTableProps = {
  lang: Locale;
  dict: Dictionary;
  initialMarket?: MarketAsset[];
};

function SentimentBadge({ sentiment }: { sentiment: MarketAsset["aiSentiment"] }) {
  const map = {
    Greed: "border-profit/40 bg-profit/10 text-profit",
    Neutral: "border-border/60 bg-white/5 text-muted-foreground",
    Fear: "border-loss/40 bg-loss/10 text-loss",
  } as const;
  return (
    <Badge variant="outline" className={cn("font-medium", map[sentiment])}>
      {sentiment}
    </Badge>
  );
}

export function MarketTerminalTable({ lang, dict, initialMarket }: MarketTerminalTableProps) {
  const { market: liveMarket, live, updatedAt, tickAt, loading, error } = useMarket();
  const assets = liveMarket ?? initialMarket;
  const hub = dict.marketHub;
  const t = dict.market;

  const [query, setQuery] = useState("");
  const [sentiment, setSentiment] = useState<SentimentFilter>("all");
  const [sort, setSort] = useState<SortKey>("rank");

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    if (!assets?.length) return [];
    let rows = [...assets];

    if (sentiment !== "all") {
      rows = rows.filter((a) => a.aiSentiment === sentiment);
    }

    if (deferredQuery) {
      rows = rows.filter(
        (a) =>
          a.symbol.toLowerCase().includes(deferredQuery) ||
          a.name.toLowerCase().includes(deferredQuery) ||
          a.slug.includes(deferredQuery),
      );
    }

    rows.sort((a, b) => {
      if (sort === "rank") return a.rank - b.rank;
      if (sort === "change24h") return b.change24h - a.change24h;
      if (sort === "price") return b.price - a.price;
      return b.marketCap - a.marketCap;
    });

    return rows;
  }, [assets, deferredQuery, sentiment, sort]);

  const sentimentFilters: { key: SentimentFilter; label: string }[] = [
    { key: "all", label: hub.filterAll },
    { key: "Greed", label: hub.filterGreed },
    { key: "Neutral", label: hub.filterNeutral },
    { key: "Fear", label: hub.filterFear },
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "rank", label: hub.sortRank },
    { key: "change24h", label: hub.sortChange },
    { key: "price", label: hub.sortPrice },
    { key: "marketCap", label: hub.sortCap },
  ];

  return (
    <Card className="glass overflow-hidden rounded-2xl border-white/[0.06] p-0">
      <div className="border-b border-white/[0.06] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">{t.cardTitle}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{t.cardDesc}</p>
          </div>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
              live
                ? "border-profit/30 bg-profit/10 text-profit"
                : "border-primary/30 bg-[--neon-soft] text-primary",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                live ? "animate-pulse-dot bg-profit" : "bg-primary",
              )}
            />
            {dict.marketHub.terminalBadge}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={hub.searchPlaceholder}
              className="h-10 border-white/[0.08] bg-[#0e1016] pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {sentimentFilters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSentiment(key)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                  sentiment === key
                    ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {sortOptions.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 font-numeric text-[11px] font-semibold transition-colors",
                  sort === key
                    ? "bg-white/[0.08] text-foreground ring-1 ring-white/10"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {live && (tickAt ?? updatedAt) ? (
          <p className="mt-3 text-[11px] text-muted-foreground">
            CoinGecko · {fmtTimeAgo(tickAt ?? updatedAt!, lang)}
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground/80">
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">{t.colAsset}</th>
              <th className="px-5 py-3 text-right font-medium">{t.colPrice}</th>
              <th className="px-5 py-3 text-right font-medium">{t.colCap}</th>
              <th className="px-5 py-3 text-right font-medium">{t.colChange}</th>
              <th className="px-5 py-3 text-right font-medium">{t.colSentiment}</th>
              <th className="px-5 py-3 text-right font-medium">{dict.marketDetail.signalRationaleLabel}</th>
            </tr>
          </thead>
          <tbody>
            {loading && !assets?.length
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40" aria-hidden>
                    {Array.from({ length: 7 }).map((__, c) => (
                      <td key={c} className="px-5 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))
              : null}

            {error && !assets?.length ? (
              <tr className="border-t border-border/40">
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-loss">
                  {t.error}
                </td>
              </tr>
            ) : null}

            {filtered.length === 0 && assets?.length ? (
              <tr className="border-t border-border/40">
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  {hub.noResults}
                </td>
              </tr>
            ) : null}

            {filtered.map((a) => (
              <tr
                key={a.symbol}
                className="group relative border-t border-border/40 transition-colors hover:bg-white/[0.04]"
              >
                <td className="px-5 py-4 font-numeric text-muted-foreground">{a.rank}</td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-white transition-colors group-hover:text-primary">
                    {a.symbol}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">{a.name}</span>
                </td>
                <td className="px-5 py-4 text-right font-numeric tabular-nums text-white">
                  {fmtUsd2(a.price)}
                </td>
                <td className="px-5 py-4 text-right font-numeric tabular-nums text-muted-foreground">
                  {fmtCompactUsd(a.marketCap)}
                </td>
                <td
                  className={cn(
                    "px-5 py-4 text-right font-numeric font-semibold tabular-nums",
                    a.change24h >= 0 ? "text-profit" : "text-loss",
                  )}
                >
                  {fmtPct(a.change24h)}
                </td>
                <td className="px-5 py-4 text-right">
                  <SentimentBadge sentiment={a.aiSentiment} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 px-2 text-[10px] font-bold uppercase",
                      a.aiRecommendation.signal === "Buy" && "border-profit/40 text-profit",
                      a.aiRecommendation.signal === "Hold" && "border-primary/40 text-primary",
                      a.aiRecommendation.signal === "Sell" && "border-loss/40 text-loss",
                    )}
                  >
                    {a.aiRecommendation.signal === "Buy"
                      ? dict.marketDetail.signalBuy
                      : a.aiRecommendation.signal === "Sell"
                        ? dict.marketDetail.signalSell
                        : dict.marketDetail.signalHold}
                  </Badge>
                </td>
                <Link
                  href={marketHref(lang, a)}
                  className="absolute inset-0 z-[1]"
                  aria-label={`${a.name} (${a.symbol})`}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
