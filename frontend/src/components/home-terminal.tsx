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
    <div className="space-y-8">
      <section>
        <header className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
            {dict.offers.eyebrow}
          </p>
          <h2 className="font-heading text-lg font-bold text-white">
            {dict.home.leaderboardTitle}
          </h2>
        </header>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HomeCryptoExchanges lang={lang} dict={dict} offers={offers} />
          </div>
          <HomeSidebarLeaderboard
            lang={lang}
            dict={dict}
            offers={offers}
            benchmarks={benchmarks}
          />
        </div>
      </section>

      <section>
        <HomeMarketTable lang={lang} dict={dict} initialMarket={initialMarket} />
        <Link
          href={`/${lang}/market`}
          className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
        >
          {teasers.marketCta}
          <ChevronRight className="size-3.5" />
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CompactOpportunityCalculator
          lang={lang}
          dict={dict}
          benchmarks={benchmarks}
          compareHref={`/${lang}/compare`}
        />
        <HomeSidebarNews lang={lang} dict={dict} items={news} />
      </div>
    </div>
  );
}
