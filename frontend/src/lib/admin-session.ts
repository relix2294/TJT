/**
 * Signed admin session cookie — Edge/Node safe (Web Crypto only).
 *
 * Cookie format: `{expiresUnixSec}.{base64urlHmac}`
 * HMAC-SHA256 is computed over the expiry timestamp with ADMIN_PASSWORD as key.
 */

export const ADMIN_SESSION_COOKIE = "tjt_admin_session";

/** Seven days — matches product requirement. */
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const textEncoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signExpiry(expires: number, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, textEncoder.encode(String(expires)));
  return base64UrlEncode(new Uint8Array(sig));
}

export async function createAdminSessionValue(secret: string): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const signature = await signExpiry(expires, secret);
  return `${expires}.${signature}`;
}

export async function isValidAdminSession(
  cookieValue: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!cookieValue || !secret) return false;

  const dot = cookieValue.indexOf(".");
  if (dot <= 0) return false;

  const expiresRaw = cookieValue.slice(0, dot);
  const signature = cookieValue.slice(dot + 1);
  const expires = Number.parseInt(expiresRaw, 10);
  if (!Number.isFinite(expires)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (expires <= now) return false;

  const expected = await signExpiry(expires, secret);
  return timingSafeEqual(signature, expected);
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}
