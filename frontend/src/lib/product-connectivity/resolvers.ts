import type { CpaOffer } from "@/lib/config";
import type { ComparePage } from "@/lib/compare/types";
import { isProtocolComparison } from "@/lib/compare/types";
import { compareDetailPath, compareHubPath } from "@/lib/compare/paths";
import type { Asset, EarnAssetSlug } from "@/lib/earn/types";
import { earnAssetPath, earnHubPath } from "@/lib/earn/paths";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/seo/urls";
import type { ProtocolSlug } from "@/lib/protocols/types";
import type {
  SeoPilotHubSegment,
  SeoPilotPage,
} from "@/lib/seo-pilot/types";
import type { ProductNextStepAction } from "@/lib/product-connectivity/types";
import {
  PROTOCOL_SEO_SLUGS,
  protocolHubPath,
  protocolReviewPath,
  protocolSafetyPath,
  resolveProtocolSlugFromOfferName,
} from "@/lib/product-connectivity/protocol-seo-map";

const ASSET_COMPARE_SLUG: Partial<Record<EarnAssetSlug, string>> = {
  usdt: "best-usdt-yield",
  usdc: "best-usdc-yield",
  eth: "best-eth-staking",
  sol: "best-sol-staking",
};

function step(
  kind: ProductNextStepAction["kind"],
  label: string,
  href: string,
  description?: string,
): ProductNextStepAction {
  return { kind, label, href, description };
}

function reviewSlugToProtocolSlug(reviewSlug: string): ProtocolSlug | null {
  if (!reviewSlug.endsWith("-review")) return null;
  const base = reviewSlug.slice(0, -"-review".length);
  return base in PROTOCOL_SEO_SLUGS ? (base as ProtocolSlug) : null;
}

function safetySlugToProtocolSlug(safetySlug: string): ProtocolSlug | null {
  if (!safetySlug.startsWith("is-") || !safetySlug.endsWith("-safe")) return null;
  const base = safetySlug.slice(3, -"-safe".length);
  return base in PROTOCOL_SEO_SLUGS ? (base as ProtocolSlug) : null;
}

/** Compare detail → protocol hub, safety, opportunity. */
export function buildComparePageNextSteps(
  lang: Locale,
  page: ComparePage,
): ProductNextStepAction[] {
  const steps: ProductNextStepAction[] = [];

  if (isProtocolComparison(page.comparison)) {
    const primary = page.comparison.left;
    steps.push(
      step(
        "protocol",
        lang === "ru"
          ? `Хаб ${primary.name}`
          : `${primary.name} protocol hub`,
        primary.protocolPath,
      ),
    );
    const safetyHref = protocolSafetyPath(lang, primary.protocolSlug);
    if (safetyHref) {
      steps.push(
        step(
          "safety",
          lang === "ru"
            ? `Безопасность ${primary.name}`
            : `Is ${primary.name} safe?`,
          safetyHref,
        ),
      );
    }
    steps.push(
      step(
        "trust",
        lang === "ru" ? "Trust Score в таблице" : "Trust Score in table",
        "#compare-trust-overview",
      ),
    );
    const offer = page.linkedOffers[0];
    if (offer) {
      steps.push(
        step(
          "opportunity",
          lang === "ru" ? "Открыть оффер" : "View opportunity",
          offer.offerPath,
        ),
      );
    }
  } else {
    const compareSlug = ASSET_COMPARE_SLUG[page.comparison.assetSlug];
    if (compareSlug) {
      steps.push(
        step(
          "compare",
          lang === "ru"
            ? `Сравнение ${page.comparison.assetSymbol} yield`
            : `${page.comparison.assetSymbol} yield comparison`,
          compareDetailPath(lang, compareSlug as Parameters<typeof compareDetailPath>[1]),
        ),
      );
    }
    const topRow = page.comparison.rows[0];
    if (topRow) {
      steps.push(
        step(
          "protocol",
          lang === "ru"
            ? `Хаб ${topRow.protocolName}`
            : `${topRow.protocolName} protocol hub`,
          topRow.protocolPath,
        ),
      );
      const safetyHref = protocolSafetyPath(
        lang,
        topRow.protocolSlug as ProtocolSlug,
      );
      if (safetyHref) {
        steps.push(
          step(
            "safety",
            lang === "ru"
              ? `Безопасность ${topRow.protocolName}`
              : `Is ${topRow.protocolName} safe?`,
            safetyHref,
          ),
        );
      }
      if (topRow.offerPath) {
        steps.push(
          step(
            "opportunity",
            lang === "ru" ? "Открыть оффер" : "View opportunity",
            topRow.offerPath,
          ),
        );
      }
    }
  }

  if (steps.length < 3) {
    steps.push(
      step(
        "compare",
        lang === "ru" ? "Все сравнения" : "All comparisons",
        compareHubPath(lang),
      ),
    );
  }

  return steps.slice(0, 3);
}

