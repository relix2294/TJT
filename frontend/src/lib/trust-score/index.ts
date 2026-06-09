export {
  TRUST_SCORE_DISCLAIMER,
  TRUST_SCORE_FACTOR_LABELS,
  TRUST_SCORE_FACTOR_WEIGHTS,
} from "@/lib/trust-score/factors";

export {
  PROTOCOL_PLACEHOLDER_PROFILES,
  getProtocolPlaceholderProfile,
} from "@/lib/trust-score/placeholders";

export { buildEarnAssetTrustScore } from "@/lib/trust-score/earn-helpers";

export {
  computeEarnAssetTrustScore,
  computeProtocolTrustScore,
  scoreToGrade,
} from "@/lib/trust-score/scoring";

export type {
  EarnAssetTrustScoreInput,
  LocalizedString as TrustScoreLocalizedString,
  TrustScore,
  TrustScoreExplanation,
  TrustScoreFactor,
  TrustScoreFactorKey,
  TrustScoreFactorStatus,
  TrustScoreGrade,
  TrustScoreInput,
} from "@/lib/trust-score/types";
