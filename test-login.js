// Script para testar a conexão e login do Supabase
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('🔍 Testando login...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@italo.dev',
      password: 'Italo2025Admin!'
    });

    if (error) {
      console.error('❌ Erro no login:', error.message);
      return;
    }

    if (data.user) {
      console.log('✅ Login bem-sucedido!');
      console.log('👤 Usuário:', data.user.email);
      console.log('🆔 ID:', data.user.id);

      // Fazer logout
      await supabase.auth.signOut();
      console.log('👋 Logout realizado');
    }
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testLogin();
