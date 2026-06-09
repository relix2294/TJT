import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

/**
 * robots.txt — fully indexable public hub; API plumbing stays out of crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/*/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
