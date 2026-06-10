import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import type { Locale } from "@/lib/i18n";
import type { ProductNextStepAction } from "@/lib/product-connectivity/types";

type ProductNextStepProps = {
  lang: Locale;
  steps: ProductNextStepAction[];
  /** sidebar = compact aside card; grid = full-width 3-column actions; inline = stacked list */
  variant?: "sidebar" | "grid" | "inline";
  title?: string;
  description?: string;
  id?: string;
};

const STEP_KIND_LABELS: Record<
  ProductNextStepAction["kind"],
  Record<Locale, string>
> = {
  compare: { en: "Compare", ru: "Compare" },
  trust: { en: "Trust", ru: "Trust" },
  protocol: { en: "Protocol", ru: "Протокол" },
  opportunity: { en: "Opportunity", ru: "Возможность" },
  safety: { en: "Safety", ru: "Безопасность" },
  learn: { en: "Learn", ru: "Обучение" },
  review: { en: "Review", ru: "Обзор" },
};

export function ProductNextStep({
  lang,
  steps,
  variant = "sidebar",
  title,
  description,
  id = "product-next-step",
}: ProductNextStepProps) {
  if (!steps.length) return null;

  const heading =
    title ?? (lang === "ru" ? "Следующий шаг" : "Next step");
  const body =
    description ??
    (lang === "ru"
      ? "Продолжите исследование — сравнение, Trust Score, протокол или возможность."
      : "Continue your research — compare, Trust Score, protocol, or opportunity.");

  if (variant === "grid") {
    return (
      <GlassPanel id={id} title={heading} icon={ArrowRight}>
        {description ? (
          <p className="mb-4 text-sm text-muted-foreground">{body}</p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-[--neon-soft] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
              data-step-kind={action.kind}
            >
              <span>{action.label}</span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          ))}
        </div>
      </GlassPanel>
    );
  }

  if (variant === "inline") {
    return (
      <nav id={id} aria-label={heading} className="space-y-2">
        {steps.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            data-step-kind={action.kind}
          >
            <span>{action.label}</span>
            <span className="text-[10px] uppercase tracking-wider text-primary/70">
              {STEP_KIND_LABELS[action.kind][lang]}
            </span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <div
      id={id}
      className="rounded-2xl border border-primary/30 bg-[--neon-soft]/30 p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        {heading}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <ul className="mt-4 space-y-2">
        {steps.map((action) => (
          <li key={action.href}>
            <Link
              href={action.href}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:border-primary/40 hover:text-primary"
              data-step-kind={action.kind}
            >
              <span>{action.label}</span>
              <ArrowRight className="size-3.5 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
