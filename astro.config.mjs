// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Configuração otimizada para Vercel
  output: 'static',

  // Base URL configuration
  site: 'https://portifolio-seu-dev-br.vercel.app',

  // Configurações de integração
  integrations: [],

  // Configurações de build otimizadas
  build: {
    format: 'file',
    inlineStylesheets: 'auto'
  },

  // Configurações de Vite para melhor performance
  vite: {
    build: {
      cssMinify: true,
      minify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            supabase: ['@supabase/supabase-js']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js', 'marked']
    }
  }
});
