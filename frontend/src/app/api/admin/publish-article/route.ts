import { timingSafeEqual } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { NEWS_CATEGORIES } from "@/lib/config";
import {
  JsonFileLockError,
  JsonFileStoreError,
  withLockedJsonUpdate,
} from "@/lib/json-file-store";
import { sendErrorToTelegram } from "@/lib/telegram-logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONFIG_PATH = path.resolve(process.cwd(), "..", "config.json");
const REGISTRY_PATH = path.resolve(process.cwd(), "..", "sys_registry.json");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const NEWS_CATEGORY_SET: ReadonlySet<string> = new Set(NEWS_CATEGORIES);
const AGENT_RUN_LOG_CAP = 200;

/** Bilingual string leaf as stored in config.json. */
export interface LocalizedString {
  en: string;
  ru: string;
}

/** Incoming article payload from AI agents (API contract). */
export interface PublishArticlePayload {
  slug: string;
  category: string;
  date: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString;
  lang?: "en" | "ru";
  seo_keywords?: { en: string[]; ru: string[] };
}

/** Raw news row shape written to config.json (snake_case). */
interface ConfigNewsEntry {
  id: string;
  slug: string;
  category: string;
  published_at: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString;
  seo_keywords: { en: string[]; ru: string[] };
}

type AgentRunLogEntry = {
  pipeline: string;
  token: string;
  mode: string;
  timestamp: string;
  action: "created" | "updated";
};

type RegistryMetrics = {
  generated_articles_count: number;
  generated_video_scripts_count: number;
  outbound_ctr_clicks: number;
  [metric: string]: number;
};

type Registry = {
  metrics: RegistryMetrics;
  click_log: unknown[];
  agent_run_log: AgentRunLogEntry[];
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

function safeErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message && !err.message.includes("/")) {
    return err.message;
  }
  return "An internal error occurred while publishing the article.";
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_API_SECRET?.trim();
  if (!secret) {
    console.error(
      "[publish-article] ADMIN_API_SECRET is not set in frontend/.env — rejecting all requests.",
    );
    return false;
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    console.error("[publish-article] Missing or malformed Authorization header.");
    return false;
  }

  const token = header.slice("Bearer ".length);
  if (token.length !== secret.length) return false;

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(secret));
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseLocalizedString(
  value: unknown,
  label: string,
): LocalizedString | null {
  if (!isRecord(value)) return null;
  const en = value.en;
  const ru = value.ru;
  if (typeof en !== "string" || !en.trim() || typeof ru !== "string" || !ru.trim()) {
    return null;
  }
  return { en: en.trim(), ru: ru.trim() };
}

function parseSeoKeywords(
  value: unknown,
): { en: string[]; ru: string[] } | null {
  if (!isRecord(value)) return null;
  const en = value.en;
  const ru = value.ru;
  if (!Array.isArray(en) || !Array.isArray(ru)) return null;
  const enKeywords = en.filter((k): k is string => typeof k === "string" && k.trim());
  const ruKeywords = ru.filter((k): k is string => typeof k === "string" && k.trim());
  if (!enKeywords.length || !ruKeywords.length) return null;
  return { en: enKeywords, ru: ruKeywords };
}

function parsePayload(body: unknown): PublishArticlePayload | string {
  if (!isRecord(body)) return "Request body must be a JSON object.";

  const slug = body.slug;
  if (typeof slug !== "string" || !slug.trim()) {
    return "slug must be a non-empty string.";
  }

  const category = body.category;
  if (typeof category !== "string" || !NEWS_CATEGORY_SET.has(category)) {
    return `category must be one of: ${NEWS_CATEGORIES.join(", ")}.`;
  }

  const date = body.date;
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return "date must be a string in YYYY-MM-DD format.";
  }
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  if (
    parsed.getUTCFullYear() !== y ||
    parsed.getUTCMonth() !== m - 1 ||
    parsed.getUTCDate() !== d
  ) {
    return "date is not a valid calendar date.";
  }

  const title = parseLocalizedString(body.title, "title");
  if (!title) return "title must be { en: string, ru: string } with non-empty values.";

  const description = parseLocalizedString(body.description, "description");
  if (!description) {
    return "description must be { en: string, ru: string } with non-empty values.";
  }

  const content = parseLocalizedString(body.content, "content");
  if (!content) return "content must be { en: string, ru: string } with non-empty values.";

  const lang = body.lang;
  if (lang !== undefined && lang !== "en" && lang !== "ru") {
    return "lang must be 'en' or 'ru' when provided.";
  }

  const seoKeywordsRaw = body.seo_keywords;
  const seo_keywords =
    seoKeywordsRaw === undefined
      ? undefined
      : parseSeoKeywords(seoKeywordsRaw);
  if (seoKeywordsRaw !== undefined && !seo_keywords) {
    return "seo_keywords must be { en: string[], ru: string[] } with non-empty arrays.";
  }

  return {
    slug: slug.trim(),
    category,
    date,
    title,
    description,
    content,
    ...(lang !== undefined ? { lang } : {}),
    ...(seo_keywords !== undefined ? { seo_keywords } : {}),
  };
}

