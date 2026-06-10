import type { CpaOffer } from "@/lib/config";
import type { ComparePage } from "@/lib/compare/types";
import { isProtocolComparison, isYieldComparison } from "@/lib/compare/types";
import type { Asset, YieldOpportunity } from "@/lib/earn/types";
import type { Locale } from "@/lib/i18n";
import {
  candidatesFromOffers,
  candidatesFromOpportunities,
  candidatesFromProtocolSides,
  candidatesFromYieldRows,
} from "@/lib/recommendations/candidates";
import { RECOMMENDATION_DISCLAIMER } from "@/lib/recommendations/labels";
import { applyRecommendationLenses } from "@/lib/recommendations/scoring";
import type {
  RecommendationLayerModel,
  RecommendationLens,
} from "@/lib/recommendations/types";

const YIELD_LENSES: RecommendationLens[] = [
  "highest_yield",
  "most_trusted",
  "conservative_choice",
  "best_for_beginners",
];

const PROTOCOL_COMPARE_LENSES: RecommendationLens[] = [
  "conservative_choice",
  "highest_yield",
  "most_trusted",
];

const EARN_LENSES: RecommendationLens[] = [
  "best_for_beginners",
  "highest_yield",
  "most_trusted",
  "best_risk_reward",
];

const OFFERS_CATALOG_LENSES: RecommendationLens[] = [
  "highest_yield",
  "conservative_choice",
  "best_for_beginners",
];

const OFFER_DETAIL_LENSES: RecommendationLens[] = [
  "highest_yield",
  "conservative_choice",
  "best_risk_reward",
];

function buildModel(
  lang: Locale,
  decisionContext: string,
  candidates: ReturnType<typeof candidatesFromYieldRows>,
  lenses: RecommendationLens[],
): RecommendationLayerModel | null {
  const picks = applyRecommendationLenses(candidates, lenses, lang);
  if (!picks.length) return null;

  return {
    decisionContext,
    picks: picks.slice(0, 4),
    disclaimer: RECOMMENDATION_DISCLAIMER[lang],
  };
}

/** Compare detail — protocol-vs-protocol or best-yield tables. */
export function buildCompareRecommendations(
  lang: Locale,
  page: ComparePage,
): RecommendationLayerModel | null {
  if (isProtocolComparison(page.comparison)) {
    const candidates = candidatesFromProtocolSides(
      page.comparison.left,
      page.comparison.right,
    );
    const left = page.comparison.left.name;
    const right = page.comparison.right.name;
    const context =
      lang === "ru"
        ? `Выбор между ${left} и ${right} зависит от приоритета: yield, trust или простота.`
        : `Choosing between ${left} and ${right} depends on whether you prioritize yield, trust, or simplicity.`;

    return buildModel(lang, context, candidates, PROTOCOL_COMPARE_LENSES);
  }

  if (isYieldComparison(page.comparison)) {
    const candidates = candidatesFromYieldRows(page.comparison.rows, lang);
    const symbol = page.comparison.assetSymbol;
    const context =
      lang === "ru"
        ? `Маршруты ${symbol} yield в каталоге — разные профили риска и доходности.`
        : `${symbol} yield routes in the catalog carry different risk and return profiles.`;

    return buildModel(lang, context, candidates, YIELD_LENSES);
  }

  return null;
}

/** Earn asset page — opportunity list decision support. */
export function buildEarnAssetRecommendations(
  lang: Locale,
  asset: Asset,
  opportunities: YieldOpportunity[],
): RecommendationLayerModel | null {
  const candidates = candidatesFromOpportunities(opportunities, lang);
  const context =
    lang === "ru"
      ? `Какой маршрут ${asset.symbol} выбрать — зависит от опыта, аппетита к риску и цели yield.`
      : `Which ${asset.symbol} route fits you depends on experience, risk appetite, and yield goals.`;

  return buildModel(lang, context, candidates, EARN_LENSES);
}

/** Offers catalog — cross-offer framing without implicit sort order. */
export function buildOffersCatalogRecommendations(
  lang: Locale,
  offers: CpaOffer[],
): RecommendationLayerModel | null {
  const candidates = candidatesFromOffers(offers, lang);
  const context =
    lang === "ru"
      ? "Офферы каталога отличаются по APY, risk rating и сложности — выберите линзу под свой профиль."
      : "Catalog offers differ by APY, risk rating, and complexity — match a lens to your profile.";

  return buildModel(lang, context, candidates, OFFERS_CATALOG_LENSES);
}

/** Offer detail — alternatives in the same catalog for comparative context. */
export function buildOfferDetailRecommendations(
  lang: Locale,
  offer: CpaOffer,
  allOffers: CpaOffer[],
): RecommendationLayerModel | null {
  const sameAssetOffers = allOffers.filter((o) => {
    const assetKeys = ["usdt", "usdc", "eth", "sol", "eeth", "susde", "jito"];
    const offerAssets = assetKeys.filter((k) => offer.slug.includes(k));
    if (!offerAssets.length) return true;
    return offerAssets.some((k) => o.slug.includes(k));
  });

  const candidates = candidatesFromOffers(sameAssetOffers, lang, offer.slug);
  if (candidates.length < 2) {
    const fallback = candidatesFromOffers(allOffers, lang, offer.slug);
    if (fallback.length < 2) return null;
    const context =
      lang === "ru"
        ? `Перед депозитом в ${offer.name} сравните альтернативы каталога по приоритету.`
        : `Before depositing into ${offer.name}, compare catalog alternatives by priority.`;
    return buildModel(lang, context, fallback, OFFER_DETAIL_LENSES);
  }

  const context =
    lang === "ru"
      ? `Перед депозитом в ${offer.name} сравните альтернативы по приоритету.`
      : `Before depositing into ${offer.name}, compare alternatives by priority.`;

  return buildModel(lang, context, candidates, OFFER_DETAIL_LENSES);
}
