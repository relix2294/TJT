import type { CpaOffer } from "@/lib/config";
import type {
  ProtocolComparisonSide,
  YieldComparisonRow,
} from "@/lib/compare/types";
import { EARN_PROTOCOLS } from "@/lib/earn/registry";
import type { YieldOpportunity } from "@/lib/earn/types";
import { resolveLocalized } from "@/lib/earn/types";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/seo/urls";
import { resolveProtocolTrustScoreValue } from "@/lib/trust";
import { PROTOCOL_CATEGORIES } from "@/lib/trust-score/protocol-categories";
import { resolveProtocolSlugFromOfferName } from "@/lib/product-connectivity/protocol-seo-map";
import type { RecommendationCandidate } from "@/lib/recommendations/types";

function protocolRiskTier(protocolSlug: string): string | null {
  return EARN_PROTOCOLS.find((p) => p.slug === protocolSlug)?.riskTier ?? null;
}

function protocolTrustScore(
  protocolSlug: string,
  apy: number | null,
): number | null {
  const seed = EARN_PROTOCOLS.find((p) => p.slug === protocolSlug);
  if (!seed) return null;
  const categorySlug = PROTOCOL_CATEGORIES[protocolSlug] ?? "vault";
  return resolveProtocolTrustScoreValue(protocolSlug, {
    entityType: "protocol",
    slug: protocolSlug,
    name: seed.name,
    categorySlug,
    riskTier: seed.riskTier,
    topApy: apy,
  });
}

function trustFromSide(
  side: ProtocolComparisonSide | YieldComparisonRow,
): number | null {
  return side.trustProfile?.score ?? side.trustScore.score ?? null;
}

export function candidatesFromYieldRows(
  rows: YieldComparisonRow[],
  lang: Locale,
): RecommendationCandidate[] {
  return rows.map((row) => ({
    id: row.id,
    label: row.protocolName,
    href: row.offerPath ?? row.protocolPath,
    apy: row.apy,
    trustScore: trustFromSide(row),
    riskTier: protocolRiskTier(row.protocolSlug),
    protocolName: row.protocolName,
    productType: undefined,
  }));
}

export function candidatesFromProtocolSides(
  left: ProtocolComparisonSide,
  right: ProtocolComparisonSide,
): RecommendationCandidate[] {
  return [left, right].map((side) => ({
    id: side.protocolSlug,
    label: side.name,
    href: side.protocolPath,
    apy: side.apy,
    trustScore: trustFromSide(side),
    riskTier: protocolRiskTier(side.protocolSlug),
    protocolName: side.name,
    productType: undefined,
  }));
}

export function candidatesFromOpportunities(
  opportunities: YieldOpportunity[],
  lang: Locale,
): RecommendationCandidate[] {
  return opportunities.map((opp) => ({
    id: opp.id,
    label: resolveLocalized(opp.headline, lang),
    href: opp.offerSlug
      ? localePath(lang, `/offers/${opp.offerSlug}`)
      : localePath(lang, `/protocols/${opp.protocolSlug}`),
    apy: opp.apy,
    trustScore: protocolTrustScore(opp.protocolSlug, opp.apy),
    riskTier: protocolRiskTier(opp.protocolSlug),
    protocolName: EARN_PROTOCOLS.find((p) => p.slug === opp.protocolSlug)?.name,
    productType: opp.type,
  }));
}

export function candidatesFromOffers(
  offers: CpaOffer[],
  lang: Locale,
  excludeSlug?: string,
): RecommendationCandidate[] {
  return offers
    .filter((o) => o.slug !== excludeSlug)
    .map((offer) => {
      const protocolSlug =
        resolveProtocolSlugFromOfferName(offer.protocol) ??
        offer.protocol.toLowerCase().replace(/\s+/g, "-");
      return {
        id: offer.slug,
        label: offer.name,
        href: localePath(lang, `/offers/${offer.slug}`),
        apy: offer.apy,
        trustScore: protocolTrustScore(protocolSlug, offer.apy),
        riskTier: offer.riskRating,
        protocolName: offer.protocol,
        productType: undefined,
      };
    });
}
