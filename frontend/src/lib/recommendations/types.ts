import type { Locale } from "@/lib/i18n";

/** Audience / priority lenses — reusable across compare, earn, protocol, and offer pages. */
export type RecommendationLens =
  | "best_for_beginners"
  | "most_trusted"
  | "highest_yield"
  | "best_risk_reward"
  | "conservative_choice"
  | "advanced_choice";

/** Normalized option in a decision set — built from compare rows, opportunities, or offers. */
export type RecommendationCandidate = {
  id: string;
  label: string;
  href: string;
  apy: number | null;
  trustScore: number | null;
  riskTier: string | null;
  protocolName?: string;
  productType?: string;
};

/** One lens-applied pick with conditional framing — not a financial recommendation. */
export type RecommendationPick = {
  lens: RecommendationLens;
  lensLabel: string;
  targetLabel: string;
  targetHref: string;
  reason: string;
  apy?: number | null;
  trustScore?: number | null;
};

/** Page-level decision-support payload for the RecommendationLayer component. */
export type RecommendationLayerModel = {
  decisionContext: string;
  picks: RecommendationPick[];
  disclaimer: string;
};

export type RecommendationPageContext =
  | "compare_protocol"
  | "compare_yield"
  | "earn_asset"
  | "offers_catalog"
  | "offer_detail"
  | "protocol_detail";

export type LocalizedRecommendationCopy = Record<Locale, string>;
