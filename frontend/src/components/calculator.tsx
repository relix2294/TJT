"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Download,
  Landmark,
  Loader2,
  TrendingDown,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/lib/use-config";
import { toast } from "sonner";
import { fmtUsd, fmtUsdSigned, fmtYears } from "@/lib/format";
import type { CalculatorAsset } from "@/lib/calculator-assets";
import type { Benchmarks, Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PRESETS = [1_000, 10_000, 50_000, 100_000];

/** Future profit (compounded) over `years` for a given annual rate (%). */
function compoundedGain(capital: number, ratePct: number, years: number): number {
  return capital * (Math.pow(1 + ratePct / 100, years) - 1);
}

type CalculatorProps = {
  lang: Locale;
  dict: Dictionary;
  benchmarks?: Benchmarks;
  /** When true, capital/asset sync with the home-page offers leaderboard. */
  linked?: boolean;
  asset?: CalculatorAsset;
  onAssetChange?: (asset: CalculatorAsset) => void;
  assetOptions?: readonly CalculatorAsset[];
  capital?: number | null;
  onCapitalChange?: (capital: number) => void;
  offersHref?: string;
};

export function Calculator({
  lang,
  dict,
  benchmarks: benchmarksProp,
  linked = false,
  asset: assetProp,
  onAssetChange,
  assetOptions,
  capital: capitalProp,
  onCapitalChange,
  offersHref,
}: CalculatorProps) {
  const searchParams = useSearchParams();
  const { config, loading, error } = useConfig(lang);
  const benchmarks = benchmarksProp ?? config?.benchmarks;
  const t = dict.calculator;

  const bankDepositApr = benchmarks?.bankDepositApr ?? 0;
  const realInflationRate = benchmarks?.realInflationRate ?? 0;
  const web3AggregatorApy = benchmarks?.web3AggregatorApy ?? 0;

  const [internalCapital, setInternalCapital] = useState<number | null>(null);
  const [years, setYears] = useState<number>(3);
  const [downloading, setDownloading] = useState(false);
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  // Seed from URL query params (?capital=10000&years=3) for shareable links.
  useEffect(() => {
    if (initializedFromUrl) return;
    const capitalParam = searchParams.get("capital");
    const yearsParam = searchParams.get("years");
    let applied = false;

    if (capitalParam) {
      const parsed = Number(capitalParam);
      if (Number.isFinite(parsed) && parsed > 0) {
        if (linked && onCapitalChange) onCapitalChange(parsed);
        else setInternalCapital(parsed);
        applied = true;
      }
    }
    if (yearsParam) {
      const parsed = Number(yearsParam);
      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 10) {
        setYears(Math.round(parsed));
        applied = true;
      }
    }
    if (applied) setInitializedFromUrl(true);
  }, [searchParams, initializedFromUrl, linked, onCapitalChange]);

  const capital = linked && capitalProp !== undefined ? capitalProp : internalCapital;
  const setCapital = linked && onCapitalChange ? onCapitalChange : setInternalCapital;

  // Seed the capital input from the backend default once the config arrives,
  // without clobbering a value the user has already typed or from URL.
  useEffect(() => {
    if (!benchmarks || capital !== null) return;
    if (linked && onCapitalChange) onCapitalChange(benchmarks.defaultCapital);
    else setInternalCapital(benchmarks.defaultCapital);
  }, [benchmarks, capital, linked, onCapitalChange]);

  const r = useMemo(() => {
    const safeCapital =
      capital != null && Number.isFinite(capital) && capital > 0 ? capital : 0;

    // Annual (nominal) — faithful to backend app.py reactive math.
    const bankGainYear = (safeCapital * bankDepositApr) / 100;
    const inflationLossYear = (safeCapital * realInflationRate) / 100;
    const web3GainYear = (safeCapital * web3AggregatorApy) / 100;

    // Projected over the chosen horizon (compounded).
    const bankGain = compoundedGain(safeCapital, bankDepositApr, years);
    const web3Gain = compoundedGain(safeCapital, web3AggregatorApy, years);
    // Purchasing-power erosion of the principal under real inflation.
    const inflationLoss =
      safeCapital - safeCapital / Math.pow(1 + realInflationRate / 100, years);

    const missedYield = web3Gain - bankGain;

    return {
      safeCapital,
      bankGainYear,
      inflationLossYear,
      web3GainYear,
      bankGain,
      web3Gain,
      inflationLoss,
      missedYield,
    };
  }, [capital, years, bankDepositApr, realInflationRate, web3AggregatorApy]);

  // Relative bar widths for the comparison strip.
  const maxGain = Math.max(r.web3Gain, r.bankGain, r.inflationLoss, 1);
  const pct = (v: number) => `${Math.min(100, (v / maxGain) * 100)}%`;
  const yearsText = fmtYears(years, lang);

  async function handleDownloadReport() {
    if (downloading || !benchmarks || r.safeCapital <= 0) return;
    setDownloading(true);
    try {
      // Lazily pull in jspdf + the embedded fonts only when actually needed,
      // so they never weigh down the calculator's initial bundle.
      const { generateOpportunityReport } = await import("@/lib/pdf-report");
      await generateOpportunityReport({
        lang,
        dict,
        capital: r.safeCapital,
        years,
        benchmarks: { bankDepositApr, realInflationRate, web3AggregatorApy },
        results: {
          bankGain: r.bankGain,
          inflationLoss: r.inflationLoss,
          web3Gain: r.web3Gain,
          missedYield: r.missedYield,
        },
        offers: config?.offers ?? [],
      });
      toast.success(t.reportReady);
    } catch (err) {
      console.error("[calculator] Failed to generate PDF report", err);
      toast.error(t.reportError);
    } finally {
      setDownloading(false);
    }
  }

  if (error || (!loading && !benchmarks && !benchmarksProp)) {
    return (
      <Card className="glass rounded-3xl border-loss/40 bg-loss/5 p-8 text-sm text-loss">
        {t.error}
        {error ? <span className="mt-1 block text-loss/70">{error}</span> : null}
      </Card>
    );
  }

  if ((loading && !benchmarksProp) || !benchmarks) {
    return (
      <Card className="glass relative overflow-hidden rounded-3xl border border-white/[0.06] p-5 sm:p-9">
        <div className="grid-noise pointer-events-none absolute inset-0" />
        <div className="relative space-y-8">
          <div className="space-y-3">
            <div className="h-6 w-56 animate-pulse rounded-full bg-white/10" />
            <div className="h-9 w-80 max-w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/5" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.35fr]">
            <div className="space-y-7">
              <div className="h-14 animate-pulse rounded-xl bg-white/5" />
              <div className="h-2 animate-pulse rounded-full bg-white/5" />
              <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
            </div>
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
              <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass relative overflow-hidden rounded-3xl border border-white/[0.06] p-5 sm:p-9">
      <div className="grid-noise pointer-events-none absolute inset-0" />

      <div className="relative">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-white/10 bg-white/[0.04] font-medium text-foreground/80"
            >
              {t.liveBadge} · {web3AggregatorApy}% APY vs {bankDepositApr}% APR
            </Badge>
            <h2 className="font-heading text-2xl font-bold text-white sm:text-4xl">
              {t.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.35fr]">
          {/* Controls */}
          <div className="space-y-7">
            {linked && assetOptions && assetProp && onAssetChange ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  {t.assetLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {assetOptions.map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => onAssetChange(symbol)}
                      className={cn(
                        "rounded-xl border px-3.5 py-2 font-numeric text-xs font-semibold tracking-wide transition-all duration-200",
                        assetProp === symbol
                          ? "border-primary/50 bg-gradient-to-b from-[rgba(88,166,255,0.12)] to-[rgba(88,166,255,0.04)] text-primary shadow-[0_0_20px_rgba(88,166,255,0.12)]"
                          : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:border-primary/30 hover:text-foreground",
                      )}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="size-4 text-primary" /> {t.capitalLabel}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-numeric text-lg text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  min={0}
                  step={500}
                  value={capital != null && Number.isFinite(capital) ? capital : ""}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value);
                    setCapital(Number.isFinite(next) ? next : 0);
                  }}
                  className="h-14 rounded-xl border-border/70 bg-background/60 pl-9 font-numeric text-xl font-semibold text-white tabular-nums focus-visible:ring-primary/50"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCapital(p)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      capital === p
                        ? "border-primary/60 bg-[--neon-soft] text-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-white",
                    )}
                  >
                    {fmtUsd(p)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  {t.horizonLabel}
                </label>
                <span className="font-numeric text-sm font-semibold text-primary">
                  {yearsText}
                </span>
              </div>
              <Slider
                value={[years]}
                min={1}
                max={10}
                step={1}
                onValueChange={(v) => setYears(Array.isArray(v) ? v[0] : v)}
                className="py-2"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground/70">
                <span>{fmtYears(1, lang)}</span>
                <span>{fmtYears(10, lang)}</span>
              </div>
            </div>

            {/* Comparison strip */}
            <div className="space-y-3 rounded-2xl border border-border/60 bg-background/40 p-4">
              <BarRow label={`${t.nameBank} · ${bankDepositApr}%`} value={r.bankGain} width={pct(r.bankGain)} tone="neutral" />
              <BarRow label={`${t.nameInflation} · ${realInflationRate}%`} value={-r.inflationLoss} width={pct(r.inflationLoss)} tone="loss" />
              <BarRow label={`${t.nameWeb3} · ${web3AggregatorApy}%`} value={r.web3Gain} width={pct(r.web3Gain)} tone="profit" />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                icon={<Landmark className="size-5" />}
                tone="neutral"
                label={`${t.nameBank} · ${bankDepositApr}% APR`}
                value={fmtUsd(r.bankGain)}
                sub={`${t.profitOver} ${yearsText}`}
              />
              <ResultCard
                icon={<TrendingDown className="size-5" />}
                tone="loss"
                label={`${t.nameInflation} · ${realInflationRate}%`}
                value={fmtUsdSigned(-r.inflationLoss)}
                sub={t.subInflation}
              />
              <ResultCard
                icon={<Sparkles className="size-5" />}
                tone="profit"
                label={`${t.nameWeb3} · ${web3AggregatorApy}% APY`}
                value={fmtUsd(r.web3Gain)}
                sub={t.subWeb3}
              />
            </div>

            {/* Headline — missed yield */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#13141a] to-[#0e0f14] p-6 sm:p-7">
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full blur-3xl"
                style={{ background: "rgba(63,185,80,0.08)" }}
              />
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wider text-profit/80">
                  {t.missedTitle}
                </div>
                <div className="mt-2 flex flex-wrap items-end gap-3">
                  <span className="font-heading font-numeric text-4xl font-extrabold tracking-tight text-profit sm:text-6xl">
                    {fmtUsd(r.missedYield)}
                  </span>
                  <span className="mb-2 text-sm text-muted-foreground">
                    {t.missedDescPrefix} {yearsText}
                  </span>
                </div>

                {linked && offersHref ? (
                  <Link
                    href={offersHref}
                    className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-gradient-to-r from-[rgba(88,166,255,0.1)] via-[rgba(88,166,255,0.04)] to-transparent px-5 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary/45 hover:from-[rgba(88,166,255,0.16)] hover:shadow-[0_0_28px_rgba(88,166,255,0.12)] sm:w-auto"
                  >
                    {t.scrollToOffers}
                    <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </Link>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="h-12 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    render={<Link href={`/${lang}/offers`} />}
                  >
                    {t.missedCta}
                    <ArrowRight className="size-4" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDownloadReport}
                    disabled={downloading || r.safeCapital <= 0}
                    className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-6 font-semibold text-white transition-colors hover:border-primary/50 hover:bg-white/[0.06] disabled:opacity-60"
                  >
                    {downloading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                    {downloading ? t.generatingReport : t.downloadReport}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ResultCard({
  icon,
  tone,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  tone: "neutral" | "loss" | "profit";
  label: string;
  value: string;
  sub: string;
}) {
  const toneClass = {
    neutral: "text-primary",
    loss: "text-loss",
    profit: "text-profit",
  }[tone];

  return (
    <Card className="group rounded-2xl border-border/60 bg-surface/70 p-5 transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/50">
      <div className={cn("mb-3 flex size-9 items-center justify-center rounded-lg bg-background/60", toneClass)}>
        {icon}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1.5 font-numeric text-2xl font-bold tabular-nums", toneClass)}>
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground/80">{sub}</div>
    </Card>
  );
}

function BarRow({
  label,
  value,
  width,
  tone,
}: {
  label: string;
  value: number;
  width: string;
  tone: "neutral" | "loss" | "profit";
}) {
  const bar = {
    neutral: "bg-primary/70",
    loss: "bg-loss/70",
    profit: "bg-profit/80",
  }[tone];
  const text = {
    neutral: "text-primary",
    loss: "text-loss",
    profit: "text-profit",
  }[tone];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-numeric font-semibold tabular-nums", text)}>
          {fmtUsdSigned(value)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background/60">
        <div
          className={cn("h-full rounded-full transition-all duration-500", bar)}
          style={{ width }}
        />
      </div>
    </div>
  );
}
