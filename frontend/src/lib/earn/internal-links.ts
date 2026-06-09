import type { CpaOffer } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { detailPath, hubPath, localePath } from "@/lib/seo/urls";
import type { Asset, EarnAssetSlug, YieldOpportunity } from "@/lib/earn/types";
import { earnAssetPath, earnHubPath } from "@/lib/earn/paths";
import { EARN_ASSETS } from "@/lib/earn/registry";
import type { InternalLink } from "@/lib/seo/internal-links";

/** Cross-links between earn asset hub pages. */
export function getRelatedEarnAssetLinks(
  lang: Locale,
  currentAsset: EarnAssetSlug,
  limit = 3,
): InternalLink[] {
  return EARN_ASSETS.filter((a) => a.slug !== currentAsset)
    .slice(0, limit)
    .map((asset) => ({
      href: earnAssetPath(lang, asset.slug),
      label: `${asset.symbol} Earn`,
      type: "earn" as const,
      slug: asset.slug,
      priority: 0.75,
    }));
}

/** Live CPA offers mapped to an earn asset page. */
export function getEarnOfferLinks(
  lang: Locale,
  opportunities: YieldOpportunity[],
  limit = 4,
): InternalLink[] {
  return opportunities
    .filter((o) => o.offerSlug)
    .slice(0, limit)
    .map((o) => ({
      href: detailPath(lang, "protocols", o.offerSlug!),
      label: o.offerSlug!.replace(/-/g, " "),
      type: "protocols" as const,
      slug: o.offerSlug,
      priority: 0.8,
    }));
}

/** Hub + sibling asset links for earn pages. */
export function getEarnHubLinkGraph(
  lang: Locale,
  currentPath: string,
): InternalLink[] {
  const links: InternalLink[] = [
    {
      href: earnHubPath(lang),
      label: "Earn",
      type: "earn",
      priority: 0.9,
    },
    {
      href: hubPath(lang, "coins"),
      label: "Market",
      type: "coins",
      priority: 0.85,
    },
    {
      href: localePath(lang, "/offers"),
      label: "Yield catalog",
      type: "protocols",
      priority: 0.8,
    },
    {
      href: hubPath(lang, "news"),
      label: "News",
      type: "news",
      priority: 0.7,
    },
  ];

  for (const asset of EARN_ASSETS) {
    const href = earnAssetPath(lang, asset.slug);
    if (href === currentPath) continue;
    links.push({
      href,
      label: `${asset.symbol} Earn`,
      type: "earn",
      slug: asset.slug,
      priority: 0.75,
    });
  }

  return links;
}

/** Market coin links for an earn asset (symbol match). */
export function getEarnToMarketLinks(
  lang: Locale,
  asset: Asset,
  marketSlugs: { slug: string; symbol: string; name: string }[],
): InternalLink[] {
  const sym = asset.symbol.toUpperCase();
  const match = marketSlugs.find((m) => m.symbol.toUpperCase() === sym);
  if (!match) return [];

  return [
    {
      href: detailPath(lang, "coins", match.slug),
      label: `${match.name} (${match.symbol})`,
      type: "coins",
      slug: match.slug,
      priority: 0.7,
    },
  ];
}

/** Future compare deep-links — structure only, no compare pages yet. */
export function getEarnComparePlaceholderLinks(
  _lang: Locale,
  _asset: Asset,
): InternalLink[] {
  return [];
}

/** Filter offers relevant to an asset for sidebar cards. */
export function filterOffersForAsset(
  offers: CpaOffer[],
  asset: Asset,
): CpaOffer[] {
  const sym = asset.symbol.toUpperCase();
  return offers
    .filter(
      (o) =>
        o.name.toUpperCase().includes(sym) ||
        o.network.toUpperCase().includes(sym) ||
        (sym === "ETH" && o.network.toLowerCase() === "ethereum") ||
        (sym === "SOL" && o.network.toLowerCase() === "solana"),
    )
    .sort((a, b) => b.apy - a.apy);
}
