import type {
  TrustCategory,
  TrustDataStatus,
  TrustFactor,
  TrustFactorKey,
  TrustLocalizedString,
  TrustProtocolSlug,
} from "@/lib/trust/trust-types";

/** v0.1 factor weights — must sum to 100. */
export const TRUST_FACTOR_WEIGHTS: Record<TrustFactorKey, number> = {
  tvl: 20,
  protocol_age: 12,
  audits: 18,
  exploit_history: 15,
  liquidity: 12,
  yield_sustainability: 8,
  protocol_adoption: 10,
  documentation_quality: 5,
};

export const TRUST_FACTOR_LABELS: Record<TrustFactorKey, TrustLocalizedString> = {
  tvl: { en: "TVL", ru: "TVL" },
  protocol_age: { en: "Protocol age", ru: "Возраст протокола" },
  audits: { en: "Audits", ru: "Аудиты" },
  exploit_history: { en: "Exploit history", ru: "История эксплойтов" },
  liquidity: { en: "Liquidity", ru: "Ликвидность" },
  yield_sustainability: {
    en: "Yield sustainability",
    ru: "Устойчивость доходности",
  },
  protocol_adoption: {
    en: "Protocol adoption",
    ru: "Принятие протокола",
  },
  documentation_quality: {
    en: "Documentation quality",
    ru: "Качество документации",
  },
};

export const TRUST_CATEGORY_LABELS: Record<TrustCategory, TrustLocalizedString> =
  {
    very_high_trust: {
      en: "Very High Trust",
      ru: "Очень высокое доверие",
    },
    high_trust: { en: "High Trust", ru: "Высокое доверие" },
    moderate_trust: { en: "Moderate Trust", ru: "Умеренное доверие" },
    elevated_risk: { en: "Elevated Risk", ru: "Повышенный риск" },
    high_risk: { en: "High Risk", ru: "Высокий риск" },
  };

export const TRUST_SCORE_DISCLAIMER: TrustLocalizedString = {
  en: "This educational score is an estimated framework for risk context only — not financial advice, not a recommendation, and not a guarantee of safety or performance. Several factors use placeholder or estimated data until external verification sources are connected.",
  ru: "Этот образовательный балл — оценочная рамка только для контекста риска, не финансовый совет, не рекомендация и не гарантия безопасности или доходности. Часть факторов основана на заглушках или оценках до подключения внешних источников верификации.",
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Map a 0–100 composite score to a Trust category band. */
export function scoreToCategory(score: number): TrustCategory {
  const clamped = clampScore(score);
  if (clamped >= 90) return "very_high_trust";
  if (clamped >= 75) return "high_trust";
  if (clamped >= 60) return "moderate_trust";
  if (clamped >= 40) return "elevated_risk";
  return "high_risk";
}

type BuildFactorInput = {
  key: TrustFactorKey;
  score: number;
  dataStatus: TrustDataStatus;
  note: TrustLocalizedString;
};

/** Build a weighted factor from raw inputs. */
export function buildTrustFactor(input: BuildFactorInput): TrustFactor {
  const weight = TRUST_FACTOR_WEIGHTS[input.key];
  const clamped = clampScore(input.score);
  return {
    key: input.key,
    label: TRUST_FACTOR_LABELS[input.key],
    score: clamped,
    weight,
    weightedScore: Math.round(clamped * (weight / 100) * 10) / 10,
    dataStatus: input.dataStatus,
    note: input.note,
  };
}

/** Compute composite score from weighted factors. */
export function computeCompositeScore(factors: TrustFactor[]): number {
  return clampScore(factors.reduce((sum, f) => sum + f.weightedScore, 0));
}

/** Map SEO Pilot review/safety slugs to protocol trust slugs. */
export const SEO_PILOT_TRUST_SLUG_MAP: Record<string, TrustProtocolSlug> = {
  "aave-review": "aave",
  "lido-review": "lido",
  "jito-review": "jito",
  "is-aave-safe": "aave",
  "is-lido-safe": "lido",
  "is-jito-safe": "jito",
};

export function resolveTrustSlugFromSeoPilot(
  seoPilotSlug: string,
): TrustProtocolSlug | null {
  return SEO_PILOT_TRUST_SLUG_MAP[seoPilotSlug] ?? null;
}

/** Render indexable SEO prose for a trust profile. */
export function buildTrustSeoProse(
  profile: { protocolName: string; score: number; categoryLabel: TrustLocalizedString; explanation: TrustLocalizedString; riskNotes: TrustLocalizedString[] },
  lang: "en" | "ru",
): string {
  const riskContext = profile.riskNotes.map((n) => n[lang]).join(" ");
  return `${profile.protocolName} TJT Trust Score: ${profile.score}/100 (${profile.categoryLabel[lang]}). ${profile.explanation[lang]} Risk context: ${riskContext}`;
}
