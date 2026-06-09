import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/seo/urls";
import type { ProtocolSlug } from "@/lib/protocols/types";

/** Protocols hub: `/{lang}/protocols`. */
export function protocolsHubPath(lang: Locale): string {
  return localePath(lang, "/protocols");
}

/** Protocol review page: `/{lang}/protocols/{slug}`. */
export function protocolDetailPath(lang: Locale, slug: ProtocolSlug): string {
  return localePath(lang, `/protocols/${slug}`);
}

/** Future compare page: `/{lang}/compare/{slug}` — reserved, not implemented. */
export function protocolComparePath(lang: Locale, slug: string): string {
  return localePath(lang, `/compare/${slug}`);
}
