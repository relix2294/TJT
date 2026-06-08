import { NextResponse, type NextRequest } from "next/server";
import path from "node:path";
import { withLockedJsonUpdate } from "@/lib/json-file-store";
import { loadCpaOffers } from "@/lib/server-config";
import { sendErrorToTelegram } from "@/lib/telegram-logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The shared system registry is the single source of truth for the whole repo.
 * It lives at the project root, next to the Python/Streamlit backend, one level
 * ABOVE the Next.js app dir (process.cwd() === `frontend/` in dev and prod).
 * Both this route and `ai_agents.log_outbound_click` append to the same file.
 */
const REGISTRY_PATH = path.resolve(process.cwd(), "..", "sys_registry.json");

/** Keep the click log bounded; identical to the Python `[-500:]` cap. */
const CLICK_LOG_CAP = 500;

type SupportedLang = "en" | "ru";

/**
 * Mirrors the object appended by `ai_agents.log_outbound_click`. The timestamp
 * is an ISO-8601 UTC string to match `datetime.now(timezone.utc).isoformat()`.
 */
type ClickLogEntry = {
  timestamp: string;
  offer_id: string;
  lang: SupportedLang;
  status: "success";
};

type RegistryMetrics = {
  generated_articles_count: number;
  generated_video_scripts_count: number;
  outbound_ctr_clicks: number;
  [metric: string]: number;
};

type Registry = {
  metrics: RegistryMetrics;
  click_log: ClickLogEntry[];
  agent_run_log: unknown[];
  last_updated: string | null;
};

const EMPTY_REGISTRY: Registry = {
  metrics: {
    generated_articles_count: 0,
    generated_video_scripts_count: 0,
    outbound_ctr_clicks: 0,
  },
  click_log: [],
  agent_run_log: [],
  last_updated: null,
};

/**
 * Resolve the interface language of the page where the click happened.
 * Order: explicit URL locale segment of the referrer → browser preference →
 * default to the primary interface language (`ru`).
 */
function resolveLang(request: Request): SupportedLang {
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const head = new URL(referer).pathname
        .split("/")
        .filter(Boolean)[0]
        ?.toLowerCase();
      if (head === "en" || head === "ru") return head;
    } catch {
      // Malformed referer header — ignore and fall through.
    }
  }

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  if (accept.startsWith("ru") || accept.includes("ru-")) return "ru";
  if (accept.startsWith("en") || accept.includes("en-")) return "en";

  return "ru";
}

function normalizeRegistry(raw: Partial<Registry>): Registry {
  return {
    ...EMPTY_REGISTRY,
    ...raw,
    metrics: { ...EMPTY_REGISTRY.metrics, ...(raw.metrics ?? {}) },
    click_log: (raw.click_log ?? []) as ClickLogEntry[],
    agent_run_log: raw.agent_run_log ?? [],
  };
}

async function recordClick(
  offer: Awaited<ReturnType<typeof loadCpaOffers>>[number],
  lang: SupportedLang,
): Promise<number | null> {
  let total: number | null = null;
  try {
    const registry = await withLockedJsonUpdate(
      REGISTRY_PATH,
      EMPTY_REGISTRY,
      (raw) => {
        const next = normalizeRegistry(raw);

        next.click_log.push({
          timestamp: new Date().toISOString(),
          offer_id: offer.id,
          lang,
          status: "success",
        });
        next.click_log = next.click_log.slice(-CLICK_LOG_CAP);

        next.metrics.outbound_ctr_clicks =
          (next.metrics.outbound_ctr_clicks ?? 0) + 1;
        next.last_updated = new Date().toISOString();

        return next;
      },
    );
    total = registry.metrics.outbound_ctr_clicks;
  } catch (err) {
    console.error(
      `[click-track] Could not sync sys_registry.json (offer=${offer.id}, lang=${lang}). ` +
        "The file is likely locked by the Python/Streamlit process or blocked by permissions. " +
        "Returning success so the user is still redirected to the referral link.",
      err,
    );
    await sendErrorToTelegram(
      err instanceof Error ? err : new Error(String(err)),
      `click-track: failed to sync sys_registry.json (offer=${offer.id}, lang=${lang}) — ` +
        "file likely locked by the Python/Streamlit process or blocked by permissions",
    );
  }
  return total;
}

export async function GET(request: NextRequest) {
  const offerId = request.nextUrl.searchParams.get("offerId");
  if (!offerId) {
    return NextResponse.json(
      { ok: false, error: "offerId is required" },
      { status: 400 },
    );
  }

  const langParam = request.nextUrl.searchParams.get("lang");
  const lang: SupportedLang =
    langParam === "en" || langParam === "ru" ? langParam : resolveLang(request);

  let offers: Awaited<ReturnType<typeof loadCpaOffers>>;
  try {
    offers = await loadCpaOffers(lang);
  } catch (err) {
    console.error("[click-track] Failed to load offers", err);
    return NextResponse.json(
      { ok: false, error: "Config unavailable" },
      { status: 503 },
    );
  }

  const offer = offers.find((o) => o.id === offerId);
  if (!offer) {
    return NextResponse.json(
      { ok: false, error: "Unknown offerId" },
      { status: 404 },
    );
  }

  await recordClick(offer, lang);
  return NextResponse.redirect(offer.referralUrl, 302);
}

export async function POST(request: Request) {
  let offerId: unknown;
  let requestedLang: unknown;
  try {
    const body = await request.json();
    offerId = body?.offerId;
    requestedLang = body?.lang;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (typeof offerId !== "string" || !offerId) {
    return NextResponse.json(
      { ok: false, error: "offerId is required" },
      { status: 400 },
    );
  }

  const lang: SupportedLang =
    requestedLang === "en" || requestedLang === "ru"
      ? requestedLang
      : resolveLang(request);

  let offers: Awaited<ReturnType<typeof loadCpaOffers>>;
  try {
    offers = await loadCpaOffers(lang);
  } catch (err) {
    console.error("[click-track] Failed to load offers", err);
    return NextResponse.json(
      { ok: false, error: "Config unavailable" },
      { status: 503 },
    );
  }

  const offer = offers.find((o) => o.id === offerId);
  if (!offer) {
    return NextResponse.json(
      { ok: false, error: "Unknown offerId" },
      { status: 404 },
    );
  }

  const total = await recordClick(offer, lang);

  return NextResponse.json({
    ok: true,
    total,
    offer: {
      id: offer.id,
      name: offer.name,
      protocol: offer.protocol,
      network: offer.network,
      referralUrl: offer.referralUrl,
    },
  });
}
