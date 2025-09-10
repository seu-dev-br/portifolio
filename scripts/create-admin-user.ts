// Script para criar um usuário administrativo no Supabase
// Com confirmação automática habilitada
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

// Configuração do usuário administrador
const adminEmail: string = 'admin@italo.dev';
const adminPassword: string = 'Italo2025Admin!';

async function createAdminUser(): Promise<void> {
  try {
    console.log('🔍 Verificando se o usuário já existe...');
    
    // Tentar fazer login para verificar se o usuário existe
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (!signInError) {
      console.log('✅ Usuário já existe e está funcionando!');
      console.log(`   Email: ${adminEmail}`);
      
      // Fazer logout
      await supabase.auth.signOut();
      return;
    }

    // Se o erro não for "Invalid login credentials", pode ser outro problema
    if (signInError.message !== 'Invalid login credentials') {
      console.log('⚠️ Erro ao verificar usuário:', signInError.message);
    }

    console.log('📝 Criando novo usuário administrador...');
    
    // Usar a API Admin para criar usuário com email confirmado
    // Obs: isso requer a URL da função Supabase Edge que não temos acesso aqui
    // Como alternativa, usamos o método signUp padrão
    
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('❌ Erro ao criar usuário:', error.message);
      return;
    }

    console.log('✅ Usuário criado com sucesso!');
    if (data.user) {
      console.log(`   Email: ${data.user.email}`);
      console.log(`   ID: ${data.user.id}`);
    }
    console.log('\n⚠️ IMPORTANTE: ');
    console.log('1. Acesse o painel do Supabase: https://supabase.com/dashboard');
    console.log('2. Vá para: Authentication → Users');
    console.log(`3. Encontre o usuário: ${adminEmail}`);
    console.log('4. Clique em "Confirm email" para confirmar manualmente');
    console.log('\nOU');
    console.log('1. Acesse: Authentication → Settings → Email');
    console.log('2. Desmarque "Enable email confirmations"');
    console.log('3. Salve as configurações');

  } catch (error: unknown) {
    let message = 'Erro desconhecido';
    if (error instanceof Error) message = error.message;
    else if (typeof error === 'string') message = error;
    console.error('❌ Erro geral:', message);
    process.exit(1);
  }
}

createAdminUser();
