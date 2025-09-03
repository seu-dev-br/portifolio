import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    console.log('📡 URL:', supabaseUrl);

    // Teste 1: Verificar se conseguimos fazer uma query simples
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('count')
      .limit(1);

    if (postsError) {
      console.error('❌ Erro na tabela posts:', postsError);
    } else {
      console.log('✅ Tabela posts acessível:', posts);
    }

    // Teste 2: Verificar autenticação
    console.log('🔐 Testando autenticação...');

    // Tentar fazer sign up de um usuário de teste (se não existir)
    const testEmail = 'admin@teste.com';
    const testPassword = 'Teste123!';

    console.log('📝 Tentando criar usuário de teste...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ Usuário já existe:', testEmail);
      } else {
        console.error('❌ Erro no sign up:', signUpError);
      }
    } else {
      console.log('✅ Usuário criado:', signUpData.user?.email);
    }

    // Teste 3: Tentar fazer login
    console.log('🔑 Tentando fazer login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.error('❌ Erro no login:', signInError);
    } else {
      console.log('✅ Login bem-sucedido:', signInData.user?.email);

      // Logout após teste
      await supabase.auth.signOut();
      console.log('👋 Logout realizado');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testSupabaseConnection();
