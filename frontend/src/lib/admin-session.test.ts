import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createAdminSessionValue,
  isValidAdminSession,
} from "@/lib/admin-session";

const SECRET = "super-secret-signing-key";

afterEach(() => {
  vi.useRealTimers();
});

describe("admin-session", () => {
  it("accepts a freshly minted session with the same secret", async () => {
    const value = await createAdminSessionValue(SECRET);
    expect(await isValidAdminSession(value, SECRET)).toBe(true);
  });

  it("rejects a session verified with a different secret", async () => {
    const value = await createAdminSessionValue(SECRET);
    expect(await isValidAdminSession(value, "other-secret")).toBe(false);
  });

  it("rejects a tampered signature", async () => {
    const value = await createAdminSessionValue(SECRET);
    const [expires] = value.split(".");
    const forged = `${expires}.deadbeef`;
    expect(await isValidAdminSession(forged, SECRET)).toBe(false);
  });

  it("rejects a tampered (extended) expiry", async () => {
    const value = await createAdminSessionValue(SECRET);
    const sig = value.split(".")[1];
    const farFuture = Math.floor(Date.now() / 1000) + 999_999_999;
    const forged = `${farFuture}.${sig}`;
    expect(await isValidAdminSession(forged, SECRET)).toBe(false);
  });

  it("rejects an expired session", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const value = await createAdminSessionValue(SECRET);
    expect(await isValidAdminSession(value, SECRET)).toBe(true);

    // Jump past the 7-day max age.
    vi.setSystemTime(new Date("2026-02-01T00:00:00Z"));
    expect(await isValidAdminSession(value, SECRET)).toBe(false);
  });

  it("rejects empty inputs", async () => {
    expect(await isValidAdminSession(undefined, SECRET)).toBe(false);
    expect(await isValidAdminSession("only-one-part", SECRET)).toBe(false);
    const value = await createAdminSessionValue(SECRET);
    expect(await isValidAdminSession(value, "")).toBe(false);
  });
});
