import { promises as fs } from "node:fs";
import path from "node:path";
import { resolveRepoDataPath } from "@/lib/repo-paths";
import {
  NEWS_CATEGORIES,
  type AppConfig,
  type Benchmarks,
  type CpaOffer,
  type Dictionary,
  type MarketAsset,
  type NewsItem,
  type AiRecommendation,
} from "@/lib/config";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

/**
 * The Python backend owns `config.json` at the project root, one level above
 * the Next.js app (`frontend/`). It is the single source of truth for the
 * site's financial benchmarks, CPA offers, market snapshot, news AND every
 * piece of localizable interface copy (stored as `{ en, ru }`).
 *
 * This module is the only place that reads that file. It validates and
 * normalizes the backend's snake_case schema into the camelCase types the
 * frontend consumes, and resolves all `{ en, ru }` fields down to the active
 * `lang`. It deliberately throws (instead of returning placeholder data) when
 * the file is missing or malformed, so a broken source of truth fails loudly.
 */
const CONFIG_PATH = resolveRepoDataPath("config.json");

class ConfigError extends Error {
  constructor(message: string) {
    super(`[config.json] ${message}`);
    this.name = "ConfigError";
  }
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ConfigError(`"${label}" must be an object.`);
  }
  return value as Record<string, unknown>;
}

function asNumber(value: unknown, label: string): number {
  const n = typeof value === "string" ? Number(value) : value;
  if (typeof n !== "number" || !Number.isFinite(n)) {
    throw new ConfigError(`"${label}" must be a finite number.`);
  }
  return n;
}

function asString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ConfigError(`"${label}" must be a non-empty string.`);
  }
  return value;
}

/* ----------------------------- localization ----------------------------- */

/** A node is a translatable leaf when it has exactly the supported locales. */
function isLocalizedLeaf(value: Record<string, unknown>): boolean {
  const keys = Object.keys(value);
  return (
    keys.length === LOCALES.length &&
    LOCALES.every((locale) => locale in value)
  );
}

/**
 * Recursively collapse every `{ en, ru }` leaf in a config subtree to the
 * value for `lang`. Objects and arrays are walked; primitives pass through.
 * This is what lets the whole `ui` dictionary live in `config.json` as a
 * single bilingual tree with no per-field wiring here.
 */
function localizeTree(node: unknown, lang: Locale): unknown {
  if (Array.isArray(node)) {
    return node.map((child) => localizeTree(child, lang));
  }
  if (node !== null && typeof node === "object") {
    const record = node as Record<string, unknown>;
    if (isLocalizedLeaf(record)) {
      return record[lang] ?? record[DEFAULT_LOCALE];
    }
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      out[key] = localizeTree(record[key], lang);
    }
    return out;
  }
  return node;
}

/** Resolve a `{ en, ru }` string leaf to `lang`. */
function localizedString(value: unknown, label: string, lang: Locale): string {
  const record = asRecord(value, label);
  return asString(record[lang] ?? record[DEFAULT_LOCALE], `${label}.${lang}`);
}

/** Resolve a `{ en: string[], ru: string[] }` leaf to `lang`. */
function localizedStringArray(
  value: unknown,
  label: string,
  lang: Locale,
): string[] {
  const record = asRecord(value, label);
  const raw = record[lang] ?? record[DEFAULT_LOCALE];
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new ConfigError(`"${label}.${lang}" must be a non-empty array.`);
  }
  return raw.map((entry, i) => asString(entry, `${label}.${lang}[${i}]`));
}

/* ------------------------------ normalizers ------------------------------ */

function normalizeBenchmarks(raw: unknown): Benchmarks {
  const b = asRecord(raw, "fintech_benchmarks");
  return {
    bankDepositApr: asNumber(b.bank_deposit_apr, "fintech_benchmarks.bank_deposit_apr"),
    realInflationRate: asNumber(b.real_inflation_rate, "fintech_benchmarks.real_inflation_rate"),
    web3AggregatorApy: asNumber(b.web3_aggregator_apy, "fintech_benchmarks.web3_aggregator_apy"),
    currencySymbol: asString(b.currency_symbol, "fintech_benchmarks.currency_symbol"),
    defaultCapital: asNumber(b.default_capital_usd, "fintech_benchmarks.default_capital_usd"),
  };
}

