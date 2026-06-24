{
  description = "TypeScript monorepo project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.pnpm
            nodePackages.typescript
            nodePackages.typescript-language-server
            turbo
            biome
            git
          ];

          shellHook = ''
            echo "TypeScript monorepo development environment"
            echo "Run 'pnpm install' to install dependencies"
            echo "Run 'pnpm dev' to start development"
            echo "Run 'pnpm build' to build all packages"
          '';
        };
      });
}