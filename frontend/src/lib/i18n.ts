/**
 * TJT internationalization core — strictly two locales.
 *
 * `en` is the global default; `ru` targets the CIS region. Every other piece
 * of the stack (proxy redirects, `[lang]` routes, the content layer) derives
 * its behavior from the constants and helpers defined here, so the supported
 * language set lives in exactly one place.
 *
 * This module is intentionally dependency-free and runtime-agnostic: it is
 * imported by the request proxy (Edge/Node), Server Components and Client
 * Components alike, so it must never reach for `node:*` or browser globals.
 */

export const LOCALES = ["en", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

/** Global default — served to everyone who is not explicitly Russian-speaking. */
export const DEFAULT_LOCALE: Locale = "en";

/** Cookie that persists an explicit/derived language choice across visits. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** One year — long-lived so a returning visitor keeps their language. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Narrowing type guard used to validate cookies, params and query strings. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * A value translated into every supported locale.
 * The content layer stores localizable fields as `Localized<T>` and resolves
 * them down to a single `T` for the active request.
 */
export type Localized<T> = { [L in Locale]: T };

/** Resolve a `Localized<T>` to the value for `lang` (falls back to default). */
export function pickLocalized<T>(value: Localized<T>, lang: Locale): T {
  return value[lang] ?? value[DEFAULT_LOCALE];
}

/**
 * Pick the best supported locale from an `Accept-Language` header.
 *
 * The header is parsed by descending quality (`q`) weight; the first entry
 * whose primary subtag is a CIS/Russian language resolves to `ru`, otherwise
 * we fall back to the global English default. This keeps the rule the product
 * asked for simple and explicit: "Russian browsers → /ru, everyone else → /en".
 */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (primary === "ru") return "ru";
    if (primary === "en") return "en";
  }

  return DEFAULT_LOCALE;
}
