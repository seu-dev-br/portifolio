// Função para inicializar a aplicação
async function initApp() {
    try {
        console.log('🚀 Inicializando aplicação admin...');
        
        // Aguardar o Supabase estar disponível
        await waitForSupabase();
        
        // Inicializar autenticação
        await initAuth();
        
        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                await login(email, password);
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
    } catch (error) {
        console.error('❌ Erro ao inicializar a aplicação:', error);
        if (typeof showError === 'function') {
            showError('Erro ao inicializar a aplicação: ' + error.message);
        } else {
            alert('Erro ao inicializar a aplicação: ' + error.message);
        }
    }
}

// Chamada para iniciar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - iniciando aplicação admin');
    
    // Verificar se o Supabase já está disponível
    if (window.supabase) {
        console.log('✅ Supabase já está disponível no momento do carregamento do DOM');
    } else {
        console.log('⏳ Supabase ainda não está disponível no momento do carregamento do DOM');
        // Adicionar um listener para o evento supabaseReady
        window.addEventListener('supabaseReady', () => {
            console.log('✅ Evento supabaseReady recebido em init.js');
        });
    }
    
    // Iniciar a aplicação
    initApp().catch(error => {
        console.error('❌ Erro ao inicializar a aplicação:', error);
        alert('Erro ao inicializar a aplicação: ' + error.message);
    });
});
