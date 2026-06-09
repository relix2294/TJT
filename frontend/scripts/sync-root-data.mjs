import { copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(frontendRoot, "..");

for (const file of ["config.json", "sys_registry.json"]) {
  const src = resolve(repoRoot, file);
  const dest = resolve(frontendRoot, file);

  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`[sync-root-data] ${file}`);
    continue;
  }

  if (!existsSync(dest)) {
    console.error(`[sync-root-data] missing ${file} — expected ${src} or ${dest}`);
    process.exit(1);
  }

  console.log(`[sync-root-data] using existing frontend/${file}`);
}
