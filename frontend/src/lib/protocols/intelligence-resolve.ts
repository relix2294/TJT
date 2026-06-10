import { getCompareSlugTitle } from "@/lib/compare/content";
import { compareDetailPath } from "@/lib/compare/paths";
import type { Locale } from "@/lib/i18n";
import { detailPath } from "@/lib/seo/urls";
import {
  TVL_TIER_LABELS,
  getProtocolIntelligenceSeed,
} from "@/lib/protocols/intelligence";
import type {
  ProtocolTrustBreakdownComponent,
  ResolvedProtocolIntelligence,
} from "@/lib/protocols/intelligence-types";
import { resolveIntelligenceString } from "@/lib/protocols/intelligence-types";
import { protocolSafetyPath } from "@/lib/product-connectivity/protocol-seo-map";
import { localePath } from "@/lib/seo/urls";
import { protocolDetailPath } from "@/lib/protocols/paths";
import type { Protocol } from "@/lib/protocols/types";
import { resolveProtocolLocalized } from "@/lib/protocols/types";
import type { ProtocolTrustProfile } from "@/lib/trust";

const RISK_TYPE_LABELS = {
  smart_contract: { en: "Smart contract risk", ru: "Риск смарт-контрактов" },
  governance: { en: "Governance risk", ru: "Риск governance" },
  liquidity: { en: "Liquidity risk", ru: "Риск ликвидности" },
  depeg: { en: "Depeg risk", ru: "Риск depeg" },
  validator: { en: "Validator risk", ru: "Риск валидаторов" },
} as const;

const SEVERITY_LABELS = {
  low: { en: "Low", ru: "Низкий" },
  medium: { en: "Medium", ru: "Средний" },
  high: { en: "High", ru: "Высокий" },
} as const;

const BREAKDOWN_LABELS: Record<
  ProtocolTrustBreakdownComponent["key"],
  ProtocolTrustBreakdownComponent["label"]
> = {
  audits: { en: "Audits", ru: "Аудиты" },
  tvl_stability: { en: "TVL Stability", ru: "Стабильность TVL" },
  track_record: { en: "Track Record", ru: "История" },
  liquidity: { en: "Liquidity", ru: "Ликвидность" },
  governance: { en: "Governance", ru: "Governance" },
};

function factorScore(
  profile: ProtocolTrustProfile,
  key: ProtocolTrustProfile["factors"][number]["key"],
): number {
  return profile.factors.find((f) => f.key === key)?.score ?? 0;
}

function factorNote(
  profile: ProtocolTrustProfile,
  key: ProtocolTrustProfile["factors"][number]["key"],
  lang: Locale,
): string {
  const factor = profile.factors.find((f) => f.key === key);
  return factor ? factor.note[lang] : "";
}

/** Map canonical Trust Score v0.1 factors to decision-support breakdown components. */
export function buildTrustBreakdownFromProfile(
  profile: ProtocolTrustProfile,
  lang: Locale,
): ResolvedProtocolIntelligence["trustBreakdown"] {
  const audits = factorScore(profile, "audits");
  const tvl = factorScore(profile, "tvl");
  const protocolAge = factorScore(profile, "protocol_age");
  const exploitHistory = factorScore(profile, "exploit_history");
  const liquidity = factorScore(profile, "liquidity");
  const adoption = factorScore(profile, "protocol_adoption");
  const documentation = factorScore(profile, "documentation_quality");

  const trackRecord = Math.round((protocolAge + exploitHistory) / 2);
  const governance = Math.round((adoption + documentation) / 2);

  const components: Array<{
    key: ProtocolTrustBreakdownComponent["key"];
    score: number;
    rationaleKey: ProtocolTrustProfile["factors"][number]["key"];
    fallbackRationaleKey?: ProtocolTrustProfile["factors"][number]["key"];
  }> = [
    { key: "audits", score: audits, rationaleKey: "audits" },
    { key: "tvl_stability", score: tvl, rationaleKey: "tvl" },
    {
      key: "track_record",
      score: trackRecord,
      rationaleKey: "protocol_age",
      fallbackRationaleKey: "exploit_history",
    },
    { key: "liquidity", score: liquidity, rationaleKey: "liquidity" },
    {
      key: "governance",
      score: governance,
      rationaleKey: "protocol_adoption",
      fallbackRationaleKey: "documentation_quality",
    },
  ];

  return components.map(({ key, score, rationaleKey, fallbackRationaleKey }) => {
    const primary = factorNote(profile, rationaleKey, lang);
    const fallback = fallbackRationaleKey
      ? factorNote(profile, fallbackRationaleKey, lang)
      : "";
    return {
      key,
      label: BREAKDOWN_LABELS[key][lang],
      score,
      rationale: primary || fallback,
    };
  });
}

