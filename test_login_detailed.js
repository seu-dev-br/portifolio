// Script para testar o login no Supabase
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://nattvkjaecceirxthizc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

// Credenciais de teste
const TEST_EMAIL = 'admin@italo.dev';
const TEST_PASSWORD = 'Italo2025Admin!';

async function testLoginWithDetails() {
  try {
    console.log('🚀 Iniciando teste detalhado de login no Supabase...');
    
    // Inicializar o cliente Supabase com opções de depuração
    console.log('🔗 URL do Supabase:', SUPABASE_URL);
    console.log('🔑 Chave anônima do Supabase (primeiros 10 caracteres):', SUPABASE_ANON_KEY.substring(0, 10) + '...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        debug: true
      }
    });
    console.log('✅ Cliente Supabase inicializado com sucesso');
    
    // Verificar se a URL e a chave estão definidas corretamente
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('❌ URL ou chave anônima do Supabase não definidas corretamente');
      return;
    }
    
    // Verificar conexão com o Supabase fazendo uma consulta simples
    console.log('🔄 Testando conexão com o Supabase...');
    try {
      const { error: connectionError } = await supabase.from('_test_connection').select('*').limit(1);
      if (connectionError && connectionError.code !== 'PGRST116') {
        console.error('❌ Erro ao conectar com o Supabase:', connectionError);
      } else {
        console.log('✅ Conexão com o Supabase estabelecida com sucesso');
      }
    } catch (connectionError) {
      console.log('ℹ️ Erro de conexão esperado (tabela _test_connection não existe): OK');
    }
    
    // Tentar fazer login
    console.log(`👤 Tentando login com email: ${TEST_EMAIL}`);
    const startTime = Date.now();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    const endTime = Date.now();
    console.log(`⏱️ Tempo de resposta: ${endTime - startTime}ms`);
    
    if (error) {
      console.error('❌ Erro no login:', error);
      console.error('Detalhes do erro:');
      console.error('- Código:', error.code || 'N/A');
      console.error('- Mensagem:', error.message || 'N/A');
      console.error('- Status:', error.status || 'N/A');
      return;
    }
    
    console.log('✅ Login bem-sucedido!');
    console.log('📊 Informações do usuário:');
    console.log(`- ID: ${data.user.id}`);
    console.log(`- Email: ${data.user.email}`);
    console.log(`- Criado em: ${new Date(data.user.created_at).toLocaleString()}`);
    console.log(`- Último login: ${new Date(data.user.last_sign_in_at).toLocaleString()}`);
    
    // Testar getSession
    console.log('🔄 Testando getSession()...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao obter sessão:', sessionError);
      return;
    }
    
    if (sessionData.session) {
      console.log('✅ Sessão obtida com sucesso');
      console.log(`- Token expira em: ${new Date(sessionData.session.expires_at * 1000).toLocaleString()}`);
    } else {
      console.warn('⚠️ Sessão não encontrada ou nula');
    }
    
    // Obter dados do usuário atual
    console.log('🔄 Testando getUser()...');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Erro ao obter dados do usuário:', userError);
      return;
    }
    
    if (userData.user) {
      console.log('✅ Dados do usuário obtidos com sucesso via getUser()');
    } else {
      console.warn('⚠️ Usuário não encontrado ou nulo via getUser()');
    }
    
    // Fazer logout
    console.log('🔄 Testando signOut()...');
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.error('❌ Erro no logout:', logoutError);
      return;
    }
    
    console.log('✅ Logout bem-sucedido');
    console.log('🎉 Teste de autenticação concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro não tratado durante o teste:', error);
    console.error('Stack trace:', error.stack);
  }
}

testLoginWithDetails();
