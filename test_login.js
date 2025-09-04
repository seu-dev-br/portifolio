// Script para testar o login no Supabase
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://nattvkjaecceirxthizc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

// Credenciais de teste
const TEST_EMAIL = 'admin@italo.dev';
const TEST_PASSWORD = 'Italo2025Admin!';

async function testLogin() {
  try {
    console.log('🚀 Iniciando teste de login no Supabase...');
    
    // Inicializar o cliente Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Cliente Supabase inicializado com sucesso');
    
    // Tentar fazer login
    console.log(`👤 Tentando login com email: ${TEST_EMAIL}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (error) {
      console.error('❌ Erro no login:', error.message);
      return;
    }
    
    console.log('✅ Login bem-sucedido!');
    console.log('📊 Informações do usuário:');
    console.log(`- ID: ${data.user.id}`);
    console.log(`- Email: ${data.user.email}`);
    console.log(`- Criado em: ${new Date(data.user.created_at).toLocaleString()}`);
    console.log(`- Último login: ${new Date(data.user.last_sign_in_at).toLocaleString()}`);
    
    // Obter dados do usuário atual
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Erro ao obter dados do usuário:', userError.message);
      return;
    }
    
    console.log('✅ Verificação getUser() bem-sucedida');
    
    // Fazer logout
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.error('❌ Erro no logout:', logoutError.message);
      return;
    }
    
    console.log('✅ Logout bem-sucedido');
    console.log('🎉 Teste de autenticação concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro não tratado durante o teste:', error.message);
  }
}

testLogin();
