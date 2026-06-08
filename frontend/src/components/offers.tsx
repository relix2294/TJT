"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OfferButton } from "@/components/offer-button";
import { useConfig } from "@/lib/use-config";
import { fmtUsd } from "@/lib/format";
import type { CpaOffer, Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

type OffersProps = {
  lang: Locale;
  dict: Dictionary;
  data?: CpaOffer[];
};

export function Offers({ lang, dict, data }: OffersProps) {
  const { config, loading, error } = useConfig(lang);
  const offers = data ?? config?.offers;
  const isLoading = !data && loading;
  const hasError = !data && (error || !config);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="flex flex-col gap-4 rounded-2xl border-border/60 bg-surface/70 p-5 sm:p-6"
            aria-hidden
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-12 animate-pulse rounded-md bg-white/10" />
              <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
            </div>
            <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
            <div className="h-9 w-28 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-11 w-full animate-pulse rounded-xl bg-white/5" />
          </Card>
        ))}
      </div>
    );
  }

  if (hasError || !offers) {
    return (
      <Card className="rounded-2xl border-loss/40 bg-loss/5 p-6 text-sm text-loss">
        {dict.offers.error}
        {error ? <span className="mt-1 block text-loss/70">{error}</span> : null}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      {offers.map((offer) => (
        <Card
          key={offer.id}
          className="group relative flex flex-col overflow-hidden rounded-2xl border-border/60 bg-surface/70 p-5 transition-all duration-200 hover:-translate-y-1.5 hover:border-profit/50 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-primary/40 bg-[--neon-soft] font-bold text-primary"
            >
              {offer.riskRating}
            </Badge>
            <span className="text-xs text-muted-foreground">{offer.network}</span>
          </div>

          <Link href={`/${lang}/offers/${offer.slug}`} className="mt-4 block">
            <h4 className="font-heading text-base font-bold text-white transition-colors group-hover:text-primary sm:text-lg">
              {offer.name}
            </h4>
          </Link>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {offer.protocol} · {dict.offers.min} {fmtUsd(offer.minEntryUsd)}
          </p>

          <div className="mt-5 font-numeric text-3xl font-extrabold text-profit sm:text-4xl">
            {offer.apy.toFixed(1)}%
            <span className="ml-1 text-sm font-semibold text-muted-foreground">
              APY
            </span>
          </div>

          <Link
            href={`/${lang}/offers/${offer.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-white"
          >
            {dict.offers.review}
            <ArrowUpRight className="size-3.5" />
          </Link>

          <OfferButton offer={offer} dict={dict} lang={lang} />
        </Card>
      ))}
    </div>
  );
}
