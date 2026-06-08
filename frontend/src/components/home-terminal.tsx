"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CompactOpportunityCalculator } from "@/components/compact-opportunity-calculator";
import { HomeCryptoExchanges } from "@/components/home-crypto-exchanges";
import { HomeMarketTable } from "@/components/home-market-table";
import { HomeSidebarLeaderboard } from "@/components/home-sidebar-leaderboard";
import { HomeSidebarNews } from "@/components/home-sidebar-news";
import type { Benchmarks, CpaOffer, Dictionary, MarketAsset, NewsItem } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

type HomeTerminalProps = {
  lang: Locale;
  dict: Dictionary;
  benchmarks: Benchmarks;
  offers: CpaOffer[];
  news: NewsItem[];
  initialMarket: MarketAsset[];
};

export function HomeTerminal({
  lang,
  dict,
  benchmarks,
  offers,
  news,
  initialMarket,
}: HomeTerminalProps) {
  const teasers = dict.homeTeasers;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <HomeCryptoExchanges lang={lang} dict={dict} offers={offers} />
        <HomeMarketTable lang={lang} dict={dict} initialMarket={initialMarket} />
        <Link
          href={`/${lang}/market`}
          className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
        >
          {teasers.marketCta}
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <aside className="space-y-4">
        <CompactOpportunityCalculator
          lang={lang}
          dict={dict}
          benchmarks={benchmarks}
          offersHref={`/${lang}/offers`}
        />
        <HomeSidebarNews lang={lang} dict={dict} items={news} />
        <HomeSidebarLeaderboard
          lang={lang}
          dict={dict}
          offers={offers}
          benchmarks={benchmarks}
        />
      </aside>
    </div>
  );
}
