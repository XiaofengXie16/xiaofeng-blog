---
"xiaofeng-blog": patch
---

Move CI checks into a Dagger module and upgrade dependencies, including TanStack Start 1.0

- Added a TypeScript Dagger module (`.dagger/`, `dagger.json`) with `lint`, `typecheck`, `test`, `build` and `check` functions; `dagger call check` runs the full pipeline locally the same way CI does
- The GitHub Actions test job now runs `dagger call check` via `dagger/dagger-for-github`; the Fly deploy job is unchanged
- Upgraded `@tanstack/react-start` to 1.169 (Start 1.0 stable) and `@tanstack/react-router` to 1.170.46; audited against the "Migrate from the Release Candidate" guide — the app already uses `.validator()` and Nitro's `nitro/vite` plugin, and doesn't use any removed APIs
- Upgraded Vite+ 0.3.3 → 1.4.0 (Vite core 8.3.5) and Vitest/`@vitest/coverage-v8` 4.1.11 → 5.0.5; ignored Vitest 5's new `.vitest/` artifacts directory
- Bumped remaining dependencies to latest; `oxc-transform-react` stays on 0.152.x, the newest range `@vitejs/plugin-react` supports
