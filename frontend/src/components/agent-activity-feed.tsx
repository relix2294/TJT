"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";
import {
  DEFAULT_AGENT_METRICS,
  resolveLogHref,
  type AgentKind,
  type AgentLogEntry,
  type AgentLogMetrics,
  type AgentLogsResponse,
} from "@/lib/agent-logs";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const POLL_MS = 10_000;

const URL_RE = /https?:\/\/[^\s<>"']+/gi;
const SLUG_IN_TEXT_RE = /\b([a-z0-9]+(?:-[a-z0-9]+){2,})\b/gi;

const WIDGET_COPY: Record<
  Locale,
  { eyebrow: string; title: string; empty: string; metrics: (m: AgentLogMetrics) => string }
> = {
  en: {
    eyebrow: "Live agents",
    title: "AI Agents Activity",
    empty: "Awaiting agent telemetry…",
    metrics: (m) =>
      `AI Articles: ${m.generated_articles_count} | Clicks tracked: ${m.outbound_ctr_clicks}`,
  },
  ru: {
    eyebrow: "Live-агенты",
    title: "AI Agents Activity",
    empty: "Ожидание телеметрии агентов…",
    metrics: (m) =>
      `ИИ-Статей: ${m.generated_articles_count} | Кликов отслежено: ${m.outbound_ctr_clicks}`,
  },
};

/** Pulse beacon colors: blue SEO, purple copywriter, emerald compliance. */
const BEACON_CLASS: Record<AgentKind, string> = {
  seo: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.45)]",
  copywriter: "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.45)]",
  compliance: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]",
  system:
    "bg-muted-foreground shadow-[0_0_6px_color-mix(in_srgb,var(--muted-foreground)_35%,transparent)]",
};

function formatLogTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--:--";
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

type MessageSegment =
  | { kind: "text"; value: string }
  | { kind: "link"; value: string; href: string; external?: boolean };

function splitByPattern(
  text: string,
  pattern: RegExp,
  hrefFor: (match: string) => string | null,
  external = false,
): MessageSegment[] {
  const segments: MessageSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(pattern.source, pattern.flags);
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const raw = match[0];
    const captured = match[1] ?? raw;
    const start = match.index;
    if (start > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, start) });
    }
    const href = hrefFor(captured);
    if (href) {
      segments.push({ kind: "link", value: captured, href, external });
    } else {
      segments.push({ kind: "text", value: raw });
    }
    lastIndex = start + raw.length;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ kind: "text", value: text }];
}

function buildMessageSegments(entry: AgentLogEntry, lang: Locale): MessageSegment[] {
  const entryHref = resolveLogHref(lang, entry);
  const linkType = entry.linkType ?? "news";

  let segments: MessageSegment[] = [{ kind: "text", value: entry.message }];

  if (entry.slug && entryHref) {
    segments = splitByPattern(entry.message, new RegExp(entry.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), () => entryHref);
  }

  const withUrls: MessageSegment[] = [];
  for (const seg of segments) {
    if (seg.kind === "link") {
      withUrls.push(seg);
      continue;
    }
    withUrls.push(
      ...splitByPattern(seg.value, URL_RE, (url) => url, true),
    );
  }

  const withSlugs: MessageSegment[] = [];
  for (const seg of withUrls) {
    if (seg.kind === "link") {
      withSlugs.push(seg);
      continue;
    }
    withSlugs.push(
      ...splitByPattern(seg.value, SLUG_IN_TEXT_RE, (slug) => {
        if (entry.slug && slug === entry.slug && entryHref) return entryHref;
        if (linkType === "offer") return `/${lang}/offers/${slug}`;
        return `/${lang}/news/${slug}`;
      }),
    );
  }

  return withSlugs;
}

function LinkedLogMessage({ entry, lang }: { entry: AgentLogEntry; lang: Locale }) {
  const segments = buildMessageSegments(entry, lang);

  return (
    <p className="mt-0.5 text-[11px] leading-relaxed text-foreground/90" title={entry.message}>
      {segments.map((seg, i) =>
        seg.kind === "link" ? (
          seg.external ? (
            <a
              key={`${entry.id}-link-${i}`}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 transition-colors hover:underline"
            >
              {seg.value}
            </a>
          ) : (
            <Link
              key={`${entry.id}-link-${i}`}
              href={seg.href}
              className="text-sky-400 transition-colors hover:underline"
            >
              {seg.value}
            </Link>
          )
        ) : (
          <Fragment key={`${entry.id}-text-${i}`}>{seg.value}</Fragment>
        ),
      )}
    </p>
  );
}

type AgentActivityFeedProps = {
  lang: Locale;
  className?: string;
};

export function AgentActivityFeed({ lang, className }: AgentActivityFeedProps) {
  const copy = WIDGET_COPY[lang];
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [metrics, setMetrics] = useState<AgentLogMetrics>(DEFAULT_AGENT_METRICS);
  const [loading, setLoading] = useState(true);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/agent-logs", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as AgentLogsResponse;
      if (!data.success || !Array.isArray(data.logs)) return;

      if (data.metrics) {
        setMetrics(data.metrics);
      }

      const incoming = data.logs;
      const nextFresh = new Set<string>();
      for (const entry of incoming) {
        if (!seenIdsRef.current.has(entry.id)) {
          nextFresh.add(entry.id);
          seenIdsRef.current.add(entry.id);
        }
      }

      if (nextFresh.size > 0) {
        setFreshIds(nextFresh);
        window.setTimeout(() => setFreshIds(new Set()), 600);
      }

      setLogs(incoming);
    } catch {
      // Keep the last good snapshot on transient network errors.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
    const timer = window.setInterval(() => void fetchLogs(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [fetchLogs]);

  return (
    <section
      className={cn(
        "glass overflow-hidden rounded-xl border border-border/60 p-4 sm:p-5",
        className,
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-3 border-b border-border/60 pb-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {copy.eyebrow}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Activity className="size-3.5 shrink-0 text-muted-foreground" />
            <h2 className="font-heading text-sm font-bold tracking-tight text-foreground sm:text-base">
              {copy.title}
            </h2>
          </div>
          <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-muted-foreground/80">
            {copy.metrics(metrics)}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-surface-2 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-profit" />
          LIVE
        </span>
      </header>

      <div
        className="terminal-scroll relative max-h-[350px] overflow-y-auto rounded-lg border border-border/60 bg-background/40 p-2.5 font-mono"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading && logs.length === 0 ? (
          <ul className="space-y-2" aria-hidden>
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex gap-2.5">
                <div className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="h-2.5 w-14 animate-pulse rounded bg-muted/80" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted/60" />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {!loading && logs.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">{copy.empty}</p>
        ) : null}

        {logs.length > 0 ? (
          <ul className="space-y-0">
            {logs.map((entry, index) => (
              <li
                key={entry.id}
                className={cn(
                  "flex gap-2.5 border-b border-border/40 py-2 last:border-b-0",
                  freshIds.has(entry.id) && "animate-log-enter",
                )}
                style={freshIds.has(entry.id) ? { animationDelay: `${index * 40}ms` } : undefined}
              >
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full animate-pulse-dot",
                    BEACON_CLASS[entry.agent],
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <time
                    className="font-mono text-[10px] tabular-nums text-muted-foreground"
                    dateTime={entry.timestamp}
                  >
                    [{formatLogTime(entry.timestamp)}]
                  </time>
                  <LinkedLogMessage entry={entry} lang={lang} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
