"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import type { Benchmarks, Dictionary } from "@/lib/config";
import { fmtUsd, fmtYears } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const HOME_DEFAULT_CAPITAL = 1_000;
const PRESETS = [1_000, 10_000, 50_000];

function compoundedGain(capital: number, ratePct: number, years: number): number {
  return capital * (Math.pow(1 + ratePct / 100, years) - 1);
}

type CompactOpportunityCalculatorProps = {
  lang: Locale;
  dict: Dictionary;
  benchmarks: Benchmarks;
  offersHref: string;
};

export function CompactOpportunityCalculator({
  lang,
  dict,
  benchmarks,
  offersHref,
}: CompactOpportunityCalculatorProps) {
  const t = dict.calculator;
  const teasers = dict.homeTeasers;

  const { bankDepositApr, web3AggregatorApy } = benchmarks;

  const [capital, setCapital] = useState(HOME_DEFAULT_CAPITAL);
  const [years, setYears] = useState(3);

  const result = useMemo(() => {
    const safeCapital = Number.isFinite(capital) && capital > 0 ? capital : 0;
    const bankGain = compoundedGain(safeCapital, bankDepositApr, years);
    const web3Gain = compoundedGain(safeCapital, web3AggregatorApy, years);
    const missedYield = web3Gain - bankGain;
    return { safeCapital, bankGain, web3Gain, missedYield };
  }, [capital, years, bankDepositApr, web3AggregatorApy]);

  const yearsText = fmtYears(years, lang);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
      <header className="mb-3 border-b border-slate-800 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
          {teasers.calcEyebrow}
        </p>
        <h2 className="text-sm font-semibold text-white">{teasers.calcTitle}</h2>
      </header>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {t.capitalLabel}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-numeric text-xs text-slate-500">
              $
            </span>
            <Input
              type="number"
              min={0}
              step={500}
              placeholder="1000"
              value={Number.isFinite(capital) ? capital : ""}
              onChange={(e) => {
                const next = parseFloat(e.target.value);
                setCapital(Number.isFinite(next) ? next : 0);
              }}
              className="h-8 border-slate-800 bg-slate-900/60 pl-6 font-numeric text-sm font-semibold text-white tabular-nums placeholder:text-slate-600"
            />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCapital(p)}
                className={cn(
                  "rounded border px-2 py-0.5 font-numeric text-[10px] font-medium transition-colors",
                  capital === p
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300",
                )}
              >
                {fmtUsd(p)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {t.horizonLabel}
            </label>
            <span className="font-numeric text-[11px] font-semibold text-emerald-400">
              {yearsText}
            </span>
          </div>
          <Slider
            value={[years]}
            min={1}
            max={10}
            step={1}
            onValueChange={(v) => setYears(Array.isArray(v) ? v[0] : v)}
            className="py-1"
          />
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-900/50 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {t.missedTitle}
          </p>
          <p className="mt-1 font-numeric text-xl font-bold tabular-nums text-emerald-500">
            {fmtUsd(result.missedYield)}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            {t.missedDescPrefix} {yearsText}
          </p>
        </div>

        <Link
          href={offersHref}
          className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-[11px] font-semibold text-emerald-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/15"
        >
          {t.missedCta}
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </section>
  );
}
