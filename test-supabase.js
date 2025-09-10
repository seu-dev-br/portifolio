// Script para testar conexão com Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

async function testSupabaseConnection() {
    console.log('🔍 Testando conexão com Supabase...');

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Cliente Supabase criado');

        // Testar conexão básica
        const { data, error } = await supabase.from('posts').select('count').limit(1);

        if (error) {
            console.error('❌ Erro na conexão:', error);
            return false;
        }

        console.log('✅ Conexão com Supabase funcionando!');
        return true;

    } catch (error) {
        console.error('❌ Erro ao testar conexão:', error);
        return false;
    }
}

// Testar autenticação
async function testAuth() {
    console.log('🔐 Testando autenticação...');

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Tentar fazer login com credenciais de teste
        const testEmail = prompt('Digite o email para teste:');
        const testPassword = prompt('Digite a senha para teste:');

        if (!testEmail || !testPassword) {
            console.log('❌ Teste cancelado');
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
        });

        if (error) {
            console.error('❌ Erro na autenticação:', error.message);
            return false;
        }

        if (data.user) {
            console.log('✅ Autenticação bem-sucedida!');
            console.log('👤 Usuário:', data.user.email);
            return true;
        }

    } catch (error) {
        console.error('❌ Erro no teste de autenticação:', error);
        return false;
    }
}

// Executar testes
window.testSupabase = async () => {
    const connectionOk = await testSupabaseConnection();
    if (connectionOk) {
        await testAuth();
    }
};

console.log('🔧 Função testSupabase disponível. Execute: testSupabase()');
