import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/seo/urls";
import type { ProtocolSlug } from "@/lib/protocols/types";
import { protocolDetailPath } from "@/lib/protocols/paths";

/** Maps catalog protocol slugs to SeoPilot review and safety article slugs. */
export const PROTOCOL_SEO_SLUGS: Partial<
  Record<ProtocolSlug, { review?: string; safety?: string }>
> = {
  aave: { review: "aave-review", safety: "is-aave-safe" },
  morpho: { review: "morpho-review", safety: "is-morpho-safe" },
  compound: { review: "compound-review", safety: "is-compound-safe" },
  lido: { review: "lido-review", safety: "is-lido-safe" },
  "rocket-pool": { review: "rocket-pool-review", safety: "is-rocket-pool-safe" },
  jito: { review: "jito-review", safety: "is-jito-safe" },
  spark: { review: "spark-review", safety: "is-spark-safe" },
  pendle: { review: "pendle-review", safety: "is-pendle-safe" },
  etherfi: { review: "etherfi-review", safety: "is-etherfi-safe" },
  ethena: { review: "ethena-review", safety: "is-ethena-safe" },
};

const OFFER_PROTOCOL_NAME_TO_SLUG: Record<string, ProtocolSlug> = {
  Aave: "aave",
  Morpho: "morpho",
  Compound: "compound",
  Lido: "lido",
  "Rocket Pool": "rocket-pool",
  Jito: "jito",
  Spark: "spark",
  Pendle: "pendle",
  EtherFi: "etherfi",
  Ethena: "ethena",
};

export function resolveProtocolSlugFromOfferName(
  protocolName: string,
): ProtocolSlug | null {
  return OFFER_PROTOCOL_NAME_TO_SLUG[protocolName] ?? null;
}

export function protocolSafetyPath(
  lang: Locale,
  protocolSlug: ProtocolSlug,
): string | null {
  const safety = PROTOCOL_SEO_SLUGS[protocolSlug]?.safety;
  return safety ? localePath(lang, `/safety/${safety}`) : null;
}

export function protocolReviewPath(
  lang: Locale,
  protocolSlug: ProtocolSlug,
): string | null {
  const review = PROTOCOL_SEO_SLUGS[protocolSlug]?.review;
  return review ? localePath(lang, `/reviews/${review}`) : null;
}

export function protocolHubPath(lang: Locale, protocolSlug: ProtocolSlug): string {
  return protocolDetailPath(lang, protocolSlug);
}
