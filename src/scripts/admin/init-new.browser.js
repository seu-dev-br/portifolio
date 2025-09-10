// init-new.ts - Arquivo de inicialização alternativo para o painel administrativo (TypeScript)

// ==========================================
// DECLARAÇÕES GLOBAIS
// ==========================================

// ==========================================
// ELEMENTOS DOM
// ==========================================

let loginContainer= null;
let dashboardContainer= null;
let loginForm= null;
let logoutBtn= null;

// ==========================================
// FUNÇÃO PARA INICIAR A APLICAÇÃO
// ==========================================

async function startApplication(){
    try {
        console.log('🚀 Iniciando aplicação administrativa');

        // Obter referências para elementos DOM importantes
        loginContainer = document.getElementById('login-container');
        dashboardContainer = document.getElementById('dashboard-container');
        loginForm = document.getElementById('login-form');
        logoutBtn = document.getElementById('logout-btn');

        // Verificar autenticação atual
        if (!window.supabase) {
            throw new Error('Supabase não está disponível');
        }

        const { data, error } = await window.supabase.auth.getUser();

        if (authError) {
            console.error('❌ Erro ao verificar usuário:', authError);
            showLoginForm();
        } else if (user) {
            console.log('👤 Usuário já autenticado:', user.email);
            showDashboard();
        } else {
            console.log('ℹ️ Nenhum usuário autenticado, mostrando login');
            showLoginForm();
        }

        // Configurar eventos
        setupEventListeners();

    } catch (error) {
        console.error('❌ Erro ao iniciar aplicação:', error);
        if (typeof showError === 'function') {
            showError('Erro ao iniciar aplicação' + error.message);
        }
    }
}

// ==========================================
// CONFIGURAÇÃO DE EVENT LISTENERS
// ==========================================

function setupEventListeners(){
    console.log('🔧 Configurando event listeners');

    // Form de login
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // Botão de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Listener para mudanças de estado de autenticação
    if (window.supabase) {
        window.supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Estado de autenticação mudou:', event);

            if (event === 'SIGNED_IN' && session) {
                console.log('✅ Usuário fez login:', session.user.email);
                showDashboard();
                if (typeof showSuccess === 'function') {
                    showSuccess('Login realizado com sucesso!');
                }
            } else if (event === 'SIGNED_OUT') {
                console.log('🚪 Usuário fez logout');
                showLoginForm();
                if (typeof showSuccess === 'function') {
                    showSuccess('Logout realizado com sucesso!');
                }
            }
        });
    }
}

// ==========================================
// HANDLERS DE EVENTOS
// ==========================================

async function handleLoginSubmit(e){
    e.preventDefault();
    console.log('📝 Tentativa de login');

    if (!loginForm || !window.supabase) {
        console.error('❌ Formulário de login ou Supabase não disponível');
        return;
    }

    const emailInput = loginForm.querySelector('#email');
    const passwordInput = loginForm.querySelector('#password');

    if (!emailInput || !passwordInput) {
        console.error('❌ Campos de email ou senha não encontrados');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        if (typeof showError === 'function') {
            showError('Por favor, preencha email e senha');
        }
        return;
    }

    try {
        console.log('🔐 Tentando fazer login...');

        const { data, error } = await window.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('❌ Erro no login:', error);
            if (typeof showError === 'function') {
                showError(error.message || 'Erro ao fazer login');
            }
        } else if (data.user) {
            console.log('✅ Login bem-sucedido:', data.user.email);
            // O listener de auth state change cuidará de mostrar o dashboard
        }

    } catch (error) {
        console.error('❌ Erro inesperado no login:', error);
        if (typeof showError === 'function') {
            showError('Erro inesperado ao fazer login');
        }
    }
}

async function handleLogout(){
    console.log('🚪 Tentativa de logout');

    if (!window.supabase) {
        console.error('❌ Supabase não disponível');
        return;
    }

    try {
        const { error } = await window.supabase.auth.signOut();

        if (error) {
            console.error('❌ Erro no logout:', error);
            if (typeof showError === 'function') {
                showError('Erro ao fazer logout');
            }
        } else {
            console.log('✅ Logout bem-sucedido');
            // O listener de auth state change cuidará de mostrar o login
        }

    } catch (error) {
        console.error('❌ Erro inesperado no logout:', error);
        if (typeof showError === 'function') {
            showError('Erro inesperado ao fazer logout');
        }
    }
}

// ==========================================
// FUNÇÕES DE UI
// ==========================================

function showLoginForm(){
    console.log('📋 Mostrando formulário de login');

    if (loginContainer && dashboardContainer) {
        loginContainer.style.display = 'block';
        dashboardContainer.style.display = 'none';
    } else {
        console.warn('⚠️ Containers de login/dashboard não encontrados');
    }
}

function showDashboard(){
    console.log('📊 Mostrando dashboard');

    if (loginContainer && dashboardContainer) {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
    } else {
        console.warn('⚠️ Containers de login/dashboard não encontrados');
    }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Aguardar o documento estar pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM carregado - iniciando aplicação admin');

    // Verificar se o Supabase já está disponível
    if (window.supabase) {
        console.log('✅ Supabase já está disponível no momento do carregamento do DOM');
        startApplication();
    } else {
        console.log('⏳ Supabase ainda não está disponível no momento do carregamento do DOM');
        // Adicionar um listener para o evento supabaseReady
        window.addEventListener('supabaseReady', () => {
            console.log('✅ Evento supabaseReady recebido - iniciando aplicação');
            startApplication();
        });
    }
});

// ==========================================
// EXPORTS
// ==========================================

{
    startApplication,
    setupEventListeners,
    handleLoginSubmit,
    handleLogout,
    showLoginForm,
    showDashboard
};
