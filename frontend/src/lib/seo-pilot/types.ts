import type { Locale } from "@/lib/i18n";

export type LocalizedString = Record<Locale, string>;

export type SeoPilotHubSegment = "reviews" | "safety" | "learn" | "earn";

export type SeoPilotPageType = "review" | "safety" | "learn" | "earn_guide";

export const REVIEW_SLUGS = [
  "aave-review",
  "lido-review",
  "jito-review",
] as const;

export const SAFETY_SLUGS = [
  "is-aave-safe",
  "is-lido-safe",
  "is-jito-safe",
] as const;

export const LEARN_SLUGS = [
  "what-is-defi-yield",
  "what-is-liquid-staking",
  "crypto-yield-risks",
] as const;

export const EARN_GUIDE_SLUGS = ["how-to-compare-usdt-yield"] as const;

export const SEO_PILOT_SLUGS = [
  ...REVIEW_SLUGS,
  ...SAFETY_SLUGS,
  ...LEARN_SLUGS,
  ...EARN_GUIDE_SLUGS,
] as const;

export type ReviewSlug = (typeof REVIEW_SLUGS)[number];
export type SafetySlug = (typeof SAFETY_SLUGS)[number];
export type LearnSlug = (typeof LEARN_SLUGS)[number];
export type EarnGuideSlug = (typeof EARN_GUIDE_SLUGS)[number];
export type SeoPilotSlug = (typeof SEO_PILOT_SLUGS)[number];

export type SeoPilotSection = {
  key: string;
  title: LocalizedString;
  body: LocalizedString;
};

export type SeoPilotFaqItem = {
  question: LocalizedString;
  answer: LocalizedString;
};

export type SeoPilotRelatedLink = {
  href: (lang: Locale) => string;
  label: LocalizedString;
  type: "compare" | "offers" | "market" | "protocols" | "earn" | "learn" | "safety" | "reviews";
};

export type SeoPilotPage = {
  slug: SeoPilotSlug;
  type: SeoPilotPageType;
  hubSegment: SeoPilotHubSegment;
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  h1: LocalizedString;
  eyebrow: LocalizedString;
  intro: LocalizedString;
  sections: SeoPilotSection[];
  faq: SeoPilotFaqItem[];
  relatedLinks: SeoPilotRelatedLink[];
  ctaHref: (lang: Locale) => string;
  keywords: string[];
};

export function L(en: string, ru: string): LocalizedString {
  return { en, ru };
}

export function resolvePilotLocalized(
  value: LocalizedString,
  lang: Locale,
): string {
  return value[lang];
}

export function isReviewSlug(value: string): value is ReviewSlug {
  return (REVIEW_SLUGS as readonly string[]).includes(value);
}

export function isSafetySlug(value: string): value is SafetySlug {
  return (SAFETY_SLUGS as readonly string[]).includes(value);
}

export function isLearnSlug(value: string): value is LearnSlug {
  return (LEARN_SLUGS as readonly string[]).includes(value);
}

export function isEarnGuideSlug(value: string): value is EarnGuideSlug {
  return (EARN_GUIDE_SLUGS as readonly string[]).includes(value);
}

export function isSeoPilotSlug(value: string): value is SeoPilotSlug {
  return (SEO_PILOT_SLUGS as readonly string[]).includes(value);
}
