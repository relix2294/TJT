import { SITE } from "@/lib/config";

/** Fallback when `SITE.url` is unset — keeps sitemap/robots from emitting empty URLs. */
export const FALLBACK_BASE_URL = "https://yourdomain.com";

/** Default Open Graph / Twitter card image (served from `/public`). */
export const DEFAULT_OG_IMAGE = "/og-card.png";

export const OG_IMAGE_DIMENSIONS = { width: 1200, height: 630 } as const;

/** Resolve the canonical public origin for absolute URLs. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return SITE.url || FALLBACK_BASE_URL;
}

/** Next.js `metadataBase` — all relative OG/Twitter image paths resolve against this. */
export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}
