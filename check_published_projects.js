import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPublishedProjects() {
    console.log('🔍 Verificando projetos publicados no banco...');

    try {
        // Verificar todos os projetos
        const { data: allProjects, error: allError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (allError) {
            console.error('❌ Erro ao buscar todos os projetos:', allError.message);
            return;
        }

        console.log(`📊 Total de projetos no banco: ${allProjects?.length || 0}`);

        if (allProjects && allProjects.length > 0) {
            console.log('📋 Lista de todos os projetos:');
            allProjects.forEach((project, index) => {
                console.log(`${index + 1}. ${project.title} - Status: ${project.status} - Criado: ${project.created_at}`);
            });

            // Verificar projetos publicados
            const publishedProjects = allProjects.filter(p => p.status === 'published');
            console.log(`\n✅ Projetos publicados: ${publishedProjects.length}`);

            if (publishedProjects.length > 0) {
                console.log('📋 Projetos publicados:');
                publishedProjects.forEach((project, index) => {
                    console.log(`${index + 1}. ${project.title}`);
                    console.log(`   - Descrição: ${project.description}`);
                    console.log(`   - Tecnologias: ${project.technologies?.join(', ') || 'Nenhuma'}`);
                    console.log(`   - Demo: ${project.demo_link || 'Não informado'}`);
                    console.log(`   - GitHub: ${project.github_link || 'Não informado'}`);
                    console.log(`   - Download: ${project.download_link || 'Não informado'}`);
                    console.log(`   - Imagem: ${project.image || 'Não informado'}`);
                    console.log(`   - Publicado em: ${project.published_at || 'Não definido'}`);
                    console.log('');
                });
            } else {
                console.log('⚠️ Nenhum projeto está com status "published"');
                console.log('💡 Para que apareçam no frontend, os projetos precisam ter status = "published"');
            }
        } else {
            console.log('ℹ️ Nenhum projeto encontrado no banco de dados');
            console.log('💡 Você precisa criar projetos no painel admin primeiro');
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

// Executar a verificação
checkPublishedProjects();
