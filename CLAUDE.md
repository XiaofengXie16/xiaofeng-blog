<!--TOOLCHAIN START-->

# Toolchain

This project uses Bun for installing dependencies, formatting, type checking and tests, Vite for dev and build (TanStack Start), `bun test` for tests and Oxlint for linting. The production server runs on Bun (see `Dockerfile`).

| Task              | Command             | Tool                                  |
| ----------------- | ------------------- | ------------------------------------- |
| Install           | `bun install`       | Bun (`bun.lock`)                      |
| Dev server        | `bun run dev`       | Vite                                  |
| Build + prerender | `bun run build`     | Vite + Nitro                          |
| Format            | `bun run format`    | `bun fmt` (Prettier-compatible)       |
| Lint              | `bun run lint`      | Oxlint, type-aware (`.oxlintrc.json`) |
| Type check        | `bun run typecheck` | `bun check`                           |
| Test              | `bun run test`      | `bun test` (config in `bunfig.toml`)  |
| Full CI pipeline  | `dagger call check` | Dagger module in `.dagger/`           |

- Run project scripts with `bun run <name>`. Don't call `bun fmt` or `bun check` through a script named `fmt` or `check`: Bun runs a same-named script instead of the built-in command.
- Formatting settings live in `.prettierrc.json` and `.prettierignore`.
- Tests use `bun:test`. Vite's `import.meta.glob` isn't available under Bun, so `test/import-meta-glob.ts` (preloaded via `bunfig.toml`) expands it for tests.
- Oxlint stays as the linter until `bun lint` ships in a stable Bun release.

## Review Checklist

- [ ] Run `bun install` after pulling remote changes and before getting started.
- [ ] Run `bun run format`, `bun run lint`, `bun run typecheck` and `bun run test` before committing (the pre-commit hook formats staged files and lints).
- [ ] For changes to the build or CI, run `dagger call check`.

<!--TOOLCHAIN END-->

<!-- intent-skills:start -->

# Skill mappings - when working in these areas, load the linked skill file into context.

skills:

- task: "routing, navigation, links, route configuration"
  load: "node_modules/@tanstack/router-core/skills/router-core/SKILL.md"
- task: "TanStack Start setup, server functions, entry points, middleware"
  load: "node_modules/@tanstack/start-client-core/skills/start-core/SKILL.md"
- task: "React-specific Start bindings, StartClient, StartServer, React imports"
  load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"
- task: "router plugin config, code splitting, route generation"
  load: "node_modules/@tanstack/router-plugin/skills/router-plugin/SKILL.md"
- task: "deployment, production builds, SSR, static prerendering"
  load: "node_modules/@tanstack/start-client-core/skills/start-core/deployment/SKILL.md"

<!-- intent-skills:end -->

<!-- polylane:start -->

## Investigating production with Polylane

[Polylane](https://polylane.com/?ref=github.onboarding-pr) is an AI production engineer: it watches deploys, telemetry, incidents, and the infrastructure this repository ships to, investigates problems as they happen, and proposes fixes as pull requests. It is connected to this repository and available to coding agents through the [Polylane MCP server](https://mcp.polylane.com/mcp).

- When a question involves production behaviour (an error, a spike, a deploy, a missing signal), query Polylane through its MCP tools before reasoning from the code alone.
- When debugging a failure, start from the incident or issue Polylane recorded: it carries the evidence an investigation already gathered.
- Polylane reviews pull requests in this repository against the live infrastructure. Read its review comment before merging changes that touch production paths.

<!-- polylane:end -->
