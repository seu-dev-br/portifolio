import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

import { createClient } from '@supabase/supabase-js';

// Testar conectividade com Supabase (para debug no Vercel)
const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Debug Supabase Connection:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Definido' : '❌ Não definido');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Definido' : '❌ Não definido');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
    console.log('Variáveis disponíveis:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('🔗 Testando conexão com Supabase...');

        // Teste básico de conectividade
        const { data: testData, error: testError } = await supabase
            .from('projects')
            .select('count')
            .limit(1);

        if (testError) {
            console.error('❌ Erro na conexão:', testError.message);
            console.error('Código do erro:', testError.code);
            return false;
        }

        console.log('✅ Conexão com Supabase estabelecida!');

        // Teste de leitura de projetos publicados
        console.log('📖 Testando leitura de projetos publicados...');
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (projectsError) {
            console.error('❌ Erro ao ler projetos:', projectsError.message);
            console.error('Código do erro:', projectsError.code);
            return false;
        }

        console.log(`📊 Projetos publicados encontrados: ${projects?.length || 0}`);

        // Teste de autenticação
        console.log('🔐 Testando autenticação...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'admin@portifolio.com',
            password: 'admin123456'
        });

        if (authError) {
            console.error('❌ Erro na autenticação:', authError.message);
            return false;
        }

        console.log('✅ Autenticação bem-sucedida!');

        // Teste de criação de projeto
        console.log('📝 Testando criação de projeto...');
        const testProject = {
            title: 'Projeto de Teste - Vercel',
            description: 'Projeto criado para testar deploy no Vercel',
            technologies: ['JavaScript', 'Vercel'],
            demo_link: 'https://example.com',
            github_link: 'https://github.com/example',
            status: 'published',
            published_at: new Date().toISOString()
        };

        const { data: createdProject, error: createError } = await supabase
            .from('projects')
            .insert([testProject])
            .select();

        if (createError) {
            console.error('❌ Erro ao criar projeto:', createError.message);
            console.error('Código do erro:', createError.code);
            return false;
        }

        console.log('✅ Projeto criado com sucesso!');
        console.log('ID do projeto:', createdProject?.[0]?.id);

        return true;

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

testConnection();
