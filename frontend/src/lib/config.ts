/**
 * TJT frontend config — types & static brand identity.
 *
 * Dynamic, business-critical data (benchmarks, CPA offers, market snapshot,
 * news) AND every piece of localizable copy now live in the backend
 * `config.json` at the project root — the single source of truth. The frontend
 * reads it at runtime through `src/lib/server-config.ts`, which resolves each
 * `{ en, ru }` field down to the active `lang` and serves the result via the
 * `/api/config` route (`src/lib/use-config.ts`) or directly to Server
 * Components.
 *
 * This module only declares the TypeScript contract for that resolved payload
 * plus the handful of non-localizable brand constants.
 */

import type { Locale } from "@/lib/i18n";

/** Non-localizable brand identity. */
export const SITE = {
  name: "TJT",
  /** Canonical public origin — used by sitemap.xml, robots.txt and OG metadata. */
  url: "https://tjt.example",
  model: "Non-Custodial Information Broker (CPA / RevShare)",
  version: "1.0.0",
} as const;

/** Shape served by `/api/config` -> config.json `fintech_benchmarks`. */
export type Benchmarks = {
  bankDepositApr: number;
  realInflationRate: number;
  web3AggregatorApy: number;
  currencySymbol: string;
  defaultCapital: number;
};

/** Shape served by `/api/config` -> config.json `cpa_offers[]`. */
export type CpaOffer = {
  id: string;
  slug: string;
  name: string;
  protocol: string;
  network: string;
  logo: string;
  apy: number;
  riskRating: string;
  minEntryUsd: number;
  referralUrl: string;
  description: string;
  benefits: string[];
};

/** AI trading signal attached to a market asset. */
export type AiRecommendationSignal = "Buy" | "Hold" | "Sell";

export type AiRecommendation = {
  signal: AiRecommendationSignal;
  rationale: string;
};

/** Shape served by `/api/config` -> config.json `market_snapshot[]`. */
export type MarketAsset = {
  rank: number;
  slug: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  change24h: number;
  /** 24h trading volume in USD — from CoinGecko or config fallback. */
  volume24h?: number;
  /** Coin logo URL — populated from CoinGecko live feed when available. */
  imageUrl?: string;
  aiSentiment: "Greed" | "Neutral" | "Fear";
  relatedSymbols: string[];
  aiRecommendation: AiRecommendation;
};

/**
 * Editorial taxonomy for the AI-driven news hub. These are stable, locale-
 * neutral *keys* (matched for filtering); the display label per locale comes
 * from `Dictionary["newsCategories"]`.
 */
export const NEWS_CATEGORIES = ["Аналитика", "DeFi", "Новости"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/**
 * A single news article, already resolved to the active locale.
 *
 * Authored by the autonomous TJT AI backend. `content` is Markdown text,
 * `slug` powers SEO-friendly `/[lang]/news/[slug]` routes, and `seoKeywords`
 * feeds per-article `<meta keywords>` / structured data.
 */
export type NewsItem = {
  id: string;
  slug: string;
  category: NewsCategory;
  publishedAt: string;
  title: string;
  description: string;
  content: string;
  seoKeywords: string[];
};

/** Resolved site identity / document metadata. */
export type SiteContent = {
  tagline: string;
  metaTitle: string;
  metaDescription: string;
};

/** Resolved academy article (static editorial, AI-authored). */
export type AcademyArticle = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
};

/** Resolved non-custodial flow step. */
export type SafetyStep = { title: string; description: string };

/** Resolved footer navigation column. */
export type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

/**
 * The full interface dictionary, resolved to a single locale by the content
 * layer. Mirrors `config.json` -> `ui` with every `{ en, ru }` leaf collapsed
 * to a `string` (or `string[]`). Components consume this — never raw strings.
 */
