// Diagnóstico de Conexão Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente de .env.local
dotenv.config({ path: '.env.local' });

// Função para verificar CORS
async function checkCORS() {
    try {
        const response = await fetch('https://nattvkjaecceirxthizc.supabase.co/auth/v1/callback', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:4321'
            }
        });
        
        console.log('\n--- Verificação de CORS ---');
        console.log(`Status: ${response.status}`);
        console.log('Headers:');
        response.headers.forEach((value, name) => {
            console.log(`  ${name}: ${value}`);
        });
        
        const corsHeaders = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers'
        ];
        
        let corsOK = true;
        for (const header of corsHeaders) {
            if (!response.headers.has(header)) {
                console.log(`❌ Header ${header} não encontrado`);
                corsOK = false;
            }
        }
        
        if (corsOK) {
            console.log('✅ Configuração CORS parece estar correta');
        } else {
            console.log('❌ Problemas detectados na configuração CORS');
        }
    } catch (error) {
        console.error('❌ Erro ao verificar CORS:', error.message);
    }
}

// Função para testar a conexão com o Supabase
async function testSupabaseConnection() {
    console.log('\n=== DIAGNÓSTICO DE CONEXÃO SUPABASE ===\n');
    
    // Verificar variáveis de ambiente
    console.log('--- Verificação de Variáveis de Ambiente ---');
    if (!process.env.SUPABASE_URL) {
        console.log('❌ SUPABASE_URL não encontrada');
    } else {
        console.log(`✅ SUPABASE_URL: ${process.env.SUPABASE_URL}`);
    }
    
    if (!process.env.SUPABASE_ANON_KEY) {
        console.log('❌ SUPABASE_ANON_KEY não encontrada');
    } else {
        console.log(`✅ SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY.substring(0, 5)}...`);
    }
    
    // Tentar criar cliente Supabase
    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );
        
        console.log('\n--- Teste de Conexão ---');
        
        // Testar conexão fazendo uma consulta simples
        const { data, error } = await supabase
            .from('posts')
            .select('count')
            .limit(1);
        
        if (error) {
            console.log(`❌ Erro ao conectar: ${error.message}`);
        } else {
            console.log('✅ Conexão com Supabase estabelecida com sucesso!');
            console.log(`  Dados recebidos: ${JSON.stringify(data)}`);
        }
        
        // Verificar autenticação
        console.log('\n--- Teste de API de Autenticação ---');
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
            console.log(`❌ Erro ao acessar API de autenticação: ${authError.message}`);
        } else {
            console.log('✅ API de autenticação respondendo corretamente');
        }
        
    } catch (error) {
        console.log(`❌ Erro ao criar cliente Supabase: ${error.message}`);
    }
    
    // Verificar CORS
    await checkCORS();
    
    // Sugestões para resolver problemas
    console.log('\n--- Soluções Possíveis ---');
    console.log('1. Verifique se as URLs de redirecionamento estão configuradas corretamente no Supabase');
    console.log('   - Acesse: https://supabase.com/dashboard -> Authentication -> Settings -> URL Configuration');
    console.log('   - Adicione: http://localhost:4321 e http://localhost:4321/admin');
    
    console.log('2. Desabilite a confirmação de email para desenvolvimento');
    console.log('   - Acesse: Authentication -> Settings -> Email');
    console.log('   - Desmarque "Enable email confirmations"');
    
    console.log('3. Limpe o cache do navegador e cookies');
    
    console.log('\n=== FIM DO DIAGNÓSTICO ===');
}

// Executar diagnóstico
testSupabaseConnection().catch(console.error);
// Arquivo removido (script de diagnóstico)
