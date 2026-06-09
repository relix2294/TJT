import type { Locale } from "@/lib/i18n";
import type { SeoPilotHubSegment, SeoPilotPage } from "@/lib/seo-pilot/types";

export function seoPilotDetailPath(
  lang: Locale,
  hubSegment: SeoPilotHubSegment,
  slug: string,
): string {
  return `/${lang}/${hubSegment}/${slug}`;
}

export function seoPilotMetadataPath(lang: Locale, page: SeoPilotPage): string {
  return seoPilotDetailPath(lang, page.hubSegment, page.slug);
}

export const SEO_PILOT_HUB_LABELS = {
  reviews: { en: "Reviews", ru: "Обзоры" },
  safety: { en: "Safety", ru: "Безопасность" },
  learn: { en: "Learn", ru: "Обучение" },
  earn: { en: "Earn", ru: "Earn" },
} as const;
