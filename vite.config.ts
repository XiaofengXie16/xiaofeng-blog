import { defineConfig, lazyPlugins } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const isTest = !!process.env.VITEST;

export default defineConfig({
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts", ".output/**", "dist/**", "coverage/**"],
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["src/routeTree.gen.ts", ".output/**", "dist/**", "coverage/**"],
  },
  staged: {
    "*": "vp check --fix",
  },
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: lazyPlugins(() => [
    tailwindcss(),
    ...(isTest
      ? []
      : [
          tanstackStart({
            srcDirectory: "src",
            prerender: { enabled: true, crawlLinks: true, failOnError: true },
          }),
        ]),
    viteReact(),
    babel({
      parserOpts: { plugins: ["typescript", "jsx"] },
      presets: [reactCompilerPreset()],
    }),
    // NOTE: deliberately not `nitro({ preset: "bun" })`. The prerenderer boots
    // the built server under Node, and a bun-preset output cannot serve it
    // (prerender yields 0 pages / UND_ERR_HEADERS_TIMEOUT). The default
    // node-server output runs fine under Bun, which is what the Dockerfile does.
    ...(isTest ? [] : [nitro()]),
  ]),
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "build/",
        "setupTests.ts",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "**/constants/**",
      ],
      // Vitest 4 takes these at the top level; a `global` key here is parsed
      // as a glob pattern and silently matches nothing.
      thresholds: {
        branches: 60,
        functions: 90,
        lines: 90,
        statements: 80,
      },
    },
  },
});
