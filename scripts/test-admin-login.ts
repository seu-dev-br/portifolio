// Script para testar login com o usuário administrador
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não encontradas!');
  console.log('Certifique-se de que o arquivo .env.local está configurado corretamente.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Credenciais do usuário administrador
const adminEmail: string = 'admin@italo.dev';
const adminPassword: string = 'Italo2025Admin!';

async function testAdminLogin(): Promise<void> {
  console.log('🔐 Testando login com usuário administrador...');
  console.log(`📧 Email: ${adminEmail}`);
  
  try {
    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        console.error('❌ Erro: Email não confirmado!');
        console.log('\n🔧 Soluções:');
        console.log('1. Acesse o painel do Supabase: https://supabase.com/dashboard');
        console.log('2. Vá para: Authentication → Users');
        console.log(`3. Encontre o usuário: ${adminEmail}`);
        console.log('4. Clique em "Confirm email" para confirmar manualmente');
        console.log('\nOU');
        console.log('1. Acesse: Authentication → Settings → Email');
        console.log('2. Desmarque "Enable email confirmations"');
        console.log('3. Salve as configurações');
      } else {
        console.error('❌ Erro no login:', error.message);
      }
      process.exit(1);
    }

    console.log('✅ Login bem-sucedido!');
    console.log(`👤 Usuário: ${data.user?.email}`);
    console.log(`🆔 ID: ${data.user?.id}`);
    console.log(`🔑 Sessão ativa: ${!!data.session}`);
    
    // Verificar papel (role) do usuário se existir
    if (data.user?.app_metadata?.role) {
      console.log(`👑 Papel: ${data.user.app_metadata.role}`);
    }

    // Fazer logout
    await supabase.auth.signOut();
    console.log('👋 Logout realizado');
    
  } catch (error: unknown) {
    let message = 'Erro desconhecido';
    if (error instanceof Error) message = error.message;
    else if (typeof error === 'string') message = error;
    console.error('❌ Erro geral:', message);
    process.exit(1);
  }
}

testAdminLogin();
