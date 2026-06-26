import { defineConfig } from "vite-plus";

// Single source of truth for tooling. vite+ reads each block:
//   lint  -> Oxlint        fmt -> Oxfmt        test -> Vitest
//   pack  -> tsdown        staged -> commit-hook checks
// Note: this is a Node backend, not a Vite app, so we build with `vp pack`
// (tsdown) rather than `vp build` (Vite).
export default defineConfig({
  lint: {
    ignorePatterns: ["dist/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "typescript/no-floating-promises": "error",
      "typescript/no-misused-promises": "error",
    },
  },

  fmt: {
    ignorePatterns: ["dist/**"],
    sortPackageJson: true,
  },

  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },

  // tsdown bundle for production (`pnpm run build`).
  pack: {
    entry: ["src/server.ts"],
    format: ["esm"],
    sourcemap: true,
    dts: false,
  },

  // Staged-file checks for the built-in commit hooks (`vp config`).
  staged: {
    "*.{ts,js}": "vp check --fix",
  },
});
