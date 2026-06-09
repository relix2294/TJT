import type { Locale } from "@/lib/i18n";

/** Bilingual string leaf — resolved at render time. */
export type LocalizedString = Record<Locale, string>;

/** Letter grade derived from a 0–100 composite score. */
export type TrustScoreGrade = "A" | "B" | "C" | "D" | "E" | "F";

/** v0.1 weighted factor identifiers. */
export type TrustScoreFactorKey =
  | "tvl_strength"
  | "protocol_maturity"
  | "audit_status"
  | "exploit_history"
  | "apy_sustainability"
  | "liquidity_withdrawal_risk";

/** How confident TJT is in a factor value at v0.1. */
export type TrustScoreFactorStatus =
  | "verified"
  | "estimated"
  | "pending_verification";

/** Single weighted factor in the Trust Score model. */
export type TrustScoreFactor = {
  key: TrustScoreFactorKey;
  /** Display weight as a percentage (e.g. 25 for 25%). */
  weight: number;
  /** Raw factor score 0–100 before weighting. */
  score: number;
  /** Contribution to composite: score × (weight / 100). */
  weightedScore: number;
  status: TrustScoreFactorStatus;
  label: LocalizedString;
  description: LocalizedString;
};

/** Short and optional long-form explanations for the composite score. */
export type TrustScoreExplanation = {
  short: LocalizedString;
  detailed?: LocalizedString;
};

/** Computed Trust Score result — TJT proprietary scoring layer v0.1. */
export type TrustScore = {
  /** Composite score 0–100. */
  score: number;
  grade: TrustScoreGrade;
  version: "0.1";
  explanation: TrustScoreExplanation;
  factors: TrustScoreFactor[];
  disclaimer: LocalizedString;
  /** ISO-8601 timestamp of computation. */
  computedAt: string;
};

/** Input for protocol-level Trust Score computation. */
export type TrustScoreInput = {
  entityType: "protocol";
  slug: string;
  name: string;
  categorySlug: string;
  riskTier: string;
  /** Best available APY from catalog, if any. */
  topApy: number | null;
  /** Optional TVL in USD — uses placeholder tier when absent. */
  tvlUsd?: number | null;
  /** Optional protocol age in years — uses placeholder when absent. */
  maturityYears?: number | null;
};

/** Input for earn-asset-level Trust Score (aggregated from routes). */
export type EarnAssetTrustScoreInput = {
  entityType: "earn_asset";
  slug: string;
  symbol: string;
  category: "stablecoin" | "native";
  topApy: number | null;
  /** Protocol trust scores backing yield routes on this asset. */
  protocolScores: TrustScore[];
};
