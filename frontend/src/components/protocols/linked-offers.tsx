import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fmtUsd } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { ProtocolLinkedOffer } from "@/lib/protocols/types";

type ProtocolLinkedOffersProps = {
  lang: Locale;
  offers: ProtocolLinkedOffer[];
  title: string;
  emptyLabel: string;
  ctaLabel: string;
  minLabel: string;
};

export function ProtocolLinkedOffers({
  lang,
  offers,
  title,
  emptyLabel,
  ctaLabel,
  minLabel,
}: ProtocolLinkedOffersProps) {
  if (!offers.length) {
    return (
      <p className="text-sm text-muted-foreground">{emptyLabel}</p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="rounded-2xl border-border/60 bg-surface/70 p-5 ring-1 ring-foreground/10"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/40 bg-[--neon-soft] font-bold text-primary"
              >
                {offer.riskRating}
              </Badge>
              <span className="text-xs text-muted-foreground">{offer.network}</span>
            </div>
            <h3 className="font-heading text-base font-bold text-white">{offer.name}</h3>
            <p className="mt-2 font-numeric text-2xl font-extrabold text-profit">
              {offer.apy.toFixed(1)}% APY
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                · {minLabel} {fmtUsd(offer.minEntryUsd)}
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                render={<a href={offer.trackUrl} rel="noopener noreferrer" />}
              >
                {ctaLabel}
                <ArrowUpRight className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                render={<Link href={offer.offerPath} />}
              >
                {lang === "ru" ? "Детали оффера" : "Offer details"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
