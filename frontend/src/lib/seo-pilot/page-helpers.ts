import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";
import { generatePageMetadata } from "@/lib/seo";
import {
  getSeoPilotPage,
  getSeoPilotSlugsForHub,
  isSeoPilotSlugForHub,
  resolvePilotLocalized,
  seoPilotMetadataPath,
  type SeoPilotHubSegment,
  type SeoPilotPage,
} from "@/lib/seo-pilot";

export function buildSeoPilotStaticParams(hubSegment: SeoPilotHubSegment) {
  const slugs = getSeoPilotSlugsForHub(hubSegment);
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export function buildSeoPilotMetadata(
  lang: string,
  hubSegment: SeoPilotHubSegment,
  slug: string,
): Metadata {
  if (!LOCALES.includes(lang as Locale) || !isSeoPilotSlugForHub(hubSegment, slug)) {
    return {};
  }

  const page = getSeoPilotPage(slug);
  if (!page || page.hubSegment !== hubSegment) return {};

  return buildMetadataForPage(lang as Locale, page);
}

export function buildMetadataForPage(lang: Locale, page: SeoPilotPage): Metadata {
  const path = seoPilotMetadataPath(lang, page);
  return generatePageMetadata({
    lang,
    path,
    title: resolvePilotLocalized(page.metaTitle, lang),
    description: resolvePilotLocalized(page.metaDescription, lang),
    keywords: page.keywords,
    ogType: "article",
    ogImageAlt: resolvePilotLocalized(page.h1, lang),
    xDefault: true,
  });
}
