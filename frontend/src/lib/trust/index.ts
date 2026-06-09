export {
  TRUST_CATEGORY_LABELS,
  TRUST_FACTOR_LABELS,
  TRUST_FACTOR_WEIGHTS,
  TRUST_SCORE_DISCLAIMER,
  SEO_PILOT_TRUST_SLUG_MAP,
  buildTrustFactor,
  buildTrustSeoProse,
  computeCompositeScore,
  resolveTrustSlugFromSeoPilot,
  scoreToCategory,
} from "@/lib/trust/trust-score";

export {
  TRUST_PROTOCOL_REGISTRY,
  TRUST_PROTOCOL_SLUGS,
  getTrustProfile,
  getTrustProfileOrNull,
  isTrustProtocolSlug,
} from "@/lib/trust/trust-registry";

export {
  getProtocolTrustForDisplay,
  trustProfileToCompareBadge,
} from "@/lib/trust/resolve";

export type {
  CompareTrustBadge,
  ProtocolTrustDisplay,
} from "@/lib/trust/resolve";

export type {
  ProtocolTrustProfile,
  TrustCategory,
  TrustDataStatus,
  TrustFactor,
  TrustFactorKey,
  TrustLocalizedString,
  TrustProtocolSlug,
} from "@/lib/trust/trust-types";
