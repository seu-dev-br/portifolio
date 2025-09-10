// debug.ts - Script de depuração para o painel administrativo (TypeScript)

// ==========================================
// DECLARAÇÕES GLOBAIS
// ==========================================

// Removido para evitar conflitos com outras declarações

// ==========================================
// CONSTANTES DE CONFIGURAÇÃO
// ==========================================

const DEBUG_ENABLED = true;
const DEBUG_DELAY = 2000; // ms
const LOG_PREFIX = '🔍 [DEBUG]';

// ==========================================
// FUNÇÕES DE LOGGING
// ==========================================

function debugLog(message, ...args) {
    if (DEBUG_ENABLED) {
        console.log(`${LOG_PREFIX} ${message}`, ...args);
    }
}

function debugError(message, ...args) {
    if (DEBUG_ENABLED) {
        console.error(`${LOG_PREFIX} ${message}`, ...args);
    }
}

function debugWarn(message, ...args) {
    if (DEBUG_ENABLED) {
        console.warn(`${LOG_PREFIX} ${message}`, ...args);
    }
}

// ==========================================
// VERIFICAÇÃO DO SUPABASE
// ==========================================

function checkSupabaseAvailability() {
    debugLog('Verificando disponibilidade do Supabase...');

    if (window.supabase) {
        debugLog('✅ Supabase está definido globalmente');
        debugLog('🔗 URL do Supabase:', window.supabase.supabaseUrl);

        // Verificar se podemos acessar a API de auth
        if (window.supabase.auth) {
            debugLog('✅ API de autenticação do Supabase está disponível');

            // Verificar sessão atual
            window.supabase.auth.getSession().then(({ data, error }) => {
                if (error) {
                    debugError('Erro ao verificar sessão:', error);
                } else if (data.session) {
                    debugLog('✅ Sessão ativa encontrada para:', data.session.user.email);
                    logSessionDetails(data.session);
                } else {
                    debugLog('ℹ️ Nenhuma sessão ativa encontrada');
                }
            }).catch((error) => {
                debugError('Erro inesperado ao verificar sessão:', error);
            });
        } else {
            debugError('❌ API de autenticação do Supabase não está disponível');
        }
    } else {
        debugError('❌ Supabase não está definido globalmente');
        debugLog('💡 Verificando se o script do Supabase foi carregado...');
        checkSupabaseScriptLoaded();
    }
}

function checkSupabaseScriptLoaded() {
    const supabaseScripts = document.querySelectorAll('script[src*="supabase"]');
    debugLog(`Encontrados ${supabaseScripts.length} scripts relacionados ao Supabase:`);

    supabaseScripts.forEach((script, index) => {
        const src = script.getAttribute('src');
        debugLog(`  ${index + 1}. ${src}`);
    });

    if (supabaseScripts.length === 0) {
        debugWarn('Nenhum script do Supabase encontrado na página');
    }
}

function logSessionDetails(session) {
    if (!session) return;

    debugLog('📋 Detalhes da sessão:');
    debugLog(`  - Usuário: ${session.user?.email || 'N/A'}`);
    debugLog(`  - ID do usuário: ${session.user?.id || 'N/A'}`);
    debugLog(`  - Provedor: ${session.user?.app_metadata?.provider || 'N/A'}`);
    debugLog(`  - Último login: ${session.user?.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString() : 'N/A'}`);
    debugLog(`  - Criado em: ${session.user?.created_at ? new Date(session.user.created_at).toLocaleString() : 'N/A'}`);
}

// ==========================================
// MONITORAMENTO DE FORMULÁRIOS
// ==========================================

function setupFormMonitoring() {
    debugLog('Configurando monitoramento de formulários...');

    // Monitorar formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        debugLog('✅ Formulário de login encontrado');
        loginForm.addEventListener('submit', handleLoginSubmit);
    } else {
        debugError('❌ Formulário de login não encontrado');
    }

    // Monitorar outros formulários
    const postForm = document.getElementById('post-form');
    if (postForm) {
        debugLog('✅ Formulário de posts encontrado');
        postForm.addEventListener('submit', handlePostSubmit);
    }

    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        debugLog('✅ Formulário de projetos encontrado');
        projectForm.addEventListener('submit', handleProjectSubmit);
    }
}

