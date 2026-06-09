import type { Metadata } from "next";
import { SITE } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import {
  DEFAULT_OG_IMAGE,
  getMetadataBase,
  OG_IMAGE_DIMENSIONS,
} from "@/lib/seo/constants";
import { hreflangAlternates } from "@/lib/seo/urls";

export type PageMetadataInput = {
  lang: Locale;
  /** Locale-relative canonical path, e.g. `/en/news/my-article`. */
  path: string;
  title: string;
  description?: string;
  keywords?: string[];
  /** Open Graph type — defaults to `website`. */
  ogType?: "website" | "article";
  /** Override default OG/Twitter image path. */
  ogImage?: string;
  ogImageAlt?: string;
  /** Article-only Open Graph fields. */
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  /** When true, adds `x-default` hreflang pointing to English. */
  xDefault?: boolean;
  robots?: Metadata["robots"];
};

function ogLocale(lang: Locale): string {
  return lang === "ru" ? "ru_RU" : "en_US";
}

function ogAlternateLocale(lang: Locale): string {
  return lang === "ru" ? "en_US" : "ru_RU";
}

/**
 * Unified metadata builder for all TJT pages.
 *
 * Pages keep their Next.js `export async function generateMetadata()` and
 * delegate to this helper for canonical URLs, hreflang, OpenGraph, and Twitter.
 */
export function generatePageMetadata(input: PageMetadataInput): Metadata {
  const {
    lang,
    path,
    title,
    description,
    keywords,
    ogType = "website",
    ogImage = DEFAULT_OG_IMAGE,
    ogImageAlt,
    publishedTime,
    modifiedTime,
    section,
    tags,
    xDefault = false,
    robots,
  } = input;

  const languages = hreflangAlternates(
    (l) => path.replace(`/${lang}`, `/${l}`),
    { includeXDefault: xDefault },
  );

  const openGraph: Metadata["openGraph"] = {
    type: ogType,
    siteName: SITE.name,
    locale: ogLocale(lang),
    alternateLocale: ogAlternateLocale(lang),
    title,
    description,
    url: path,
    images: [
      {
        url: ogImage,
        ...OG_IMAGE_DIMENSIONS,
        alt: ogImageAlt ?? title,
      },
    ],
    ...(ogType === "article"
      ? {
          publishedTime,
          modifiedTime: modifiedTime ?? publishedTime,
          section,
          tags,
        }
      : {}),
  };

  return {
    metadataBase: getMetadataBase(),
    title,
    ...(description ? { description } : {}),
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: path,
      languages,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(robots ? { robots } : {}),
  };
}

/** Shorthand for pages that should not be indexed (404 shells, admin). */
export function noIndexMetadata(
  lang: Locale,
  path: string,
  title?: string,
  description?: string,
): Metadata {
  return generatePageMetadata({
    lang,
    path,
    title: title ?? "Not found",
    description,
    robots: { index: false, follow: true },
  });
}
