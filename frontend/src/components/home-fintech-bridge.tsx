"use client";

import { Suspense, useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Calculator } from "@/components/calculator";
import { GlassPanel } from "@/components/glass-panel";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { MarketSnapshot } from "@/components/market-snapshot";
import { PulsingCpaButton } from "@/components/pulsing-cpa-button";
import { AiMarketScoring } from "@/components/ai-market-scoring";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CALCULATOR_ASSETS,
  type CalculatorAsset,
} from "@/lib/calculator-assets";
import type { Benchmarks, CpaOffer, Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

function CalculatorFallback() {
  return (
    <Card className="glass relative overflow-hidden rounded-xl p-5">
      <div className="h-56 animate-pulse rounded-lg bg-surface-2" />
    </Card>
  );
}

type HomeFintechBridgeProps = {
  lang: Locale;
  dict: Dictionary;
  benchmarks: Benchmarks;
  offers: CpaOffer[];
};

export function HomeFintechBridge({
  lang,
  dict,
  benchmarks,
  offers,
}: HomeFintechBridgeProps) {
  const homeT = dict.home;

  const [asset, setAsset] = useState<CalculatorAsset>("USDC");
  const [capital, setCapital] = useState<number | null>(benchmarks.defaultCapital);

  const deferredCapital = useDeferredValue(
    capital != null && Number.isFinite(capital) && capital > 0
      ? capital
      : benchmarks.defaultCapital,
  );

  const stableOffers = useMemo(() => offers, [offers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="space-y-4 lg:col-span-8">
          <Suspense fallback={<CalculatorFallback />}>
            <Calculator
              lang={lang}
              dict={dict}
              benchmarks={benchmarks}
              linked
              asset={asset}
              onAssetChange={setAsset}
              assetOptions={CALCULATOR_ASSETS}
              capital={capital}
              onCapitalChange={setCapital}
              offersHref={`/${lang}/offers`}
            />
          </Suspense>
          <PulsingCpaButton label={homeT.fixBonusCta} href={`/${lang}/offers`} />
        </div>

        <aside className="lg:col-span-4">
          <AiMarketScoring lang={lang} dict={dict} />
        </aside>
      </div>

      <MarketSnapshot lang={lang} dict={dict} />

      <GlassPanel
        id="offers-leaderboard"
        eyebrow={dict.offers.eyebrow}
        title={homeT.leaderboardTitle}
        icon={TrendingUp}
        action={
          <Button
            variant="ghost"
            size="xs"
            className="text-[11px] text-primary"
            render={<Link href={`/${lang}/offers`} />}
          >
            {dict.offers.review}
            <ArrowUpRight className="size-3" />
          </Button>
        }
      >
        <LeaderboardTable
          lang={lang}
          dict={dict}
          offers={stableOffers}
          asset={asset}
          capital={deferredCapital}
          bankApr={benchmarks.bankDepositApr}
          ctaLabel={homeT.getOffer}
          introText={homeT.leaderboardDesc}
        />
      </GlassPanel>
    </div>
  );
}
