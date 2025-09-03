/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { getViteConfig } from 'astro/config';

export default defineConfig({
  ...getViteConfig(),
  test: {
    // Configurações do Vitest
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],

    // Configurações de cobertura
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/env.d.ts',
        'astro.config.mjs',
        'src/test/',
      ],
    },

    // Configurações de teste
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
