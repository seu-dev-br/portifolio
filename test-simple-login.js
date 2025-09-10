// Script simples para testar apenas o login do Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleLogin() {
  console.log('🔐 Testando login simples...');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@italo.dev',
      password: 'Italo2025Admin!'
    });

    if (error) {
      console.error('❌ Erro no login:', error.message);
      return false;
    }

    if (data.user) {
      console.log('✅ Login bem-sucedido!');
      console.log('👤 Usuário:', data.user.email);
      console.log('🆔 ID:', data.user.id);

      // Fazer logout
      await supabase.auth.signOut();
      console.log('👋 Logout realizado');
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return false;
  }
}

testSimpleLogin();
