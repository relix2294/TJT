import type { Asset, YieldOpportunity } from "@/lib/earn/types";
import { EARN_PROTOCOLS, getTopApyForAsset } from "@/lib/earn/registry";
import { PROTOCOL_CATEGORIES } from "@/lib/trust-score/protocol-categories";
import {
  computeEarnAssetTrustScore,
  computeProtocolTrustScore,
} from "@/lib/trust-score/scoring";
import type { TrustScore } from "@/lib/trust-score/types";

/** Compute asset-level Trust Score from live yield opportunities. */
export function buildEarnAssetTrustScore(
  asset: Asset,
  opportunities: YieldOpportunity[],
): TrustScore {
  const assetOpportunities = opportunities.filter(
    (o) => o.assetSlug === asset.slug,
  );
  const protocolSlugs = [
    ...new Set(assetOpportunities.map((o) => o.protocolSlug)),
  ];

  const protocolScores = protocolSlugs.flatMap((slug) => {
    const seed = EARN_PROTOCOLS.find((p) => p.slug === slug);
    if (!seed) return [];

    const topApy =
      assetOpportunities
        .filter((o) => o.protocolSlug === slug)
        .sort((a, b) => b.apy - a.apy)[0]?.apy ?? null;

    const categorySlug = PROTOCOL_CATEGORIES[slug] ?? "vault";

    return [
      computeProtocolTrustScore({
        entityType: "protocol",
        slug,
        name: seed.name,
        categorySlug,
        riskTier: seed.riskTier,
        topApy,
      }),
    ];
  });

  return computeEarnAssetTrustScore({
    entityType: "earn_asset",
    slug: asset.slug,
    symbol: asset.symbol,
    category: asset.category,
    topApy: getTopApyForAsset(assetOpportunities, asset.slug),
    protocolScores,
  });
}
