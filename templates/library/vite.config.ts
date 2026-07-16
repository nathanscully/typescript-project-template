import { defineConfig } from "vite-plus";

// Single source of truth for tooling. vite+ reads each block:
//   lint  -> Oxlint        fmt -> Oxfmt        test -> Vitest
//   pack  -> tsdown        staged -> commit-hook checks
// This is a library, so we build with `vp pack` (tsdown) to emit an ESM bundle
// plus type declarations for npm consumers. JSR consumers get the TS source
// directly (see the `jsr` key in package.json).
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

  // tsdown bundle for the published package (`pnpm run build`). `dts: true`
  // emits `dist/index.d.mts`; with `isolatedDeclarations` in tsconfig.json it
  // takes tsdown's fast oxc-transform path.
  pack: {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
  },

  // Staged-file checks for the built-in commit hooks (`vp config`).
  staged: {
    "*.{ts,js}": "vp check --fix",
  },
});
