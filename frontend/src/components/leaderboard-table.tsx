"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OfferButton } from "@/components/offer-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  netProfitVsBank,
  sortOffersForCalculator,
  type CalculatorAsset,
} from "@/lib/calculator-assets";
import { fmtUsd } from "@/lib/format";
import type { CpaOffer, Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function riskBadgeClass(rating: string): string {
  if (rating.startsWith("AAA")) return "border-profit/30 bg-profit/10 text-profit";
  if (rating.startsWith("AA")) return "border-primary/30 bg-[--neon-soft] text-primary";
  return "border-loss/30 bg-loss/10 text-loss";
}

type LeaderboardTableProps = {
  lang: Locale;
  dict: Dictionary;
  offers: CpaOffer[];
  asset: CalculatorAsset;
  capital: number;
  bankApr: number;
  ctaLabel?: string;
  introText?: string;
};

export function LeaderboardTable({
  lang,
  dict,
  offers,
  asset,
  capital,
  bankApr,
  ctaLabel,
  introText,
}: LeaderboardTableProps) {
  const t = dict.homeTeasers;
  const calcT = dict.calculator;
  const homeT = dict.home;
  const buttonLabel = ctaLabel ?? homeT.getOffer;
  const description = introText ?? t.offersDesc;

  const { sortedOffers, topMatchId } = useMemo(() => {
    const result = sortOffersForCalculator(offers, asset, capital);
    return { sortedOffers: result.offers, topMatchId: result.topMatchId };
  }, [offers, asset, capital]);

  if (sortedOffers.length === 0) {
    return <p className="text-xs text-muted-foreground">{dict.offers.error}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 px-2">{dict.admin.colRank}</TableHead>
            <TableHead>{dict.admin.colOffer}</TableHead>
            <TableHead>{dict.admin.colRisk}</TableHead>
            <TableHead className="text-right">{homeT.bonusLabel}</TableHead>
            <TableHead className="hidden text-right sm:table-cell">
              {dict.report.minLabel}
            </TableHead>
            <TableHead className="w-[7.5rem] text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOffers.map((offer, index) => {
            const isSniper = offer.id === topMatchId;
            const netProfit = netProfitVsBank(capital, offer.apy, bankApr);

            return (
              <TableRow
                key={offer.id}
                className={cn(
                  "relative text-xs sm:text-sm",
                  isSniper && "bg-gradient-to-r from-[rgba(255,120,40,0.06)] to-transparent",
                )}
              >
                <TableCell className="px-2 align-top">
                  <div className="flex items-center gap-2">
                    <span className="font-numeric w-4 text-[11px] text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border/60 bg-surface-2 text-[10px] font-bold text-primary">
                      {offer.logo}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  {isSniper ? (
                    <div
                      className="animate-sniper-badge mb-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[rgba(255,120,40,0.35)] bg-gradient-to-r from-[rgba(255,90,30,0.14)] to-[rgba(255,140,60,0.08)] px-2.5 py-1 text-[10px] font-semibold leading-snug text-[#ffb380] sm:text-[11px]"
                      role="status"
                    >
                      <span className="shrink-0">🔥</span>
                      <span>
                        {calcT.sniperBadgePrefix} {fmtUsd(capital)}!{" "}
                        {calcT.sniperBadgeProfit} {fmtUsd(netProfit)}
                      </span>
                    </div>
                  ) : null}
                  <Link
                    href={`/${lang}/offers/${offer.slug}`}
                    className="block font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {offer.name}
                  </Link>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {offer.protocol} · {offer.network}
                  </span>
                </TableCell>
                <TableCell className="align-top">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 px-1.5 text-[10px] font-semibold",
                      riskBadgeClass(offer.riskRating),
                    )}
                  >
                    {offer.riskRating}
                  </Badge>
                </TableCell>
                <TableCell className="align-top text-right">
                  <span className="font-numeric text-base font-bold tabular-nums text-profit sm:text-lg">
                    {offer.apy.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="hidden align-top text-right sm:table-cell">
                  <span className="font-numeric text-xs text-muted-foreground">
                    {fmtUsd(offer.minEntryUsd)}
                  </span>
                </TableCell>
                <TableCell className="align-top text-right">
                  <OfferButton
                    offer={offer}
                    dict={dict}
                    lang={lang}
                    label={buttonLabel}
                    className="mt-0 inline-flex h-7 w-auto gap-1 px-2.5 text-xs"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Link
        href={`/${lang}/offers`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-foreground"
      >
        {t.offersCta}
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}
