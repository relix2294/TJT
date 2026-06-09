import type { Locale } from "@/lib/i18n";
import {
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqPageSchema,
  type BreadcrumbItem,
} from "@/lib/seo/json-ld";
import type { SeoPilotPage } from "@/lib/seo-pilot/types";
import { resolvePilotLocalized } from "@/lib/seo-pilot/types";
import { seoPilotMetadataPath } from "@/lib/seo-pilot/paths";

type JsonLd = Record<string, unknown>;

export function buildSeoPilotJsonLd(input: {
  lang: Locale;
  page: SeoPilotPage;
  breadcrumbs: BreadcrumbItem[];
}): JsonLd[] {
  const path = seoPilotMetadataPath(input.lang, input.page);
  const headline = resolvePilotLocalized(input.page.h1, input.lang);
  const description = resolvePilotLocalized(
    input.page.metaDescription,
    input.lang,
  );

  const faq = input.page.faq.map((item) => ({
    question: resolvePilotLocalized(item.question, input.lang),
    answer: resolvePilotLocalized(item.answer, input.lang),
  }));

  return [
    buildBreadcrumbList(input.breadcrumbs),
    buildArticleSchema({
      lang: input.lang,
      path,
      headline,
      description,
      keywords: input.page.keywords,
    }),
    ...(faq.length ? [buildFaqPageSchema(faq)] : []),
  ];
}
