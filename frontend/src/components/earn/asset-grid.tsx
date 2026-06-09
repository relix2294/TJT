import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustScoreCard } from "@/components/trust-score/trust-score-card";
import type { Locale } from "@/lib/i18n";
import type { Asset } from "@/lib/earn/types";
import { earnAssetPath } from "@/lib/earn/paths";
import { resolveLocalized } from "@/lib/earn/types";
import type { TrustScore } from "@/lib/trust-score";

type EarnAssetGridProps = {
  lang: Locale;
  assets: Asset[];
  exploreLabel: string;
  topApyByAsset: Record<string, number | null>;
  trustScoreByAsset: Record<string, TrustScore>;
};

export function EarnAssetGrid({
  lang,
  assets,
  exploreLabel,
  topApyByAsset,
  trustScoreByAsset,
}: EarnAssetGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {assets.map((asset) => {
        const topApy = topApyByAsset[asset.slug];
        return (
          <Link key={asset.slug} href={earnAssetPath(lang, asset.slug)} className="group">
            <Card className="h-full rounded-2xl border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xl font-bold text-white">
                      {asset.symbol}
                    </span>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {asset.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {resolveLocalized(asset.name, lang)}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {resolveLocalized(asset.description, lang)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {trustScoreByAsset[asset.slug] ? (
                  <TrustScoreCard
                    lang={lang}
                    trustScore={trustScoreByAsset[asset.slug]}
                    variant="compact"
                  />
                ) : null}
                {topApy != null ? (
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-profit">
                    <TrendingUp className="size-3.5" />
                    {topApy}% APY
                  </p>
                ) : null}
              </div>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-primary">
                {exploreLabel}
              </span>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
