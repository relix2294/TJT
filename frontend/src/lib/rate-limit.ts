/**
 * Minimal in-process rate limiter (fixed window per key).
 *
 * Intended for a single long-lived Node instance: state lives in module memory
 * and is not shared across processes. If the app is ever scaled to multiple
 * instances behind a load balancer, replace the backing Map with a shared store
 * (e.g. Redis) — the public API here is designed to make that swap local.
 *
 * Semantics are failure-oriented: only failed attempts are counted, and a
 * success clears the counter, so a legitimate operator is never locked out by
 * their own successful logins.
 */

type FailureBucket = { count: number; resetAt: number };

const failures = new Map<string, FailureBucket>();

/** Cap the map size; expired buckets are pruned lazily once this is exceeded. */
const MAX_ENTRIES = 1000;

function prune(now: number): void {
  if (failures.size < MAX_ENTRIES) return;
  for (const [key, bucket] of failures) {
    if (now >= bucket.resetAt) failures.delete(key);
  }
}

export type RateLimitStatus = { limited: boolean; retryAfterSec: number };

/** Check whether `key` has exceeded `limit` failures within its current window. */
export function isRateLimited(key: string, limit: number): RateLimitStatus {
  const now = Date.now();
  const bucket = failures.get(key);
  if (!bucket || now >= bucket.resetAt) {
    return { limited: false, retryAfterSec: 0 };
  }
  if (bucket.count >= limit) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { limited: false, retryAfterSec: 0 };
}

/** Record a failed attempt for `key`, starting a fresh window if needed. */
export function recordFailure(key: string, windowMs: number): void {
  const now = Date.now();
  prune(now);
  const bucket = failures.get(key);
  if (!bucket || now >= bucket.resetAt) {
    failures.set(key, { count: 1, resetAt: now + windowMs });
  } else {
    bucket.count += 1;
  }
}

/** Clear the failure counter for `key` (call after a successful attempt). */
export function clearFailures(key: string): void {
  failures.delete(key);
}
