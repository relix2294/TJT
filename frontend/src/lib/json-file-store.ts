import lockfile from "proper-lockfile";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

/** Cross-process lock wait — must match Python `LOCK_TIMEOUT_SECONDS`. */
const LOCK_TIMEOUT_MS = 5_000;
const LOCK_RETRY_MS = 50;
/** Drop lock files left behind by crashed processes (proper-lockfile `stale`). */
const LOCK_STALE_MS = 30_000;

export class JsonFileLockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JsonFileLockError";
  }
}

export class JsonFileStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JsonFileStoreError";
  }
}

function tempPathFor(targetPath: string): string {
  const nonce = randomBytes(6).toString("hex");
  return `${targetPath}.tmp.${process.pid}.${nonce}`;
}

async function withCrossProcessLock<T>(
  targetPath: string,
  fn: () => Promise<T>,
): Promise<T> {
  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(targetPath, {
      lockfilePath: `${targetPath}.lock`,
      stale: LOCK_STALE_MS,
      retries: {
        retries: Math.max(1, Math.floor(LOCK_TIMEOUT_MS / LOCK_RETRY_MS)),
        minTimeout: LOCK_RETRY_MS,
        maxTimeout: LOCK_RETRY_MS,
        factor: 1,
      },
    });
    return await fn();
  } catch (err) {
    if (lockfile.isLockStale(err as Error)) {
      console.error(`[json-file-store] Stale lock on ${targetPath}:`, err);
    }
    const message = (err as Error).message ?? String(err);
    if (message.toLowerCase().includes("timeout") || message.includes("retries")) {
      console.error(
        `[json-file-store] Lock timeout after ${LOCK_TIMEOUT_MS}ms for ${targetPath}`,
      );
      throw new JsonFileLockError(
        `Timed out acquiring lock for ${path.basename(targetPath)} after ${LOCK_TIMEOUT_MS}ms`,
      );
    }
    console.error(`[json-file-store] Lock error for ${targetPath}:`, err);
    throw new JsonFileLockError(
      `Unable to acquire lock for ${path.basename(targetPath)}: ${message}`,
    );
  } finally {
    if (release) {
      try {
        await release();
      } catch (err) {
        console.error(`[json-file-store] Failed to release lock for ${targetPath}:`, err);
      }
    }
  }
}

async function writeJsonAtomicUnlocked(
  targetPath: string,
  data: unknown,
): Promise<void> {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  const tmpPath = tempPathFor(targetPath);
  try {
    await writeFile(tmpPath, content, "utf-8");
    await rename(tmpPath, targetPath);
  } finally {
    await unlink(tmpPath).catch(() => undefined);
  }
}

async function readJsonFile<T>(targetPath: string, defaultValue: T): Promise<T> {
  try {
    const raw = await readFile(targetPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return defaultValue;
    if (err instanceof SyntaxError) {
      throw new JsonFileStoreError(
        `${path.basename(targetPath)} is not valid JSON (possibly mid-write).`,
      );
    }
    throw err;
  }
}

/**
 * Run a read-modify-write cycle under an exclusive cross-process lock with
 * atomic replace on success. Uses the same `{file}.lock` path as Python
 * `filelock`.
 */
export async function withLockedJsonUpdate<T>(
  targetPath: string,
  defaultValue: T,
  mutator: (current: T) => T | Promise<T>,
): Promise<T> {
  return withCrossProcessLock(targetPath, async () => {
    const current = await readJsonFile(targetPath, defaultValue);
    const updated = await mutator(current);
    await writeJsonAtomicUnlocked(targetPath, updated);
    return updated;
  });
}

/** Replace a JSON document atomically under an exclusive lock. */
export async function writeJsonFileLocked(
  targetPath: string,
  data: unknown,
): Promise<void> {
  await withCrossProcessLock(targetPath, async () => {
    await writeJsonAtomicUnlocked(targetPath, data);
  });
}
