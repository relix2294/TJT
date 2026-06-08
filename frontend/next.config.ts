import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

function readRootEnvVar(name: string): string | undefined {
  const rootEnv = path.resolve(__dirname, "..", ".env");
  if (!existsSync(rootEnv)) return undefined;

  for (const line of readFileSync(rootEnv, "utf-8").split("\n")) {
    const match = line.match(new RegExp(`^${name}=(.+)$`));
    if (!match?.[1]) continue;
    return match[1].trim().replace(/^["']|["']$/g, "");
  }
  return undefined;
}

const nextConfig: NextConfig = {
  env: {
    ADMIN_PASSWORD:
      process.env.ADMIN_PASSWORD?.trim() ?? readRootEnvVar("ADMIN_PASSWORD") ?? "",
  },
};

export default nextConfig;