function normalizeOffers(raw: unknown, lang: Locale): CpaOffer[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new ConfigError(`"cpa_offers" must be a non-empty array.`);
  }

  const seenSlugs = new Set<string>();
  return raw.map((entry, i) => {
    const o = asRecord(entry, `cpa_offers[${i}]`);
    const id = asString(o.id, `cpa_offers[${i}].id`);
    const slugRaw = o.slug;
    const slug =
      typeof slugRaw === "string" && slugRaw.length > 0
        ? slugRaw
        : id.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

    if (seenSlugs.has(slug)) {
      throw new ConfigError(`cpa_offers[${i}].slug "${slug}" is duplicated.`);
    }
    seenSlugs.add(slug);

    const protocol = asString(o.protocol, `cpa_offers[${i}].protocol`);
    const logoRaw = o.logo;
    const logo =
      typeof logoRaw === "string" && logoRaw.length > 0
        ? logoRaw
        : protocol.slice(0, 2).toUpperCase();

    const descriptionRaw = o.description;
    const description =
      descriptionRaw !== undefined
        ? localizedString(descriptionRaw, `cpa_offers[${i}].description`, lang)
        : asString(o.name, `cpa_offers[${i}].name`);

    const benefitsRaw = o.benefits;
    const benefits =
      benefitsRaw !== undefined
        ? localizedStringArray(benefitsRaw, `cpa_offers[${i}].benefits`, lang)
        : [];

    return {
      id,
      slug,
      name: asString(o.name, `cpa_offers[${i}].name`),
      protocol,
      network: asString(o.network, `cpa_offers[${i}].network`),
      logo,
      apy: asNumber(o.apy, `cpa_offers[${i}].apy`),
      riskRating: asString(o.risk_rating, `cpa_offers[${i}].risk_rating`),
      minEntryUsd: asNumber(o.min_entry_usd, `cpa_offers[${i}].min_entry_usd`),
      referralUrl: asString(o.referral_url, `cpa_offers[${i}].referral_url`),
      description,
      benefits,
    };
  });
}

const SENTIMENTS: ReadonlySet<string> = new Set(["Greed", "Neutral", "Fear"]);
const AI_SIGNALS: ReadonlySet<string> = new Set(["Buy", "Hold", "Sell"]);

function defaultSlug(name: string, symbol: string): string {
  const fromName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return fromName.length > 0 ? fromName : symbol.toLowerCase();
}

function normalizeAiRecommendation(
  raw: unknown,
  label: string,
  lang: Locale,
  sentiment: MarketAsset["aiSentiment"],
  change24h: number,
  symbol: string,
): AiRecommendation {
  const fallbackSignal: AiRecommendation["signal"] =
    sentiment === "Greed" && change24h > 1
      ? "Buy"
      : sentiment === "Fear" && change24h < -1
        ? "Sell"
        : "Hold";

  if (raw === undefined || raw === null) {
    return {
      signal: fallbackSignal,
      rationale:
        lang === "ru"
          ? `${symbol}: автоматический вердикт на основе ИИ-тональности и движения за 24ч.`
          : `${symbol}: auto verdict from AI sentiment and 24h price action.`,
    };
  }

  const rec = asRecord(raw, label);
  const signalRaw = asString(rec.signal ?? rec.recommendation, `${label}.signal`);
  if (!AI_SIGNALS.has(signalRaw)) {
    throw new ConfigError(`${label}.signal must be one of Buy | Hold | Sell.`);
  }

  const rationaleRaw = rec.rationale ?? rec.reason;
  const rationale =
    rationaleRaw !== undefined
      ? localizedString(rationaleRaw, `${label}.rationale`, lang)
      : lang === "ru"
        ? `${symbol}: вердикт ${signalRaw} от ИИ-агента TJT.`
        : `${symbol}: ${signalRaw} verdict from the TJT AI agent.`;

  return {
    signal: signalRaw as AiRecommendation["signal"],
    rationale,
  };
}

