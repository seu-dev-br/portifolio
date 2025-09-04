import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProjectsTable() {
    try {
        console.log('🔍 Verificando estrutura da tabela projects...');

        // Tentar fazer uma consulta simples para ver se conseguimos dados
        const { data: projects, error: selectError } = await supabase
            .from('projects')
            .select('*')
            .limit(1);

        if (selectError) {
            console.error('❌ Erro ao consultar tabela projects:', selectError.message);
            console.log('Código do erro:', selectError.code);
            return;
        }

        console.log('✅ Consulta bem-sucedida!');
        console.log('📊 Estrutura atual da tabela:');

        if (projects && projects.length > 0) {
            const sampleProject = projects[0];
            console.log('Colunas encontradas:', Object.keys(sampleProject));
            console.log('Amostra de dados:', JSON.stringify(sampleProject, null, 2));
        } else {
            console.log('ℹ️ Tabela existe mas está vazia');
            console.log('Tentando descobrir colunas via tentativa de inserção...');

            // Tentar inserir com as colunas esperadas para ver quais existem
            const testData = {
                title: 'Test Project',
                description: 'Test Description',
                technologies: ['test'],
                demo_link: 'https://example.com',
                github_link: 'https://github.com/example',
                download_link: 'https://example.com/download',
                image: 'https://example.com/image.jpg',
                status: 'draft'
            };

            const { error: insertError } = await supabase
                .from('projects')
                .insert([testData]);

            if (insertError) {
                console.error('❌ Erro ao inserir (colunas podem estar faltando):', insertError.message);
                console.log('Código do erro:', insertError.code);

                if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
                    console.log('');
                    console.log('🔧 Colunas que podem estar faltando:');
                    console.log('- demo_link (em vez de demoLink)');
                    console.log('- github_link (em vez de githubLink)');
                    console.log('- download_link (em vez de downloadLink)');
                    console.log('- technologies (tipo array)');
                    console.log('- status');
                    console.log('- published_at');
                    console.log('- created_at');
                    console.log('- updated_at');
                }
            } else {
                console.log('✅ Inserção de teste bem-sucedida! Limpando dados de teste...');

                // Limpar dados de teste
                const { error: deleteError } = await supabase
                    .from('projects')
                    .delete()
                    .eq('title', 'Test Project');

                if (deleteError) {
                    console.log('⚠️ Não foi possível limpar dados de teste, mas isso não é crítico');
                }
            }
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

// Executar a função
checkProjectsTable();
