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
          ? `How much money is locked in this protocol right now. More TVL usually means deeper liquidity and more eyes watching the code — but it is not a safety guarantee.`
          : `Estimated total value locked. Protocols with billions locked tend to be harder to drain quickly, but large TVL alone does not mean your deposit is safe.`,
      ru:
        tvl.status === "verified"
          ? `Сколько денег сейчас заблокировано в протоколе. Больше TVL обычно означает больше ликвидности и больше внимания к коду — но это не гарантия безопасности.`
          : `Оценочный TVL. Протоколы с миллиардами сложнее опустошить быстро, но большой TVL сам по себе не означает безопасность депозита.`,
    }),
    buildFactor("protocol_maturity", maturityScore, "estimated", {
      en: `How long this protocol has been running (~${maturityYears} years). Older protocols have survived more market crashes and code upgrades — newer ones have less track record.`,
      ru: `Как долго работает протокол (~${maturityYears} лет). Старые пережили больше кризисов и обновлений кода — у новых меньше истории.`,
    }),
    buildFactor("audit_status", auditScore, "pending_verification", {
      en: `Whether independent security firms have reviewed the smart contract code. Audits reduce risk but do not eliminate it — bugs are still found after audits. Risk tier: ${input.riskTier}.`,
      ru: `Проверяли ли независимые фирмы код смарт-контрактов. Аудиты снижают риск, но не убирают его — баги находят и после аудитов. Уровень риска: ${input.riskTier}.`,
    }),
    buildFactor("exploit_history", exploitScore, "pending_verification", {
      en: `Whether this protocol has been hacked or had funds stolen before. A clean history is reassuring; past exploits mean the team has been tested — but new vulnerabilities can still appear.`,
      ru: `Был ли протокол взломан или терял средства раньше. Чистая история обнадёживает; прошлые взломы значат, что команду уже проверяли — но новые уязвимости возможны.`,
    }),
    buildFactor("apy_sustainability", apy.score, apy.status, {
      en:
        input.topApy != null
          ? `Whether the current ${input.topApy}% APY looks sustainable or driven by temporary token rewards. Very high stablecoin rates often drop sharply when incentives end.`
          : `Whether advertised yield comes from real borrower demand or short-lived token giveaways. Unsustainable rates are the most common way beginners lose money.`,
      ru:
        input.topApy != null
          ? `Насколько текущий APY ${input.topApy}% устойчив или основан на временных токен-наградах. Очень высокие ставки на стейблкоинах часто падают, когда incentives заканчиваются.`
          : `Идёт ли доходность от реального спроса заёмщиков или от краткосрочных раздач токенов. Неустойчивые ставки — частая причина потерь у новичков.`,
    }),
    buildFactor("liquidity_withdrawal_risk", liquidityScore, "estimated", {
      en: `How quickly you can get your money back out. If too many people withdraw at once, you may face delays or accept a lower exit price — especially on newer or smaller protocols.`,
      ru: `Как быстро можно вывести деньги. Если многие выводят одновременно, возможны задержки или выход по худшей цене — особенно в новых или мелких протоколах.`,
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
