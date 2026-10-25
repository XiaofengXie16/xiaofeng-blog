/**
 * Test-only Bun plugin that implements Vite's `import.meta.glob` for
 * `bun test` (Bun doesn't provide it). Loaded via `preload` in bunfig.toml.
 *
 * It supports the form the app uses — eager raw imports:
 *   import.meta.glob("../dir/*.md", { eager: true, query: "?raw", import: "default" })
 * and expands it at load time into an object of { "<relative path>": "<file contents>" },
 * which is what Vite produces at build time. Any other form throws, so a new
 * usage fails loudly instead of silently behaving differently from Vite.
 */
import { plugin } from "bun";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";

const GLOB_CALL = /import\.meta\.glob\(\s*(["'])([^"']+)\1\s*,\s*(\{[^}]*\})\s*\)/g;

function expandGlob(importer: string, pattern: string, options: string): string {
  const eager = /\beager\s*:\s*true\b/.test(options);
  const raw = /\bquery\s*:\s*["']\?raw["']/.test(options);
  const defaultImport = /\bimport\s*:\s*["']default["']/.test(options);
  if (!eager || !raw || !defaultImport) {
    throw new Error(
      `import.meta.glob("${pattern}") in ${importer}: only { eager: true, query: "?raw", import: "default" } is supported in tests`,
    );
  }

  const dirPart = posix.dirname(pattern);
  const filePart = posix.basename(pattern);
  if (/[*?[{]/.test(dirPart)) {
    throw new Error(
      `import.meta.glob("${pattern}") in ${importer}: globs in directory names are not supported in tests`,
    );
  }

  const matcher = new Bun.Glob(filePart);
  const dir = join(dirname(importer), dirPart);
  const entries: Record<string, string> = {};
  for (const name of readdirSync(dir).sort()) {
    if (matcher.match(name)) {
      entries[posix.join(dirPart, name)] = readFileSync(join(dir, name), "utf8");
    }
  }
  return JSON.stringify(entries);
}

plugin({
  name: "vite-import-meta-glob",
  setup(build) {
    build.onLoad({ filter: /\/src\/.*\.tsx?$/ }, async ({ path }) => {
      // Bun runtime plugins must return contents for every matched file, so
      // files without import.meta.glob pass through unchanged.
      const source = await Bun.file(path).text();
      const contents = source.includes("import.meta.glob")
        ? source.replace(GLOB_CALL, (_match, _quote, pattern: string, options: string) =>
            expandGlob(path, pattern, options),
          )
        : source;
      return { contents, loader: path.endsWith(".tsx") ? "tsx" : "ts" };
    });
  },
});
