---
"xiaofeng-blog": patch
---

Bump Dockerfile `NODE_VERSION` to 24 and sync `package-lock.json` with
`package.json`. Nitro, vite-plus, rolldown, oxlint, and jsdom all require
`^20.19.0 || >=22.12.0`, and the stale lockfile was causing `npm ci` to
fail with missing `chokidar`/`lru-cache`/`readdirp` entries. Fixes the
Fly deploy workflow.
