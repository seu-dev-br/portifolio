// src/admin/modules/lazy-loader.ts
// Sistema de carregamento lazy para componentes do admin

export class LazyLoader {
    private static loadedModules = new Map<string, any>();

    // Carrega um módulo dinamicamente
    static async loadModule<T>(modulePath: string): Promise<T> {
        if (this.loadedModules.has(modulePath)) {
            return this.loadedModules.get(modulePath);
        }

        try {
            const module = await import(modulePath);
            this.loadedModules.set(modulePath, module.default || module);
            return module.default || module;
        } catch (error) {
            console.error(`Erro ao carregar módulo ${modulePath}:`, error);
            throw error;
        }
    }

    // Carrega múltiplos módulos em paralelo
    static async loadModules<T>(modulePaths: string[]): Promise<T[]> {
        const promises = modulePaths.map(path => this.loadModule<T>(path));
        return Promise.all(promises);
    }

    // Pré-carrega módulos críticos
    static async preloadCriticalModules() {
        const criticalModules = [
            '../services/auth.service',
            '../services/loading.service',
            '../services/notification.service',
            '../services/state.service',
            '../services/api.service'
        ];

        try {
            await this.loadModules(criticalModules);
            console.log('Módulos críticos carregados com sucesso');
        } catch (error) {
            console.error('Erro ao pré-carregar módulos críticos:', error);
        }
    }

    // Carrega componentes sob demanda
    static async loadComponent(componentName: string) {
        const componentPath = `../components/${componentName}.astro`;
        return this.loadModule(componentPath);
    }

    // Limpa cache de módulos carregados
    static clearCache() {
        this.loadedModules.clear();
    }

    // Verifica se um módulo está carregado
    static isModuleLoaded(modulePath: string): boolean {
        return this.loadedModules.has(modulePath);
    }
}

// Hook para carregamento lazy com React-like API
export function useLazyLoad<T>() {
    return {
        load: (modulePath: string) => LazyLoader.loadModule<T>(modulePath),
        loadMultiple: (modulePaths: string[]) => LazyLoader.loadModules<T>(modulePaths),
        isLoaded: (modulePath: string) => LazyLoader.isModuleLoaded(modulePath),
        clearCache: () => LazyLoader.clearCache()
    };
}

// Inicialização automática dos módulos críticos
if (typeof window !== 'undefined') {
    // Carrega módulos críticos quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
        LazyLoader.preloadCriticalModules();
    });
}
