import { Brain } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import type { AiRecommendation, Dictionary } from "@/lib/config";
import { cn } from "@/lib/utils";

type AiAgentAnalysisProps = {
  recommendation: AiRecommendation;
  dict: Dictionary;
};

const SIGNAL_STYLES = {
  Buy: {
    card: "border-profit/40 bg-profit/[0.07]",
    badge: "border-profit/50 bg-profit/15 text-profit",
    ring: "ring-profit/20",
  },
  Hold: {
    card: "border-primary/30 bg-primary/[0.05]",
    badge: "border-primary/40 bg-primary/10 text-primary",
    ring: "ring-primary/15",
  },
  Sell: {
    card: "border-loss/40 bg-loss/[0.07]",
    badge: "border-loss/50 bg-loss/15 text-loss",
    ring: "ring-loss/20",
  },
} as const;

function signalLabel(
  signal: AiRecommendation["signal"],
  t: Dictionary["marketDetail"],
): string {
  if (signal === "Buy") return t.signalBuy;
  if (signal === "Sell") return t.signalSell;
  return t.signalHold;
}

export function AiAgentAnalysis({ recommendation, dict }: AiAgentAnalysisProps) {
  const t = dict.marketDetail;
  const styles = SIGNAL_STYLES[recommendation.signal];

  return (
    <GlassPanel
      eyebrow={t.aiAnalysisEyebrow}
      title={t.aiAnalysisTitle}
      icon={Brain}
      className="h-full"
    >
      <div
        className={cn(
          "rounded-xl border p-4 ring-1 ring-inset",
          styles.card,
          styles.ring,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t.signalRationaleLabel}
          </span>
          <span
            className={cn(
              "inline-flex rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wide",
              styles.badge,
            )}
          >
            {signalLabel(recommendation.signal, t)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          {recommendation.rationale}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {(["Buy", "Hold", "Sell"] as const).map((signal) => {
          const active = recommendation.signal === signal;
          const s = SIGNAL_STYLES[signal];
          return (
            <div
              key={signal}
              className={cn(
                "rounded-lg border px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wide transition-opacity",
                active ? cn(s.badge, "opacity-100") : "border-white/[0.06] text-muted-foreground/50 opacity-60",
              )}
            >
              {signalLabel(signal, t)}
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
