/**
 * Workaround for dual-package hazard with vite-plus.
 *
 * vite-plus depends on both `vite` (aliased to @voidzero-dev/vite-plus-core)
 * and `@voidzero-dev/vite-plus-core` directly. npm installs them as separate
 * copies, causing `instanceof` checks to fail across module boundaries.
 *
 * This breaks TanStack Start's SSR dev server because its
 * `isRunnableDevEnvironment()` check uses `instanceof` against a class from
 * one copy, while the dev server environment is created from the other.
 *
 * Fix: symlink @voidzero-dev/vite-plus-core to the vite alias so they share
 * a single module instance.
 */
const fs = require("fs");
const path = require("path");

const target = path.join("node_modules", "@voidzero-dev", "vite-plus-core");
const source = path.resolve(path.join("node_modules", "vite"));

try {
  fs.rmSync(target, { recursive: true, force: true });
  fs.symlinkSync(source, target, "dir");
  console.log("Linked @voidzero-dev/vite-plus-core -> vite");
} catch (e) {
  console.warn("symlink skipped:", e.message);
}
