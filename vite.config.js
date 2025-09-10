/**
 * Configuração adicional de Vite para otimização de performance
 * Complementa o astro.config.mjs
 */

import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    // Compressão Gzip
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024, // Apenas arquivos maiores que 1KB
      compressionOptions: {
        level: 6
      }
    }),

    // Compressão Brotli
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(gz)$/, /\.(br)$/],
      threshold: 1024,
      compressionOptions: {
        level: 6
      }
    })
  ],

  build: {
    // Otimização adicional de chunks
    rollupOptions: {
      output: {
        // Estratégia de code splitting inteligente
        manualChunks(id) {
          // Separar node_modules em chunks menores
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('@astrojs') || id.includes('astro')) {
              return 'astro-vendor';
            }
            if (id.includes('tailwindcss') || id.includes('@tailwindcss')) {
              return 'tailwind-vendor';
            }
            if (id.includes('marked') || id.includes('markedjs')) {
              return 'markdown-vendor';
            }
            // Outros pacotes vão para vendor
            return 'vendor';
          }

          // Separar componentes grandes
          if (id.includes('/components/')) {
            if (id.includes('InteractiveCard') || id.includes('EnhancedButton')) {
              return 'ui-components';
            }
            if (id.includes('Toast') || id.includes('ProgressBar')) {
              return 'feedback-components';
            }
          }

          // Separar utilitários
          if (id.includes('/lib/')) {
            if (id.includes('animations') || id.includes('service-worker')) {
              return 'utils';
            }
          }
        }
      }
    },

    // Otimizações de performance
    cssCodeSplit: true,
    sourcemap: false, // Desabilitar sourcemaps em produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs em produção
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    }
  },

  // Otimizações de dependências
  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      'marked',
      'intersection-observer'
    ],
    exclude: [
      // Excluir pacotes que causam problemas
      '@astrojs/tailwind'
    ]
  },

  // Configurações de servidor de desenvolvimento
  server: {
    fs: {
      // Permitir acesso a arquivos fora do projeto (útil para monorepos)
      allow: ['../../']
    }
  }
});
