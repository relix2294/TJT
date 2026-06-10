export type { ProductNextStepAction, ProductStepKind } from "@/lib/product-connectivity/types";
export {
  PROTOCOL_SEO_SLUGS,
  protocolHubPath,
  protocolReviewPath,
  protocolSafetyPath,
  resolveProtocolSlugFromOfferName,
} from "@/lib/product-connectivity/protocol-seo-map";
export {
  buildCompareHubNextSteps,
  buildComparePageNextSteps,
  buildEarnAssetNextSteps,
  buildEarnHubNextSteps,
  buildOfferNextSteps,
  buildSeoPilotHubNextSteps,
  buildSeoPilotPageNextSteps,
  dedupeNextSteps,
} from "@/lib/product-connectivity/resolvers";
