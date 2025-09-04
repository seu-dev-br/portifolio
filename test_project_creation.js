import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProjectCreation() {
    console.log('🧪 Testando criação de projeto...');

    try {
        // Primeiro, tentar fazer login para ter uma sessão válida
        console.log('🔐 Fazendo login...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'admin@italo.dev',
            password: 'senha123'
        });

        if (authError) {
            console.error('❌ Erro no login:', authError.message);
            return;
        }

        console.log('✅ Login bem-sucedido!');

        // Agora tentar criar um projeto
        const testProject = {
            title: 'Projeto de Teste Automático',
            description: 'Este é um projeto criado automaticamente para testar a funcionalidade',
            technologies: ['JavaScript', 'Node.js', 'Supabase'],
            demo_link: 'https://example.com/demo',
            github_link: 'https://github.com/example/test',
            download_link: 'https://example.com/download',
            status: 'draft',
            image: 'https://example.com/image.jpg'
        };

        console.log('📝 Tentando criar projeto...');
        const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .insert([testProject])
            .select();

        if (projectError) {
            console.error('❌ Erro ao criar projeto:', projectError.message);
            console.log('Código do erro:', projectError.code);
            return;
        }

        console.log('✅ Projeto criado com sucesso!');
        console.log('📊 Dados do projeto criado:', projectData);

        // Limpar o projeto de teste
        if (projectData && projectData.length > 0) {
            console.log('🧹 Limpando projeto de teste...');
            const { error: deleteError } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectData[0].id);

            if (deleteError) {
                console.log('⚠️ Não foi possível limpar o projeto de teste, mas isso não é crítico');
            } else {
                console.log('✅ Projeto de teste removido');
            }
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

// Executar o teste
testProjectCreation();
