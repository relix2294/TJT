import { Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import type { TrustScore, TrustScoreFactorStatus } from "@/lib/trust-score";

type TrustScoreCardProps = {
  lang: Locale;
  trustScore: TrustScore;
  title?: string;
  variant?: "compact" | "full";
};

function gradeBadgeClass(grade: string): string {
  if (grade === "A" || grade === "B") {
    return "border-profit/30 bg-profit/10 text-profit";
  }
  if (grade === "C") {
    return "border-primary/30 bg-[--neon-soft] text-primary";
  }
  return "border-loss/30 bg-loss/10 text-loss";
}

function statusLabel(lang: Locale, status: TrustScoreFactorStatus): string {
  const labels: Record<TrustScoreFactorStatus, Record<Locale, string>> = {
    verified: { en: "Verified", ru: "Проверено" },
    estimated: { en: "Estimated", ru: "Оценка" },
    pending_verification: {
      en: "Pending verification",
      ru: "Ожидает верификации",
    },
  };
  return labels[status][lang];
}

function statusBadgeClass(status: TrustScoreFactorStatus): string {
  if (status === "verified") return "border-profit/30 bg-profit/10 text-profit";
  if (status === "estimated") return "border-primary/30 bg-[--neon-soft] text-primary";
  return "border-border/60 text-muted-foreground";
}

export function TrustScoreCard({
  lang,
  trustScore,
  title,
  variant = "full",
}: TrustScoreCardProps) {
  const displayTitle =
    title ??
    (lang === "ru" ? "TJT Trust Score v0.1" : "TJT Trust Score v0.1");

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2">
        <Badge
          variant="outline"
          className={`font-heading text-xs font-bold ${gradeBadgeClass(trustScore.grade)}`}
        >
          <Shield className="mr-1 size-3" />
          {trustScore.score}
        </Badge>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {lang === "ru" ? "Оценка" : "Grade"} {trustScore.grade}
        </span>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-border/60 bg-card/40 p-5 sm:p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <h2 className="font-heading text-lg font-bold text-white">
              {displayTitle}
            </h2>
            <Badge variant="outline" className="text-[10px] uppercase">
              v{trustScore.version}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {trustScore.explanation.short[lang]}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-heading text-3xl font-bold text-white">
              {trustScore.score}
              <span className="text-base font-normal text-muted-foreground">
                /100
              </span>
            </p>
            <Badge
              variant="outline"
              className={`mt-1 font-heading font-bold ${gradeBadgeClass(trustScore.grade)}`}
            >
              {lang === "ru" ? "Оценка" : "Grade"} {trustScore.grade}
            </Badge>
          </div>
        </div>
      </header>

      {trustScore.factors.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "ru" ? "Разбивка по факторам" : "Factor breakdown"}
          </h3>
          <ul className="space-y-2">
            {trustScore.factors.map((factor) => (
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
                      className={`text-[9px] uppercase ${statusBadgeClass(factor.status)}`}
                    >
                      {statusLabel(lang, factor.status)}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {factor.weight}%
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {factor.description[lang]}
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

      <div className="mt-4 flex gap-2 rounded-lg border border-border/40 bg-background/20 p-3">
        <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {trustScore.disclaimer[lang]}
        </p>
      </div>
    </Card>
  );
}