/** Earn asset → compare, protocol, opportunity. */
export function buildEarnAssetNextSteps(
  lang: Locale,
  asset: Asset,
  topProtocolPath?: string | null,
  topOfferPath?: string | null,
): ProductNextStepAction[] {
  const steps: ProductNextStepAction[] = [];
  const compareSlug = ASSET_COMPARE_SLUG[asset.slug];

  if (compareSlug) {
    steps.push(
      step(
        "compare",
        lang === "ru"
          ? `Сравнить ${asset.symbol} yield`
          : `Compare ${asset.symbol} yield`,
        compareDetailPath(lang, compareSlug as Parameters<typeof compareDetailPath>[1]),
      ),
    );
  }

  if (topProtocolPath) {
    steps.push(
      step(
        "protocol",
        lang === "ru" ? "Хаб протокола" : "Protocol hub",
        topProtocolPath,
      ),
    );
  } else {
    steps.push(
      step(
        "learn",
        lang === "ru" ? "Риски crypto yield" : "Crypto yield risks",
        localePath(lang, "/learn/crypto-yield-risks"),
      ),
    );
  }

  if (topOfferPath) {
    steps.push(
      step(
        "opportunity",
        lang === "ru" ? "Открыть оффер" : "View opportunity",
        topOfferPath,
      ),
    );
  } else {
    steps.push(
      step(
        "opportunity",
        lang === "ru" ? "Каталог yield" : "Yield catalog",
        localePath(lang, "/offers"),
      ),
    );
  }

  return steps.slice(0, 3);
}

/** Offer detail → protocol, compare, safety. */
export function buildOfferNextSteps(
  lang: Locale,
  offer: CpaOffer,
): ProductNextStepAction[] {
  const protocolSlug = resolveProtocolSlugFromOfferName(offer.protocol);
  const steps: ProductNextStepAction[] = [];

  if (protocolSlug) {
    steps.push(
      step(
        "protocol",
        lang === "ru"
          ? `Хаб ${offer.protocol}`
          : `${offer.protocol} protocol hub`,
        protocolHubPath(lang, protocolSlug),
      ),
    );
    const safetyHref = protocolSafetyPath(lang, protocolSlug);
    if (safetyHref) {
      steps.push(
        step(
          "safety",
          lang === "ru"
            ? `Безопасность ${offer.protocol}`
            : `Is ${offer.protocol} safe?`,
          safetyHref,
        ),
      );
    }
    const reviewHref = protocolReviewPath(lang, protocolSlug);
    if (reviewHref) {
      steps.push(
        step(
          "review",
          lang === "ru"
            ? `Обзор ${offer.protocol}`
            : `${offer.protocol} review`,
          reviewHref,
        ),
      );
    }
  }

  const assetGuess = offer.slug.includes("usdt")
    ? "best-usdt-yield"
    : offer.slug.includes("usdc")
      ? "best-usdc-yield"
      : offer.slug.includes("eth") || offer.slug.includes("eeth")
        ? "best-eth-staking"
        : offer.slug.includes("sol") || offer.slug.includes("jito")
          ? "best-sol-staking"
          : null;

  if (assetGuess) {
    steps.push(
      step(
        "compare",
        lang === "ru" ? "Сравнить yield" : "Compare yield",
        compareDetailPath(lang, assetGuess as Parameters<typeof compareDetailPath>[1]),
      ),
    );
  } else {
    steps.push(
      step(
        "compare",
        lang === "ru" ? "Все сравнения" : "All comparisons",
        compareHubPath(lang),
      ),
    );
  }

  if (steps.length < 3) {
    steps.push(
      step(
        "opportunity",
        lang === "ru" ? "Каталог yield" : "Yield catalog",
        localePath(lang, "/offers"),
      ),
    );
  }

  return steps.slice(0, 3);
}

