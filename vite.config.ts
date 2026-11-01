import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { redact } from "@tanstack/redact/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  // Bundle server dependencies so Redact can redirect their React imports.
  // Keep the CommonJS markdown parser external so dev SSR loads it natively.
  ssr: { noExternal: true, external: ["gray-matter"] },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        // three.js only loads lazily for the 3D scenes, but as one chunk it is
        // ~555 kB and trips Vite's 500 kB warning. Split it along three's own
        // two files (the core library and the WebGL renderer) so each chunk
        // stays under the limit, downloads in parallel, and stays cached when
        // our scene code changes.
        codeSplitting: {
          groups: [
            { name: "three-core", test: /node_modules[\\/]three[\\/]build[\\/]three\.core\.js/ },
            { name: "three-webgl", test: /node_modules[\\/]three[\\/]build[\\/]three\.module\.js/ },
          ],
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
    }),
    viteReact({ compiler: true }),
    // TanStack Redact: a smaller React/React DOM for the browser. Must come
    // after the Start and React plugins. The site uses no <Activity>, fragment
    // refs or portals (nor do its dependencies), so those features are dropped.
    redact({
      features: { activity: false, fragmentRefs: false, portal: false },
    }),
    // NOTE: deliberately not `nitro({ preset: "bun" })`. The prerenderer boots
    // the built server under Node, and a bun-preset output cannot serve it
    // (prerender yields 0 pages / UND_ERR_HEADERS_TIMEOUT). The default
    // node-server output runs fine under Bun, which is what the Dockerfile does.
    nitro(),
  ],
});
