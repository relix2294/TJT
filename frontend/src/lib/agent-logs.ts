export type AgentKind = "seo" | "copywriter" | "compliance" | "system";

export type AgentLogLinkType = "news" | "offer" | "external";

export type AgentLogEntry = {
  id: string;
  timestamp: string;
  agent: AgentKind;
  message: string;
  mode?: string;
  /** Article or offer slug for contextual deep-linking. */
  slug?: string;
  /** Absolute URL when the backend supplies one directly. */
  link?: string;
  linkType?: AgentLogLinkType;
};

export type AgentLogMetrics = {
  generated_articles_count: number;
  generated_video_scripts_count: number;
  outbound_ctr_clicks: number;
};

export type AgentLogsResponse = {
  success: boolean;
  metrics: AgentLogMetrics;
  logs: AgentLogEntry[];
};

export const DEFAULT_AGENT_METRICS: AgentLogMetrics = {
  generated_articles_count: 0,
  generated_video_scripts_count: 0,
  outbound_ctr_clicks: 0,
};

/** Slug-like token: lowercase alphanumerics with hyphens, no spaces. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)+$/i;

export function isSlugLike(value: string): boolean {
  return SLUG_RE.test(value.trim());
}

export function resolveLogHref(
  lang: string,
  entry: Pick<AgentLogEntry, "slug" | "link" | "linkType">,
): string | null {
  if (entry.link) {
    if (/^https?:\/\//i.test(entry.link)) return entry.link;
    return entry.link.startsWith("/") ? entry.link : `/${entry.link}`;
  }
  if (!entry.slug) return null;
  if (entry.linkType === "offer") return `/${lang}/offers/${entry.slug}`;
  if (entry.linkType === "news") return `/${lang}/news/${entry.slug}`;
  return `/${lang}/news/${entry.slug}`;
}
