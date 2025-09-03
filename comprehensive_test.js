import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function comprehensiveTest() {
  console.log('🔍 INICIANDO TESTE ABRANGENTE DO SUPABASE\n');

  try {
    // Teste 1: Conexão básica
    console.log('1️⃣ TESTANDO CONEXÃO BÁSICA...');
    const { data: health, error: healthError } = await supabase
      .from('posts')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ Erro na conexão básica:', healthError);
    } else {
      console.log('✅ Conexão básica OK');
    }

    // Teste 2: Verificar configurações de CORS
    console.log('\n2️⃣ TESTANDO CONFIGURAÇÕES DE CORS...');
    try {
      const corsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window?.location?.origin || 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'authorization,content-type'
        }
      });

      console.log('📡 Status CORS:', corsResponse.status);
      console.log('📡 Headers CORS:', Object.fromEntries(corsResponse.headers.entries()));
    } catch (corsError) {
      console.error('❌ Erro no teste CORS:', corsError);
    }

    // Teste 3: Verificar se podemos fazer uma requisição autenticada
    console.log('\n3️⃣ TESTANDO AUTENTICAÇÃO...');

    // Primeiro, vamos tentar obter a sessão atual
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ Erro ao obter sessão:', sessionError);
    } else {
      console.log('✅ Sessão obtida:', session?.session ? 'Ativa' : 'Nenhuma');
    }

    // Teste 4: Verificar configurações do projeto
    console.log('\n4️⃣ VERIFICANDO CONFIGURAÇÕES DO PROJETO...');

    // Verificar se conseguimos acessar as configurações
    const projectInfo = {
      url: supabaseUrl,
      key: supabaseAnonKey.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    };

    console.log('📋 Configurações:', projectInfo);

    // Teste 5: Verificar conectividade de rede
    console.log('\n5️⃣ TESTANDO CONECTIVIDADE DE REDE...');

    try {
      const networkTest = await fetch('https://httpbin.org/ip');
      const networkData = await networkTest.json();
      console.log('🌐 IP público:', networkData.origin);
      console.log('✅ Conectividade OK');
    } catch (networkError) {
      console.error('❌ Erro de conectividade:', networkError);
    }

    // Teste 6: Verificar se o domínio do Vercel está autorizado
    console.log('\n6️⃣ VERIFICANDO DOMÍNIOS AUTORIZADOS...');

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'Node.js';
    console.log('🏠 Origem atual:', currentOrigin);

    // Lista de domínios comuns que podem estar bloqueados
    const commonDomains = [
      'http://localhost:3000',
      'http://localhost:4321', // Astro dev
      'https://portifolio-seu-dev-br.vercel.app',
      'https://portifolio-git-main-seu-dev-br.vercel.app'
    ];

    console.log('📋 Domínios que podem precisar ser autorizados:');
    commonDomains.forEach(domain => console.log(`   - ${domain}`));

    console.log('\n🔧 PARA CORREÇÃO:');
    console.log('1. Acesse: https://supabase.com/dashboard');
    console.log('2. Vá para: Authentication → Settings');
    console.log('3. Na seção "Site URL":', currentOrigin);
    console.log('4. Na seção "Redirect URLs":');
    console.log('   - Adicione:', currentOrigin);
    console.log('   - Adicione:', `${currentOrigin}/admin`);
    console.log('5. Desmarque "Enable email confirmations" (para desenvolvimento)');

  } catch (error) {
    console.error('❌ ERRO GERAL NO TESTE:', error);
  }

  console.log('\n🎯 TESTE CONCLUÍDO');
}

comprehensiveTest();
