import { createClient } from '@supabase/supabase-js';

// Simulando o ambiente do Astro
process.env.PUBLIC_SUPABASE_URL = 'https://nattvkjaecceirxthizc.supabase.co';
process.env.PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAllPublishedProjects() {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching published projects:', error);
            return [];
        }

        return projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image,
            demoLink: project.demo_link,
            githubLink: project.github_link,
            downloadLink: project.download_link,
            technologies: project.technologies || [],
            status: project.status,
            publishedAt: project.published_at,
            createdAt: project.created_at
        }));
    } catch (error) {
        console.error('Error fetching published projects:', error);
        return [];
    }
}

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