export type Dictionary = {
  site: SiteContent;
  nav: {
    calculator: string;
    market: string;
    news: string;
    yield: string;
    safety: string;
    academy: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
    mobileTagline: string;
  };
  hero: {
    badge: string;
    titleLead: string;
    titleLoss: string;
    titleMid: string;
    titleWeb3: string;
    titleTail: string;
    subtitle: string;
    ctaCalc: string;
    ctaOffers: string;
    pillarCustodial: string;
    pillarAi: string;
    pillarCpa: string;
    statWeb3: string;
    statBank: string;
    statInflation: string;
  };
  calculator: {
    liveBadge: string;
    title: string;
    desc: string;
    capitalLabel: string;
    horizonLabel: string;
    nameBank: string;
    nameInflation: string;
    nameWeb3: string;
    profitOver: string;
    subInflation: string;
    subWeb3: string;
    missedTitle: string;
    missedDescPrefix: string;
    missedCta: string;
    assetLabel: string;
    scrollToOffers: string;
    sniperBadgePrefix: string;
    sniperBadgeProfit: string;
    downloadReport: string;
    generatingReport: string;
    reportReady: string;
    reportError: string;
    error: string;
  };
  report: {
    documentTitle: string;
    fileLabel: string;
    brandTagline: string;
    generatedOn: string;
    inputsHeading: string;
    capitalLabel: string;
    horizonLabel: string;
    benchmarksHeading: string;
    colScenario: string;
    colRate: string;
    colResult: string;
    bankLabel: string;
    inflationLabel: string;
    web3Label: string;
    missedHeading: string;
    missedSub: string;
    offersHeading: string;
    offersIntro: string;
    minLabel: string;
    openLink: string;
    disclaimerHeading: string;
    disclaimer: string;
    pageLabel: string;
    ofLabel: string;
  };
  admin: {
    eyebrow: string;
    title: string;
    desc: string;
    liveBadge: string;
    kpiTotalClicks: string;
    kpiActiveOffers: string;
    kpiArticles: string;
    kpiVideoScripts: string;
    kpiOfTotal: string;
    lastUpdated: string;
    never: string;
    tabByOffer: string;
    tabByLang: string;
    tabRecent: string;
    byOfferTitle: string;
    byOfferDesc: string;
    byLangTitle: string;
    byLangDesc: string;
    recentTitle: string;
    recentDesc: string;
    colRank: string;
    colOffer: string;
    colNetwork: string;
    colApy: string;
    colRisk: string;
    colClicks: string;
    colShare: string;
    colLastClick: string;
    colLanguage: string;
    colTime: string;
    langEn: string;
    langRu: string;
    langUnknown: string;
    emptyClicks: string;
    backToSite: string;
    error: string;
  };
  market: {
    eyebrow: string;
    title: string;
    desc: string;
    cardTitle: string;
    cardDesc: string;
    colAsset: string;
    colPrice: string;
    colCap: string;
    colChange: string;
    colVolume: string;
    colAction: string;
    colSentiment: string;
    error: string;
  };
  priceTicker: {
    liveLabel: string;
  };
  home: {
    aiScoringTitle: string;
    aiScoringDesc: string;
    aiVerdictLabel: string;
    fixBonusCta: string;
    leaderboardTitle: string;
    leaderboardDesc: string;
    getOffer: string;
    getBonus: string;
    bonusLabel: string;
    exchangesTitle: string;
    signUp: string;
  };
  marketDetail: {
    metaTitleSuffix: string;
    whereToBuy: string;
    whereToBuyDesc: string;
    newsAbout: string;
    chartTitle: string;
    timeframe1D: string;
    timeframe1W: string;
    timeframe1M: string;
    timeframe3M: string;
    timeframe1Y: string;
    notFoundTitle: string;
    notFoundDesc: string;
    priceLabel: string;
    change24hLabel: string;
    sentimentLabel: string;
    aiAnalysisEyebrow: string;
    aiAnalysisTitle: string;
    signalBuy: string;
    signalHold: string;
    signalSell: string;
    signalRationaleLabel: string;
    similarEyebrow: string;
    similarTitle: string;
    similarChange24h: string;
  };
  ticker: {
    title: string;
    desc: string;
    empty: string;
    error: string;
    all: string;
  };
  offers: {
    eyebrow: string;
    title: string;
    desc: string;
    min: string;
    review: string;
    error: string;
  };
  offersHub: {
    metaTitle: string;
    metaDescription: string;
    breadcrumbOffers: string;
  };
  offerDetail: {
    benefitsHeading: string;
    cta: string;
    back: string;
    notFoundTitle: string;
    notFoundDesc: string;
  };
  marketHub: {
    metaTitle: string;
    metaDescription: string;
    breadcrumbMarket: string;
    terminalBadge: string;
    searchPlaceholder: string;
    filterAll: string;
    filterGainers: string;
    filterLosers: string;
    filterGreed: string;
    filterNeutral: string;
    filterFear: string;
    sortRank: string;
    sortChange: string;
    sortPrice: string;
    sortCap: string;
    noResults: string;
  };
  calculatorPage: {
    metaTitle: string;
    metaDescription: string;
    breadcrumbCalculator: string;
  };
  homeTeasers: {
    marketEyebrow: string;
    marketTitle: string;
    marketDesc: string;
    marketCta: string;
    offersEyebrow: string;
    offersTitle: string;
    offersDesc: string;
    offersCta: string;
    newsEyebrow: string;
    newsTitle: string;
    newsCta: string;
    calcEyebrow: string;
    calcTitle: string;
    calcDesc: string;
    calcCta: string;
  };
  offerButton: {
    idle: string;
    opening: string;
    loading: string;
    successPrefix: string;
    successSuffix: string;
    error: string;
  };
  safety: {
    eyebrow: string;
    title: string;
    desc: string;
    cardTitle: string;
    cardDesc: string;
    badge: string;
    steps: SafetyStep[];
  };
  academy: {
    eyebrow: string;
    title: string;
    desc: string;
    readingSuffix: string;
    read: string;
    articles: AcademyArticle[];
  };
  newsHub: {
    eyebrow: string;
    title: string;
    desc: string;
    metaTitle: string;
    metaDescription: string;
    breadcrumbNews: string;
    filterAll: string;
    emptyCategory: string;
    readMore: string;
    loadError: string;
  };
  article: {
    aiBadge: string;
    back: string;
    related: string;
    similarNews: string;
    assetsInArticle: string;
    disclaimer: string;
    notFoundTitle: string;
    notFoundDesc: string;
  };
  breadcrumbs: {
    home: string;
    news: string;
    market: string;
    offers: string;
    tools: string;
    ariaLabel: string;
  };
  newsCategories: Record<NewsCategory, string>;
  footer: {
    tagline: string;
    columns: FooterColumn[];
    statusLabel: string;
    nonCustodialLabel: string;
    academyNote: string;
  };
  risk: {
    heading: string;
    paragraphs: string[];
  };
};

/**
 * Full payload returned by `/api/config?lang=` and `loadAppConfig(lang)`.
 * Everything here is already resolved to a single locale.
 */
export type AppConfig = {
  lang: Locale;
  benchmarks: Benchmarks;
  offers: CpaOffer[];
  market: MarketAsset[];
  news: NewsItem[];
  dict: Dictionary;
};

export type SocialLink = { label: string; href: string };

/** Placeholder social handles — non-functional anchors by design. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "X (Twitter)", href: "#" },
  { label: "Telegram", href: "#" },
  { label: "Discord", href: "#" },
  { label: "GitHub", href: "#" },
];
