---
"xiaofeng-blog": patch
---

Switch the runtime from Bun to Node and wire the `nitro()` plugin into Vite
so TanStack Start's SSR handler mounts correctly (fixes `vp dev` returning
404 at `/`). Replace `Bun.markdown.html` with `marked`, delete the
Bun-specific `scripts/start-server.ts` in favor of Nitro's `node-server`
output (`.output/server/index.mjs`), and move Docker and CI off `setup-bun`
onto `voidzero-dev/setup-vp`. No user-facing behavior change.
