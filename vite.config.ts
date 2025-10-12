import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    // Enables Vite to resolve imports using path aliases.
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'app', // This is the default
      router: {
        // Specifies the directory TanStack Router uses for your routes.
        routesDirectory: 'routes', // Defaults to "routes", relative to srcDirectory
      },
    }),
    viteReact(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only apply manual chunking for client builds
          if (process.env.VITE_REACT_ROUTER_SSR !== '1') {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('@tanstack')) {
                return 'vendor';
              }
              if (id.includes('markdown-it') || id.includes('gray-matter')) {
                return 'markdown';
              }
            }
          }
          return undefined;
        }
      }
    },
    target: 'es2022',
    minify: 'esbuild',
    cssMinify: 'esbuild'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router', 'markdown-it', 'gray-matter']
  }
})