/** SeoPilot article → journey-aware next steps by page type. */
export function buildSeoPilotPageNextSteps(
  lang: Locale,
  page: SeoPilotPage,
): ProductNextStepAction[] {
  const steps: ProductNextStepAction[] = [];

  if (page.type === "review") {
    const protocolSlug = reviewSlugToProtocolSlug(page.slug);
    if (protocolSlug) {
      const safetyHref = protocolSafetyPath(lang, protocolSlug);
      if (safetyHref) {
        steps.push(
          step(
            "safety",
            lang === "ru" ? "Изучить риски" : "Review safety",
            safetyHref,
          ),
        );
      }
      steps.push(
        step(
          "protocol",
          lang === "ru" ? "Хаб протокола" : "Protocol hub",
          protocolHubPath(lang, protocolSlug),
        ),
      );
    }
    steps.push(
      step(
        "compare",
        lang === "ru" ? "Сравнить возможности" : "Compare opportunities",
        page.ctaHref(lang),
      ),
    );
    steps.push(
      step(
        "opportunity",
        lang === "ru" ? "Каталог yield" : "Yield catalog",
        localePath(lang, "/offers"),
      ),
    );
  } else if (page.type === "safety") {
    const protocolSlug = safetySlugToProtocolSlug(page.slug);
    steps.push(
      step(
        "compare",
        lang === "ru" ? "Сравнить альтернативы" : "Compare alternatives",
        page.ctaHref(lang),
      ),
    );
    if (protocolSlug) {
      steps.push(
        step(
          "protocol",
          lang === "ru" ? "Хаб протокола" : "Protocol hub",
          protocolHubPath(lang, protocolSlug),
        ),
      );
      const reviewHref = protocolReviewPath(lang, protocolSlug);
      if (reviewHref) {
        steps.push(
          step(
            "review",
            lang === "ru" ? "Обзор протокола" : "Protocol review",
            reviewHref,
          ),
        );
      }
    } else {
      steps.push(
        step(
          "opportunity",
          lang === "ru" ? "Каталог yield" : "Yield catalog",
          localePath(lang, "/offers"),
        ),
      );
    }
  } else if (page.type === "learn") {
    if (page.slug === "crypto-yield-risks" || page.slug === "usdc-yield-risks") {
      steps.push(
        step(
          "compare",
          lang === "ru" ? "Сравнить USDT yield" : "Compare USDT yield",
          compareDetailPath(lang, "best-usdt-yield"),
        ),
      );
    } else {
      steps.push(
        step(
          "learn",
          lang === "ru" ? "Риски crypto yield" : "Crypto yield risks",
          localePath(lang, "/learn/crypto-yield-risks"),
        ),
      );
    }
    steps.push(
      step(
        "compare",
        lang === "ru" ? "Сравнить возможности" : "Compare opportunities",
        page.ctaHref(lang),
      ),
    );
    steps.push(
      step(
        "protocol",
        lang === "ru" ? "Каталог протоколов" : "Protocol catalog",
        localePath(lang, "/protocols"),
      ),
    );
  } else {
    steps.push(
      step(
        "compare",
        lang === "ru" ? "Сравнить возможности" : "Compare opportunities",
        page.ctaHref(lang),
      ),
    );
    steps.push(
      step(
        "opportunity",
        lang === "ru" ? "Earn-хаб" : "Earn hub",
        earnHubPath(lang),
      ),
    );
    steps.push(
      step(
        "opportunity",
        lang === "ru" ? "Каталог yield" : "Yield catalog",
        localePath(lang, "/offers"),
      ),
    );
  }

  return dedupeNextSteps(steps).slice(0, 3);
}

