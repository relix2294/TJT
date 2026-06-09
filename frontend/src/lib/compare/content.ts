import type { Locale } from "@/lib/i18n";
import type {
  ComparePage,
  CompareSlug,
  LocalizedString,
  ProtocolCompareSlug,
} from "@/lib/compare/types";
import { resolveCompareLocalized } from "@/lib/compare/types";

export const COMPARE_LEGAL_DISCLAIMER: LocalizedString = {
  en: "TJT provides informational comparisons only and does not provide financial advice.",
  ru: "TJT предоставляет только информационные сравнения и не даёт финансовых советов.",
};

export const COMPARE_HUB_COPY = {
  eyebrow: {
    en: "Market context",
    ru: "Рыночный контекст",
  } satisfies LocalizedString,
  title: {
    en: "DeFi protocol & yield comparisons",
    ru: "Сравнения DeFi-протоколов и доходности",
  } satisfies LocalizedString,
  subtitle: {
    en: "Informational side-by-side comparisons across protocols, assets, APY snapshots, TVL tiers, and TJT Trust Score v0.1. For market context only — not financial advice.",
    ru: "Информационные сравнения протоколов, активов, снимков APY, уровней TVL и TJT Trust Score v0.1. Только рыночный контекст — не финансовый совет.",
  } satisfies LocalizedString,
  metaTitle: {
    en: "DeFi Protocol & Yield Comparisons — Informational | TJT",
    ru: "Сравнения DeFi-протоколов и доходности — информационно | TJT",
  } satisfies LocalizedString,
  metaDescription: {
    en: "Informational DeFi protocol and yield comparisons with APY, TVL context, chain coverage, and TJT Trust Score v0.1. Market context only — not financial advice.",
    ru: "Информационные сравнения DeFi-протоколов и доходности с APY, контекстом TVL, сетями и TJT Trust Score v0.1. Только рыночный контекст — не финансовый совет.",
  } satisfies LocalizedString,
  breadcrumbCompare: {
    en: "Compare",
    ru: "Сравнения",
  } satisfies LocalizedString,
  gridTitle: {
    en: "Comparison pages",
    ru: "Страницы сравнений",
  } satisfies LocalizedString,
  exploreLabel: {
    en: "View comparison",
    ru: "Открыть сравнение",
  } satisfies LocalizedString,
};

const PROTOCOL_COMPARE_TITLES: Record<ProtocolCompareSlug, LocalizedString> = {
  "aave-vs-lido": {
    en: "Aave vs Lido — informational protocol comparison",
    ru: "Aave vs Lido — информационное сравнение протоколов",
  },
  "aave-vs-jito": {
    en: "Aave vs Jito — informational protocol comparison",
    ru: "Aave vs Jito — информационное сравнение протоколов",
  },
  "lido-vs-jito": {
    en: "Lido vs Jito — informational liquid-staking comparison",
    ru: "Lido vs Jito — информационное сравнение liquid staking",
  },
  "morpho-vs-aave": {
    en: "Morpho vs Aave — informational lending comparison",
    ru: "Morpho vs Aave — информационное сравнение lending",
  },
  "compound-vs-aave": {
    en: "Compound vs Aave — informational lending comparison",
    ru: "Compound vs Aave — информационное сравнение lending",
  },
  "lido-vs-rocket-pool": {
    en: "Lido vs Rocket Pool — informational liquid-staking comparison",
    ru: "Lido vs Rocket Pool — информационное сравнение liquid staking",
  },
};

const YIELD_COMPARE_TITLES: Record<
  Extract<
    CompareSlug,
    "best-usdt-yield" | "best-usdc-yield" | "best-eth-staking" | "best-sol-staking"
  >,
  LocalizedString
> = {
  "best-usdt-yield": {
    en: "USDT yield comparison — informational market context",
    ru: "Сравнение доходности USDT — информационный рыночный контекст",
  },
  "best-usdc-yield": {
    en: "USDC yield comparison — informational market context",
    ru: "Сравнение доходности USDC — информационный рыночный контекст",
  },
  "best-eth-staking": {
    en: "ETH staking comparison — informational market context",
    ru: "Сравнение стейкинга ETH — информационный рыночный контекст",
  },
  "best-sol-staking": {
    en: "SOL staking comparison — informational market context",
    ru: "Сравнение стейкинга SOL — информационный рыночный контекст",
  },
};

export function comparePageTitle(page: ComparePage, lang: Locale): string {
  return resolveCompareLocalized(page.title, lang);
}

export function comparePageMetaTitle(page: ComparePage, lang: Locale): string {
  const title = comparePageTitle(page, lang);
  return `${title} | TJT`;
}

export function comparePageMetaDescription(
  page: ComparePage,
  lang: Locale,
): string {
  return resolveCompareLocalized(page.summary, lang);
}

export function getCompareSlugTitle(slug: CompareSlug): LocalizedString {
  if (slug in PROTOCOL_COMPARE_TITLES) {
    return PROTOCOL_COMPARE_TITLES[slug as keyof typeof PROTOCOL_COMPARE_TITLES];
  }
  return YIELD_COMPARE_TITLES[slug as keyof typeof YIELD_COMPARE_TITLES];
}
