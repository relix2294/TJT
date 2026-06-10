import type { Locale } from "@/lib/i18n";
import type { RecommendationLens } from "@/lib/recommendations/types";

export const LENS_LABELS: Record<
  RecommendationLens,
  Record<Locale, string>
> = {
  best_for_beginners: {
    en: "Best for beginners",
    ru: "Для новичков",
  },
  most_trusted: {
    en: "Most trusted",
    ru: "Наиболее надёжный",
  },
  highest_yield: {
    en: "Highest yield",
    ru: "Максимальный yield",
  },
  best_risk_reward: {
    en: "Best risk/reward",
    ru: "Лучший risk/reward",
  },
  conservative_choice: {
    en: "Conservative choice",
    ru: "Консервативный выбор",
  },
  advanced_choice: {
    en: "Advanced choice",
    ru: "Для опытных",
  },
};

export const RECOMMENDATION_DISCLAIMER: Record<Locale, string> = {
  en: "Contextual framing for independent research — not financial advice or a product recommendation.",
  ru: "Контекст для самостоятельного исследования — не финансовый совет и не рекомендация продукта.",
};

export const LAYER_TITLE: Record<Locale, string> = {
  en: "If your priority is…",
  ru: "Если ваш приоритет — …",
};

export function lensLabel(lens: RecommendationLens, lang: Locale): string {
  return LENS_LABELS[lens][lang];
}
