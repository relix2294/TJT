import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import { detailPath } from "@/lib/seo";
import type { YieldOpportunity } from "@/lib/earn/types";
import { resolveLocalized } from "@/lib/earn/types";
import { getEarnChain } from "@/lib/earn/registry";

type EarnOpportunityListProps = {
  lang: Locale;
  opportunities: YieldOpportunity[];
  emptyLabel: string;
};

export function EarnOpportunityList({
  lang,
  opportunities,
  emptyLabel,
}: EarnOpportunityListProps) {
  if (!opportunities.length) {
    return (
      <Card className="rounded-2xl border-border/60 bg-card/30 p-6 text-sm text-muted-foreground">
        {emptyLabel}
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {opportunities.map((opp) => {
        const chain = getEarnChain(opp.chainSlug);
        const href = opp.offerSlug
          ? detailPath(lang, "protocols", opp.offerSlug)
          : undefined;

        const row = (
          <Card className="rounded-xl border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading text-sm font-bold text-white">
                  {resolveLocalized(opp.headline, lang)}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {resolveLocalized(opp.summary, lang)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {opp.type}
                  </Badge>
                  {chain ? (
                    <Badge variant="secondary" className="text-[10px]">
                      {chain.name[lang]}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div className="text-right">
                <p className="font-heading text-lg font-bold text-profit">{opp.apy}%</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">APY</p>
              </div>
            </div>
          </Card>
        );

        return (
          <li key={opp.id}>
            {href ? (
              <Link href={href} className="group block">
                <div className="relative">
                  {row}
                  <ArrowUpRight className="absolute right-4 top-4 size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}
