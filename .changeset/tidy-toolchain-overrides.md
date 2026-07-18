---
"xiaofeng-blog": patch
---

Toolchain maintenance: bump Vite+ core to 0.2.5 and align config with the Vite+ docs

- Bumped the `vite` override alias to `@voidzero-dev/vite-plus-core@0.2.5`, matching the `vite-plus` CLI
- Removed the redundant `typescript` and `vitest` overrides; every dependency already resolves to the single pinned version without them
- Switched the staged-file hook to the documented `"*": "vp check --fix"` pattern, fixing commits where every staged file is format-ignored (e.g. only `routeTree.gen.ts` changed)
- Wrapped plugins in `lazyPlugins` so metadata-only commands (`vp lint`, `vp fmt`, `vp staged`) skip evaluating the TanStack Start and Nitro plugin factories
- Raised `engines.node` to `>=22.12.0` to reflect what the toolchain actually supports
