import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Standalone unit-test runner for pure logic modules (no Next runtime).
 * The `@/` alias mirrors tsconfig `paths` so tests import the same way the app
 * does.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
