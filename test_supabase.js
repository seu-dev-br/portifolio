import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
    console.log('🔍 Testando conexão com Supabase...');

    try {
        // Teste 1: Verificar conexão básica
        console.log('📡 Testando conexão básica...');
        const { data: connectionTest, error: connectionError } = await supabase
            .from('settings')
            .select('count')
            .limit(1);

        if (connectionError) {
            console.error('❌ Erro na conexão básica:', connectionError);
            return;
        }

        console.log('✅ Conexão básica funcionando');

        // Teste 2: Verificar se a tabela settings existe
        console.log('📋 Verificando tabela settings...');
        const { data: settingsData, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .limit(1);

        if (settingsError) {
            console.error('❌ Erro ao acessar tabela settings:', settingsError);
            console.log('💡 Possível solução: Criar a tabela settings no Supabase');
            return;
        }

        console.log('✅ Tabela settings acessível');

        // Teste 3: Tentar salvar dados de teste
        console.log('💾 Testando salvamento de dados...');
        const testData = {
            key: 'test_about',
            value: {
                bio: 'Teste de bio',
                profileImage: '',
                skills: { frontend: ['Teste'] },
                socialLinks: { github: 'https://github.com/test' },
                experience: [],
                education: [],
                certifications: [],
                gallery: [],
                updatedAt: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
        };

        const { data: saveResult, error: saveError } = await supabase
            .from('settings')
            .upsert(testData);

        if (saveError) {
            console.error('❌ Erro ao salvar dados:', saveError);
            console.log('💡 Possíveis soluções:');
            console.log('   - Verificar políticas RLS da tabela settings');
            console.log('   - Verificar se o usuário está autenticado');
            console.log('   - Verificar permissões do usuário');
            return;
        }

        console.log('✅ Salvamento funcionando:', saveResult);

        // Teste 4: Verificar dados salvos
        console.log('🔍 Verificando dados salvos...');
        const { data: verifyData, error: verifyError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'test_about')
            .single();

        if (verifyError) {
            console.error('❌ Erro ao verificar dados salvos:', verifyError);
            return;
        }

        console.log('✅ Dados salvos e recuperados com sucesso:', verifyData);

        // Limpar dados de teste
        console.log('🧹 Limpando dados de teste...');
        const { error: deleteError } = await supabase
            .from('settings')
            .delete()
            .eq('key', 'test_about');

        if (deleteError) {
            console.error('❌ Erro ao limpar dados de teste:', deleteError);
        } else {
            console.log('✅ Dados de teste limpos');
        }

        console.log('🎉 Todos os testes passaram! O Supabase está funcionando corretamente.');

    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
    }
}

// Executar teste
testSupabaseConnection();
