import { defineConfig } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts", ".output/**", "dist/**"],
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["src/routeTree.gen.ts", ".output/**", "dist/**"],
  },
  staged: {
    "*.{ts,tsx,js,jsx,mjs,cjs}": "vp fmt --write",
    "*": "vp lint",
  },
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({ srcDirectory: "src" }),
    viteReact(),
    babel({
      parserOpts: { plugins: ["typescript", "jsx"] },
      presets: [reactCompilerPreset()],
    }),
    nitro(),
  ],
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
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
