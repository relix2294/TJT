import Link from "next/link";
import { Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/glass-panel";
import type { Locale } from "@/lib/i18n";
import { LAYER_TITLE } from "@/lib/recommendations/labels";
import type { RecommendationLayerModel } from "@/lib/recommendations/types";

type RecommendationLayerProps = {
  lang: Locale;
  model: RecommendationLayerModel;
  id?: string;
};

export function RecommendationLayer({
  lang,
  model,
  id = "recommendation-layer",
}: RecommendationLayerProps) {
  if (!model.picks.length) return null;

  return (
    <GlassPanel id={id} title={LAYER_TITLE[lang]} icon={Compass}>
      <p className="mb-4 text-sm text-muted-foreground">{model.decisionContext}</p>
      <ul className="space-y-3">
        {model.picks.map((pick) => (
          <li
            key={pick.lens}
            className="rounded-xl border border-border/60 bg-background/40 p-4"
            data-recommendation-lens={pick.lens}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider text-primary"
              >
                {pick.lensLabel}
              </Badge>
              {pick.apy != null ? (
                <span className="text-xs text-profit">{pick.apy}% APY</span>
              ) : null}
              {pick.trustScore != null ? (
                <span className="text-xs text-muted-foreground">
                  Trust {pick.trustScore}/100
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {pick.reason}
            </p>
            <Link
              href={pick.targetHref}
              className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              {pick.targetLabel} →
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground/80">{model.disclaimer}</p>
    </GlassPanel>
  );
}
