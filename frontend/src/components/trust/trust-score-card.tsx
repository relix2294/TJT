import { Shield, Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import type {
  ProtocolTrustProfile,
  TrustCategory,
  TrustDataStatus,
} from "@/lib/trust";

type TrustScoreCardProps = {
  lang: Locale;
  profile: ProtocolTrustProfile;
  variant?: "compact" | "full";
};

function categoryBadgeClass(category: TrustCategory): string {
  if (category === "very_high_trust" || category === "high_trust") {
    return "border-profit/30 bg-profit/10 text-profit";
  }
  if (category === "moderate_trust") {
    return "border-primary/30 bg-[--neon-soft] text-primary";
  }
  return "border-loss/30 bg-loss/10 text-loss";
}

function dataStatusLabel(lang: Locale, status: TrustDataStatus): string {
  const labels: Record<TrustDataStatus, Record<Locale, string>> = {
    verified: { en: "Verified", ru: "Проверено" },
    estimated: { en: "Estimated", ru: "Оценка" },
    placeholder: { en: "Placeholder", ru: "Заглушка" },
  };
  return labels[status][lang];
}

function dataStatusBadgeClass(status: TrustDataStatus): string {
  if (status === "verified") return "border-profit/30 bg-profit/10 text-profit";
  if (status === "estimated") return "border-primary/30 bg-[--neon-soft] text-primary";
  return "border-border/60 text-muted-foreground";
}

export function TrustScoreCard({
  lang,
  profile,
  variant = "full",
}: TrustScoreCardProps) {
  const trustOverviewLabel =
    lang === "ru" ? "Trust overview" : "Trust overview";
  const educationalScoreLabel =
    lang === "ru" ? "Образовательный балл" : "Educational score";
  const estimatedFrameworkLabel =
    lang === "ru" ? "Оценочная рамка v0.1" : "Estimated framework v0.1";
  const factorBreakdownLabel =
    lang === "ru" ? "Разбивка по факторам" : "Factor breakdown";
  const riskContextLabel =
    lang === "ru" ? "Risk context" : "Risk context";
  const lastReviewedLabel =
    lang === "ru" ? "Последний обзор" : "Last reviewed";

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2">
        <Badge
          variant="outline"
          className={`font-heading text-xs font-bold ${categoryBadgeClass(profile.category)}`}
        >
          <Shield className="mr-1 size-3" />
          {profile.score}
        </Badge>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {profile.categoryLabel[lang]}
        </span>
      </div>
    );
  }

  return (
    <section aria-label={trustOverviewLabel}>
      <Card className="rounded-2xl border-border/60 bg-card/40 p-5 sm:p-6">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Shield className="size-4 text-primary" />
              <h2 className="font-heading text-lg font-bold text-white">
                TJT Trust Score
              </h2>
              <Badge variant="outline" className="text-[10px] uppercase">
                {estimatedFrameworkLabel}
              </Badge>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {trustOverviewLabel} · {profile.protocolName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-3xl font-bold text-white">
              {profile.score}
              <span className="text-base font-normal text-muted-foreground">
                /100
              </span>
            </p>
            <Badge
              variant="outline"
              className={`mt-1 font-heading font-bold ${categoryBadgeClass(profile.category)}`}
            >
              {profile.categoryLabel[lang]}
            </Badge>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {educationalScoreLabel}
            </p>
          </div>
        </header>

        {/* Indexable SEO prose — visible text, not visual-only */}
        <div className="mb-4 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {profile.explanation[lang]}
          </p>
          <p className="text-xs text-muted-foreground">
            {lastReviewedLabel}: {profile.lastReviewed} ·{" "}
            {dataStatusLabel(lang, profile.dataStatus)}
          </p>
        </div>

        {profile.factors.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {factorBreakdownLabel}
            </h3>
            <ul className="space-y-2">
              {profile.factors.map((factor) => (
                <li
                  key={factor.key}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 bg-background/30 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {factor.label[lang]}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${dataStatusBadgeClass(factor.dataStatus)}`}
                      >
                        {dataStatusLabel(lang, factor.dataStatus)}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {factor.weight}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {factor.note[lang]}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-heading text-sm font-bold text-white">
                      {factor.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {" "}
                      (+{factor.weightedScore})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {profile.riskNotes.length > 0 ? (
          <div className="mt-4 space-y-2">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <AlertTriangle className="size-3" />
              {riskContextLabel}
            </h3>
            <ul className="space-y-1.5">
              {profile.riskNotes.map((note) => (
                <li
                  key={note.en}
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  {note[lang]}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 flex gap-2 rounded-lg border border-border/40 bg-background/20 p-3">
          <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {profile.disclaimer[lang]}
          </p>
        </div>
      </Card>
    </section>
  );
}
