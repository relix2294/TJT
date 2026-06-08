"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  NEWS_CATEGORIES,
  type Dictionary,
  type NewsCategory,
  type NewsItem,
} from "@/lib/config";
import { fmtNewsDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CATEGORY_BADGE: Record<NewsCategory, string> = {
  Аналитика: "border-primary/40 bg-[--neon-soft] text-primary",
  DeFi: "border-profit/40 bg-profit/10 text-profit",
  Новости: "border-border/70 bg-white/[0.04] text-muted-foreground",
};

type Filter = "all" | NewsCategory;

export function NewsList({
  news,
  lang,
  dict,
}: {
  news: NewsItem[];
  lang: Locale;
  dict: Dictionary;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filters = useMemo<Filter[]>(() => ["all", ...NEWS_CATEGORIES], []);

  const visible = useMemo(
    () => (filter === "all" ? news : news.filter((n) => n.category === filter)),
    [filter, news],
  );

  const filterLabel = (f: Filter) =>
    f === "all" ? dict.newsHub.filterAll : dict.newsCategories[f];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const active = f === filter;
          const count =
            f === "all" ? news.length : news.filter((n) => n.category === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary/50 bg-[--neon-soft] text-primary"
                  : "border-border/60 bg-white/[0.02] text-muted-foreground hover:border-white/15 hover:text-white",
              )}
            >
              {filterLabel(f)}
              <span
                className={cn(
                  "font-numeric text-xs",
                  active ? "text-primary/80" : "text-muted-foreground/60",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <Card className="rounded-2xl border-border/60 bg-surface/70 p-10 text-center text-sm text-muted-foreground">
          {dict.newsHub.emptyCategory}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {visible.map((item) => (
            <Card
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-border/60 bg-surface/70 p-0 ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:ring-primary/30"
            >
              <Link
                href={`/${lang}/news/${item.slug}`}
                className="flex flex-1 flex-col p-6"
                aria-label={item.title}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[0.7rem] font-semibold uppercase tracking-wider",
                      CATEGORY_BADGE[item.category],
                    )}
                  >
                    {dict.newsCategories[item.category]}
                  </Badge>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/40 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="size-3" />
                    AI
                  </span>
                </div>

                <h2 className="font-heading text-lg font-bold leading-snug text-white transition-colors group-hover:text-primary sm:text-xl">
                  {item.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {fmtNewsDate(item.publishedAt, lang)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-0.5">
                    {dict.newsHub.readMore}
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
