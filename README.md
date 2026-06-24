# TypeScript Nix Flake Templates

Modern TypeScript project templates using Nix flakes, featuring pnpm, Turborepo, and Biome.

## Features

- 🚀 **Turborepo** - High-performance build system
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🔧 **Biome** - Fast formatter and linter (replaces ESLint + Prettier)
- ❄️ **Nix Flakes** - Reproducible development environment
- 📁 **Two Templates** - Monorepo and single library variants
- 🔒 **TypeScript Strict Mode** - Catch errors at compile time
- 🎯 **direnv** - Automatic environment loading

## Templates

### Monorepo Template

Perfect for multi-package projects with shared dependencies:
- `apps/` directory for applications
- `packages/` directory for shared libraries
- pnpm workspaces configured
- Shared TypeScript configuration

### Library Template

Ideal for single-purpose packages:
- Simple `src/` structure
- Ready for npm publishing
- Minimal configuration

## Usage

### Initialize in Current Directory

```bash
# Monorepo template (default)
nix flake init --template github:yourusername/typescript-project-template

# Library template
nix flake init --template github:yourusername/typescript-project-template#library
```

### Create New Project

```bash
# Monorepo
nix flake new my-monorepo --template github:yourusername/typescript-project-template

# Library
nix flake new my-library --template github:yourusername/typescript-project-template#library
```

### Development Workflow

1. **Enter the development shell:**
   ```bash
   nix develop
   # or with direnv
   direnv allow
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Available commands:**
   ```bash
   pnpm dev        # Start development mode
   pnpm build      # Build all packages
   pnpm lint       # Run Biome linter
   pnpm format     # Format code with Biome
   pnpm typecheck  # Run TypeScript type checking
   pnpm test       # Run tests
   pnpm clean      # Clean build artifacts
   ```

## Project Structure

### Monorepo
```
my-monorepo/
├── apps/
│   └── my-app/
├── packages/
│   └── shared/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── biome.json
├── tsconfig.json
└── flake.nix
```

### Library
```
my-library/
├── src/
│   └── index.ts
├── package.json
├── turbo.json
├── biome.json
├── tsconfig.json
└── flake.nix
```

## Tools Included

- **Node.js 20** - Latest LTS version
- **TypeScript** - Type-safe JavaScript
- **Turborepo** - Monorepo build orchestration
- **Biome** - Fast formatting and linting
- **pnpm** - Efficient package management
- **Git** - Version control

## Customization

### Adding a Package (Monorepo)

1. Create a new directory under `apps/` or `packages/`
2. Add a `package.json` with a unique name
3. Run `pnpm install` to link the workspace

### Publishing (Library)

The library template is configured for npm publishing:

```bash
pnpm version patch  # Bump version
pnpm publish       # Publish to npm
```

## License

MIT