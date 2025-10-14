import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '~/': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'build/',
        'setupTests.ts',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/constants/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  }
});
