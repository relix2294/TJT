import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitCompare,
  Info,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n";
import type { ResolvedProtocolIntelligence } from "@/lib/protocols/intelligence-types";

type ProtocolIntelligenceProps = {
  lang: Locale;
  intelligence: ResolvedProtocolIntelligence;
};

function IntelligenceSection({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className="glass rounded-xl p-5 sm:p-6"
      data-protocol-intelligence={id}
    >
      <header className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
      </header>
      {children}
    </article>
  );
}

function severityBadgeClass(
  severity: ResolvedProtocolIntelligence["mainRisks"][number]["severity"],
): string {
  if (severity === "high") return "border-loss/30 bg-loss/10 text-loss";
  if (severity === "medium") return "border-primary/30 bg-[--neon-soft] text-primary";
  return "border-profit/30 bg-profit/10 text-profit";
}

/** Decision-support core: facts, positioning, risks, audience fit, trust breakdown. */
export function ProtocolIntelligenceCore({
  lang,
  intelligence,
}: ProtocolIntelligenceProps) {
  const keyFactsTitle = lang === "ru" ? "Ключевые факты" : "Key Facts";
  const whyChooseTitle =
    lang === "ru"
      ? "Почему выбирают этот протокол"
      : "Why Users Choose This Protocol";
  const risksTitle = lang === "ru" ? "Основные риски" : "Main Risks";
  const bestForTitle = lang === "ru" ? "Подходит для" : "Best For";
  const notIdealTitle = lang === "ru" ? "Не идеален для" : "Not Ideal For";
  const trustBreakdownTitle =
    lang === "ru" ? "Разбивка Trust Score" : "Trust Score Breakdown";

  const keyFactLabels = {
    category: lang === "ru" ? "Категория" : "Category",
    launchYear: lang === "ru" ? "Год запуска" : "Launch year",
    chains: lang === "ru" ? "Сети" : "Chains supported",
    tvlTier: lang === "ru" ? "Уровень TVL" : "TVL tier",
    primaryUseCase: lang === "ru" ? "Основной use case" : "Primary use case",
  };

  return (
    <div className="space-y-6">
      <IntelligenceSection id="protocol-intelligence-key-facts" title={keyFactsTitle} icon={Info}>
        <dl className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["category", intelligence.keyFacts.category],
              ["launchYear", String(intelligence.keyFacts.launchYear)],
              ["chains", intelligence.keyFacts.chains],
              ["tvlTier", intelligence.keyFacts.tvlTier],
              ["primaryUseCase", intelligence.keyFacts.primaryUseCase],
            ] as const
          ).map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border border-border/60 bg-background/40 px-4 py-3"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {keyFactLabels[key]}
              </dt>
              <dd className="mt-1 text-sm font-medium text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </IntelligenceSection>

      <IntelligenceSection
        id="protocol-intelligence-why-choose"
        title={whyChooseTitle}
        icon={Sparkles}
      >
        <ul className="space-y-2">
          {intelligence.whyUsersChoose.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-profit" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </IntelligenceSection>

      <IntelligenceSection
        id="protocol-intelligence-risks"
        title={risksTitle}
        icon={AlertTriangle}
      >
        <ul className="space-y-3">
          {intelligence.mainRisks.map((risk) => (
            <li
              key={`${risk.type}-${risk.description}`}
              className="rounded-lg border border-border/60 bg-background/40 px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-white">{risk.typeLabel}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase ${severityBadgeClass(risk.severity)}`}
                >
                  {risk.severityLabel}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {risk.description}
              </p>
            </li>
          ))}
        </ul>
      </IntelligenceSection>

      <div className="grid gap-6 md:grid-cols-2">
        <IntelligenceSection
          id="protocol-intelligence-best-for"
          title={bestForTitle}
          icon={Target}
        >
          <ul className="space-y-2">
            {intelligence.bestFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-profit" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </IntelligenceSection>

        <IntelligenceSection
          id="protocol-intelligence-not-ideal"
          title={notIdealTitle}
          icon={XCircle}
        >
          <ul className="space-y-2">
            {intelligence.notIdealFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <XCircle className="mt-0.5 size-4 shrink-0 text-loss/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </IntelligenceSection>
      </div>

      {intelligence.trustBreakdown.length > 0 ? (
        <IntelligenceSection
          id="protocol-intelligence-trust-breakdown"
          title={trustBreakdownTitle}
          icon={Shield}
        >
          {intelligence.compositeScore !== null ? (
            <p className="mb-4 text-sm text-muted-foreground">
              {lang === "ru"
                ? `Составной балл: ${intelligence.compositeScore}/100. Компоненты ниже объясняют, почему Trust Score именно такой.`
                : `Composite score: ${intelligence.compositeScore}/100. The components below explain why the Trust Score is what it is.`}
            </p>
          ) : null}
          <ul className="space-y-3">
            {intelligence.trustBreakdown.map((component) => (
              <li
                key={component.key}
                className="rounded-lg border border-border/60 bg-background/40 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-white">
                    {component.label}
                  </span>
                  <span className="font-heading text-sm font-bold text-primary">
                    {component.score}/100
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${component.score}%` }}
                  />
                </div>
                {component.rationale ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {component.rationale}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </IntelligenceSection>
      ) : null}
    </div>
  );
}

