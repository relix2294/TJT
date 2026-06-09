import { promises as fs } from "node:fs";
import { loadCpaOffers } from "@/lib/server-config";
import type { CpaOffer } from "@/lib/config";
import { resolveRepoDataPath } from "@/lib/repo-paths";

/**
 * Server-side reader & analytics layer for the shared system registry.
 *
 * `sys_registry.json` is the single source of truth co-owned by the Python /
 * Streamlit backend (`ai_agents.log_outbound_click`) and the Next.js
 * click-tracking gateway (`/api/click-track`). Both append to `click_log`, but
 * with two slightly different row shapes:
 *
 *   • Python : { offer_id, protocol, network, apy, timestamp }
 *   • Next.js: { timestamp, offer_id, lang, status }
 *
 * This module is the ONLY place the admin surface reads that file. It tolerates
 * both shapes, joins each click back to its CPA offer (the locale-neutral
 * `config.json` is authoritative for offer metadata) and derives the analytics
 * the dashboard renders. It never writes — the dashboard is read-only.
 */
const REGISTRY_PATH = resolveRepoDataPath("sys_registry.json");

export type RegistryMetrics = {
  generated_articles_count: number;
  generated_video_scripts_count: number;
  outbound_ctr_clicks: number;
  [metric: string]: number;
};

/** A single click row, after normalizing both producer shapes. */
export type NormalizedClick = {
  offerId: string;
  /** Interface language of the page where the click happened, if recorded. */
  lang: string | null;
  timestamp: string;
  /** Joined CPA offer (undefined if the offer id is no longer in config). */
  offer?: CpaOffer;
  /** Best-effort label even when the offer is gone (falls back to the id). */
  offerName: string;
  protocol: string;
  network: string;
  apy: number | null;
};

/** Per-offer rollup used by the "clicks by offer" leaderboard. */
export type OfferStat = {
  offerId: string;
  name: string;
  protocol: string;
  network: string;
  apy: number | null;
  riskRating: string | null;
  clicks: number;
  /** Share of all attributable clicks, 0..1. */
  share: number;
  /** Most recent click timestamp for this offer, if any. */
  lastClick: string | null;
};

/** Per-language rollup used by the "distribution by language" panel. */
export type LangStat = {
  lang: string;
  clicks: number;
  share: number;
};

export type DashboardData = {
  metrics: ResolvedMetrics;
  offerStats: OfferStat[];
  langStats: LangStat[];
  recentClicks: NormalizedClick[];
  totalClicks: number;
  uniqueOffers: number;
  lastUpdated: string | null;
};

export type ResolvedMetrics = {
  generatedArticles: number;
  generatedVideoScripts: number;
  outboundClicks: number;
};

type RawClick = Record<string, unknown>;

type RawRegistry = {
  metrics?: Partial<ResolvedMetrics> & Record<string, unknown>;
  click_log?: RawClick[];
  agent_run_log?: unknown[];
  last_updated?: string | null;
};

/** How many of the newest clicks the activity log surfaces. */
export const RECENT_CLICK_LIMIT = 20;