function normalizeMarket(raw: unknown, lang: Locale): MarketAsset[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new ConfigError(`"market_snapshot" must be a non-empty array.`);
  }
  return raw.map((entry, i) => {
    const a = asRecord(entry, `market_snapshot[${i}]`);
    const sentiment = asString(a.ai_sentiment, `market_snapshot[${i}].ai_sentiment`);
    if (!SENTIMENTS.has(sentiment)) {
      throw new ConfigError(
        `market_snapshot[${i}].ai_sentiment must be one of Greed | Neutral | Fear.`,
      );
    }
    const symbol = asString(a.symbol, `market_snapshot[${i}].symbol`);
    const name = asString(a.name, `market_snapshot[${i}].name`);
    const slugRaw = a.slug;
    const slug =
      typeof slugRaw === "string" && slugRaw.length > 0
        ? slugRaw.toLowerCase()
        : defaultSlug(name, symbol);
    const change24h = asNumber(a.change_24h, `market_snapshot[${i}].change_24h`);

    const relatedRaw = a.related_symbols;
    let relatedSymbols: string[] = [];
    if (relatedRaw !== undefined) {
      if (!Array.isArray(relatedRaw)) {
        throw new ConfigError(`market_snapshot[${i}].related_symbols must be an array.`);
      }
      relatedSymbols = relatedRaw.map((sym, j) =>
        asString(sym, `market_snapshot[${i}].related_symbols[${j}]`).toUpperCase(),
      );
    }

    const aiRaw = a.ai_recommendation ?? a.ai_signals;
    const aiRecommendation = normalizeAiRecommendation(
      aiRaw,
      `market_snapshot[${i}].ai_recommendation`,
      lang,
      sentiment as MarketAsset["aiSentiment"],
      change24h,
      symbol,
    );

    const volumeRaw = a.volume_24h;
    const volume24h =
      volumeRaw !== undefined
        ? asNumber(volumeRaw, `market_snapshot[${i}].volume_24h`)
        : undefined;

    const imageRaw = a.image_url;
    const imageUrl =
      typeof imageRaw === "string" && imageRaw.length > 0 ? imageRaw : undefined;

    return {
      rank: asNumber(a.rank, `market_snapshot[${i}].rank`),
      slug,
      symbol,
      name,
      price: asNumber(a.price, `market_snapshot[${i}].price`),
      marketCap: asNumber(a.market_cap, `market_snapshot[${i}].market_cap`),
      change24h,
      volume24h,
      imageUrl,
      aiSentiment: sentiment as MarketAsset["aiSentiment"],
      relatedSymbols,
      aiRecommendation,
    };
  });
}

const NEWS_CATEGORY_SET: ReadonlySet<string> = new Set(NEWS_CATEGORIES);

function asIsoTimestamp(value: unknown, label: string): string {
  const raw = asString(value, label);
  if (Number.isNaN(Date.parse(raw))) {
    throw new ConfigError(`"${label}" must be an ISO-8601 date string.`);
  }
  return raw;
}

/**
 * Validate the bilingual `news[]` and resolve each article to `lang`.
 * News is an optional layer: an absent key yields an empty hub, but a
 * present-yet-malformed value still fails loudly.
 */
function normalizeNews(raw: unknown, lang: Locale): NewsItem[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    throw new ConfigError(`"news" must be an array when present.`);
  }

  const seenSlugs = new Set<string>();
  const items = raw.map((entry, i) => {
    const n = asRecord(entry, `news[${i}]`);
    const slug = asString(n.slug, `news[${i}].slug`);
    if (seenSlugs.has(slug)) {
      throw new ConfigError(`news[${i}].slug "${slug}" is duplicated.`);
    }
    seenSlugs.add(slug);

    const category = asString(n.category, `news[${i}].category`);
    if (!NEWS_CATEGORY_SET.has(category)) {
      throw new ConfigError(
        `news[${i}].category must be one of ${NEWS_CATEGORIES.join(" | ")}.`,
      );
    }

    return {
      id: asString(n.id, `news[${i}].id`),
      slug,
      category: category as NewsItem["category"],
      publishedAt: asIsoTimestamp(n.published_at, `news[${i}].published_at`),
      title: localizedString(n.title, `news[${i}].title`, lang),
      description: localizedString(n.description, `news[${i}].description`, lang),
      content: localizedString(n.content, `news[${i}].content`, lang),
      seoKeywords: localizedStringArray(n.seo_keywords, `news[${i}].seo_keywords`, lang),
    };
  });

  // Newest first — the hub, ticker and SEO listings all expect reverse-chron.
  return items.sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

