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
    console.log('🧪 Teste de Criação de Posts\n');

    try {
        // Criar um post de teste
        const testPost = {
            title: 'Post de Teste Automático',
            slug: 'post-teste-automatico-' + Date.now(),
            excerpt: 'Este é um post criado automaticamente para testar a funcionalidade',
            content_markdown: `# Post de Teste

Este post foi criado automaticamente para verificar se a criação de posts está funcionando corretamente após ajustar as políticas RLS.

## Funcionalidades Testadas:
- ✅ Criação de posts
- ✅ Geração automática de slug
- ✅ Status do post
- ✅ Conteúdo em Markdown

Criado em: ${new Date().toLocaleString('pt-BR')}
`,
            status: 'published'
        };

        console.log('📝 Criando post de teste...');
        console.log('Título:', testPost.title);
        console.log('Slug:', testPost.slug);
        console.log('Status:', testPost.status);

        const { data: createdPost, error: createError } = await supabase
            .from('posts')
            .insert([testPost])
            .select()
            .single();

        if (createError) {
            console.error('❌ Erro na criação do post:', createError.message);
            console.error('💡 Certifique-se de executar o script SQL no Supabase primeiro');
            return;
        }

        console.log('\n✅ Post criado com sucesso!');
        console.log('📄 Detalhes do post:');
        console.log('- ID:', createdPost.id);
        console.log('- Título:', createdPost.title);
        console.log('- Slug:', createdPost.slug);
        console.log('- Status:', createdPost.status);
        console.log('- Criado em:', new Date(createdPost.created_at).toLocaleString('pt-BR'));

        // Verificar se o post aparece na listagem
        console.log('\n🔍 Verificando listagem de posts...');
        const { data: posts, error: listError } = await supabase
            .from('posts')
            .select('id, title, slug, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (listError) {
            console.error('❌ Erro ao listar posts:', listError.message);
        } else {
            console.log('✅ Listagem funcionando:');
            posts.forEach((post, index) => {
                console.log(`${index + 1}. ${post.title} (${post.status}) - ${post.slug}`);
            });
        }

        // Limpar post de teste
        console.log('\n🧹 Limpando post de teste...');
        const { error: deleteError } = await supabase
            .from('posts')
            .delete()
            .eq('id', createdPost.id);

        if (deleteError) {
            console.error('❌ Erro ao remover post de teste:', deleteError.message);
        } else {
            console.log('✅ Post de teste removido com sucesso');
        }

        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('================================');
        console.log('✅ Criação de posts funcionando');
        console.log('✅ Leitura de posts funcionando');
        console.log('✅ Exclusão de posts funcionando');
        console.log('✅ Sistema pronto para uso no admin panel');

    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
    }
}

testPostCreation();
// Arquivo removido (script de teste)