/** Internal product connectivity: alternatives, comparisons, opportunities. */
export function ProtocolIntelligenceConnectivity({
  lang,
  intelligence,
}: ProtocolIntelligenceProps) {
  const alternativesTitle = lang === "ru" ? "Альтернативы" : "Alternatives";
  const comparisonsTitle =
    lang === "ru" ? "Связанные сравнения" : "Related Comparisons";
  const opportunitiesTitle =
    lang === "ru" ? "Связанные возможности" : "Related Opportunities";

  if (
    intelligence.alternatives.length === 0 &&
    intelligence.relatedComparisons.length === 0 &&
    intelligence.relatedOpportunities.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-6">
      {intelligence.alternatives.length > 0 ? (
        <IntelligenceSection
          id="protocol-intelligence-alternatives"
          title={alternativesTitle}
          icon={GitCompare}
        >
          <ul className="flex flex-wrap gap-2">
            {intelligence.alternatives.map((alt) => (
              <li key={alt.slug}>
                <Link
                  href={alt.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {alt.name}
                  <ArrowRight className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </IntelligenceSection>
      ) : null}

      {intelligence.relatedComparisons.length > 0 ? (
        <IntelligenceSection
          id="protocol-intelligence-comparisons"
          title={comparisonsTitle}
          icon={GitCompare}
        >
          <ul className="space-y-2">
            {intelligence.relatedComparisons.map((comparison) => (
              <li key={comparison.slug}>
                <Link
                  href={comparison.href}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <span>{comparison.label}</span>
                  <ArrowRight className="size-3.5 shrink-0 text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </IntelligenceSection>
      ) : null}

      {intelligence.relatedOpportunities.length > 0 ? (
        <IntelligenceSection
          id="protocol-intelligence-opportunities"
          title={opportunitiesTitle}
          icon={TrendingUp}
        >
          <ul className="space-y-3">
            {intelligence.relatedOpportunities.map((opp) => (
              <li
                key={opp.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{opp.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {opp.type === "offer"
                      ? lang === "ru"
                        ? "Оффер"
                        : "Offer"
                      : "Earn"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-profit">
                    <TrendingUp className="size-3.5" />
                    {opp.apy}%
                  </span>
                  <Link
                    href={opp.href}
                    className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-white"
                  >
                    {lang === "ru" ? "Открыть" : "Open"}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </IntelligenceSection>
      ) : null}
    </div>
  );
}

/** Terminal recommendation block — always rendered last on protocol pages. */
export function ProtocolSuggestedNextStep({
  lang,
  intelligence,
}: ProtocolIntelligenceProps) {
  const nextStepTitle =
    lang === "ru" ? "Рекомендуемый следующий шаг" : "Suggested Next Step";

  return (
    <IntelligenceSection
      id="protocol-intelligence-next-step"
      title={nextStepTitle}
      icon={ArrowRight}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            intelligence.suggestedNextStep.compareAlternatives,
            intelligence.suggestedNextStep.reviewRisks,
            intelligence.suggestedNextStep.viewOpportunities,
          ] as const
        ).map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-[--neon-soft] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
          >
            <span>{action.label}</span>
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        ))}
      </div>
    </IntelligenceSection>
  );
}
