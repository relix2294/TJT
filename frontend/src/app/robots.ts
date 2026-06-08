import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

const FALLBACK_BASE_URL = "https://yourdomain.com";

function getBaseUrl(): string {
  return SITE.url || FALLBACK_BASE_URL;
}

/**
 * robots.txt — fully indexable public hub; API plumbing stays out of crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
