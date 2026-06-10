import { getTrustProfileOrNull } from "@/lib/trust/trust-registry";
import type {
  ProtocolTrustProfile,
  TrustDataStatus,
  TrustLocalizedString,
  TrustProtocolSlug,
} from "@/lib/trust/trust-types";
import {
  computeProtocolTrustScore,
  scoreToGrade,
} from "@/lib/trust-score/scoring";
import type { TrustScore, TrustScoreInput } from "@/lib/trust-score/types";

/** Resolved protocol trust data for display surfaces (compare table, badges). */
export type ProtocolTrustDisplay = {
  slug: TrustProtocolSlug;
  protocolName: string;
  score: number;
  categoryLabel: TrustLocalizedString;
  shortLabel: TrustLocalizedString;
  explanation: TrustLocalizedString;
  dataStatus: TrustDataStatus;
  lastReviewed: string;
};

/** Compact trust badge for compare table cells. */
export type CompareTrustBadge = {
  score: number;
  categoryLabel: TrustLocalizedString;
  shortLabel: TrustLocalizedString;
};

const SHORT_CATEGORY_LABELS: Record<
  ProtocolTrustProfile["category"],
  TrustLocalizedString
> = {
  very_high_trust: { en: "Very High", ru: "Очень высокое" },
  high_trust: { en: "High", ru: "Высокое" },
  moderate_trust: { en: "Moderate", ru: "Умеренное" },
  elevated_risk: { en: "Elevated", ru: "Повышенный" },
  high_risk: { en: "High Risk", ru: "Высокий риск" },
};

/** Map a static profile to a compare-table badge (score + category, no letter grade). */
export function trustProfileToCompareBadge(
  profile: ProtocolTrustProfile,
): CompareTrustBadge {
  return {
    score: profile.score,
    categoryLabel: profile.categoryLabel,
    shortLabel: SHORT_CATEGORY_LABELS[profile.category],
  };
}

/**
 * Resolve canonical static Trust Score v0.1 for display.
 * Returns null when the slug is not in TRUST_PROTOCOL_REGISTRY.
 */
export function getProtocolTrustForDisplay(
  slug: string,
): ProtocolTrustDisplay | null {
  const profile = getTrustProfileOrNull(slug);
  if (!profile) return null;

  const badge = trustProfileToCompareBadge(profile);
  return {
    slug: profile.slug,
    protocolName: profile.protocolName,
    score: profile.score,
    categoryLabel: badge.categoryLabel,
    shortLabel: badge.shortLabel,
    explanation: profile.explanation,
    dataStatus: profile.dataStatus,
    lastReviewed: profile.lastReviewed,
  };
}

/** Canonical numeric Trust Score — prefers static registry profile over dynamic compute. */
export function resolveProtocolTrustScoreValue(
  slug: string,
  fallback?: TrustScoreInput,
): number | null {
  const profile = getTrustProfileOrNull(slug);
  if (profile) return profile.score;
  if (fallback) return computeProtocolTrustScore(fallback).score;
  return null;
}

/** Canonical Trust Score object — prefers static registry profile over dynamic compute. */
export function resolveProtocolTrustScore(
  slug: string,
  fallback?: TrustScoreInput,
): TrustScore | null {
  const profile = getTrustProfileOrNull(slug);
  if (profile) {
    return {
      score: profile.score,
      grade: scoreToGrade(profile.score),
      version: profile.version,
      explanation: {
        short: profile.explanation,
        detailed: profile.explanation,
      },
      factors: [],
      disclaimer: profile.disclaimer,
      computedAt: profile.lastReviewed,
    };
  }
  if (fallback) return computeProtocolTrustScore(fallback);
  return null;
}