function dateToPublishedAt(date: string): string {
  return `${date}T12:00:00.000Z`;
}

function defaultSeoKeywords(slug: string): { en: string[]; ru: string[] } {
  const token = slug.replace(/-/g, " ");
  return { en: [token], ru: [token] };
}

function toConfigEntry(
  payload: PublishArticlePayload,
  existing?: ConfigNewsEntry,
): ConfigNewsEntry {
  return {
    id: existing?.id ?? `news-${payload.slug}`,
    slug: payload.slug,
    category: payload.category,
    published_at: dateToPublishedAt(payload.date),
    title: payload.title,
    description: payload.description,
    content: payload.content,
    seo_keywords:
      payload.seo_keywords ??
      existing?.seo_keywords ??
      defaultSeoKeywords(payload.slug),
  };
}

function normalizeRegistry(raw: Partial<Registry>): Registry {
  return {
    ...EMPTY_REGISTRY,
    ...raw,
    metrics: { ...EMPTY_REGISTRY.metrics, ...(raw.metrics ?? {}) },
    click_log: raw.click_log ?? [],
    agent_run_log: (raw.agent_run_log ?? []) as AgentRunLogEntry[],
  };
}

async function syncRegistryAfterPublish(
  slug: string,
  action: "created" | "updated",
): Promise<void> {
  await withLockedJsonUpdate(REGISTRY_PATH, EMPTY_REGISTRY, (raw) => {
    const registry = normalizeRegistry(raw);

    if (action === "created") {
      registry.metrics.generated_articles_count =
        (registry.metrics.generated_articles_count ?? 0) + 1;
    }

    registry.agent_run_log.push({
      pipeline: "publish-article",
      token: slug,
      mode: "api",
      timestamp: new Date().toISOString(),
      action,
    });
    registry.agent_run_log = registry.agent_run_log.slice(-AGENT_RUN_LOG_CAP);
    registry.last_updated = new Date().toISOString();

    return registry;
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 500 },
    );
  }

  const parsed = parsePayload(body);
  if (typeof parsed === "string") {
    return NextResponse.json(
      { success: false, error: parsed },
      { status: 500 },
    );
  }

  try {
    let action: "created" | "updated" = "created";

    await withLockedJsonUpdate(
      CONFIG_PATH,
      {} as Record<string, unknown>,
      (root) => {
        if (!isRecord(root)) {
          throw new JsonFileStoreError("Configuration root must be a JSON object.");
        }

        const newsRaw = root.news;
        const news: ConfigNewsEntry[] = Array.isArray(newsRaw)
          ? (newsRaw as ConfigNewsEntry[])
          : [];

        const index = news.findIndex((item) => item?.slug === parsed.slug);
        action = index >= 0 ? "updated" : "created";
        const entry = toConfigEntry(
          parsed,
          index >= 0 ? news[index] : undefined,
        );

        if (index >= 0) {
          news[index] = entry;
        } else {
          news.unshift(entry);
        }

        return { ...root, news };
      },
    );

    try {
      await syncRegistryAfterPublish(parsed.slug, action);
    } catch (err) {
      console.error(
        `[publish-article] Article "${parsed.slug}" saved to config, but sys_registry.json ` +
          "could not be updated (likely locked by the Python/Streamlit process).",
        err,
      );
      await sendErrorToTelegram(
        err instanceof Error ? err : new Error(String(err)),
        `publish-article: config saved for slug=${parsed.slug}, but sys_registry.json sync failed`,
      );
    }

    return NextResponse.json({ success: true, slug: parsed.slug });
  } catch (err) {
    if (err instanceof JsonFileLockError) {
      console.error(
        `[publish-article] Lock contention on config.json or sys_registry.json:`,
        err,
      );
    } else {
      console.error("[publish-article] Failed to publish article:", err);
    }
    await sendErrorToTelegram(
      err instanceof Error ? err : new Error(String(err)),
      "publish-article: failed to read or write config.json",
    );
    return NextResponse.json(
      { success: false, error: safeErrorMessage(err) },
      { status: err instanceof JsonFileLockError ? 503 : 500 },
    );
  }
}
