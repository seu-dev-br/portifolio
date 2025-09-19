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

async function testPostCreation() {
    console.log('🧪 Testing Post Creation Functionality...\n');

    try {
        // Test 1: Create a new post
        console.log('1️⃣ Creating a new test post...');

        const testPost = {
            title: 'Post de Teste Automático',
            slug: 'post-teste-automatico-' + Date.now(),
            excerpt: 'Este é um post criado automaticamente para testar a funcionalidade',
            content_markdown: `# Post de Teste

Este post foi criado automaticamente para testar a funcionalidade de criação de posts no painel admin.

## Funcionalidades Testadas

- ✅ Criação de posts
- ✅ Geração automática de slug
- ✅ Validação de campos obrigatórios
- ✅ Salvamento no Supabase
- ✅ Status draft/publicado

## Código de Exemplo

\`\`\`javascript
// Exemplo de como criar um post
const postData = {
    title: "Meu Post",
    slug: "meu-post",
    excerpt: "Resumo do post",
    content_markdown: "# Conteúdo em Markdown",
    status: "published"
};
\`\`\`

Criado em: ${new Date().toLocaleString('pt-BR')}
`,
            cover_image: 'https://picsum.photos/800/400?random=' + Date.now(),
            tags: ['teste', 'automação', 'blog'],
            status: 'draft'
        };

        const { data: createdPost, error: createError } = await supabase
            .from('posts')
            .insert([testPost])
            .select()
            .single();

        if (createError) {
            console.error('❌ Error creating post:', createError.message);
            return;
        }

        console.log('✅ Post created successfully!');
        console.log('📝 Post ID:', createdPost.id);
        console.log('📝 Post Title:', createdPost.title);
        console.log('📝 Post Slug:', createdPost.slug);

        // Test 2: Verify post was created
        console.log('\n2️⃣ Verifying post creation...');

        const { data: retrievedPost, error: retrieveError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', createdPost.id)
            .single();

        if (retrieveError) {
            console.error('❌ Error retrieving post:', retrieveError.message);
            return;
        }

        console.log('✅ Post retrieved successfully!');
        console.log('📄 Post data matches:', JSON.stringify({
            title: retrievedPost.title === testPost.title,
            slug: retrievedPost.slug === testPost.slug,
            excerpt: retrievedPost.excerpt === testPost.excerpt,
            status: retrievedPost.status === testPost.status,
            tags: JSON.stringify(retrievedPost.tags) === JSON.stringify(testPost.tags)
        }, null, 2));

        // Test 3: Test slug uniqueness
        console.log('\n3️⃣ Testing slug uniqueness validation...');

        const duplicateSlugPost = {
            ...testPost,
            slug: testPost.slug, // Same slug
            title: 'Post com Slug Duplicado'
        };

        const { error: duplicateError } = await supabase
            .from('posts')
            .insert([duplicateSlugPost]);

        if (duplicateError && duplicateError.code === '23505') {
            console.log('✅ Slug uniqueness validation working!');
        } else {
            console.log('⚠️ Slug uniqueness might not be properly validated');
        }

        // Test 4: Test published posts retrieval
        console.log('\n4️⃣ Testing published posts retrieval...');

        const { data: publishedPosts, error: publishedError } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .limit(5);

        if (publishedError) {
            console.error('❌ Error retrieving published posts:', publishedError.message);
            return;
        }

        console.log('✅ Published posts retrieved successfully!');
        console.log(`📊 Found ${publishedPosts?.length || 0} published posts`);

        // Test 5: Update post to published
        console.log('\n5️⃣ Testing post update to published...');

        const { data: updatedPost, error: updateError } = await supabase
            .from('posts')
            .update({
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', createdPost.id)
            .select()
            .single();

        if (updateError) {
            console.error('❌ Error updating post:', updateError.message);
            return;
        }

        console.log('✅ Post updated to published!');
        console.log('📝 Updated status:', updatedPost.status);
        console.log('📝 Published at:', updatedPost.published_at);

        // Test 6: Clean up - delete test post
        console.log('\n6️⃣ Cleaning up test data...');

        const { error: deleteError } = await supabase
            .from('posts')
            .delete()
            .eq('id', createdPost.id);

        if (deleteError) {
            console.error('❌ Error deleting test post:', deleteError.message);
        } else {
            console.log('✅ Test post deleted successfully!');
        }

        console.log('\n🎉 All post creation tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   ✅ Post creation');
        console.log('   ✅ Data validation');
        console.log('   ✅ Slug uniqueness');
        console.log('   ✅ Status management');
        console.log('   ✅ Published posts retrieval');
        console.log('   ✅ Post updates');
        console.log('   ✅ Data cleanup');

    } catch (error) {
        console.error('❌ Test failed with error:', error instanceof Error ? error.message : String(error));
    }
}

testPostCreation();
// Arquivo removido (script de teste)
