import type { TrustScoreInput } from "@/lib/trust-score/types";

/**
 * Static placeholder tiers for known protocols until external TVL/audit APIs ship.
 * Values are conservative estimates — always marked `estimated` in factor output.
 */
export const PROTOCOL_PLACEHOLDER_PROFILES: Record<
  string,
  {
    tvlTierScore: number;
    maturityYears: number;
    auditScore: number;
    exploitScore: number;
    liquidityScore: number;
  }
> = {
  aave: {
    tvlTierScore: 92,
    maturityYears: 5,
    auditScore: 88,
    exploitScore: 75,
    liquidityScore: 85,
  },
  lido: {
    tvlTierScore: 95,
    maturityYears: 4,
    auditScore: 90,
    exploitScore: 82,
    liquidityScore: 80,
  },
  jito: {
    tvlTierScore: 72,
    maturityYears: 2,
    auditScore: 78,
    exploitScore: 80,
    liquidityScore: 75,
  },
};

const DEFAULT_PROFILE = {
  tvlTierScore: 55,
  maturityYears: 1,
  auditScore: 50,
  exploitScore: 50,
  liquidityScore: 50,
};

/** Risk tier nudges audit and exploit placeholder scores. */
export function riskTierAdjustments(riskTier: string): {
  auditDelta: number;
  exploitDelta: number;
} {
  if (riskTier.startsWith("AAA")) return { auditDelta: 8, exploitDelta: 10 };
  if (riskTier.startsWith("AA")) return { auditDelta: 4, exploitDelta: 5 };
  return { auditDelta: 0, exploitDelta: 0 };
}

export function getProtocolPlaceholderProfile(slug: string) {
  return PROTOCOL_PLACEHOLDER_PROFILES[slug] ?? DEFAULT_PROFILE;
}

/** Score APY sustainability — high APY on stablecoins scores lower. */
export function scoreApySustainability(
  topApy: number | null,
  categorySlug: string,
): { score: number; status: "verified" | "estimated" } {
  if (topApy == null) {
    return { score: 50, status: "estimated" };
  }

  const isStable = categorySlug === "lending";
  let score: number;

  if (isStable) {
    if (topApy <= 6) score = 90;
    else if (topApy <= 10) score = 75;
    else if (topApy <= 15) score = 55;
    else score = 35;
  } else {
    if (topApy <= 8) score = 88;
    else if (topApy <= 12) score = 72;
    else if (topApy <= 18) score = 55;
    else score = 40;
  }

  return { score, status: "verified" };
}

/** Maturity score from years — placeholder when years are from static profile. */
export function scoreMaturity(years: number): number {
  if (years >= 5) return 95;
  if (years >= 3) return 82;
  if (years >= 2) return 70;
  if (years >= 1) return 58;
  return 45;
}

/** TVL score from USD or tier placeholder. */
export function scoreTvl(
  tvlUsd: number | null | undefined,
  tierScore: number,
): { score: number; status: "verified" | "estimated" | "pending_verification" } {
  if (tvlUsd != null && tvlUsd > 0) {
    if (tvlUsd >= 5_000_000_000) return { score: 95, status: "verified" };
    if (tvlUsd >= 1_000_000_000) return { score: 85, status: "verified" };
    if (tvlUsd >= 100_000_000) return { score: 70, status: "verified" };
    if (tvlUsd >= 10_000_000) return { score: 55, status: "verified" };
    return { score: 40, status: "verified" };
  }
  return { score: tierScore, status: "estimated" };
}

export function buildProtocolExplanation(
  input: TrustScoreInput,
  score: number,
): { short: { en: string; ru: string }; detailed?: { en: string; ru: string } } {
  const gradeContext =
    score >= 80
      ? { en: "strong informational profile", ru: "сильный информационный профиль" }
      : score >= 65
        ? { en: "moderate informational profile", ru: "умеренный информационный профиль" }
        : { en: "mixed informational profile", ru: "смешанный информационный профиль" };

  return {
    short: {
      en: `${input.name} scores ${score}/100 on TJT Trust Score v0.1 — a ${gradeContext.en} based on catalog data and estimated on-chain factors.`,
      ru: `${input.name} получает ${score}/100 в TJT Trust Score v0.1 — ${gradeContext.ru} на основе данных каталога и оценочных on-chain факторов.`,
    },
    detailed: {
      en: `Composite reflects TVL strength, protocol maturity, audit and exploit placeholders, APY sustainability from catalog snapshots, and liquidity exit assumptions. External verification pending for v1.0.`,
      ru: `Композит учитывает TVL, зрелость протокола, заглушки аудита и эксплойтов, устойчивость APY из каталога и допущения по ликвидности. Внешняя верификация запланирована для v1.0.`,
    },
  };
}

export function buildEarnAssetExplanation(
  symbol: string,
  score: number,
  protocolCount: number,
): { short: { en: string; ru: string }; detailed?: { en: string; ru: string } } {
  return {
    short: {
      en: `${symbol} earn routes aggregate to ${score}/100 on TJT Trust Score v0.1 across ${protocolCount} catalogued protocol${protocolCount === 1 ? "" : "s"}. Informational only.`,
      ru: `Маршруты ${symbol} дают ${score}/100 в TJT Trust Score v0.1 по ${protocolCount} протокол${protocolCount === 1 ? "у" : "ам"} каталога. Только для информации.`,
    },
    detailed: {
      en: `Asset-level score is a weighted blend of protocol Trust Scores for live CPA routes. Does not rank or recommend any specific offer.`,
      ru: `Оценка на уровне актива — взвешенное смешение Trust Score протоколов для live CPA-маршрутов. Не ранжирует и не рекомендует конкретный оффер.`,
    },
  };
}
