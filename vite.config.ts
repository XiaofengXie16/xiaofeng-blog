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
        host: '192.168.215.2',
        port: 3000
    }
});
