// Teste de login admin direto (sem browser)
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Credenciais de teste
const EMAIL = 'admin@italo.dev';
const PASSWORD = 'Italo2025Admin!';

// Criar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('🔐 Testando login com credenciais de admin...\n');
  console.log(`URL do Supabase: ${supabaseUrl}`);
  console.log(`Email: ${EMAIL}`);
  console.log(`Senha: ${'*'.repeat(PASSWORD.length)}`);
  
  try {
    // Tentar fazer login
    console.log('\n📡 Enviando requisição de login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD
    });
    
    if (error) {
      console.error('\n❌ Erro ao fazer login:');
      console.error(`  Código: ${error.status}`);
      console.error(`  Mensagem: ${error.message}`);
      console.error('\nDetalhes completos do erro:');
      console.error(error);
      
      // Sugestões específicas baseadas no erro
      if (error.message.includes('Email not confirmed')) {
        console.log('\n🔧 Solução:');
        console.log('  1. Acesse o Supabase Dashboard');
        console.log('  2. Vá para Authentication > Users');
        console.log('  3. Encontre o usuário e marque como "Confirmed"');
        console.log('  - OU -');
        console.log('  1. Vá para Authentication > Settings > Email');
        console.log('  2. Desative "Enable email confirmations"');
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('\n🔧 Solução:');
        console.log('  - Verifique se o email e senha estão corretos');
        console.log('  - Use o script create-admin-user.js para criar um novo usuário');
      } else if (error.message.includes('fetch')) {
        console.log('\n🔧 Solução:');
        console.log('  - Verifique sua conexão com a internet');
        console.log('  - Confirme se o URL do Supabase está correto');
        console.log('  - Verifique se o Supabase está acessível (pode estar em manutenção)');
      }
    } else {
      console.log('\n✅ Login bem-sucedido!');
      console.log(`  Usuário: ${data.user.email}`);
      console.log(`  Acesso: ${data.user.role || 'usuário padrão'}`);
      console.log(`  Último login: ${new Date(data.user.last_sign_in_at).toLocaleString()}`);
      
      // Obter o token para possível uso em debugging
      console.log('\n🔑 Token de acesso obtido com sucesso');
      console.log(`  Tipo: ${data.session.token_type}`);
      console.log(`  Expira: ${new Date(data.session.expires_at * 1000).toLocaleString()}`);
    }
  } catch (err) {
    console.error('\n❌ Erro inesperado:');
    console.error(err);
    
    console.log('\n🔍 Verificações adicionais:');
    console.log('  1. Verifique se o servidor Supabase está online');
    console.log('  2. Confirme se as credenciais de API estão corretas');
    console.log('  3. Verifique se há problemas de rede (proxy, firewall)');
  }
}

// Executar teste
testLogin();
