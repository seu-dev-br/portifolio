// init.js - Arquivo de inicialização para o painel administrativo

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

// Função para iniciar a aplicação
async function startApplication() {
    try {
        console.log('🚀 Iniciando aplicação administrativa');
        
        // Obter referências para elementos DOM importantes
        const loginContainer = document.getElementById('login-container');
        const dashboardContainer = document.getElementById('dashboard-container');
        const loginForm = document.getElementById('login-form');
        const logoutBtn = document.getElementById('logout-btn');
        
        // Verificar autenticação atual
        const { data: { user }, error: authError } = await window.supabase.auth.getUser();
        
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
        
        // Form de login
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                try {
                    const loadingSpinner = document.getElementById('loading-spinner');
                    if (loadingSpinner) loadingSpinner.style.display = 'flex';
                    
                    console.log('🔐 Tentando login com:', email);
                    const { data, error } = await window.supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });
                    
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                    
                    if (error) {
                        console.error('❌ Erro de login:', error);
                        showError('Erro no login: ' + error.message);
                    } else {
                        console.log('✅ Login bem-sucedido!');
                        showDashboard();
                    }
                } catch (error) {
                    console.error('❌ Erro ao processar login:', error);
                    showError('Erro ao processar login: ' + error.message);
                }
            });
        }
        
        // Botão de logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await window.supabase.auth.signOut();
                    showLoginForm();
                } catch (error) {
                    console.error('❌ Erro ao fazer logout:', error);
                    showError('Erro ao fazer logout: ' + error.message);
                }
            });
        }
        
        // Funções auxiliares
        function showLoginForm() {
            if (loginContainer) loginContainer.style.display = 'flex';
            if (dashboardContainer) dashboardContainer.style.display = 'none';
        }
        
        function showDashboard() {
            if (loginContainer) loginContainer.style.display = 'none';
            if (dashboardContainer) dashboardContainer.style.display = 'block';
            
            // Carregar dados iniciais, se necessário
            if (typeof loadPosts === 'function') {
                loadPosts();
            }
        }
        
        function showError(message) {
            const loginError = document.getElementById('login-error');
            if (loginError) {
                loginError.textContent = message;
                loginError.style.display = 'block';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 5000);
            } else {
                alert(message);
            }
        }
        
        console.log('✅ Aplicação administrativa inicializada com sucesso');
        
    } catch (error) {
        console.error('❌ Erro fatal na inicialização da aplicação:', error);
        alert('Erro fatal na inicialização: ' + error.message);
    }
}
