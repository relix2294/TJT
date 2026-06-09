import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/seo/urls";
import type { ChainSlug, EarnAssetSlug } from "@/lib/earn/types";

/** Earn hub: `/{lang}/earn`. */
export function earnHubPath(lang: Locale): string {
  return localePath(lang, "/earn");
}

/** Asset hub: `/{lang}/earn/{asset}`. */
export function earnAssetPath(lang: Locale, asset: EarnAssetSlug): string {
  return localePath(lang, `/earn/${asset}`);
}

/**
 * Future chain-scoped earn page: `/{lang}/earn/{asset}/{chain}`.
 * Route segment not implemented yet — path helper ready for sitemap/metadata.
 */
export function earnAssetChainPath(
  lang: Locale,
  asset: EarnAssetSlug,
  chain: ChainSlug,
): string {
  return localePath(lang, `/earn/${asset}/${chain}`);
}

/** Future compare page placeholder: `/{lang}/compare/{slug}`. */
export function comparePath(lang: Locale, slug: string): string {
  return localePath(lang, `/compare/${slug}`);
}
