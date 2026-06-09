import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolve repo data files for local dev (../ from `frontend/`) and Vercel
 * (copies colocated in the app root via `scripts/sync-root-data.mjs`).
 */
export function resolveRepoDataPath(filename: string): string {
  const candidates = [
    path.resolve(process.cwd(), filename),
    path.resolve(process.cwd(), "..", filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return candidates[0];
}
