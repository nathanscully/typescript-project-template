# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains Nix flake templates for TypeScript projects. It provides two template variants:
1. **Monorepo**: Multi-package setup with apps/ and packages/ directories
2. **Library**: Single package setup for publishable libraries

Both templates include pnpm, Turborepo, and Biome preconfigured.

## Common Commands

### Template Development
- `nix flake check` - Validate flake configuration
- `nix flake show` - Display available templates

### Testing Templates
```bash
# Test monorepo template
nix flake init --template .#monorepo --dest test-monorepo

# Test library template  
nix flake init --template .#library --dest test-library
```

## Project Structure

```
/
├── flake.nix              # Main flake defining both templates
├── templates/
│   ├── monorepo/         # Monorepo template files
│   │   ├── apps/         # Empty directory for applications
│   │   ├── packages/     # Empty directory for shared packages
│   │   └── ...           # Configuration files
│   └── library/          # Library template files
│       ├── src/          # Source directory with example code
│       └── ...           # Configuration files
└── lib/                  # Shared Nix configurations (if needed)
```

## Key Design Decisions

1. **Biome over ESLint/Prettier**: Biome is significantly faster and provides both linting and formatting
2. **Turborepo for single packages**: Even single libraries use Turborepo for consistency and future scalability
3. **Strict TypeScript**: Both templates enable strict mode and additional safety checks
4. **ES Modules**: Library template uses `"type": "module"` for modern JavaScript

## Template Maintenance

When updating templates:
1. Test both templates after changes
2. Keep tool versions in sync between templates
3. Ensure all scripts in package.json work correctly
4. Verify Nix development shells include all necessary tools