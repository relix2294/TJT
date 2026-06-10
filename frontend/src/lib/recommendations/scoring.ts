import type { Locale } from "@/lib/i18n";
import type {
  RecommendationCandidate,
  RecommendationLens,
  RecommendationPick,
} from "@/lib/recommendations/types";
import { lensLabel } from "@/lib/recommendations/labels";

const RISK_TIER_RANK: Record<string, number> = {
  AAA: 3,
  AA: 2,
  A: 1,
};

const BEGINNER_TYPES = new Set(["lending", "staking"]);
const ADVANCED_TYPES = new Set(["restaking", "vault", "liquidity"]);

function riskTierRank(tier: string | null): number {
  if (!tier) return 0;
  return RISK_TIER_RANK[tier.toUpperCase()] ?? 0;
}

function trustScore(candidate: RecommendationCandidate): number {
  return candidate.trustScore ?? 0;
}

function apy(candidate: RecommendationCandidate): number {
  return candidate.apy ?? 0;
}

function riskRewardScore(candidate: RecommendationCandidate): number {
  const score = trustScore(candidate);
  const yieldVal = apy(candidate);
  if (score <= 0 || yieldVal <= 0) return yieldVal + score * 0.01;
  return yieldVal * (score / 100);
}

type LensScorer = (candidates: RecommendationCandidate[]) => RecommendationCandidate | null;

const LENS_SCORERS: Record<RecommendationLens, LensScorer> = {
  highest_yield: (candidates) =>
    [...candidates].sort((a, b) => apy(b) - apy(a))[0] ?? null,

  most_trusted: (candidates) =>
    [...candidates].sort((a, b) => trustScore(b) - trustScore(a))[0] ?? null,

  conservative_choice: (candidates) =>
    [...candidates].sort((a, b) => {
      const riskDiff = riskTierRank(b.riskTier) - riskTierRank(a.riskTier);
      if (riskDiff !== 0) return riskDiff;
      return trustScore(b) - trustScore(a);
    })[0] ?? null,

  best_risk_reward: (candidates) =>
    [...candidates].sort(
      (a, b) => riskRewardScore(b) - riskRewardScore(a),
    )[0] ?? null,

  best_for_beginners: (candidates) =>
    [...candidates].sort((a, b) => {
      const aBeginner = BEGINNER_TYPES.has(a.productType ?? "") ? 1 : 0;
      const bBeginner = BEGINNER_TYPES.has(b.productType ?? "") ? 1 : 0;
      if (bBeginner !== aBeginner) return bBeginner - aBeginner;
      const riskDiff = riskTierRank(b.riskTier) - riskTierRank(a.riskTier);
      if (riskDiff !== 0) return riskDiff;
      return trustScore(b) - trustScore(a);
    })[0] ?? null,

  advanced_choice: (candidates) =>
    [...candidates].sort((a, b) => {
      const aAdvanced = ADVANCED_TYPES.has(a.productType ?? "") ? 1 : 0;
      const bAdvanced = ADVANCED_TYPES.has(b.productType ?? "") ? 1 : 0;
      if (bAdvanced !== aAdvanced) return bAdvanced - aAdvanced;
      return apy(b) - apy(a);
    })[0] ?? null,
};

function buildReason(
  lens: RecommendationLens,
  candidate: RecommendationCandidate,
  lang: Locale,
): string {
  const name = candidate.label;
  const apyVal = candidate.apy;
  const score = candidate.trustScore;
  const tier = candidate.riskTier;

  const reasons: Record<RecommendationLens, Record<Locale, string>> = {
    highest_yield: {
      en: `${name} leads this set on catalog APY${apyVal != null ? ` (${apyVal}%)` : ""} — verify sustainability before acting.`,
      ru: `${name} лидирует по APY каталога${apyVal != null ? ` (${apyVal}%)` : ""} — проверьте устойчивость дохода перед действием.`,
    },
    most_trusted: {
      en: `${name} has the strongest Trust Score in this set${score != null ? ` (${score}/100)` : ""} for risk-context research.`,
      ru: `${name} имеет наивысший Trust Score в этой выборке${score != null ? ` (${score}/100)` : ""} для контекста риска.`,
    },
    conservative_choice: {
      en: `${name} combines a higher risk tier${tier ? ` (${tier})` : ""} with stronger trust signals — suited when capital preservation matters.`,
      ru: `${name} сочетает более высокий risk tier${tier ? ` (${tier})` : ""} с сильными trust-сигналами — когда важнее сохранность капитала.`,
    },
    best_risk_reward: {
      en: `${name} balances yield${apyVal != null ? ` (${apyVal}%)` : ""} against trust${score != null ? ` (${score}/100)` : ""} in this catalog snapshot.`,
      ru: `${name} балансирует yield${apyVal != null ? ` (${apyVal}%)` : ""} и trust${score != null ? ` (${score}/100)` : ""} в этом снимке каталога.`,
    },
    best_for_beginners: {
      en: `${name} offers simpler product mechanics and stronger baseline trust — a common starting point for first-time yield research.`,
      ru: `${name} предлагает более простую механику и сильный базовый trust — типичная отправная точка для первого yield-исследования.`,
    },
    advanced_choice: {
      en: `${name} targets experienced users with higher-complexity mechanics and potentially higher upside${apyVal != null ? ` (${apyVal}% APY)` : ""}.`,
      ru: `${name} ориентирован на опытных пользователей со сложной механикой и потенциально более высоким upside${apyVal != null ? ` (${apyVal}% APY)` : ""}.`,
    },
  };

  return reasons[lens][lang];
}

function pickFromCandidate(
  lens: RecommendationLens,
  candidate: RecommendationCandidate,
  lang: Locale,
): RecommendationPick {
  return {
    lens,
    lensLabel: lensLabel(lens, lang),
    targetLabel: candidate.label,
    targetHref: candidate.href,
    reason: buildReason(lens, candidate, lang),
    apy: candidate.apy,
    trustScore: candidate.trustScore,
  };
}

/** Apply lenses to a candidate set; falls back gracefully when few candidates exist. */
export function applyRecommendationLenses(
  candidates: RecommendationCandidate[],
  lenses: RecommendationLens[],
  lang: Locale,
): RecommendationPick[] {
  if (candidates.length === 0) return [];

  if (candidates.length === 1) {
    const sole = candidates[0];
    const fallbackLenses = lenses.slice(0, 2);
    return fallbackLenses.map((lens) => pickFromCandidate(lens, sole, lang));
  }

  const picks: RecommendationPick[] = [];
  const usedTargets = new Set<string>();

  for (const lens of lenses) {
    const winner = LENS_SCORERS[lens](candidates);
    if (!winner) continue;

    const dedupeKey = `${lens}:${winner.id}`;
    if (usedTargets.has(dedupeKey)) continue;

    picks.push(pickFromCandidate(lens, winner, lang));
    usedTargets.add(dedupeKey);
  }

  if (picks.length === 0) {
    const fallback = candidates[0];
    return [pickFromCandidate(lenses[0] ?? "most_trusted", fallback, lang)];
  }

  return picks;
}
