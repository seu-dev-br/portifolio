// Debug Script para admin.astro
console.log('🔍 Script de depuração iniciado');

// Monitorar eventos de autenticação
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DOM carregado - iniciando depuração');
    
    // Verificar se o Supabase está definido
    setTimeout(() => {
        if (window.supabase) {
            console.log('✅ Supabase está definido globalmente');
            console.log('🔗 URL do Supabase:', window.supabase.supabaseUrl);
            
            // Verificar se podemos acessar a API de auth
            if (window.supabase.auth) {
                console.log('✅ API de autenticação do Supabase está disponível');
                
                // Verificar sessão atual
                window.supabase.auth.getSession().then(({ data, error }) => {
                    if (error) {
                        console.error('❌ Erro ao verificar sessão:', error);
                    } else if (data.session) {
                        console.log('✅ Sessão ativa encontrada para:', data.session.user.email);
                    } else {
                        console.log('ℹ️ Nenhuma sessão ativa encontrada');
                    }
                });
            } else {
                console.error('❌ API de autenticação do Supabase não está disponível');
            }
        } else {
            console.error('❌ Supabase não está definido globalmente');
        }
    }, 2000);
    
    // Monitorar formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('✅ Formulário de login encontrado');
        loginForm.addEventListener('submit', (e) => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log(`🔍 Tentativa de login com email: ${email}`);
            
            // Não precisamos impedir o comportamento padrão, apenas monitorar
        });
    } else {
        console.error('❌ Formulário de login não encontrado');
    }
    
    // Verificar se waitForSupabase está disponível
    if (typeof waitForSupabase === 'function') {
        console.log('✅ Função waitForSupabase está disponível');
    } else {
        console.error('❌ Função waitForSupabase não está disponível');
    }
    
    // Monitorar evento supabaseReady
    window.addEventListener('supabaseReady', () => {
        console.log('✅ Evento supabaseReady disparado');
    });
    
    // Verificar variáveis globais importantes
    setTimeout(() => {
        console.log('🔍 Verificando variáveis globais após 3 segundos:');
        console.log('- window.supabase:', !!window.supabase);
        console.log('- window.supabaseInitialized:', !!window.supabaseInitialized);
        console.log('- window.currentUser:', !!window.currentUser);
    }, 3000);
});

// Erros não tratados
window.addEventListener('error', (event) => {
    console.error('❌ Erro não tratado:', event.error);
});

// Rejeições de promessa não tratadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promessa rejeitada não tratada:', event.reason);
});

console.log('🔍 Script de depuração carregado com sucesso');
