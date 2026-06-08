"use client";

import Link from "next/link";
import { ShieldCheck, Zap, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/lib/use-config";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { config, loading } = useConfig(lang);
  const b = config?.benchmarks;

  const pillars = [
    { icon: ShieldCheck, text: dict.hero.pillarCustodial },
    { icon: Bot, text: dict.hero.pillarAi },
    { icon: Zap, text: dict.hero.pillarCpa },
  ];

  const stats: { value: string; label: string; tone: string }[] = [
    { value: b ? `${b.web3AggregatorApy}%` : "", label: dict.hero.statWeb3, tone: "text-profit" },
    { value: b ? `${b.bankDepositApr}%` : "", label: dict.hero.statBank, tone: "text-primary" },
    { value: b ? `${b.realInflationRate}%` : "", label: dict.hero.statInflation, tone: "text-loss" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="grid-noise pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-16 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-6 border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/75"
          >
            {dict.hero.badge}
          </Badge>

          <h1 className="font-heading text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
            {dict.hero.titleLead}{" "}
            <span className="text-loss">{dict.hero.titleLoss}</span>{" "}
            {dict.hero.titleMid}
            <br className="hidden sm:block" />{" "}
            <span className="text-primary">{dict.hero.titleWeb3}</span>{" "}
            {dict.hero.titleTail}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {dict.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href={`/${lang}/tools/roi-calculator`} />}
              size="lg"
              className="h-12 rounded-xl bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {dict.hero.ctaCalc}
            </Button>
            <Button
              render={<Link href={`/${lang}/offers`} />}
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border/70 bg-white/5 px-7 font-semibold text-white hover:bg-white/10"
            >
              {dict.hero.ctaOffers}
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {pillars.map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 text-primary" /> {text}
              </span>
            ))}
          </div>
        </div>

        {/* Hero stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass animate-float rounded-2xl border-border/60 p-6 text-center"
            >
              <div className={`font-numeric text-3xl font-extrabold sm:text-4xl ${s.tone}`}>
                {loading || !s.value ? (
                  <span className="mx-auto block h-9 w-20 animate-pulse rounded bg-white/10" />
                ) : (
                  s.value
                )}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