function handleLoginSubmit(e) {
    const form = e.target;
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');

    const email = emailInput?.value || '';
    const password = passwordInput?.value || '';

    debugLog(`🔍 Tentativa de login com email: ${email}`);
    debugLog(`🔐 Senha fornecida: ${password ? '***' + password.slice(-3) : 'vazia'}`);

    // Não impedir o comportamento padrão, apenas monitorar
}

function handlePostSubmit(e) {
    debugLog('📝 Formulário de post submetido');
    const form = e.target;
    const formData = new FormData(form);

    debugLog('📋 Dados do formulário de post:');
    for (const [key, value] of formData.entries()) {
        if (key.includes('password') || key.includes('senha')) {
            debugLog(`  - ${key}: ***`);
        } else {
            debugLog(`  - ${key}: ${value}`);
        }
    }
}

function handleProjectSubmit(e) {
    debugLog('🚀 Formulário de projeto submetido');
    const form = e.target;
    const formData = new FormData(form);

    debugLog('📋 Dados do formulário de projeto:');
    for (const [key, value] of formData.entries()) {
        debugLog(`  - ${key}: ${value}`);
    }
}

// ==========================================
// MONITORAMENTO DE EVENTOS DE AUTENTICAÇÃO
// ==========================================

function setupAuthMonitoring() {
    debugLog('Configurando monitoramento de eventos de autenticação...');

    if (window.supabase?.auth) {
        window.supabase.auth.onAuthStateChange((event, session) => {
            debugLog(`🔄 Evento de autenticação: ${event}`);

            switch (event) {
                case 'SIGNED_IN':
                    debugLog('✅ Usuário fez login');
                    if (session?.user) {
                        debugLog(`👤 Email: ${session.user.email}`);
                        debugLog(`🆔 ID: ${session.user.id}`);
                    }
                    break;

                case 'SIGNED_OUT':
                    debugLog('🚪 Usuário fez logout');
                    break;

                case 'TOKEN_REFRESHED':
                    debugLog('🔄 Token renovado');
                    break;

                case 'USER_UPDATED':
                    debugLog('👤 Usuário atualizado');
                    break;

                default:
                    debugLog(`❓ Evento desconhecido: ${event}`);
            }
        });
    } else {
        debugWarn('Não foi possível configurar monitoramento de autenticação - Supabase não disponível');
    }
}

// ==========================================
// MONITORAMENTO DE PERFORMANCE
// ==========================================

function logPerformanceMetrics() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            debugLog('📊 Métricas de performance:');
            debugLog(`  - Tempo de carregamento: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
            debugLog(`  - DOM Ready: ${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms`);
            debugLog(`  - Primeira renderização: ${perfData.responseEnd - perfData.fetchStart}ms`);
        }
    }
}

// ==========================================
// MONITORAMENTO DE ERROS
// ==========================================

function setupErrorMonitoring() {
    debugLog('Configurando monitoramento de erros...');

    // Monitorar erros não capturados
    window.addEventListener('error', (event) => {
        debugError('❌ Erro não capturado:', event.error);
        debugError(`📍 Arquivo: ${event.filename}:${event.lineno}:${event.colno}`);
    });

    // Monitorar promessas rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
        debugError('❌ Promessa rejeitada não tratada:', event.reason);
    });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    debugLog('🚀 DOM carregado - iniciando depuração');

    // Aguardar um pouco para garantir que tudo esteja carregado
    setTimeout(() => {
        checkSupabaseAvailability();
        setupFormMonitoring();
        setupAuthMonitoring();
        setupErrorMonitoring();
        logPerformanceMetrics();

        debugLog('✅ Sistema de depuração inicializado completamente');
    }, DEBUG_DELAY);
});

// ==========================================
// EXPORTS PARA USO EXTERNO
// ==========================================

 {
    debugLog,
    debugError,
    debugWarn,
    checkSupabaseAvailability,
    setupFormMonitoring,
    setupAuthMonitoring,
    logPerformanceMetrics
};
