/**
 * Service Worker Registration
 * Registra o Service Worker para funcionalidades offline
 */

import { Workbox } from 'workbox-window';

let wb;

if ('serviceWorker' in navigator) {
  // Registrar Service Worker
  if (import.meta.env.PROD) {
    wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (!event.isUpdate) {
        console.log('🎉 Service Worker instalado pela primeira vez!');
      }
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('🚀 Service Worker ativado!');
      }
    });

    wb.addEventListener('waiting', () => {
      console.log('⏳ Novo Service Worker aguardando ativação...');
      // Mostrar prompt para atualizar
      showUpdatePrompt();
    });

    wb.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('📦 Cache atualizado:', event.data.payload);
      }
    });

    wb.register().catch((error) => {
      console.error('❌ Falha ao registrar Service Worker:', error);
    });
  }
}

/**
 * Mostra prompt para atualizar o Service Worker
 */
function showUpdatePrompt() {
  // Criar elemento de notificação
  const updateToast = document.createElement('div');
  updateToast.className = 'fixed bottom-4 right-4 bg-primary-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
  updateToast.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h4 class="font-semibold">Atualização Disponível</h4>
        <p class="text-sm opacity-90">Uma nova versão está disponível</p>
      </div>
      <div class="flex gap-2 ml-4">
        <button id="update-accept" class="bg-white text-primary-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
          Atualizar
        </button>
        <button id="update-dismiss" class="text-white opacity-70 hover:opacity-100 text-sm">
          Depois
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(updateToast);

  // Event listeners
  document.getElementById('update-accept')?.addEventListener('click', () => {
    wb?.messageSkipWaiting();
    updateToast.remove();
  });

  document.getElementById('update-dismiss')?.addEventListener('click', () => {
    updateToast.remove();
  });

  // Auto-remover após 10 segundos
  setTimeout(() => {
    if (updateToast.parentNode) {
      updateToast.remove();
    }
  }, 10000);
}

/**
 * Verifica se há atualizações disponíveis
 */
export function checkForUpdates() {
  if (wb) {
    wb.update();
  }
}

/**
 * Força atualização do cache
 */
export function forceCacheUpdate() {
  if (wb) {
    wb.messageSkipWaiting();
  }
}

// Exportar para uso global
window.serviceWorkerUtils = {
  checkForUpdates,
  forceCacheUpdate
};
