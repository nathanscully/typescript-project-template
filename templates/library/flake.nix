{
  description = "TypeScript library project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    gitignore.url = "github:hercules-ci/gitignore.nix";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      gitignore,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        inherit (gitignore.lib) gitignoreSource;
        typescript-library = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "typescript-library";
          version = "0.0.0";
          src = gitignoreSource ./.;
          nativeBuildInputs = with pkgs; [
            nodejs_24
            pnpm.configHook
            turbo
          ];

          pnpmDeps = pkgs.pnpm.fetchDeps {
            inherit (finalAttrs) pname version src;
            fetcherVersion = 2;
            hash = "sha256-MBllqpqk0yzZ70vzlbJ2CqHw7qVRa4oaA6/g5plRw+c=";
          };

          buildPhase = ''
            runHook preBuild

            turbo build

            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall

            mkdir -p $out/lib
            cp -r dist $out/lib/
            cp package.json $out/lib/

            runHook postInstall
          '';

          meta = with pkgs.lib; {
            description = "TypeScript library project";
            platforms = platforms.all;
          };
        });

      in
      {
        # The built package
        packages = {
          default = typescript-library;
          typescript-library = typescript-library;
        };

        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            turbo
            biome
            git
            pnpm
          ];

          shellHook = ''
            pnpm i
            echo "TypeScript development environment"
            echo "Node: $(node --version)"
            echo "pnpm: $(pnpm --version)"
            echo "TypeScript: $(tsc --version)"
            echo "Turborepo: $(turbo --version)"
            echo "Biome: $(biome --version)"
            echo ""
            echo "Run 'pnpm install' to install dependencies"
            echo "Run 'pnpm dev' to start development"
            echo "Run 'pnpm build' to build the library"
            echo ""
            echo "Build with Nix: 'nix build'"
          '';
        };
      }
    );
}
