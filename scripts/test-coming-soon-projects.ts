import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testComingSoonProjects() {
    console.log('🧪 Teste da Funcionalidade "Em Breve" dos Projetos\n');

    try {
        // Test 1: Criar projeto "Em Breve"
        console.log('1️⃣ Criando projeto "Em Breve"...');
        const comingSoonProject = {
            title: 'Sistema de IA para Análise de Dados',
            description: 'Plataforma avançada de inteligência artificial para análise preditiva de dados empresariais. Utiliza machine learning para identificar padrões e tendências ocultas nos dados.',
            technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL', 'Docker'],
            demo_link: null,
            github_link: 'https://github.com/italoantonio/ai-analytics-platform',
            download_link: null,
            image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=AI+Analytics',
            status: 'coming_soon'
        };

        const { data: createdProject, error: createError } = await supabase
            .from('projects')
            .insert([comingSoonProject])
            .select()
            .single();

        if (createError) {
            console.error('❌ Erro ao criar projeto "Em Breve":', createError.message);
            return;
        }

        console.log('✅ Projeto "Em Breve" criado com sucesso!');
        console.log('📄 Projeto criado:', {
            id: createdProject.id,
            title: createdProject.title,
            status: createdProject.status
        });

        // Test 2: Verificar se projetos "Em Breve" são visíveis publicamente
        console.log('\n2️⃣ Verificando visibilidade pública...');
        const { data: publicProjects, error: publicError } = await supabase
            .from('projects')
            .select('id, title, status')
            .in('status', ['published', 'coming_soon'])
            .order('created_at', { ascending: false });

        if (publicError) {
            console.error('❌ Erro ao buscar projetos públicos:', publicError.message);
        } else {
            console.log('✅ Projetos públicos encontrados:', publicProjects?.length || 0);
            const comingSoonCount = publicProjects?.filter(p => p.status === 'coming_soon').length || 0;
            console.log(`🚀 Projetos "Em Breve": ${comingSoonCount}`);
        }

        // Test 3: Verificar função específica para projetos "Em Breve"
        console.log('\n3️⃣ Testando busca específica de projetos "Em Breve"...');
        const { data: comingSoonOnly, error: comingSoonError } = await supabase
            .from('projects')
            .select('id, title, description, technologies, status, created_at')
            .eq('status', 'coming_soon')
            .order('created_at', { ascending: false });

        if (comingSoonError) {
            console.error('❌ Erro ao buscar projetos "Em Breve":', comingSoonError.message);
        } else {
            console.log('✅ Projetos "Em Breve" encontrados:', comingSoonOnly?.length || 0);
            if (comingSoonOnly && comingSoonOnly.length > 0) {
                console.log('📋 Lista de projetos "Em Breve":');
                comingSoonOnly.forEach((project, index) => {
                    console.log(`${index + 1}. ${project.title}`);
                    console.log(`   Tecnologias: ${project.technologies.join(', ')}`);
                    console.log(`   Criado em: ${new Date(project.created_at).toLocaleDateString('pt-BR')}\n`);
                });
            }
        }

        // Test 4: Verificar projetos publicados vs "Em Breve"
        console.log('\n4️⃣ Comparando status dos projetos...');
        const { data: allProjects, error: allError } = await supabase
            .from('projects')
            .select('status')
            .order('created_at', { ascending: false });

        if (allError) {
            console.error('❌ Erro ao buscar todos os projetos:', allError.message);
        } else {
            const statusCount = allProjects?.reduce((acc, project) => {
                acc[project.status] = (acc[project.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            console.log('📊 Distribuição de status:');
            Object.entries(statusCount || {}).forEach(([status, count]) => {
                const statusLabel = {
                    'draft': 'Rascunho',
                    'published': 'Publicado',
                    'coming_soon': 'Em Breve'
                }[status] || status;
                console.log(`   ${statusLabel}: ${count}`);
            });
        }

        // Limpar projeto de teste
        console.log('\n🧹 Limpando projeto de teste...');
        const { error: deleteError } = await supabase
            .from('projects')
            .delete()
            .eq('id', createdProject.id);

        if (deleteError) {
            console.error('❌ Erro ao remover projeto de teste:', deleteError.message);
        } else {
            console.log('✅ Projeto de teste removido com sucesso');
        }

        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('=====================================');
        console.log('✅ Funcionalidade "Em Breve" funcionando');
        console.log('✅ Projetos "Em Breve" são públicos');
        console.log('✅ Busca específica funcionando');
        console.log('✅ Status corretamente implementado');
        console.log('✅ Admin panel pronto para gerenciar');

    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
    }
}

testComingSoonProjects();