function normalizeDictionary(raw: unknown, lang: Locale): Dictionary {
  asRecord(raw, "ui");
  // The `ui` subtree is fully bilingual; the generic resolver collapses it.
  return localizeTree(raw, lang) as Dictionary;
}

/* -------------------------------- loaders -------------------------------- */

async function readConfigFile(): Promise<Record<string, unknown>> {
  let raw: string;
  try {
    raw = await fs.readFile(CONFIG_PATH, "utf-8");
  } catch (err) {
    throw new ConfigError(
      `Unable to read source of truth at ${CONFIG_PATH}: ${(err as Error).message}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new ConfigError(`Invalid JSON: ${(err as Error).message}`);
  }

  return asRecord(parsed, "<root>");
}

/**
 * Read, validate and normalize the backend `config.json` for a given locale.
 * Throws `ConfigError` if the file cannot be read or is malformed.
 */
export async function loadAppConfig(lang: Locale): Promise<AppConfig> {
  const root = await readConfigFile();
  return {
    lang,
    benchmarks: normalizeBenchmarks(root.fintech_benchmarks),
    offers: normalizeOffers(root.cpa_offers, lang),
    market: normalizeMarket(root.market_snapshot, lang),
    news: normalizeNews(root.news, lang),
    dict: normalizeDictionary(root.ui, lang),
  };
}

/**
 * Convenience accessor used by the click-tracking gateway. Offers are
 * locale-neutral, so this avoids resolving the rest of the payload.
 */
export async function loadCpaOffers(lang: Locale = DEFAULT_LOCALE): Promise<CpaOffer[]> {
  const root = await readConfigFile();
  return normalizeOffers(root.cpa_offers, lang);
}

/**
 * Locale-aware interface dictionary, for Server Components that only need copy.
 */
export async function loadDictionary(lang: Locale): Promise<Dictionary> {
  const root = await readConfigFile();
  return normalizeDictionary(root.ui, lang);
}

/** Static market snapshot from config.json — CoinGecko self-healing fallback. */
export async function loadMarketFallback(lang: Locale = DEFAULT_LOCALE): Promise<MarketAsset[]> {
  const root = await readConfigFile();
  return normalizeMarket(root.market_snapshot, lang);
}

/**
 * News accessors for the server-rendered hub (`/[lang]/news`,
 * `/[lang]/news/[slug]`). These read the source of truth directly so article
 * pages can be statically analyzed for SEO (metadata, structured data) without
 * a client round-trip.
 */
export async function loadNews(lang: Locale): Promise<NewsItem[]> {
  const root = await readConfigFile();
  return normalizeNews(root.news, lang);
}

export async function findNewsBySlug(
  lang: Locale,
  slug: string,
): Promise<NewsItem | undefined> {
  return (await loadNews(lang)).find((item) => item.slug === slug);
}

export async function findOfferBySlug(
  lang: Locale,
  slug: string,
): Promise<CpaOffer | undefined> {
  const root = await readConfigFile();
  return normalizeOffers(root.cpa_offers, lang).find((item) => item.slug === slug);
}

export async function findMarketBySlug(
  slug: string,
  lang: Locale = DEFAULT_LOCALE,
): Promise<MarketAsset | undefined> {
  const root = await readConfigFile();
  const market = normalizeMarket(root.market_snapshot, lang);
  const normalized = slug.toLowerCase();
  return market.find(
    (a) =>
      a.slug === normalized ||
      a.symbol.toLowerCase() === normalized ||
      defaultSlug(a.name, a.symbol) === normalized,
  );
}

export async function loadMarketAssets(lang: Locale = DEFAULT_LOCALE): Promise<MarketAsset[]> {
  const root = await readConfigFile();
  return normalizeMarket(root.market_snapshot, lang);
}
