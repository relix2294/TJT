import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  DEFAULT_AGENT_METRICS,
  type AgentKind,
  type AgentLogEntry,
  type AgentLogLinkType,
  type AgentLogMetrics,
  isSlugLike,
} from "@/lib/agent-logs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGISTRY_PATH = path.resolve(process.cwd(), "..", "sys_registry.json");
const LOG_LIMIT = 18;
const READ_RETRIES = 3;
const READ_RETRY_MS = 60;

type RawAgentRunLog = {
  pipeline?: unknown;
  token?: unknown;
  mode?: unknown;
  timestamp?: unknown;
  action?: unknown;
  slug?: unknown;
  link?: unknown;
  message?: unknown;
};

const DEFAULT_LOGS: AgentLogEntry[] = (() => {
  const base = Date.now();
  return [
    {
      id: "init-seo",
      timestamp: new Date(base - 120_000).toISOString(),
      agent: "seo",
      message: "SEO Architect initialized — semantic core online",
      mode: "demo",
    },
    {
      id: "init-copywriter",
      timestamp: new Date(base - 90_000).toISOString(),
      agent: "copywriter",
      message: "Copywriter agent initialized — narrative engine ready",
      mode: "demo",
    },
    {
      id: "init-compliance",
      timestamp: new Date(base - 60_000).toISOString(),
      agent: "compliance",
      message: "Compliance module initialized — policy checks armed",
      mode: "demo",
    },
    {
      id: "init-orchestrator",
      timestamp: new Date(base - 30_000).toISOString(),
      agent: "system",
      message: "Multi-agent orchestrator standing by — awaiting pipeline triggers",
      mode: "demo",
    },
  ];
})();

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asFiniteNumber(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

function isLockError(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException).code;
  return code === "EBUSY" || code === "EAGAIN" || code === "EPERM" || code === "EACCES";
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function readRegistryRaw(): Promise<string | null> {
  for (let attempt = 1; attempt <= READ_RETRIES; attempt += 1) {
    try {
      return await fs.readFile(REGISTRY_PATH, "utf-8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      if (isLockError(err) && attempt < READ_RETRIES) {
        await sleep(READ_RETRY_MS * attempt);
        continue;
      }
      throw err;
    }
  }
  return null;
}

function resolveAgentKind(pipeline: string): AgentKind {
  const key = pipeline.toLowerCase();
  if (
    key.includes("seo") ||
    key.includes("publish") ||
    key.includes("article") ||
    key.includes("analytics")
  ) {
    return "seo";
  }
  if (key.includes("video") || key.includes("script") || key.includes("copy")) {
    return "copywriter";
  }
  if (key.includes("compliance") || key.includes("legal") || key.includes("policy")) {
    return "compliance";
  }
  return "system";
}

function inferLinkType(pipeline: string, slug: string | null): AgentLogLinkType | undefined {
  const key = pipeline.toLowerCase();
  if (key.includes("offer") || key.includes("cpa") || key.includes("click")) {
    return "offer";
  }
  if (
    key.includes("publish") ||
    key.includes("article") ||
    key.includes("seo") ||
    key.includes("news")
  ) {
    return "news";
  }
  if (slug && slug.includes("-")) {
    return "news";
  }
  return undefined;
}

function resolveSlug(raw: RawAgentRunLog): string | undefined {
  const explicit = asString(raw.slug);
  if (explicit && isSlugLike(explicit)) return explicit;

  const token = asString(raw.token);
  if (token && isSlugLike(token)) return token;

  return undefined;
}

function formatPipelineMessage(raw: RawAgentRunLog): string | null {
  const pipeline = asString(raw.pipeline);
  const timestamp = asString(raw.timestamp);
  const customMessage = asString(raw.message);
  if (customMessage && timestamp) return customMessage;
  if (!pipeline || !timestamp) return null;

  const token = asString(raw.token) ?? "—";
  const mode = asString(raw.mode);
  const action = asString(raw.action);
  const agent = resolveAgentKind(pipeline);

  const agentLabel =
    agent === "seo"
      ? "SEO Architect"
      : agent === "copywriter"
        ? "Copywriter"
        : agent === "compliance"
          ? "Compliance"
          : "Orchestrator";

  const modeSuffix = mode ? ` · ${mode}` : "";

  if (action) {
    return `${agentLabel}: article ${action} · ${token}${modeSuffix}`;
  }

  if (pipeline === "seo_article" || pipeline.includes("seo")) {
    return `${agentLabel}: SEO article pipeline · ${token}${modeSuffix}`;
  }

  if (pipeline === "video_script" || pipeline.includes("video")) {
    return `${agentLabel}: video script pipeline · ${token}${modeSuffix}`;
  }

  return `${agentLabel}: ${pipeline} · ${token}${modeSuffix}`;
}

function normalizeLog(raw: RawAgentRunLog, index: number): AgentLogEntry | null {
  const message = formatPipelineMessage(raw);
  const timestamp = asString(raw.timestamp);
  const pipeline = asString(raw.pipeline);
  if (!message || !timestamp || !pipeline) return null;

  const slug = resolveSlug(raw);
  const link = asString(raw.link) ?? undefined;
  const linkType = link?.startsWith("http")
    ? ("external" as const)
    : inferLinkType(pipeline, slug ?? null);

  return {
    id: `${timestamp}-${pipeline}-${index}`,
    timestamp,
    agent: resolveAgentKind(pipeline),
    message,
    mode: asString(raw.mode) ?? undefined,
    slug,
    link,
    linkType,
  };
}

function parseMetrics(raw: string | null): AgentLogMetrics {
  if (!raw?.trim()) return { ...DEFAULT_AGENT_METRICS };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ...DEFAULT_AGENT_METRICS };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ...DEFAULT_AGENT_METRICS };
  }

  const metrics = (parsed as { metrics?: Record<string, unknown> }).metrics ?? {};
  return {
    generated_articles_count: asFiniteNumber(metrics.generated_articles_count),
    generated_video_scripts_count: asFiniteNumber(metrics.generated_video_scripts_count),
    outbound_ctr_clicks: asFiniteNumber(metrics.outbound_ctr_clicks),
  };
}

function parseAgentLogs(raw: string | null): AgentLogEntry[] {
  if (!raw?.trim()) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return [];
  }

  const rows = (parsed as { agent_run_log?: unknown }).agent_run_log;
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row, index) =>
      typeof row === "object" && row !== null
        ? normalizeLog(row as RawAgentRunLog, index)
        : null,
    )
    .filter((entry): entry is AgentLogEntry => entry !== null)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

function buildResponse(raw: string | null) {
  const metrics = parseMetrics(raw);
  const logs = parseAgentLogs(raw);
  const payload =
    logs.length > 0 ? logs.slice(0, LOG_LIMIT) : DEFAULT_LOGS.slice(0, LOG_LIMIT);

  return { success: true as const, metrics, logs: payload };
}

export async function GET() {
  try {
    const raw = await readRegistryRaw();
    return NextResponse.json(buildResponse(raw), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[agent-logs] Registry read failed — serving default payload", err);
    return NextResponse.json(
      {
        success: true,
        metrics: { ...DEFAULT_AGENT_METRICS },
        logs: DEFAULT_LOGS.slice(0, LOG_LIMIT),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
