// src/lib/settings-config.ts
// Arquivo de configuração para a integração das configurações do admin

interface IntegrationConfig {
    // Configurações de cache
    cache: {
        duration: number; // em minutos
        enabled: boolean;
    };

    // Configurações de debug
    debug: {
        enabled: boolean;
        logLevel: 'error' | 'warn' | 'info' | 'debug';
    };

    // Configurações específicas por página
    pages: {
        home: PageConfig;
        about: PageConfig;
        projects: PageConfig;
        blog: PageConfig;
    };

    // Configurações globais
    global: {
        siteTitle: string;
        defaultLanguage: string;
        theme: 'light' | 'dark' | 'auto';
    };
}

interface PageConfig {
    enabled: boolean;
    selectors: {
        title?: string;
        description?: string;
        image?: string;
        content?: string;
    };
    features: {
        slider?: boolean;
        animations?: boolean;
        lazyLoading?: boolean;
    };
}

class SettingsConfig {
    private config: IntegrationConfig;

    constructor() {
        // Configuração padrão
        this.config = {
            cache: {
                duration: 5, // 5 minutos
                enabled: true
            },
            debug: {
                enabled: process.env.NODE_ENV === 'development',
                logLevel: 'info'
            },
            pages: {
                home: {
                    enabled: true,
                    selectors: {
                        title: '.hero-title, h1, .main-title',
                        description: '.hero-description, .description, p',
                        image: '.hero-image, .background-image'
                    },
                    features: {
                        slider: true,
                        animations: true,
                        lazyLoading: true
                    }
                },
                about: {
                    enabled: true,
                    selectors: {
                        title: '.about-title, h1',
                        description: '.about-description, .bio',
                        image: '.profile-image, .about-image',
                        content: '.about-content'
                    },
                    features: {
                        slider: false,
                        animations: true,
                        lazyLoading: false
                    }
                },
                projects: {
                    enabled: true,
                    selectors: {
                        title: '.projects-title, h1',
                        description: '.projects-description',
                        content: '.projects-grid, .projects-list'
                    },
                    features: {
                        slider: false,
                        animations: true,
                        lazyLoading: true
                    }
                },
                blog: {
                    enabled: true,
                    selectors: {
                        title: '.blog-title, h1',
                        description: '.blog-description',
                        content: '.posts-grid, .posts-list'
                    },
                    features: {
                        slider: false,
                        animations: true,
                        lazyLoading: true
                    }
                }
            },
            global: {
                siteTitle: 'Meu Portfólio',
                defaultLanguage: 'pt-BR',
                theme: 'auto'
            }
        };

        // Carregar configurações do localStorage se disponíveis
        this.loadFromStorage();
    }

    /**
     * Atualiza a configuração
     */
    updateConfig(newConfig: Partial<IntegrationConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.saveToStorage();

        if (this.config.debug.enabled) {
            console.log('🔧 Configuração atualizada:', this.config);
        }
    }

    /**
     * Obtém a configuração atual
     */
    getConfig(): IntegrationConfig {
        return { ...this.config };
    }

    /**
     * Obtém configuração de uma página específica
     */
    getPageConfig(page: keyof IntegrationConfig['pages']): PageConfig {
        return { ...this.config.pages[page] };
    }

    /**
     * Verifica se uma feature está habilitada para uma página
     */
    isFeatureEnabled(page: keyof IntegrationConfig['pages'], feature: keyof PageConfig['features']): boolean {
        const pageConfig = this.config.pages[page];
        return pageConfig.enabled && (pageConfig.features[feature] ?? false);
    }

    /**
     * Obtém seletor CSS para um elemento de uma página
     */
    getSelector(page: keyof IntegrationConfig['pages'], element: keyof PageConfig['selectors']): string | undefined {
        return this.config.pages[page].selectors[element];
    }

    /**
     * Salva configuração no localStorage
     */
    private saveToStorage(): void {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('settings-config', JSON.stringify(this.config));
            }
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar configuração no localStorage:', error);
        }
    }

    /**
     * Carrega configuração do localStorage
     */
    private loadFromStorage(): void {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('settings-config');
                if (stored) {
                    const parsedConfig = JSON.parse(stored);
                    this.config = { ...this.config, ...parsedConfig };
                }
            }
        } catch (error) {
            console.warn('⚠️ Não foi possível carregar configuração do localStorage:', error);
        }
    }

    /**
     * Reseta para configuração padrão
     */
    resetToDefault(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('settings-config');
        }
        // Recriar a instância com valores padrão
        const defaultConfig = new SettingsConfig();
        this.config = defaultConfig.getConfig();

        if (this.config.debug.enabled) {
            console.log('🔄 Configuração resetada para padrão');
        }
    }

    /**
     * Log condicional baseado no nível configurado
     */
    log(level: 'error' | 'warn' | 'info' | 'debug', message: string, ...args: any[]): void {
        if (!this.config.debug.enabled) return;

        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.config.debug.logLevel);
        const messageLevelIndex = levels.indexOf(level);

        if (messageLevelIndex <= currentLevelIndex) {
            const emoji = {
                error: '❌',
                warn: '⚠️',
                info: 'ℹ️',
                debug: '🐛'
            };

            console.log(`${emoji[level]} [${level.toUpperCase()}] ${message}`, ...args);
        }
    }
}

// Instância global da configuração
const settingsConfig = new SettingsConfig();

// Exportar para uso global
if (typeof window !== 'undefined') {
    (window as any).settingsConfig = settingsConfig;
}

export default settingsConfig;
export type { IntegrationConfig, PageConfig };
