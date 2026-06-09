"use client";

import { OfferButton } from "@/components/offer-button";
import type { CpaOffer, Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

function ratingFromRisk(risk: string): string {
  if (risk.startsWith("AAA")) return "4.9";
  if (risk.startsWith("AA")) return "4.7";
  if (risk.startsWith("A")) return "4.5";
  return "4.6";
}

function featureTag(offer: CpaOffer): string {
  const raw = offer.benefits[0] ?? offer.network;
  const cut = raw.split("·")[0]?.trim() ?? raw;
  return cut.length > 28 ? `${cut.slice(0, 26)}…` : cut;
}

type HomeCryptoExchangesProps = {
  lang: Locale;
  dict: Dictionary;
  offers: CpaOffer[];
};

export function HomeCryptoExchanges({ lang, dict, offers }: HomeCryptoExchangesProps) {
  const t = dict.home;
  const rows = [...offers].sort((a, b) => b.apy - a.apy).slice(0, 4);

  if (rows.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-lg border border-gray-800 bg-neutral-950/80">
      <header className="border-b border-gray-800 px-3 py-2 sm:px-4">
        <h2 className="text-sm font-semibold text-white">{t.featuredOpportunitiesTitle}</h2>
      </header>
      <ul className="divide-y divide-gray-800">
        {rows.map((offer) => (
          <li
            key={offer.id}
            className="flex items-center gap-2 px-3 py-2 transition-colors hover:bg-neutral-900/60 sm:px-4"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded border border-gray-800 bg-neutral-900 text-[9px] font-bold text-slate-200">
              {offer.logo}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-slate-100">{offer.name}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-numeric text-[10px] font-semibold tabular-nums text-amber-400">
                  {ratingFromRisk(offer.riskRating)}/5
                </span>
                <span className="rounded border border-gray-800 bg-neutral-900 px-1.5 py-px text-[9px] font-medium text-slate-400">
                  {featureTag(offer)}
                </span>
              </div>
            </div>
            <OfferButton
              offer={offer}
              dict={dict}
              lang={lang}
              label={t.signUp}
              className="mt-0 inline-flex h-7 w-auto shrink-0 gap-0.5 rounded border border-emerald-500/40 bg-emerald-500/15 px-2.5 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
