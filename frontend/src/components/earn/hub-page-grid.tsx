import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustScoreCard } from "@/components/trust-score/trust-score-card";
import type { Locale } from "@/lib/i18n";
import type { Asset } from "@/lib/earn/types";
import { EARN_HUB_ASSET_LISTING_TITLES } from "@/lib/earn/content";
import { earnAssetPath } from "@/lib/earn/paths";
import { resolveLocalized } from "@/lib/earn/types";
import {
  getSeoPilotPagesByHub,
  resolvePilotLocalized,
  seoPilotDetailPath,
} from "@/lib/seo-pilot";
import type { TrustScore } from "@/lib/trust-score";

type EarnHubPageGridProps = {
  lang: Locale;
  assets: Asset[];
  exploreLabel: string;
  topApyByAsset: Record<string, number | null>;
  trustScoreByAsset: Record<string, TrustScore>;
};

export function EarnHubPageGrid({
  lang,
  assets,
  exploreLabel,
  topApyByAsset,
  trustScoreByAsset,
}: EarnHubPageGridProps) {
  const guides = getSeoPilotPagesByHub("earn");

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {guides.map((guide) => (
        <li key={guide.slug}>
          <Link
            href={seoPilotDetailPath(lang, guide.hubSegment, guide.slug)}
            className="group block h-full"
          >
            <Card className="flex h-full flex-col rounded-2xl border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="grid size-10 place-items-center rounded-xl border border-primary/30 bg-[--neon-soft] text-primary">
                  <BookOpen className="size-4" />
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase">
                  Guide
                </Badge>
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-primary">
                {resolvePilotLocalized(guide.h1, lang)}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {resolvePilotLocalized(guide.intro, lang)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {exploreLabel}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Card>
          </Link>
        </li>
      ))}

      {assets.map((asset) => {
        const topApy = topApyByAsset[asset.slug];
        const listingTitle = EARN_HUB_ASSET_LISTING_TITLES[asset.slug][lang];

        return (
          <li key={asset.slug}>
            <Link
              href={earnAssetPath(lang, asset.slug)}
              className="group block h-full"
            >
              <Card className="flex h-full flex-col rounded-2xl border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-lg font-bold text-white">
                        {asset.symbol}
                      </span>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {asset.category}
                      </Badge>
                    </div>
                  </div>
                  <TrendingUp className="size-4 shrink-0 text-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-white group-hover:text-primary">
                  {listingTitle}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
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
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  {exploreLabel}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
