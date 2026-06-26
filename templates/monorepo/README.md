# monorepo

A pnpm + [vite+](https://viteplus.dev) monorepo wiring a
[Fastify](https://fastify.dev) backend (`apps/server`) and a
[Vite](https://vite.dev) + [TanStack](https://tanstack.com) SPA (`apps/client`),
with shared TypeScript configs in `packages/tsconfig`. The Node + pnpm runtime
is pinned with Nix.

## Requirements

- [Nix](https://nixos.org) with flakes enabled (provides Node + pnpm)
- Optional: [direnv](https://direnv.net) — `direnv allow` to auto-enter the shell

## Getting started

```bash
nix develop          # or: direnv allow
pnpm install
pnpm dev             # runs client (:3000) + server (:3001) in parallel
```

- Client: <http://localhost:3000>
- Server: <http://localhost:3001> (docs at `/docs`)
- The client's **About** page calls the server via the `/api` dev proxy.

## Commands

| Command              | What it does                                            |
| -------------------- | ------------------------------------------------------- |
| `pnpm dev`           | Run all apps' `dev` scripts in parallel (`vp run -r`)   |
| `pnpm run build`     | Build every workspace in dependency order (`vp run -r`) |
| `pnpm run test`      | Run every workspace's tests (`vp run -r`)               |
| `pnpm exec vp check` | Format + lint + typecheck the whole repo                |
| `pnpm run ready`     | `vp check` + tests + build — the pre-push gate          |

Target one app: `pnpm exec vp run @repo/client#build` or `vp dev apps/client`.

## How it fits together

- **Runtime is Nix-owned.** The flake pins `nodejs_24` + `pnpm`; vite+'s runtime
  manager is disabled (`VP_ENV_MODE=off`).
- **One root `vite.config.ts`** owns workspace-wide lint, format, staged checks,
  and task caching, with per-path `overrides` (react rules for `apps/client/**`,
  node rules for `apps/server/**`). Each app keeps a small `vite.config.ts` for
  its own build/test (`vp build` for the SPA, `vp pack` for the server).
- **Shared dependency versions** live in `pnpm-workspace.yaml` under `catalog:`.
  Bump once there; packages reference `"catalog:"`.
- **Shared tsconfigs** in `packages/tsconfig` (`base`/`node`/`react`); each app
  `extends` the right one.
- **Commit hooks are built in** via `vp config` (on `pnpm install`).

## Layout

```
pnpm-workspace.yaml      # workspaces + catalog (shared versions)
vite.config.ts           # root: lint / fmt / staged / task config
apps/
├── server/              # Fastify + zod-openapi (port 3001)
└── client/              # Vite + TanStack Router/Query SPA (port 3000)
packages/
└── tsconfig/            # shared base / node / react tsconfigs
```
