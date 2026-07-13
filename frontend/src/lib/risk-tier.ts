/**
 * Neutral, non-credit-agency risk tiers for CPA offers.
 *
 * The product previously labeled offers with S&P/Moody's-style letter grades
 * ("AAA"/"AA"/"A"), which mimic regulated credit-rating terminology and imply
 * a safety guarantee TJT cannot make. This module replaces them with plain,
 * localized descriptive tiers and keeps backward compatibility with any legacy
 * letter codes still present in stored data.
 */

import type { Locale } from "@/lib/i18n";

export type RiskTier = "lower" | "medium" | "higher";

const TIER_LABELS: Record<RiskTier, Record<Locale, string>> = {
  lower: { en: "Lower risk", ru: "Ниже риск" },
  medium: { en: "Medium risk", ru: "Средний риск" },
  higher: { en: "Higher risk", ru: "Выше риск" },
};

/** Coarse "review score" retained for display continuity (not a guarantee). */
const TIER_SCORE: Record<RiskTier, string> = {
  lower: "4.9",
  medium: "4.7",
  higher: "4.5",
};

/**
 * Coerce any stored value (new tier code or legacy letter grade) into a tier.
 * Legacy mapping: AAA → lower, AA → medium, A → higher. Unknown → medium.
 */
export function normalizeRiskTier(raw: string | null | undefined): RiskTier {
  if (!raw) return "medium";
  const value = raw.trim();
  if (value === "lower" || value === "medium" || value === "higher") {
    return value;
  }
  const upper = value.toUpperCase();
  if (upper.startsWith("AAA")) return "lower";
  if (upper.startsWith("AA")) return "medium";
  if (upper.startsWith("A")) return "higher";
  return "medium";
}

/** Localized human-readable label for an offer's risk tier. */
export function riskTierLabel(
  raw: string | null | undefined,
  lang: Locale,
): string {
  return TIER_LABELS[normalizeRiskTier(raw)][lang];
}

/** Coarse out-of-5 score kept for legacy star displays. */
export function riskTierScore(raw: string | null | undefined): string {
  return TIER_SCORE[normalizeRiskTier(raw)];
}
