import { getAllPublishedProjects } from './src/lib/supabase.js';

async function testFrontendFetch() {
    console.log('🧪 Testando busca de projetos no frontend...');

    try {
        const projects = await getAllPublishedProjects();

        console.log(`📊 Projetos encontrados: ${projects?.length || 0}`);

        if (projects && projects.length > 0) {
            console.log('📋 Lista de projetos:');
            projects.forEach((project, index) => {
                console.log(`${index + 1}. ${project.title}`);
                console.log(`   - Descrição: ${project.description}`);
                console.log(`   - Tecnologias: ${project.technologies?.join(', ') || 'Nenhuma'}`);
                console.log(`   - Demo: ${project.demoLink || 'Não informado'}`);
                console.log(`   - GitHub: ${project.githubLink || 'Não informado'}`);
                console.log(`   - Status: ${project.status}`);
                console.log(`   - Publicado em: ${project.publishedAt}`);
                console.log('');
            });
        } else {
            console.log('⚠️ Nenhum projeto encontrado');
        }

    } catch (error) {
        console.error('❌ Erro ao buscar projetos:', error.message);
        console.error('Stack:', error.stack);
    }
}

testFrontendFetch();
