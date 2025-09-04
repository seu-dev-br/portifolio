// Login Test Script
console.log('🔍 Iniciando teste de login direto no console');

// Credenciais de teste
const TEST_EMAIL = 'admin@italo.dev';
const TEST_PASSWORD = 'Italo2025Admin!';

// Função para testar login
async function testLogin() {
    try {
        console.log('🚀 Verificando se o Supabase está disponível...');
        
        // Aguardar o Supabase estar disponível
        if (!window.supabase) {
            console.error('❌ Supabase não está disponível no window global!');
            return;
        }
        
        console.log('✅ Supabase encontrado! Tentando login...');
        
        // Tentar login
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        
        if (error) {
            console.error('❌ Erro no login:', error);
            return;
        }
        
        console.log('✅ Login bem-sucedido!');
        console.log('👤 Usuário:', data.user.email);
        
        // Verificar sessão
        const { data: sessionData } = await window.supabase.auth.getSession();
        console.log('🔑 Sessão ativa:', !!sessionData.session);
        
        // Detalhes do usuário
        console.log('📋 Detalhes do usuário:');
        console.log(`- ID: ${data.user.id}`);
        console.log(`- Email: ${data.user.email}`);
        console.log(`- Último login: ${new Date(data.user.last_sign_in_at).toLocaleString()}`);
        
    } catch (err) {
        console.error('❌ Erro inesperado no teste de login:', err);
    }
}

// Executar o teste quando o Supabase estiver pronto
if (window.supabaseInitialized && window.supabase) {
    console.log('✅ Supabase já inicializado, executando teste...');
    testLogin();
} else {
    console.log('⏳ Aguardando Supabase inicializar...');
    window.addEventListener('supabaseReady', () => {
        console.log('✅ Evento supabaseReady recebido, executando teste...');
        testLogin();
    });
}
