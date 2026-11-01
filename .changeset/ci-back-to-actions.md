---
"xiaofeng-blog": patch
---

Run CI checks as plain GitHub Actions steps instead of through Dagger

- Dagger added about 43 seconds of engine start-up and module loading to every run on fresh hosted runners, more than the checks themselves (~70s vs ~30s per run)
- The workflow now sets up Node 24 and Bun (pinned from `packageManager`), caches Bun's package cache keyed on `bun.lock`, then runs format, lint, typecheck, tests with coverage and the build
- The `.dagger/` module stays for running the same pipeline locally with `dagger call check`
