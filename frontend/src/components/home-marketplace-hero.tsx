import Link from "next/link";
import { ShieldCheck, BookOpen, Wallet, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

export function HomeMarketplaceHero({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.homeMarketplace;

  const badges = [
    { icon: ShieldCheck, label: t.badgeNonCustodial },
    { icon: Wallet, label: t.badgeNoWallet },
    { icon: BookOpen, label: t.badgeEducational },
    { icon: BarChart3, label: t.badgeTrustScore },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-slate-900/80 to-neutral-950 px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-4xl text-center">
        <Badge
          variant="outline"
          className="mb-5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400"
        >
          {t.heroEyebrow}
        </Badge>

        <h1 className="font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
          {t.heroHeadline}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          {t.heroSubheadline}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            render={<Link href={`/${lang}/compare`} />}
            size="lg"
            className="h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.ctaCompare}
          </Button>
          <Button
            render={<Link href={`/${lang}/protocols`} />}
            size="lg"
            variant="outline"
            className="h-11 rounded-xl border-border/70 bg-white/5 px-6 font-semibold text-white hover:bg-white/10"
          >
            {t.ctaProtocols}
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {badges.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"
            >
              <Icon className="size-3.5 text-emerald-500/80" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
