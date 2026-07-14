import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionValue,
  resolveSessionSigningSecret,
} from "@/lib/admin-session";
import { clearFailures, isRateLimited, recordFailure } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Max failed login attempts per client within the window, then 429. */
const LOGIN_MAX_FAILURES = 10;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function resolveAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

/**
 * Best-effort client identifier for rate limiting. Uses the first hop of
 * `x-forwarded-for` (set by the reverse proxy), falling back to a shared
 * bucket when no proxy header is present.
 */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first && first.length > 0 ? first : "unknown";
}

function passwordsMatch(input: string, expected: string): boolean {
  if (!expected || input.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rateKey = clientKey(request);
  const limit = isRateLimited(rateKey, LOGIN_MAX_FAILURES);
  if (limit.limited) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const adminPassword = resolveAdminPassword();
  if (!adminPassword) {
    console.error("[admin/auth] ADMIN_PASSWORD is not set — rejecting all requests.");
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 401 });
  }

  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof (body as { password: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (!passwordsMatch(password, adminPassword)) {
    recordFailure(rateKey, LOGIN_WINDOW_MS);
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  clearFailures(rateKey);
  const sessionValue = await createAdminSessionValue(resolveSessionSigningSecret());
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionValue, adminSessionCookieOptions());
  return response;
}
