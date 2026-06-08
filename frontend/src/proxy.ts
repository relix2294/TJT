import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-session";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
  localeFromAcceptLanguage,
  type Locale,
} from "@/lib/i18n";

/**
 * Locale proxy (Next.js 16 renamed the `middleware` convention to `proxy`).
 *
 * Runs before every page request and guarantees a locale prefix is always
 * present in the URL. Language is detected automatically, with no user action:
 *
 *   1. An explicit choice saved in the `NEXT_LOCALE` cookie wins.
 *   2. Otherwise the browser `Accept-Language` header decides (ru → /ru, else /en).
 *
 * The resolved locale is then persisted back into `NEXT_LOCALE` so the choice
 * is sticky across the session.
 */

function persistLocale(response: NextResponse, locale: Locale): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

function localeInPathname(pathname: string): Locale | null {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return null;
}

function resolveLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  return localeFromAcceptLanguage(request.headers.get("accept-language"));
}

function isAdminDashboardPath(pathname: string): boolean {
  return pathname.includes("/admin/dashboard");
}

async function guardAdminDashboard(
  request: NextRequest,
  locale: Locale,
): Promise<NextResponse | null> {
  const adminPassword = process.env.ADMIN_PASSWORD?.trim() ?? "";
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authorized = await isValidAdminSession(session, adminPassword);
  if (authorized) return null;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = `/${locale}/admin/login`;
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // The URL already carries a supported locale: let it through, but keep the
  // cookie in sync so navigating via a link counts as choosing that language.
  const current = localeInPathname(pathname);
  if (current) {
    if (isAdminDashboardPath(pathname)) {
      const denied = await guardAdminDashboard(request, current);
      if (denied) return denied;
    }

    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== current) {
      persistLocale(response, current);
    }
    return response;
  }

  // No locale prefix yet: detect one and redirect (e.g. /news -> /en/news).
  const locale = resolveLocale(request);
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return persistLocale(NextResponse.redirect(redirectUrl), locale);
}

export const config = {
  /**
   * Run on everything except API routes, Next internals, metadata files and
   * any request that looks like a static asset (contains a dot). Excluding
   * these keeps CSS/JS/images and the JSON content API free of locale rewrites.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
