import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionValue,
} from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
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
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const sessionValue = await createAdminSessionValue(adminPassword);
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionValue, adminSessionCookieOptions());
  return response;
}
