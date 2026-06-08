"use client";

import Link from "next/link";
import { Brain, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/config";
import { fmtPct } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { aiVerdict, marketHref } from "@/lib/market-utils";
import { useMarket } from "@/lib/use-market";
import { cn } from "@/lib/utils";

type AiMarketScoringProps = {
  lang: Locale;
  dict: Dictionary;
  limit?: number;
};

const SENTIMENT_STYLES = {
  Greed: "border-profit/40 bg-profit/10 text-profit",
  Neutral: "border-border/60 bg-white/5 text-muted-foreground",
  Fear: "border-loss/40 bg-loss/10 text-loss",
} as const;

export function AiMarketScoring({ lang, dict, limit = 5 }: AiMarketScoringProps) {
  const { market, loading, error } = useMarket();
  const assets = (market ?? []).slice(0, limit);
  const t = dict.home;

  if (loading && assets.length === 0) {
    return (
      <GlassPanel eyebrow="AI" title={t.aiScoringTitle} icon={Brain}>
        <ul className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
          ))}
        </ul>
      </GlassPanel>
    );
  }

  if (error && assets.length === 0) {
    return (
      <GlassPanel eyebrow="AI" title={t.aiScoringTitle} icon={Brain}>
        <p className="text-xs text-loss">{dict.market.error}</p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel eyebrow="AI" title={t.aiScoringTitle} icon={Brain}>
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{t.aiScoringDesc}</p>
      <ul className="space-y-2">
        {assets.map((asset) => (
          <li key={asset.symbol}>
            <Link
              href={marketHref(lang, asset)}
              className="group block rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200 hover:border-primary/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-numeric text-sm font-bold text-foreground">
                    {asset.symbol}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 px-1.5 text-[10px] font-semibold",
                      SENTIMENT_STYLES[asset.aiSentiment],
                    )}
                  >
                    {asset.aiSentiment}
                  </Badge>
                </div>
                <span
                  className={cn(
                    "font-numeric text-xs font-semibold tabular-nums",
                    asset.change24h >= 0 ? "text-profit" : "text-loss",
                  )}
                >
                  {fmtPct(asset.change24h)}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground transition-colors group-hover:text-foreground/80">
                <span className="font-medium text-primary/80">{t.aiVerdictLabel}: </span>
                {aiVerdict(asset, lang)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/${lang}/market`}
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-foreground"
      >
        {dict.homeTeasers.marketCta}
        <ChevronRight className="size-3.5" />
      </Link>
    </GlassPanel>
  );
}
