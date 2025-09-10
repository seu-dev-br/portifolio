/**
 * Script para gerar Service Worker com Workbox
 * Executa após o build para criar cache offline
 */

import { generateSW } from 'workbox-build';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swDest = join(__dirname, '../dist/sw.js');

try {
  const { count, size } = await generateSW({
    swDest,
    globDirectory: join(__dirname, '../dist'),
    globPatterns: [
      '**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2}',
      '**/*.{json,webmanifest}'
    ],
    // Estratégias de cache
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
          },
          cacheKeyWillBeUsed: async ({ request }) => {
            return `${request.url}?${Date.now()}`;
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
          }
        }
      },
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-api',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 // 24 horas
          },
          networkTimeoutSeconds: 10
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
          }
        }
      }
    ],
    // Páginas para precache
    additionalManifestEntries: [
      { url: '/', revision: null },
      { url: '/projetos', revision: null },
      { url: '/blog', revision: null },
      { url: '/sobre', revision: null },
      { url: '/contato', revision: null }
    ],
    // Configurações do Service Worker
    mode: 'production',
    sourcemap: false,
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    // Manifest
    manifestTransforms: [
      (manifestEntries) => {
        console.log(`📦 Service Worker gerado com ${manifestEntries.length} arquivos`);
        return { manifest: manifestEntries };
      }
    ]
  });

  console.log(`✅ Service Worker gerado com sucesso!`);
  console.log(`📊 ${count} arquivos processados (${(size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`📁 Localização: ${swDest}`);

} catch (error) {
  console.error('❌ Erro ao gerar Service Worker:', error);
  process.exit(1);
}
