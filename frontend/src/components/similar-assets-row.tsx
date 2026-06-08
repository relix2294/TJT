import Link from "next/link";
import { Layers } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { MarketSparkline } from "@/components/market-sparkline";
import type { Dictionary, MarketAsset } from "@/lib/config";
import { fmtPct, fmtUsd2 } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { marketHref } from "@/lib/market-utils";
import { cn } from "@/lib/utils";

type SimilarAssetsRowProps = {
  lang: Locale;
  dict: Dictionary;
  assets: MarketAsset[];
};

export function SimilarAssetsRow({ lang, dict, assets }: SimilarAssetsRowProps) {
  const t = dict.marketDetail;

  if (assets.length === 0) return null;

  return (
    <GlassPanel eyebrow={t.similarEyebrow} title={t.similarTitle} icon={Layers}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => {
          const up = asset.change24h >= 0;
          return (
            <Link
              key={asset.symbol}
              href={marketHref(lang, asset)}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0e1016] p-3 transition-all duration-200 hover:border-primary/30 hover:bg-white/[0.03]"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[10px] font-bold text-primary">
                {asset.symbol.slice(0, 3)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {asset.symbol}
                  </span>
                  <span className="font-numeric shrink-0 text-xs tabular-nums text-muted-foreground">
                    {fmtUsd2(asset.price)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "font-numeric text-[11px] font-semibold tabular-nums",
                      up ? "text-profit" : "text-loss",
                    )}
                  >
                    {t.similarChange24h} {fmtPct(asset.change24h)}
                  </span>
                  <MarketSparkline change24h={asset.change24h} width={56} height={22} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </GlassPanel>
  );
}
