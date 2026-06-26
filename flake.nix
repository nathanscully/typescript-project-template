{
  description = "TypeScript project templates on the vite+ stack (Vite 8, Oxlint, Oxfmt, Vitest), pinned with Nix";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      imports = [
        inputs.treefmt-nix.flakeModule
        ./nix/devshell.nix
        ./nix/formatter.nix
        ./nix/checks.nix
      ];

      flake.templates = {
        backend = {
          path = ./templates/backend;
          description = "Node.js + Fastify + zod-openapi backend (vite+ toolchain, Nix devshell)";
        };
        spa = {
          path = ./templates/spa;
          description = "Vite 8 + TanStack Start SPA (vite+ toolchain, Nix devshell)";
        };
        monorepo = {
          path = ./templates/monorepo;
          description = "pnpm + vite+ monorepo wiring a Fastify backend and a TanStack SPA";
        };
        default = inputs.self.templates.monorepo;
      };
    };
}
