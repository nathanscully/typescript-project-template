{
  description = "TypeScript project templates with pnpm, Turborepo, and Biome";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            git
            biome
          ];

        };
      in
      {
        devShells.default = devShell;
      }
    )
    // {
      templates = {
        monorepo = {
          path = ./templates/monorepo;
          description = "TypeScript monorepo with Turborepo, pnpm workspaces, and Biome";
        };

        library = {
          path = ./templates/library;
          description = "Single TypeScript library with Turborepo, pnpm, and Biome";
        };

        # Default to monorepo
        default = self.templates.monorepo;
      };
    };
}
