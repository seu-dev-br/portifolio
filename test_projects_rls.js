import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProjectsOperations() {
    console.log('🧪 Testando operações na tabela projects...');

    try {
        // 1. Testar SELECT (deve funcionar para projetos publicados)
        console.log('1️⃣ Testando SELECT...');
        const { data: selectData, error: selectError } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .limit(5);

        if (selectError) {
            console.error('❌ Erro no SELECT:', selectError.message);
            console.log('Código:', selectError.code);
        } else {
            console.log('✅ SELECT funcionando! Encontrados', selectData?.length || 0, 'projetos publicados');
        }

        // 2. Testar INSERT (deve falhar sem autenticação)
        console.log('2️⃣ Testando INSERT (deve falhar sem login)...');
        const testProject = {
            title: 'Projeto de Teste',
            description: 'Descrição de teste',
            status: 'draft'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('projects')
            .insert([testProject])
            .select();

        if (insertError) {
            if (insertError.code === '42501') {
                console.log('✅ RLS funcionando! INSERT bloqueado sem autenticação (esperado)');
                console.log('ℹ️ Isso significa que você precisa fazer login para criar projetos');
            } else {
                console.error('❌ Erro inesperado no INSERT:', insertError.message);
                console.log('Código:', insertError.code);
            }
        } else {
            console.log('⚠️ INSERT funcionou sem autenticação - RLS pode não estar configurado');
        }

        // 3. Verificar se há projetos existentes
        console.log('3️⃣ Verificando projetos existentes...');
        const { data: allProjects, error: allError } = await supabase
            .from('projects')
            .select('id, title, status')
            .limit(10);

        if (allError) {
            console.error('❌ Erro ao listar projetos:', allError.message);
        } else {
            console.log('📊 Projetos encontrados:', allProjects?.length || 0);
            if (allProjects && allProjects.length > 0) {
                allProjects.forEach(project => {
                    console.log(`- ${project.title} (${project.status})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }

    // Instruções finais
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('');
    console.log('1. FAÇA LOGIN no painel admin primeiro');
    console.log('2. Depois tente criar/editar projetos');
    console.log('');
    console.log('Se ainda houver erros, execute este SQL no Supabase Dashboard:');
    console.log('https://supabase.com/dashboard > SQL Editor');
    console.log('');
    console.log('SQL para corrigir RLS:');
    console.log('==================================================');
    console.log(`-- Permitir todas as operações para usuários autenticados
DROP POLICY IF EXISTS "projects_allow_all" ON projects;
CREATE POLICY "projects_allow_all" ON projects
FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);`);
    console.log('==================================================');
}

// Executar o teste
testProjectsOperations();
