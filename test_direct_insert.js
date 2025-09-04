import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDirectInsert() {
    console.log('🧪 Testando inserção direta no Supabase...');

    try {
        // Criar um projeto de teste sem autenticação
        const testProject = {
            title: 'Projeto de Teste Direto',
            description: 'Projeto criado diretamente para testar inserção sem auth',
            technologies: ['JavaScript', 'Supabase'],
            demo_link: 'https://example.com',
            github_link: 'https://github.com/example',
            download_link: null,
            image: 'https://via.placeholder.com/400x300',
            status: 'published',
            published_at: new Date().toISOString()
        };

        console.log('📝 Tentando inserir projeto diretamente...');
        console.log('Dados:', JSON.stringify(testProject, null, 2));

        const { data: result, error } = await supabase
            .from('projects')
            .insert([testProject])
            .select();

        if (error) {
            console.error('❌ Erro na inserção:', error.message);
            console.error('Código do erro:', error.code);
            console.error('Detalhes:', JSON.stringify(error, null, 2));

            // Se for erro de RLS, vamos tentar com autenticação
            if (error.message.includes('RLS') || error.code === '42501') {
                console.log('🔐 Tentando com autenticação...');

                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: 'admin@portifolio.com',
                    password: 'admin123456'
                });

                if (authError) {
                    console.error('❌ Erro no login:', authError.message);
                    return;
                }

                console.log('✅ Login bem-sucedido, tentando inserir novamente...');

                const { data: result2, error: error2 } = await supabase
                    .from('projects')
                    .insert([testProject])
                    .select();

                if (error2) {
                    console.error('❌ Erro mesmo com auth:', error2.message);
                } else {
                    console.log('✅ Projeto criado com sucesso!');
                    console.log('Resultado:', JSON.stringify(result2, null, 2));
                }
            }
        } else {
            console.log('✅ Projeto criado com sucesso sem autenticação!');
            console.log('Resultado:', JSON.stringify(result, null, 2));
        }

        // Verificar projetos existentes
        console.log('\n🔍 Verificando todos os projetos...');
        const { data: allProjects, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (fetchError) {
            console.error('❌ Erro ao buscar projetos:', fetchError.message);
        } else {
            console.log(`📊 Total de projetos: ${allProjects?.length || 0}`);
            if (allProjects && allProjects.length > 0) {
                allProjects.forEach((project, index) => {
                    console.log(`${index + 1}. ${project.title} - Status: ${project.status} - Criado: ${project.created_at}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

testDirectInsert();
