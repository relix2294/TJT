"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Dictionary, type MarketAsset } from "@/lib/config";
import { useConfig } from "@/lib/use-config";
import { useMarket } from "@/lib/use-market";
import { fmtUsd2, fmtCompactUsd, fmtPct, fmtTimeAgo } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { marketHref } from "@/lib/market-utils";
import { cn } from "@/lib/utils";

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

type MarketSnapshotProps = {
  lang: Locale;
  dict?: Dictionary;
  market?: MarketAsset[];
};

export function MarketSnapshot({ lang, dict, market }: MarketSnapshotProps) {
  const { config, loading: configLoading, error: configError } = useConfig(lang);
  const { market: liveMarket, live, updatedAt, tickAt, loading: marketLoading, error: marketError } =
    useMarket();
  const t = dict ?? config?.dict;
  const assets = market ?? liveMarket ?? undefined;
  const isLoading = !market && (configLoading || marketLoading);
  const hasError = !market && !isLoading && (marketError || configError || !assets?.length);

  if (!t) return null;

  return (
    <Card className="glass overflow-hidden rounded-3xl border-border/70 p-0">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
        <div>
          <h3 className="font-heading text-xl font-bold text-white">
            {t.market.cardTitle}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t.market.cardDesc}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
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
          {live ? "LIVE · 10s" : "Fallback · config"}
        </span>
      </div>
      {live && (tickAt ?? updatedAt) ? (
        <p className="border-b border-border/60 px-6 py-2 text-[11px] text-muted-foreground">
          CoinGecko · цена каждые 10 сек ·{" "}
          {fmtTimeAgo(tickAt ?? updatedAt!, lang)}
          {updatedAt ? (
            <span className="text-muted-foreground/60">
              {" "}
              · снимок {fmtTimeAgo(updatedAt, lang)}
            </span>
          ) : null}
        </p>
      ) : updatedAt ? (
        <p className="border-b border-border/60 px-6 py-2 text-[11px] text-muted-foreground">
          Локальный снимок · {fmtTimeAgo(updatedAt, lang)}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground/80">
              <th className="px-6 py-3 font-medium">#</th>
              <th className="px-6 py-3 font-medium">{t.market.colAsset}</th>
              <th className="px-6 py-3 text-right font-medium">{t.market.colPrice}</th>
              <th className="px-6 py-3 text-right font-medium">{t.market.colCap}</th>
              <th className="px-6 py-3 text-right font-medium">{t.market.colChange}</th>
              <th className="px-6 py-3 text-right font-medium">{t.market.colSentiment}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/40" aria-hidden>
                    {Array.from({ length: 6 }).map((__, c) => (
                      <td key={c} className="px-6 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))
              : null}

            {hasError ? (
              <tr className="border-t border-border/40">
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-loss">
                  {t.market.error}
                  {marketError ? (
                    <span className="mt-1 block text-loss/70">{marketError}</span>
                  ) : null}
                </td>
              </tr>
            ) : null}

            {!isLoading && assets
              ? assets.map((a) => (
                  <tr
                    key={a.symbol}
                    className="group relative border-t border-border/40 transition-colors hover:bg-white/[0.04]"
                  >
                    <td className="px-6 py-4 font-numeric text-muted-foreground">{a.rank}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white transition-colors group-hover:text-primary">
                        {a.symbol}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">{a.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-numeric tabular-nums text-white">
                      {fmtUsd2(a.price)}
                    </td>
                    <td className="px-6 py-4 text-right font-numeric tabular-nums text-muted-foreground">
                      {fmtCompactUsd(a.marketCap)}
                    </td>
                    <td
                      className={cn(
                        "px-6 py-4 text-right font-numeric font-semibold tabular-nums",
                        a.change24h >= 0 ? "text-profit" : "text-loss",
                      )}
                    >
                      {fmtPct(a.change24h)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SentimentBadge sentiment={a.aiSentiment} />
                    </td>
                    <Link
                      href={marketHref(lang, a)}
                      className="absolute inset-0 z-[1]"
                      aria-label={`${a.name} (${a.symbol})`}
                    />
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
