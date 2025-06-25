import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
        tsconfigPaths()
    ],
    server: {
        port: 3000
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Only apply manual chunking for client builds
                    if (process.env.VITE_REACT_ROUTER_SSR !== '1') {
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
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
        include: ['react', 'react-dom', 'react-router', 'markdown-it', 'gray-matter']
    }
});