/** Compare hub → featured comparisons and earn entry points. */
export function buildCompareHubNextSteps(lang: Locale): ProductNextStepAction[] {
  return [
    step(
      "compare",
      lang === "ru" ? "Сравнить USDT yield" : "Compare USDT yield",
      compareDetailPath(lang, "best-usdt-yield"),
    ),
    step(
      "compare",
      lang === "ru" ? "Morpho vs Aave" : "Morpho vs Aave",
      compareDetailPath(lang, "morpho-vs-aave"),
    ),
    step(
      "opportunity",
      lang === "ru" ? "Earn-хаб" : "Earn hub",
      earnHubPath(lang),
    ),
  ];
}

/** Earn hub → asset pages, compare tables, and yield catalog. */
export function buildEarnHubNextSteps(lang: Locale): ProductNextStepAction[] {
  return [
    step(
      "compare",
      lang === "ru" ? "Сравнить USDT yield" : "Compare USDT yield",
      compareDetailPath(lang, "best-usdt-yield"),
    ),
    step(
      "opportunity",
      lang === "ru" ? "Лучший USDC yield" : "Best USDC yield",
      earnAssetPath(lang, "usdc"),
    ),
    step(
      "learn",
      lang === "ru" ? "Риски crypto yield" : "Crypto yield risks",
      localePath(lang, "/learn/crypto-yield-risks"),
    ),
  ];
}

/** Hub-level journey entry points for learn, reviews, safety. */
export function buildSeoPilotHubNextSteps(
  lang: Locale,
  hubSegment: Exclude<SeoPilotHubSegment, "earn">,
): ProductNextStepAction[] {
  if (hubSegment === "learn") {
    return [
      step(
        "learn",
        lang === "ru" ? "Риски crypto yield" : "Crypto yield risks",
        localePath(lang, "/learn/crypto-yield-risks"),
      ),
      step(
        "compare",
        lang === "ru" ? "Сравнить USDT yield" : "Compare USDT yield",
        compareDetailPath(lang, "best-usdt-yield"),
      ),
      step(
        "protocol",
        lang === "ru" ? "Каталог протоколов" : "Protocol catalog",
        localePath(lang, "/protocols"),
      ),
    ];
  }

  if (hubSegment === "reviews") {
    return [
      step(
        "review",
        lang === "ru" ? "Обзор Aave" : "Aave review",
        localePath(lang, "/reviews/aave-review"),
      ),
      step(
        "safety",
        lang === "ru" ? "Безопасность Aave" : "Is Aave safe?",
        localePath(lang, "/safety/is-aave-safe"),
      ),
      step(
        "compare",
        lang === "ru" ? "Сравнить yield" : "Compare yield",
        compareHubPath(lang),
      ),
    ];
  }

  return [
    step(
      "safety",
      lang === "ru" ? "Безопасность Aave" : "Is Aave safe?",
      localePath(lang, "/safety/is-aave-safe"),
    ),
    step(
      "compare",
      lang === "ru" ? "Сравнить альтернативы" : "Compare alternatives",
      compareDetailPath(lang, "morpho-vs-aave"),
    ),
    step(
      "opportunity",
      lang === "ru" ? "Каталог yield" : "Yield catalog",
      localePath(lang, "/offers"),
    ),
  ];
}

export function dedupeNextSteps(
  steps: ProductNextStepAction[],
): ProductNextStepAction[] {
  const seen = new Set<string>();
  return steps.filter((s) => {
    if (seen.has(s.href)) return false;
    seen.add(s.href);
    return true;
  });
}
