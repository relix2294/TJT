import Link from "next/link";
import { ArrowRight, GitCompare, Shield, TrendingUp, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";

type HubKind = "compare" | "earn" | "offers" | "protocols";

type HubEmptyRecoveryProps = {
  lang: Locale;
  hub: HubKind;
  message: string;
};

const RECOVERY_TARGETS: Record<
  HubKind,
  { href: (lang: Locale) => string; label: Record<Locale, string>; icon: typeof GitCompare }[]
> = {
  compare: [
    {
      href: (lang) => `/${lang}/earn`,
      label: { en: "Explore Earn hub", ru: "Открыть Earn-хаб" },
      icon: TrendingUp,
    },
    {
      href: (lang) => `/${lang}/protocols`,
      label: { en: "Browse protocols", ru: "Каталог протоколов" },
      icon: Shield,
    },
    {
      href: (lang) => `/${lang}/offers`,
      label: { en: "View yield catalog", ru: "Каталог yield" },
      icon: Layers,
    },
  ],
  earn: [
    {
      href: (lang) => `/${lang}/compare`,
      label: { en: "Compare yield routes", ru: "Сравнить маршруты" },
      icon: GitCompare,
    },
    {
      href: (lang) => `/${lang}/offers`,
      label: { en: "View yield catalog", ru: "Каталог yield" },
      icon: Layers,
    },
    {
      href: (lang) => `/${lang}/learn/crypto-yield-risks`,
      label: { en: "Read yield risks guide", ru: "Гид по рискам yield" },
      icon: Shield,
    },
  ],
  offers: [
    {
      href: (lang) => `/${lang}/compare`,
      label: { en: "Compare opportunities", ru: "Сравнить возможности" },
      icon: GitCompare,
    },
    {
      href: (lang) => `/${lang}/earn`,
      label: { en: "Explore Earn hub", ru: "Открыть Earn-хаб" },
      icon: TrendingUp,
    },
    {
      href: (lang) => `/${lang}/protocols`,
      label: { en: "Protocol reviews", ru: "Обзоры протоколов" },
      icon: Shield,
    },
  ],
  protocols: [
    {
      href: (lang) => `/${lang}/compare`,
      label: { en: "Compare protocols", ru: "Сравнить протоколы" },
      icon: GitCompare,
    },
    {
      href: (lang) => `/${lang}/earn`,
      label: { en: "Earn routes", ru: "Earn-маршруты" },
      icon: TrendingUp,
    },
    {
      href: (lang) => `/${lang}/reviews`,
      label: { en: "Protocol reviews", ru: "Обзоры протоколов" },
      icon: Shield,
    },
  ],
};

export function HubEmptyRecovery({ lang, hub, message }: HubEmptyRecoveryProps) {
  const targets = RECOVERY_TARGETS[hub];
  const title =
    lang === "ru" ? "Продолжить исследование" : "Continue your research";

  return (
    <Card className="rounded-2xl border-border/60 bg-card/30 p-6">
      <p className="text-sm text-muted-foreground">{message}</p>
      <p className="mt-3 text-sm font-semibold text-white">{title}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {targets.map((target) => {
          const Icon = target.icon;
          return (
            <li key={target.href(lang)}>
              <Link
                href={target.href(lang)}
                className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-[--neon-soft] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-primary" />
                  {target.label[lang]}
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
