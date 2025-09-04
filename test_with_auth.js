import { createClient } from '@supabase/supabase-js';

// Simulando o ambiente do Astro
process.env.PUBLIC_SUPABASE_URL = 'https://nattvkjaecceirxthizc.supabase.co';
process.env.PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWithAuth() {
    console.log('🔐 Testando busca com autenticação...');

    try {
        // Fazer login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'admin@portifolio.com',
            password: 'admin123456'
        });

        if (authError) {
            console.error('❌ Erro no login:', authError.message);
            return;
        }

        console.log('✅ Login bem-sucedido!');

        // Buscar projetos publicados
        const { data: projects, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (fetchError) {
            console.error('❌ Erro ao buscar projetos:', fetchError.message);
        } else {
            console.log(`📊 Projetos encontrados com auth: ${projects?.length || 0}`);
            if (projects && projects.length > 0) {
                projects.forEach((project, index) => {
                    console.log(`${index + 1}. ${project.title} - Status: ${project.status}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

testWithAuth();
