import { ListChecks, Wallet, Banknote, ChevronRight, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/config";

const STEP_ICONS = [ListChecks, Wallet, Banknote] as const;

export function SafetySteps({ dict }: { dict: Dictionary }) {
  const t = dict.safety;

  return (
    <div className="glass relative overflow-hidden rounded-3xl border-border/70 p-6 sm:p-10">
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
              {t.cardTitle}
            </h3>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {t.cardDesc}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-profit/30 bg-profit/10 px-3 py-1 text-xs font-semibold text-profit">
            <ShieldCheck className="size-4" />
            {t.badge}
          </span>
        </div>

        <div className="mt-9 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {t.steps.map((s, i) => {
            const Icon = STEP_ICONS[i] ?? ListChecks;
            return (
              <div key={s.title} className="contents">
                <div className="group relative flex flex-col rounded-2xl border border-border/60 bg-surface/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-primary">
                      <Icon className="size-6" />
                    </span>
                    <span className="font-numeric text-5xl font-extrabold leading-none text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h4 className="mt-5 font-heading text-lg font-bold text-white">
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>

                {i < t.steps.length - 1 && (
                  <div className="flex items-center justify-center">
                    <ChevronRight className="hidden size-7 text-primary/70 lg:block" />
                    <ChevronRight className="block size-6 rotate-90 text-primary/70 lg:hidden" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
