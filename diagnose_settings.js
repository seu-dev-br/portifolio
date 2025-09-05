import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseSettingsTable() {
    console.log('🔍 Diagnosticando tabela settings...');

    try {
        // 1. Verificar se a tabela existe
        console.log('📋 Verificando estrutura da tabela settings...');
        const { data: tableInfo, error: tableError } = await supabase
            .from('settings')
            .select('*')
            .limit(1);

        if (tableError) {
            console.error('❌ Erro ao acessar tabela settings:', tableError);
            return;
        }

        console.log('✅ Tabela settings acessível');

        // 2. Verificar dados existentes
        console.log('🔍 Verificando dados existentes...');
        const { data: existingData, error: dataError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'about');

        if (dataError) {
            console.error('❌ Erro ao consultar dados:', dataError);
            return;
        }

        console.log('📊 Dados encontrados:', existingData.length, 'registros');

        if (existingData.length > 0) {
            console.log('📝 Dados atuais:');
            console.log('- ID:', existingData[0].id);
            console.log('- Key:', existingData[0].key);
            console.log('- Created:', existingData[0].created_at);
            console.log('- Updated:', existingData[0].updated_at);
            console.log('- Value size:', JSON.stringify(existingData[0].value).length, 'characters');
        }

        // 3. Tentar fazer update em vez de upsert
        console.log('🔄 Testando update direto...');
        const testData = {
            bio: 'Teste de atualização - ' + new Date().toISOString(),
            profileImage: '',
            skills: { frontend: ['Teste'], backend: [], database: [], tools: [] },
            experience: [],
            education: [],
            certifications: [],
            gallery: [],
            socialLinks: { github: 'https://github.com/test' },
            updatedAt: new Date().toISOString()
        };

        const { data: updateResult, error: updateError } = await supabase
            .from('settings')
            .update({
                value: testData,
                updated_at: new Date().toISOString()
            })
            .eq('key', 'about')
            .select();

        if (updateError) {
            console.error('❌ Erro no update:', updateError);
            console.log('💡 Código do erro:', updateError.code);
            console.log('💡 Mensagem:', updateError.message);
            return;
        }

        console.log('✅ Update realizado com sucesso:', updateResult);

        // 4. Verificar se o update foi aplicado
        const { data: verifyData, error: verifyError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'about')
            .single();

        if (verifyError) {
            console.error('❌ Erro ao verificar update:', verifyError);
            return;
        }

        console.log('✅ Dados atualizados verificados:');
        console.log('- Bio:', verifyData.value.bio);

    } catch (error) {
        console.error('❌ Erro geral no diagnóstico:', error);
    }
}

// Executar diagnóstico
diagnoseSettingsTable();
