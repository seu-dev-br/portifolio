// Script de teste para verificar se os dados estão sendo salvos e recuperados corretamente
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDataFetch() {
    console.log('🔍 Testando conexão com Supabase...\n');

    // Testar posts
    console.log('📝 POSTS:');
    console.log('━'.repeat(50));
    
    const { data: allPosts, error: allPostsError } = await supabase
        .from('posts')
        .select('id, title, status, created_at');
    
    if (allPostsError) {
        console.error('❌ Erro ao buscar posts:', allPostsError);
    } else {
        console.log(`Total de posts: ${allPosts?.length || 0}`);
        if (allPosts && allPosts.length > 0) {
            allPosts.forEach(post => {
                console.log(`  - ${post.title} (${post.status}) [ID: ${post.id}]`);
            });
        }
    }

    const { data: publishedPosts, error: publishedPostsError } = await supabase
        .from('posts')
        .select('id, title, status')
        .eq('status', 'published');
    
    if (publishedPostsError) {
        console.error('❌ Erro ao buscar posts published:', publishedPostsError);
    } else {
        console.log(`\nPosts com status="published": ${publishedPosts?.length || 0}`);
        if (publishedPosts && publishedPosts.length > 0) {
            publishedPosts.forEach(post => {
                console.log(`  ✅ ${post.title} [ID: ${post.id}]`);
            });
        }
    }

    // Testar projetos
    console.log('\n📁 PROJETOS:');
    console.log('━'.repeat(50));
    
    const { data: allProjects, error: allProjectsError } = await supabase
        .from('projects')
        .select('id, title, status, created_at');
    
    if (allProjectsError) {
        console.error('❌ Erro ao buscar projetos:', allProjectsError);
    } else {
        console.log(`Total de projetos: ${allProjects?.length || 0}`);
        if (allProjects && allProjects.length > 0) {
            allProjects.forEach(project => {
                console.log(`  - ${project.title} (${project.status}) [ID: ${project.id}]`);
            });
        }
    }

    const { data: publishedProjects, error: publishedProjectsError } = await supabase
        .from('projects')
        .select('id, title, status')
        .eq('status', 'published');
    
    if (publishedProjectsError) {
        console.error('❌ Erro ao buscar projetos published:', publishedProjectsError);
    } else {
        console.log(`\nProjetos com status="published": ${publishedProjects?.length || 0}`);
        if (publishedProjects && publishedProjects.length > 0) {
            publishedProjects.forEach(project => {
                console.log(`  ✅ ${project.title} [ID: ${project.id}]`);
            });
        }
    }

    console.log('\n' + '━'.repeat(50));
    console.log('✅ Teste concluído!');
}

testDataFetch().catch(console.error);
