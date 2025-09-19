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

async function diagnosePostCreation() {
    console.log('🔍 Diagnóstico da Criação de Posts\n');

    try {
        // Test 1: Verificar estrutura da tabela
        console.log('1️⃣ Verificando estrutura da tabela posts...');
        const { data: tableInfo, error: tableError } = await supabase
            .from('posts')
            .select('*')
            .limit(1);

        if (tableError) {
            console.error('❌ Erro ao acessar tabela posts:', tableError.message);
            return;
        }
        console.log('✅ Tabela posts acessível');

        // Test 2: Verificar posts existentes
        console.log('\n2️⃣ Verificando posts existentes...');
        const { data: existingPosts, error: postsError } = await supabase
            .from('posts')
            .select('id, title, slug, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (postsError) {
            console.error('❌ Erro ao buscar posts existentes:', postsError.message);
        } else {
            console.log(`✅ Encontrados ${existingPosts?.length || 0} posts`);
            if (existingPosts && existingPosts.length > 0) {
                console.log('📄 Posts existentes:', existingPosts.map(p => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    status: p.status
                })));
            }
        }

        // Test 3: Tentar criar post com dados mínimos
        console.log('\n3️⃣ Testando criação com dados mínimos...');
        const minimalPost = {
            title: 'Teste Mínimo',
            slug: 'teste-minimo-' + Date.now(),
            excerpt: 'Teste mínimo de criação',
            content_markdown: '# Teste',
            status: 'draft'
        };

        console.log('📝 Tentando criar post:', minimalPost);

        const { data: createdPost, error: createError } = await supabase
            .from('posts')
            .insert([minimalPost])
            .select()
            .single();

        if (createError) {
            console.error('❌ Erro na criação:', createError);
            console.error('📋 Detalhes do erro:', {
                message: createError.message,
                details: createError.details,
                hint: createError.hint,
                code: createError.code
            });

            // Verificar se é erro de RLS
            if (createError.message.includes('row-level security policy')) {
                console.log('\n🔒 PROBLEMA IDENTIFICADO: Políticas RLS');
                console.log('💡 SOLUÇÃO: Execute o script SQL em test-rls-policies.sql');
                console.log('   no SQL Editor do Supabase para ajustar as políticas temporariamente.');
            }
        } else {
            console.log('✅ Post criado com sucesso!');
            console.log('📄 Post criado:', {
                id: createdPost.id,
                title: createdPost.title,
                slug: createdPost.slug,
                status: createdPost.status
            });

            // Limpar post de teste
            await supabase.from('posts').delete().eq('id', createdPost.id);
            console.log('🧹 Post de teste removido');
        }

        // Test 4: Verificar políticas RLS atuais
        console.log('\n4️⃣ Verificando políticas RLS...');
        try {
            // Tentar fazer uma operação que normalmente requer autenticação
            const { data: rlsTest, error: rlsError } = await supabase
                .from('posts')
                .select('*')
                .limit(1);

            if (rlsError) {
                console.log('⚠️ Possível problema com RLS:', rlsError.message);
            } else {
                console.log('✅ Políticas RLS parecem estar funcionando');
            }
        } catch (error) {
            console.error('❌ Erro ao verificar RLS:', error);
        }

    } catch (error) {
        console.error('❌ Erro geral no diagnóstico:', error);
    }

    console.log('\n📋 RESUMO DO DIAGNÓSTICO:');
    console.log('========================');
    console.log('• Se o erro for de RLS, execute o script SQL em test-rls-policies.sql');
    console.log('• Se for outro erro, verifique os logs acima para detalhes');
    console.log('• Para testar manualmente, acesse /admin e tente criar um post');
}

diagnosePostCreation();
// Arquivo removido (script de diagnóstico)
