import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://gqkdvemqmggdqrplhkxc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

async function testConnectivity() {
    console.log('🌐 Testando conectividade básica...');

    try {
        // Teste básico de conectividade HTTP
        const response = await fetch('https://www.google.com');
        console.log('✅ Conectividade básica OK');

        // Teste de conectividade com Supabase
        console.log('🔗 Testando conexão com Supabase...');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Tentar fazer uma consulta simples
        const { data, error } = await supabase
            .from('projects')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Erro de conectividade com Supabase:', error.message);
            console.log('🔍 Detalhes do erro:', error);

            // Verificar se é erro de rede
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log('🌐 Problema de rede detectado');
                console.log('💡 Possíveis soluções:');
                console.log('   1. Verifique sua conexão com a internet');
                console.log('   2. Verifique se há bloqueios de firewall');
                console.log('   3. Tente usar uma VPN se necessário');
                console.log('   4. Verifique se o projeto Supabase ainda existe');
            }
        } else {
            console.log('✅ Conexão com Supabase estabelecida!');
            console.log('📊 Resposta:', data);
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);

        if (error.message.includes('fetch')) {
            console.log('🌐 Problema de rede detectado');
            console.log('💡 Verifique sua conexão com a internet');
        }
    }
}

// Executar teste
testConnectivity();