function resolveRelatedOpportunities(
  protocol: Protocol,
  lang: Locale,
  opportunitySlugs: string[],
): ResolvedProtocolIntelligence["relatedOpportunities"] {
  if (opportunitySlugs.length > 0) {
    const slugSet = new Set(opportunitySlugs);
    const fromOffers = protocol.linkedOffers
      .filter((offer) => slugSet.has(offer.slug))
      .map((offer) => ({
        slug: offer.slug,
        label: offer.name,
        apy: offer.apy,
        href: offer.offerPath,
        type: "offer" as const,
      }));
    if (fromOffers.length > 0) return fromOffers;
  }

  return protocol.earnOpportunities.slice(0, 4).map((opp) => ({
    slug: opp.id,
    label: resolveProtocolLocalized(opp.headline, lang),
    apy: opp.apy,
    href: opp.offerSlug
      ? detailPath(lang, "protocols", opp.offerSlug)
      : opp.earnAssetPath,
    type: opp.offerSlug ? ("offer" as const) : ("earn" as const),
  }));
}

export function resolveProtocolIntelligence(
  protocol: Protocol,
  lang: Locale,
  allProtocols: Protocol[],
): ResolvedProtocolIntelligence {
  const seed = getProtocolIntelligenceSeed(protocol.slug);
  const chainList = protocol.supportedChains
    .map((c) => c.name[lang])
    .join(", ");

  const protocolBySlug = new Map(allProtocols.map((p) => [p.slug, p]));

  const alternatives = seed.alternatives
    .map((slug) => protocolBySlug.get(slug))
    .filter((p): p is Protocol => Boolean(p))
    .map((alt) => ({
      slug: alt.slug,
      name: alt.name,
      href: protocolDetailPath(lang, alt.slug),
    }));

  const relatedComparisons = seed.relatedComparisons.map((slug) => ({
    slug,
    label: getCompareSlugTitle(slug)[lang],
    href: compareDetailPath(lang, slug),
  }));

  const relatedOpportunities = resolveRelatedOpportunities(
    protocol,
    lang,
    seed.relatedOpportunitySlugs,
  );

  const firstComparison = relatedComparisons[0];
  const compareHref = firstComparison?.href ?? compareDetailPath(lang, "morpho-vs-aave");
  const safetyHref =
    protocolSafetyPath(lang, protocol.slug) ?? "#protocol-intelligence-risks";
  const opportunityHref =
    relatedOpportunities[0]?.href ??
    localePath(lang, "/offers");

  const trustBreakdown = protocol.trustProfile
    ? buildTrustBreakdownFromProfile(protocol.trustProfile, lang)
    : [];

  return {
    keyFacts: {
      category: resolveProtocolLocalized(protocol.category.name, lang),
      launchYear: seed.keyFacts.launchYear,
      chains: chainList || (lang === "ru" ? "См. каталог" : "See catalog"),
      tvlTier: TVL_TIER_LABELS[seed.keyFacts.tvlTier][lang],
      primaryUseCase: resolveIntelligenceString(seed.keyFacts.primaryUseCase, lang),
    },
    whyUsersChoose: seed.whyUsersChoose.map((item) =>
      resolveIntelligenceString(item, lang),
    ),
    mainRisks: seed.mainRisks.map((risk) => ({
      type: risk.type,
      typeLabel: RISK_TYPE_LABELS[risk.type][lang],
      severity: risk.severity,
      severityLabel: SEVERITY_LABELS[risk.severity][lang],
      description: resolveIntelligenceString(risk.description, lang),
    })),
    bestFor: seed.bestFor.map((item) => resolveIntelligenceString(item, lang)),
    notIdealFor: seed.notIdealFor.map((item) =>
      resolveIntelligenceString(item, lang),
    ),
    trustBreakdown,
    compositeScore: protocol.trustProfile?.score ?? protocol.trustScore.score,
    alternatives,
    relatedComparisons,
    relatedOpportunities,
    suggestedNextStep: {
      compareAlternatives: {
        label:
          lang === "ru" ? "Сравнить альтернативы" : "Compare alternatives",
        href: compareHref,
      },
      reviewRisks: {
        label: lang === "ru" ? "Изучить риски" : "Review risks",
        href: safetyHref,
      },
      viewOpportunities: {
        label:
          lang === "ru" ? "Смотреть возможности" : "View opportunities",
        href: opportunityHref,
      },
    },
  };
}
