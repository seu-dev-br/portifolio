// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// Carregar variáveis de ambiente para garantir que estejam disponíveis
import dotenv from 'dotenv';
dotenv.config();

// Imprimir valores para debug
console.log('🔍 Variáveis de ambiente carregadas:');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'definido ✅' : 'não definido ❌');
console.log('- SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'definido ✅' : 'não definido ❌');
console.log('- PUBLIC_SUPABASE_URL:', process.env.PUBLIC_SUPABASE_URL ? 'definido ✅' : 'não definido ❌');
console.log('- PUBLIC_SUPABASE_ANON_KEY:', process.env.PUBLIC_SUPABASE_ANON_KEY ? 'definido ✅' : 'não definido ❌');

// https://astro.build/config
export default defineConfig({
  // Configuração para renderização no servidor (necessária para APIs)
  output: 'server',
  adapter: vercel(),

  // Base URL configuration
  site: 'https://portifolio-seu-dev-br.vercel.app',

  // Configurações de integração
  integrations: [tailwind()],

  // Configurações de build otimizadas
  build: {
    format: 'file',
    inlineStylesheets: 'auto'
  },

  // Configurações de imagem otimizadas
  image: {
    // Diretório de imagens otimizadas
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  // Configurações de Vite para melhor performance
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    esbuild: {
      // Permitir que arquivos TypeScript sejam processados
      include: /\.(ts|js)$/,
      exclude: /node_modules/
    },
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
      'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
      'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY),
    },
    build: {
      cssMinify: true,
      minify: true,
      rollupOptions: {
        output: {
          // Code splitting otimizado
          manualChunks: {
            // Separar bibliotecas pesadas
            supabase: ['@supabase/supabase-js'],
            vendor: ['astro', 'marked'],
            // UI components
            ui: ['@astrojs/tailwind'],
            // Animações
            animations: ['intersection-observer']
          },
          // Otimização de chunks
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.names?.[0]?.split('.') || [];
            const extType = info[info.length - 1];
            const fileName = assetInfo.names?.[0] || '';
            if (fileName && /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(fileName)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (fileName && /\.(css)$/i.test(fileName)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          }
        }
      },
      // Compressão de assets
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js', 'marked']
    }
  }
});
