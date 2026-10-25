import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
    }),
    viteReact({ compiler: true }),
    // NOTE: deliberately not `nitro({ preset: "bun" })`. The prerenderer boots
    // the built server under Node, and a bun-preset output cannot serve it
    // (prerender yields 0 pages / UND_ERR_HEADERS_TIMEOUT). The default
    // node-server output runs fine under Bun, which is what the Dockerfile does.
    nitro(),
  ],
});
