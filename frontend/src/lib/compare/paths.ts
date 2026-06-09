import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/seo/urls";
import type { CompareSlug } from "@/lib/compare/types";

/** Compare hub: `/{lang}/compare`. */
export function compareHubPath(lang: Locale): string {
  return localePath(lang, "/compare");
}

/** Compare detail page: `/{lang}/compare/{slug}`. */
export function compareDetailPath(lang: Locale, slug: CompareSlug | string): string {
  return localePath(lang, `/compare/${slug}`);
}
