"use client";

import Link from "next/link";
import { ArrowUpRight, Radio, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConfig } from "@/lib/use-config";
import { fmtTimeAgo } from "@/lib/format";
import { type Dictionary, type NewsCategory, type NewsItem } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CATEGORY_BADGE: Record<NewsCategory, string> = {
  Аналитика: "border-primary/40 bg-[--neon-soft] text-primary",
  DeFi: "border-profit/40 bg-profit/10 text-profit",
  Новости: "border-border/70 bg-white/[0.04] text-muted-foreground",
};

type NewsTickerProps = {
  lang: Locale;
  dict?: Dictionary;
  news?: NewsItem[];
  limit?: number;
};

export function NewsTicker({ lang, dict, news, limit = 3 }: NewsTickerProps) {
  const { config, loading, error } = useConfig(lang);
  const t = dict ?? config?.dict;
  const items = (news ?? config?.news ?? []).slice(0, limit);
  const isLoading = !news && loading;
  const hasError = !news && (error || !config);

  if (!t) return null;

  return (
    <Card className="glass overflow-hidden rounded-3xl border-border/70 p-0">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
        <div>
          <h3 className="inline-flex items-center gap-2 font-heading text-xl font-bold text-white">
            <Radio className="size-4 text-primary" />
            {t.ticker.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.ticker.desc}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-[--neon-soft] px-3 py-1 text-xs font-semibold text-primary">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-primary" />
          LIVE
        </span>
      </div>

      <div className="divide-y divide-border/40">
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 px-6 py-4" aria-hidden>
                <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
              </div>
            ))
          : null}

        {hasError ? (
          <div className="px-6 py-8 text-center text-sm text-loss">
            {t.ticker.error}
            {error ? <span className="mt-1 block text-loss/70">{error}</span> : null}
          </div>
        ) : null}

        {!isLoading && !hasError && items.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            {t.ticker.empty}
          </div>
        ) : null}

        {!isLoading && items.length > 0
          ? items.map((item) => (
              <Link
                key={item.id}
                href={`/${lang}/news/${item.slug}`}
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[0.65rem] font-semibold uppercase tracking-wider",
                        CATEGORY_BADGE[item.category],
                      )}
                    >
                      {t.newsCategories[item.category]}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary/80">
                      <Sparkles className="size-3" />
                      AI
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      {fmtTimeAgo(item.publishedAt, lang)}
                    </span>
                  </div>
                  <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-primary">
                    {item.title}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))
          : null}
      </div>

      <div className="border-t border-border/60 px-6 py-4">
        <Link
          href={`/${lang}/news`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform hover:translate-x-0.5"
        >
          {t.ticker.all}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
