import {
  TRUST_SCORE_DISCLAIMER,
  TRUST_SCORE_FACTOR_LABELS,
  TRUST_SCORE_FACTOR_WEIGHTS,
} from "@/lib/trust-score/factors";
import {
  buildEarnAssetExplanation,
  buildProtocolExplanation,
  getProtocolPlaceholderProfile,
  riskTierAdjustments,
  scoreApySustainability,
  scoreMaturity,
  scoreTvl,
} from "@/lib/trust-score/placeholders";
import type {
  EarnAssetTrustScoreInput,
  TrustScore,
  TrustScoreFactor,
  TrustScoreFactorKey,
  TrustScoreGrade,
  TrustScoreInput,
} from "@/lib/trust-score/types";

export function scoreToGrade(score: number): TrustScoreGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  if (score >= 25) return "E";
  return "F";
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildFactor(
  key: TrustScoreFactorKey,
  score: number,
  status: TrustScoreFactor["status"],
  description: TrustScoreFactor["description"],
): TrustScoreFactor {
  const weight = TRUST_SCORE_FACTOR_WEIGHTS[key];
  const clamped = clampScore(score);
  return {
    key,
    weight,
    score: clamped,
    weightedScore: Math.round(clamped * (weight / 100) * 10) / 10,
    status,
    label: TRUST_SCORE_FACTOR_LABELS[key],
    description,
  };
}

/** Compute protocol-level Trust Score v0.1. */
export function computeProtocolTrustScore(input: TrustScoreInput): TrustScore {
  const profile = getProtocolPlaceholderProfile(input.slug);
  const { auditDelta, exploitDelta } = riskTierAdjustments(input.riskTier);
  const maturityYears = input.maturityYears ?? profile.maturityYears;

  const tvl = scoreTvl(input.tvlUsd, profile.tvlTierScore);
  const apy = scoreApySustainability(input.topApy, input.categorySlug);

  const auditScore = clampScore(profile.auditScore + auditDelta);
  const exploitScore = clampScore(profile.exploitScore + exploitDelta);
  const maturityScore = scoreMaturity(maturityYears);
  const liquidityScore = profile.liquidityScore;

  const factors: TrustScoreFactor[] = [
    buildFactor("tvl_strength", tvl.score, tvl.status, {
      en:
        tvl.status === "verified"
          ? `TVL tier derived from available USD data.`
          : `TVL tier estimated from protocol profile — pending on-chain verification.`,
      ru:
        tvl.status === "verified"
          ? `Уровень TVL из доступных USD-данных.`
          : `Уровень TVL оценён по профилю протокола — ожидает on-chain верификации.`,
    }),
    buildFactor("protocol_maturity", maturityScore, "estimated", {
      en: `Protocol age placeholder (~${maturityYears}y) — pending verified launch date.`,
      ru: `Заглушка возраста протокола (~${maturityYears} лет) — ожидает подтверждённую дату запуска.`,
    }),
    buildFactor("audit_status", auditScore, "pending_verification", {
      en: `Audit coverage placeholder adjusted by catalog risk tier ${input.riskTier}.`,
      ru: `Заглушка аудита с учётом уровня риска каталога ${input.riskTier}.`,
    }),
    buildFactor("exploit_history", exploitScore, "pending_verification", {
      en: `Exploit history placeholder — no verified incident feed connected yet.`,
      ru: `Заглушка истории эксплойтов — верифицированный фид инцидентов не подключён.`,
    }),
    buildFactor("apy_sustainability", apy.score, apy.status, {
      en:
        input.topApy != null
          ? `APY sustainability from catalog top rate ${input.topApy}%.`
          : `APY sustainability estimated — no catalog APY available.`,
      ru:
        input.topApy != null
          ? `Устойчивость APY по лучшему APY каталога ${input.topApy}%.`
          : `Устойчивость APY оценена — APY в каталоге отсутствует.`,
    }),
    buildFactor("liquidity_withdrawal_risk", liquidityScore, "estimated", {
      en: `Liquidity and withdrawal risk placeholder by protocol category.`,
      ru: `Заглушка риска ликвидности и вывода по категории протокола.`,
    }),
  ];

  const score = clampScore(
    factors.reduce((sum, f) => sum + f.weightedScore, 0),
  );
  const explanation = buildProtocolExplanation(input, score);

  return {
    score,
    grade: scoreToGrade(score),
    version: "0.1",
    explanation,
    factors,
    disclaimer: TRUST_SCORE_DISCLAIMER,
    computedAt: new Date().toISOString(),
  };
}

/** Blend protocol scores into an asset-level Trust Score. */
export function computeEarnAssetTrustScore(
  input: EarnAssetTrustScoreInput,
): TrustScore {
  if (!input.protocolScores.length) {
    const explanation = buildEarnAssetExplanation(input.symbol, 50, 0);
    return {
      score: 50,
      grade: scoreToGrade(50),
      version: "0.1",
      explanation,
      factors: [],
      disclaimer: TRUST_SCORE_DISCLAIMER,
      computedAt: new Date().toISOString(),
    };
  }

  const totalWeight = input.protocolScores.reduce((s, p) => s + p.score, 0);
  const blendedScore = clampScore(
    totalWeight / input.protocolScores.length,
  );

  const factorMap = new Map<
    TrustScoreFactorKey,
    { sum: number; count: number; factor: TrustScoreFactor }
  >();

  for (const protocolScore of input.protocolScores) {
    for (const factor of protocolScore.factors) {
      const existing = factorMap.get(factor.key);
      if (existing) {
        existing.sum += factor.score;
        existing.count += 1;
      } else {
        factorMap.set(factor.key, { sum: factor.score, count: 1, factor });
      }
    }
  }

  const factors: TrustScoreFactor[] = Array.from(factorMap.entries()).map(
    ([key, agg]) => {
      const avgScore = clampScore(agg.sum / agg.count);
      const weight = TRUST_SCORE_FACTOR_WEIGHTS[key];
      return {
        ...agg.factor,
        score: avgScore,
        weightedScore: Math.round(avgScore * (weight / 100) * 10) / 10,
        description: {
          en: `Averaged across ${agg.count} protocol route${agg.count === 1 ? "" : "s"} on ${input.symbol}.`,
          ru: `Усреднено по ${agg.count} протокольн${agg.count === 1 ? "ому" : "ым"} маршрут${agg.count === 1 ? "у" : "ам"} на ${input.symbol}.`,
        },
      };
    },
  );

  const explanation = buildEarnAssetExplanation(
    input.symbol,
    blendedScore,
    input.protocolScores.length,
  );

  return {
    score: blendedScore,
    grade: scoreToGrade(blendedScore),
    version: "0.1",
    explanation,
    factors,
    disclaimer: TRUST_SCORE_DISCLAIMER,
    computedAt: new Date().toISOString(),
  };
}
