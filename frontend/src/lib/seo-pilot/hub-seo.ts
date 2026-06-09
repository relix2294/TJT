import { SITE } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  type BreadcrumbItem,
} from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/urls";
import type { SeoPilotHubCopy } from "@/lib/seo-pilot/hub-content";
import {
  resolvePilotLocalized,
  seoPilotDetailPath,
  seoPilotHubPath,
  type SeoPilotHubSegment,
  type SeoPilotPage,
} from "@/lib/seo-pilot";

type JsonLd = Record<string, unknown>;

export function seoPilotHubMetadataPath(
  lang: Locale,
  hubSegment: Exclude<SeoPilotHubSegment, "earn">,
): string {
  return seoPilotHubPath(lang, hubSegment);
}

export function buildSeoPilotHubJsonLd(input: {
  lang: Locale;
  hubSegment: Exclude<SeoPilotHubSegment, "earn">;
  copy: SeoPilotHubCopy;
  pages: SeoPilotPage[];
  breadcrumbs: BreadcrumbItem[];
}): JsonLd[] {
  const path = seoPilotHubPath(input.lang, input.hubSegment);
  const title = resolvePilotLocalized(input.copy.metaTitle, input.lang);
  const description = resolvePilotLocalized(input.copy.metaDescription, input.lang);

  const faq = input.copy.faq.map((item) => ({
    question: resolvePilotLocalized(item.question, input.lang),
    answer: resolvePilotLocalized(item.answer, input.lang),
  }));

  return [
    buildBreadcrumbList(input.breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: absoluteUrl(path),
      inLanguage: input.lang,
      isPartOf: {
        "@type": "WebSite",
        name: SITE.name,
        url: absoluteUrl(`/${input.lang}`),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: resolvePilotLocalized(input.copy.gridTitle, input.lang),
      numberOfItems: input.pages.length,
      itemListElement: input.pages.map((page, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: resolvePilotLocalized(page.h1, input.lang),
        url: absoluteUrl(seoPilotDetailPath(input.lang, page.hubSegment, page.slug)),
      })),
    },
    ...(faq.length ? [buildFaqPageSchema(faq)] : []),
  ];
}
