// init.ts - Inicialização do painel administrativo (TypeScript)

// ==========================================
// DECLARAÇÕES GLOBAIS
// ==========================================

declare global {
    function waitForSupabase(): Promise<any>;
    function initAuth(): Promise<void>;
    function login(email: string, password: string): Promise<void>;
    function logout(): Promise<void>;
    function showError(message: string): void;
}

// ==========================================
// ELEMENTOS DOM
// ==========================================

const loginForm = document.getElementById('login-form') as HTMLFormElement | null;
const logoutBtn = document.getElementById('logout-btn') as HTMLElement | null;

// ==========================================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// ==========================================

async function initApp(): Promise<void> {
    try {
        console.log('🚀 Inicializando aplicação admin...');

        // Aguardar o Supabase estar disponível
        await waitForSupabase();

        // Inicializar autenticação
        await initAuth();

        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', async (e: Event) => {
                e.preventDefault();
                const emailInput = document.getElementById('email') as HTMLInputElement;
                const passwordInput = document.getElementById('password') as HTMLInputElement;

                if (emailInput && passwordInput) {
                    const email = emailInput.value;
                    const password = passwordInput.value;
                    await login(email, password);
                }
            });
        }

        // Logout button
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // Configurar outros event listeners se a função estiver disponível
        if (typeof window.setupAdminEventListeners === 'function') {
            window.setupAdminEventListeners();
        }

        console.log('✅ Inicialização da aplicação concluída');
    } catch (error: any) {
        console.error('❌ Erro ao inicializar a aplicação:', error);
        if (typeof showError === 'function') {
            showError('Erro ao inicializar a aplicação: ' + error.message);
        } else {
            alert('Erro ao inicializar a aplicação: ' + error.message);
        }
    }
}

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ==========================================

// Chamada para iniciar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - iniciando aplicação admin');

    // Verificar se o Supabase já está disponível
    if (window.supabase) {
        console.log('✅ Supabase já está disponível no momento do carregamento do DOM');
    } else {
        console.log('⏳ Supabase ainda não está disponível, aguardando...');
    }

    // Iniciar a aplicação
    initApp();
});

// Exportar função para uso externo se necessário
export { initApp };
