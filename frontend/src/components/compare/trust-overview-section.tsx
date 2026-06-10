import { TrustScoreCard } from "@/components/trust/trust-score-card";
import type { ComparePage } from "@/lib/compare/types";
import {
  getTrustProfileOrNull,
  isTrustProtocolSlug,
  type ProtocolTrustProfile,
} from "@/lib/trust";
import { isProtocolComparison, isYieldComparison } from "@/lib/compare/types";
import type { Locale } from "@/lib/i18n";

type CompareTrustOverviewProps = {
  lang: Locale;
  page: ComparePage;
};

function collectTrustProfiles(page: ComparePage): ProtocolTrustProfile[] {
  const profiles: ProtocolTrustProfile[] = [];
  const seen = new Set<string>();

  if (isProtocolComparison(page.comparison)) {
    for (const side of [page.comparison.left, page.comparison.right]) {
      if (
        isTrustProtocolSlug(side.protocolSlug) &&
        !seen.has(side.protocolSlug)
      ) {
        seen.add(side.protocolSlug);
        profiles.push(getTrustProfileOrNull(side.protocolSlug)!);
      }
    }
    return profiles;
  }

  if (isYieldComparison(page.comparison)) {
    for (const row of page.comparison.rows) {
      if (
        isTrustProtocolSlug(row.protocolSlug) &&
        !seen.has(row.protocolSlug)
      ) {
        seen.add(row.protocolSlug);
        const profile = getTrustProfileOrNull(row.protocolSlug);
        if (profile) profiles.push(profile);
      }
    }
  }

  return profiles;
}

export function CompareTrustOverview({ lang, page }: CompareTrustOverviewProps) {
  const profiles = collectTrustProfiles(page);
  if (!profiles.length) return null;

  const sectionTitle =
    lang === "ru" ? "Trust overview" : "Trust overview";
  const sectionIntro =
    lang === "ru"
      ? "Образовательные баллы TJT Trust Score v0.1 для протоколов в этом сравнении. Оценочная рамка — только risk context, не финансовый совет."
      : "TJT Trust Score v0.1 educational scores for protocols in this comparison. Estimated framework for risk context only — not financial advice.";

  return (
    <section id="compare-trust-overview" aria-label={sectionTitle}>
      <h2 className="mb-2 font-heading text-lg font-bold text-white">
        {sectionTitle}
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {sectionIntro}
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((profile) => (
          <TrustScoreCard key={profile.slug} lang={lang} profile={profile} />
        ))}
      </div>
    </section>
  );
}
