import type { LocalizedString, TrustScoreFactorKey } from "@/lib/trust-score/types";

/** v0.1 factor weights — must sum to 100. */
export const TRUST_SCORE_FACTOR_WEIGHTS: Record<TrustScoreFactorKey, number> = {
  tvl_strength: 25,
  protocol_maturity: 15,
  audit_status: 20,
  exploit_history: 20,
  apy_sustainability: 10,
  liquidity_withdrawal_risk: 10,
};

export const TRUST_SCORE_FACTOR_LABELS: Record<
  TrustScoreFactorKey,
  LocalizedString
> = {
  tvl_strength: {
    en: "TVL strength",
    ru: "Сила TVL",
  },
  protocol_maturity: {
    en: "Protocol maturity",
    ru: "Зрелость протокола",
  },
  audit_status: {
    en: "Audit status",
    ru: "Статус аудита",
  },
  exploit_history: {
    en: "Exploit history",
    ru: "История эксплойтов",
  },
  apy_sustainability: {
    en: "APY sustainability",
    ru: "Устойчивость APY",
  },
  liquidity_withdrawal_risk: {
    en: "Liquidity & withdrawal",
    ru: "Ликвидность и вывод",
  },
};

export const TRUST_SCORE_DISCLAIMER: LocalizedString = {
  en: "TJT Trust Score v0.1 is an informational indicator only — not financial advice, not a recommendation, and not a guarantee of safety or performance. Several factors use estimated or pending-verification data until external sources are connected.",
  ru: "TJT Trust Score v0.1 — только информационный индикатор, не финансовый совет, не рекомендация и не гарантия безопасности или доходности. Часть факторов основана на оценочных данных или ожидает верификации до подключения внешних источников.",
};
