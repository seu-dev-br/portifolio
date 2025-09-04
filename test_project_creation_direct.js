import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://gqkdvemqmggdqrplhkxc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProjectCreation() {
    console.log('🧪 Testando criação de projeto...');

    try {
        // Primeiro, verificar se a tabela existe
        console.log('📋 Verificando estrutura da tabela projects...');
        const { data: tableInfo, error: tableError } = await supabase
            .from('projects')
            .select('*')
            .limit(1);

        if (tableError) {
            console.error('❌ Erro ao acessar tabela projects:', tableError.message);
            return;
        }

        console.log('✅ Tabela projects acessível');

        // Criar um projeto de teste
        const testProject = {
            title: 'Projeto de Teste',
            description: 'Este é um projeto criado para testar a funcionalidade',
            technologies: ['JavaScript', 'HTML', 'CSS'],
            demo_link: 'https://example.com/demo',
            github_link: 'https://github.com/example/test',
            download_link: 'https://example.com/download.zip',
            status: 'published',
            image: 'https://via.placeholder.com/400x300',
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        console.log('📝 Tentando criar projeto de teste...');
        const { data: createdProject, error: createError } = await supabase
            .from('projects')
            .insert([testProject])
            .select();

        if (createError) {
            console.error('❌ Erro ao criar projeto:', createError.message);
            console.error('📋 Detalhes do erro:', createError);

            // Verificar se é erro de RLS
            if (createError.code === '42501') {
                console.log('🔒 Erro de RLS detectado. Verificando políticas...');

                // Tentar sem autenticação (usando service role se disponível)
                console.log('🔄 Tentando abordagem alternativa...');
                console.log('💡 Você pode precisar ajustar as políticas RLS no Supabase Dashboard');
                console.log('   - Vá para Authentication > Policies');
                console.log('   - Para a tabela projects, crie uma política que permita INSERT para usuários autenticados');
            }
        } else {
            console.log('✅ Projeto criado com sucesso!');
            console.log('📊 Dados do projeto criado:', createdProject);

            // Verificar se o projeto aparece na busca
            console.log('🔍 Verificando se o projeto aparece na busca...');
            const { data: publishedProjects, error: fetchError } = await supabase
                .from('projects')
                .select('*')
                .eq('status', 'published');

            if (fetchError) {
                console.error('❌ Erro ao buscar projetos publicados:', fetchError.message);
            } else {
                console.log(`📊 Projetos publicados encontrados: ${publishedProjects?.length || 0}`);
                if (publishedProjects && publishedProjects.length > 0) {
                    publishedProjects.forEach((project, index) => {
                        console.log(`${index + 1}. ${project.title} - Status: ${project.status}`);
                    });
                }
            }
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

// Executar o teste
testProjectCreation();
