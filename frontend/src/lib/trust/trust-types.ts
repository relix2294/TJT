import type { Locale } from "@/lib/i18n";

/** Bilingual string leaf — resolved at render time. */
export type TrustLocalizedString = Record<Locale, string>;

/** Supported protocol slugs in the v0.1 static registry. */
export type TrustProtocolSlug =
  | "aave"
  | "lido"
  | "jito"
  | "morpho"
  | "spark"
  | "rocket-pool"
  | "etherfi"
  | "pendle"
  | "ethena"
  | "compound";

/** How confident TJT is in the underlying data at v0.1. */
export type TrustDataStatus = "placeholder" | "estimated" | "verified";

/** Trust Score category band derived from a 0–100 composite score. */
export type TrustCategory =
  | "very_high_trust"
  | "high_trust"
  | "moderate_trust"
  | "elevated_risk"
  | "high_risk";

/** v0.1 weighted factor identifiers. */
export type TrustFactorKey =
  | "tvl"
  | "protocol_age"
  | "audits"
  | "exploit_history"
  | "liquidity"
  | "yield_sustainability"
  | "protocol_adoption"
  | "documentation_quality";

/** Single weighted factor in the Trust Score model. */
export type TrustFactor = {
  key: TrustFactorKey;
  label: TrustLocalizedString;
  /** Raw factor score 0–100 before weighting. */
  score: number;
  /** Display weight as a percentage (e.g. 20 for 20%). */
  weight: number;
  /** Contribution to composite: score × (weight / 100). */
  weightedScore: number;
  dataStatus: TrustDataStatus;
  note: TrustLocalizedString;
};

/** Static Trust Score profile for a DeFi protocol — TJT estimated framework v0.1. */
export type ProtocolTrustProfile = {
  protocolName: string;
  slug: TrustProtocolSlug;
  /** Composite score 0–100. */
  score: number;
  category: TrustCategory;
  categoryLabel: TrustLocalizedString;
  factors: TrustFactor[];
  /** Short educational explanation of the score. */
  explanation: TrustLocalizedString;
  /** Risk context notes — informational only. */
  riskNotes: TrustLocalizedString[];
  /** ISO-8601 date when this profile was last reviewed. */
  lastReviewed: string;
  /** Overall data confidence for this profile. */
  dataStatus: TrustDataStatus;
  disclaimer: TrustLocalizedString;
  version: "0.1";
};
