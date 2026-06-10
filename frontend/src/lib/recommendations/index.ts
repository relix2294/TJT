export type {
  RecommendationCandidate,
  RecommendationLayerModel,
  RecommendationLens,
  RecommendationPageContext,
  RecommendationPick,
} from "@/lib/recommendations/types";
export {
  LENS_LABELS,
  LAYER_TITLE,
  RECOMMENDATION_DISCLAIMER,
  lensLabel,
} from "@/lib/recommendations/labels";
export {
  candidatesFromOffers,
  candidatesFromOpportunities,
  candidatesFromProtocolSides,
  candidatesFromYieldRows,
} from "@/lib/recommendations/candidates";
export { applyRecommendationLenses } from "@/lib/recommendations/scoring";
export {
  buildCompareRecommendations,
  buildEarnAssetRecommendations,
  buildOfferDetailRecommendations,
  buildOffersCatalogRecommendations,
} from "@/lib/recommendations/resolvers";
