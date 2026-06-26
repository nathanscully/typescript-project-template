# TypeScript Nix Flake Templates

Fast-start TypeScript project templates built on the
[vite+](https://viteplus.dev) toolchain (Vite 8, Oxlint, Oxfmt, Vitest, tsdown)
with a reproducible Nix devshell. Spin up a new project with one command.

## Why

- **One toolchain.** vite+ (`vp`) replaces ESLint, Prettier, the test runner, the
  bundler, and commit hooks. All config lives in `vite.config.ts`.
- **Reproducible runtime.** Nix pins Node + pnpm per project; no version drift,
  works offline. vite+ runs as a normal dev-dependency.
- **Validated.** Every template has an `nix run .#smoke-*` test that installs it,
  runs `vp check`, builds it, and boots it.

## Templates

| Template   | What you get                                                                |
| ---------- | --------------------------------------------------------------------------- |
| `backend`  | Node.js + Fastify + zod-openapi, OpenAPI/Swagger UI, type-stripped dev      |
| `spa`      | Vite 8 + TanStack Router (file-based) + TanStack Query + Tailwind 4         |
| `monorepo` | pnpm + vite+ workspace: `apps/server` + `apps/client` + `packages/tsconfig` |

## Usage

```bash
# Initialize in a new directory
nix flake new my-app --template github:nathanscully/typescript-project-template#backend

# …or into the current directory
nix flake init --template github:nathanscully/typescript-project-template#spa
```

`#monorepo` is the default (`nix flake new my-app --template github:…`).

Then:

```bash
cd my-app
nix develop          # or: direnv allow
pnpm install
pnpm dev
```

## Requirements

- [Nix](https://nixos.org) with flakes enabled
- Optional: [direnv](https://direnv.net) for automatic shell loading

## Developing the templates themselves

```bash
nix flake show          # list templates
nix flake check         # eval + formatting (fast, offline)
nix fmt                 # format this repo

nix run .#smoke-backend   # install + vp check + build + boot a template
nix run .#smoke-spa
nix run .#smoke-monorepo
```

See [CLAUDE.md](./CLAUDE.md) for architecture notes and maintenance gotchas
(notably: every template needs `node-linker=hoisted` for vite+'s native addon).

## License

MIT
