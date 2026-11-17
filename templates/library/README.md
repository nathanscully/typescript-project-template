# @scope/my-lib

A TypeScript library set up to publish to both [npm](https://npmjs.com) and
[JSR](https://jsr.io). Tooling is the [vite+](https://viteplus.dev) toolchain
(Oxlint, Oxfmt, Vitest, tsdown); the Node + pnpm runtime is pinned with Nix.

The example code is a dependency-free UUIDv7 generator — replace it with your own.

## Requirements

- [Nix](https://nixos.org) with flakes enabled (provides Node + pnpm)
- Optional: [direnv](https://direnv.net) — `direnv allow` to auto-enter the shell

## Getting started

    nix develop          # or: direnv allow
    pnpm install
    pnpm exec vp test    # run the suite

## Commands

| Command              | What it does                                           |
| -------------------- | ------------------------------------------------------ |
| `pnpm exec vp check` | Format + lint + typecheck (Oxfmt/Oxlint/tsgolint)      |
| `pnpm exec vp test`  | Run the Vitest suite                                   |
| `pnpm run build`     | Bundle to `dist/` (`.mjs` + `.d.mts`) with tsdown      |
| `pnpm run publint`   | Build, then verify the package is publishable          |
| `pnpm run jsr`       | Generate `jsr.json` from the `jsr` key in package.json |

## How it fits together

- **Runtime is Nix-owned.** The flake pins `nodejs_24` + `pnpm`. vite+'s own
  runtime manager is disabled (`VP_ENV_MODE=off`) so it never downloads Node.
- **All tool config lives in `vite.config.ts`** — the `lint`, `fmt`, `test`,
  `pack`, and `staged` blocks. There is no `.oxlintrc.json` / `vitest.config.ts`.
- **ESM-only.** `type: module`, one `.mjs` build plus `.d.mts` declarations.
  JSR is ESM-only by construction and Node has consumed ESM for years.
- **`isolatedDeclarations` is on.** Every export needs an explicit type. This is
  the same discipline JSR enforces at publish time ("no slow types"), and it
  lets tsdown generate declarations on its fast path.
- **Commit hooks are built in.** `pnpm install` runs `vp config`, installing a
  pre-commit hook that runs `vp check --fix` on staged files. Set
  `VITE_GIT_HOOKS=0` to skip.

## Two registries, one source tree

The same `src/` is published two ways:

- **npm** resolves through `package.json#exports` → the **built** `dist/index.mjs`
  plus `dist/index.d.mts`.
- **JSR** publishes the **TypeScript source** directly. `jsr.json` is generated
  from the `jsr` key in `package.json` by [`pkg-to-jsr`](https://github.com/ryoppippi/pkg-to-jsr),
  so name and version never drift between the two.

Because JSR ships source, exported symbols must have explicit types (enforced
here by `isolatedDeclarations`). See [About "slow types"](https://jsr.io/docs/about-slow-types).

## Publishing

Set `name`, `description`, `license`, and `keywords` in `package.json`, fill in
`LICENSE`, then create the package on each registry:

- **npm:** register the scope, then add a Trusted Publisher pointing at this
  repo and `.github/workflows/publish.yml` (settings → Trusted Publisher).
- **JSR:** create the scope + package, then link this GitHub repo (package
  settings → link repository).

Both use OIDC, so no `NPM_TOKEN` / `JSR_TOKEN` secrets are needed. To release:

    npm version patch      # bumps package.json, creates a git tag
    git push --follow-tags

The `publish` workflow builds, checks, and publishes to both registries with
provenance. Locally, `pnpm run publint` (which runs
[publint](https://publint.dev) and [`@arethetypeswrong/cli`](https://arethetypeswrong.github.io))
verifies the package resolves correctly before you tag.

## Layout

    src/
    ├── index.ts        # the public entry point (exports go here)
    └── index.test.ts   # colocated Vitest tests

Add modules under `src/` and re-export their public API from `src/index.ts`.
