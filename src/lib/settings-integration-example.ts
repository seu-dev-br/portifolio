// src/lib/settings-integration-example.ts
// EXEMPLO: Como integrar as configurações do admin nas páginas públicas
// Este arquivo mostra como adicionar funcionalidade sem modificar as páginas existentes

/**
 * MÉTODO 1: Inclusão via Script Tag (Recomendado)
 *
 * Adicione esta linha no final do <body> das suas páginas públicas:
 *
 * <script type="module" src="/lib/integrate-settings.ts"></script>
 *
 * Ou para páginas HTML puras:
 *
 * <script type="module">
 *   import settingsIntegrator from '/lib/integrate-settings.ts';
 *   // O script já se inicializa automaticamente
 * </script>
 */

/**
 * MÉTODO 2: Inclusão Programática
 *
 * Se você quiser mais controle, pode fazer assim:
 */

// Exemplo de uso programático
export async function exampleUsage() {
    try {
        // Importar a API
        const { default: frontendAPI } = await import('./frontend-api');

        // Buscar configurações
        const settings = await frontendAPI.getSettings();
        console.log('Configurações carregadas:', settings);

        // Aplicar manualmente
        applySettingsToPage(settings);

    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

function applySettingsToPage(settings: any) {
    // Exemplo: Atualizar o título da página baseado nas configurações
    if (settings.home?.hero?.title) {
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = settings.home.hero.title;
        }
    }

    // Exemplo: Atualizar a descrição
    if (settings.home?.hero?.description) {
        const descElement = document.querySelector('.hero-description');
        if (descElement) {
            descElement.textContent = settings.home.hero.description;
        }
    }
}

/**
 * MÉTODO 3: Hook para Frameworks
 *
 * Se você usar React, Vue, ou outros frameworks:
 */

export function useSettings() {
    // Hook personalizado para frameworks
    // Retorna as configurações e estados de loading
    return {
        settings: null,
        loading: false,
        error: null,
        refetch: () => {}
    };
}

/**
 * MÉTODO 4: Service Worker para Cache Offline
 *
 * Para melhorar performance, você pode implementar um service worker:
 */

export class SettingsServiceWorker {
    static async cacheSettings() {
        // Implementar cache das configurações
        console.log('Cache de configurações implementado');
    }
}

/**
 * DICAS PARA IMPLEMENTAÇÃO:
 *
 * 1. Adicione o script no final do <body> para não bloquear o carregamento
 * 2. Use seletores CSS específicos para identificar elementos a atualizar
 * 3. Implemente fallbacks para quando as configurações não carregarem
 * 4. Considere lazy loading para páginas que não precisam das configurações imediatamente
 * 5. Monitore o console para debug durante desenvolvimento
 */

/**
 * EXEMPLO PRÁTICO PARA index.astro:
 *
 * ---
// Adicione no final do arquivo index.astro:
---

<script>
  import settingsIntegrator from '../lib/integrate-settings';
  // O script se inicializa automaticamente
</script>

 * OU para HTML puro:
 *
 * <script type="module" src="/lib/integrate-settings.ts"></script>
 */

/**
 * DEBUGGING:
 *
 * No console do navegador, você pode acessar:
 * - window.frontendAPI: Para fazer chamadas manuais à API
 * - window.settingsIntegrator: Para controlar a integração
 * - frontendAPI.clearCache(): Para limpar o cache
 * - frontendAPI.setCacheDuration(1): Para alterar duração do cache
 */