class RegistryError extends Error {
  constructor(message: string) {
    super(`[sys_registry.json] ${message}`);
    this.name = "RegistryError";
  }
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asFiniteNumber(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

/**
 * Read the registry. A missing file is a valid "fresh, no activity yet" state,
 * but a locked/corrupt mid-write payload throws so the dashboard can render a
 * loud error instead of silently lying with zeroes.
 */
async function readRegistry(): Promise<RawRegistry> {
  let raw: string;
  try {
    raw = await fs.readFile(REGISTRY_PATH, "utf-8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { metrics: {}, click_log: [], agent_run_log: [], last_updated: null };
    }
    throw new RegistryError(
      `Unable to read registry at ${REGISTRY_PATH}: ${(err as Error).message}`,
    );
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("root is not an object");
    }
    return parsed as RawRegistry;
  } catch (err) {
    throw new RegistryError(
      `Invalid JSON (possibly mid-write by the Python process): ${(err as Error).message}`,
    );
  }
}

/** Collapse both producer row shapes into one analytics-friendly record. */
function normalizeClick(
  raw: RawClick,
  offersById: Map<string, CpaOffer>,
): NormalizedClick | null {
  const offerId = asString(raw.offer_id) ?? asString(raw.offerId);
  const timestamp = asString(raw.timestamp);
  if (!offerId || !timestamp) return null;

  const offer = offersById.get(offerId);
  return {
    offerId,
    lang: asString(raw.lang),
    timestamp,
    offer,
    offerName: offer?.name ?? offerId,
    protocol: offer?.protocol ?? asString(raw.protocol) ?? "—",
    network: offer?.network ?? asString(raw.network) ?? "—",
    apy: offer?.apy ?? asFiniteNumber(raw.apy),
  };
}

function resolveMetrics(metrics: RawRegistry["metrics"]): ResolvedMetrics {
  const m = metrics ?? {};
  return {
    generatedArticles: asFiniteNumber(m.generated_articles_count) ?? 0,
    generatedVideoScripts: asFiniteNumber(m.generated_video_scripts_count) ?? 0,
    outboundClicks: asFiniteNumber(m.outbound_ctr_clicks) ?? 0,
  };
}

function byTimestampDesc(a: { timestamp: string }, b: { timestamp: string }) {
  return Date.parse(b.timestamp) - Date.parse(a.timestamp);
}

/**
 * Read the registry, join it to the CPA offer catalog and derive every figure
 * the admin dashboard needs in a single pass. Throws `RegistryError` on a
 * locked/corrupt file so the page surfaces the failure instead of faking data.
 */
export async function loadDashboardData(): Promise<DashboardData> {
  const [registry, offers] = await Promise.all([
    readRegistry(),
    loadCpaOffers().catch(() => [] as CpaOffer[]),
  ]);

  const offersById = new Map(offers.map((o) => [o.id, o]));

  const clicks = (Array.isArray(registry.click_log) ? registry.click_log : [])
    .map((row) => normalizeClick(row, offersById))
    .filter((c): c is NormalizedClick => c !== null)
    .sort(byTimestampDesc);

  const total = clicks.length;

  /* ---- per-offer leaderboard (seed with the full catalog so every vetted
     offer is visible even at zero clicks) -------------------------------- */
  const offerAgg = new Map<
    string,
    { clicks: number; lastClick: string | null; sample: NormalizedClick }
  >();

  for (const offer of offers) {
    offerAgg.set(offer.id, {
      clicks: 0,
      lastClick: null,
      sample: {
        offerId: offer.id,
        lang: null,
        timestamp: "",
        offer,
        offerName: offer.name,
        protocol: offer.protocol,
        network: offer.network,
        apy: offer.apy,
      },
    });
  }

  for (const click of clicks) {
    const entry = offerAgg.get(click.offerId) ?? {
      clicks: 0,
      lastClick: null,
      sample: click,
    };
    entry.clicks += 1;
    if (!entry.lastClick || Date.parse(click.timestamp) > Date.parse(entry.lastClick)) {
      entry.lastClick = click.timestamp;
    }
    offerAgg.set(click.offerId, entry);
  }

  const offerStats: OfferStat[] = Array.from(offerAgg.entries())
    .map(([offerId, agg]) => ({
      offerId,
      name: agg.sample.offerName,
      protocol: agg.sample.protocol,
      network: agg.sample.network,
      apy: agg.sample.apy,
      riskRating: agg.sample.offer?.riskRating ?? null,
      clicks: agg.clicks,
      share: total > 0 ? agg.clicks / total : 0,
      lastClick: agg.lastClick,
    }))
    .sort(
      (a, b) =>
        b.clicks - a.clicks ||
        (b.apy ?? 0) - (a.apy ?? 0) ||
        a.name.localeCompare(b.name),
    );

  /* ---- language distribution ------------------------------------------ */
  const langAgg = new Map<string, number>();
  for (const click of clicks) {
    const key = (click.lang ?? "unknown").toLowerCase();
    langAgg.set(key, (langAgg.get(key) ?? 0) + 1);
  }
  const langStats: LangStat[] = Array.from(langAgg.entries())
    .map(([lang, count]) => ({
      lang,
      clicks: count,
      share: total > 0 ? count / total : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  return {
    metrics: resolveMetrics(registry.metrics),
    offerStats,
    langStats,
    recentClicks: clicks.slice(0, RECENT_CLICK_LIMIT),
    totalClicks: total,
    uniqueOffers: offerStats.filter((s) => s.clicks > 0).length,
    lastUpdated: asString(registry.last_updated ?? null),
  };
}
