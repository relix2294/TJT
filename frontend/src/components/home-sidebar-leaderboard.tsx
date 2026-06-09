"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OfferButton } from "@/components/offer-button";
import { Badge } from "@/components/ui/badge";
import {
  type CalculatorAsset,
  sortOffersForCalculator,
} from "@/lib/calculator-assets";
import type { Benchmarks, CpaOffer, Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function riskBadgeClass(rating: string): string {
  if (rating.startsWith("AAA")) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (rating.startsWith("AA")) return "border-sky-500/30 bg-sky-500/10 text-sky-400";
  return "border-rose-500/30 bg-rose-500/10 text-rose-400";
}

type HomeSidebarLeaderboardProps = {
  lang: Locale;
  dict: Dictionary;
  offers: CpaOffer[];
  benchmarks: Benchmarks;
};

export function HomeSidebarLeaderboard({
  lang,
  dict,
  offers,
  benchmarks,
}: HomeSidebarLeaderboardProps) {
  const homeT = dict.home;
  const teasers = dict.homeTeasers;
  const [asset] = useState<CalculatorAsset>("USDC");
  const capital = benchmarks.defaultCapital;

  const sortedOffers = useMemo(
    () => sortOffersForCalculator(offers, asset, capital).offers.slice(0, 4),
    [offers, asset, capital],
  );

  if (sortedOffers.length === 0) {
    return (
      <section className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
        <p className="text-[11px] text-slate-500">{dict.offers.error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
      <header className="mb-2 border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold text-white">{homeT.leaderboardSidebarTitle}</h2>
      </header>

      <ul className="divide-y divide-slate-800">
        {sortedOffers.map((offer, index) => (
          <li key={offer.id} className="py-2 first:pt-0 last:pb-0">
            <div className="flex items-start gap-2">
              <span className="font-numeric mt-0.5 w-3 shrink-0 text-[10px] text-slate-600">
                {index + 1}
              </span>
              <span className="grid size-6 shrink-0 place-items-center rounded border border-slate-800 bg-slate-900 text-[9px] font-bold text-slate-300">
                {offer.logo}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/${lang}/offers/${offer.slug}`}
                  className="block truncate text-[11px] font-semibold text-slate-200 transition-colors hover:text-emerald-400"
                >
                  {offer.name}
                </Link>
                <p className="truncate text-[10px] text-slate-500">
                  {offer.protocol} · {offer.network}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-4 px-1 text-[9px] font-semibold",
                      riskBadgeClass(offer.riskRating),
                    )}
                  >
                    {offer.riskRating}
                  </Badge>
                  <span className="font-numeric text-[11px] font-bold tabular-nums text-emerald-500">
                    {offer.apy.toFixed(1)}% {homeT.bonusLabel}
                  </span>
                </div>
              </div>
              <OfferButton
                offer={offer}
                dict={dict}
                lang={lang}
                label={homeT.getBonus}
                className="mt-0 inline-flex h-6 w-auto shrink-0 gap-0.5 px-2 text-[10px]"
              />
            </div>
          </li>
        ))}
      </ul>

      <Link
        href={`/${lang}/offers`}
        className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
      >
        {teasers.offersCta}
        <ChevronRight className="size-3" />
      </Link>
    </section>
  );
}
