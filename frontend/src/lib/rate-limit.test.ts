import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearFailures,
  isRateLimited,
  recordFailure,
} from "@/lib/rate-limit";

const WINDOW = 10_000;
const LIMIT = 3;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("rate-limit", () => {
  it("allows attempts below the limit", () => {
    const key = "ip-below";
    recordFailure(key, WINDOW);
    recordFailure(key, WINDOW);
    expect(isRateLimited(key, LIMIT).limited).toBe(false);
  });

  it("blocks once failures reach the limit", () => {
    const key = "ip-at-limit";
    for (let i = 0; i < LIMIT; i++) recordFailure(key, WINDOW);
    const status = isRateLimited(key, LIMIT);
    expect(status.limited).toBe(true);
    expect(status.retryAfterSec).toBeGreaterThan(0);
  });

  it("clears failures on success", () => {
    const key = "ip-clear";
    for (let i = 0; i < LIMIT; i++) recordFailure(key, WINDOW);
    expect(isRateLimited(key, LIMIT).limited).toBe(true);
    clearFailures(key);
    expect(isRateLimited(key, LIMIT).limited).toBe(false);
  });

  it("resets after the window elapses", () => {
    const key = "ip-window";
    for (let i = 0; i < LIMIT; i++) recordFailure(key, WINDOW);
    expect(isRateLimited(key, LIMIT).limited).toBe(true);

    vi.advanceTimersByTime(WINDOW + 1);
    expect(isRateLimited(key, LIMIT).limited).toBe(false);
  });

  it("keeps buckets independent per key", () => {
    for (let i = 0; i < LIMIT; i++) recordFailure("ip-a", WINDOW);
    expect(isRateLimited("ip-a", LIMIT).limited).toBe(true);
    expect(isRateLimited("ip-b", LIMIT).limited).toBe(false);
  });
});
