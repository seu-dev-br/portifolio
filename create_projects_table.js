import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createProjectsTable() {
    try {
        console.log('🚀 Iniciando criação da tabela projects...');

        // Ler o arquivo SQL
        const sqlFilePath = path.join(__dirname, 'create_projects_table.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        console.log('📄 SQL lido do arquivo. Executando...');

        // Executar o SQL usando rpc (chamada de função remota)
        // Como o Supabase não permite execução direta de DDL via REST API,
        // vamos tentar uma abordagem alternativa

        // Primeiro, vamos verificar se a tabela já existe
        console.log('🔍 Verificando se a tabela projects já existe...');

        const { data: existingTables, error: checkError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_name', 'projects')
            .eq('table_schema', 'public');

        if (checkError) {
            console.log('ℹ️ Não foi possível verificar tabelas existentes. Tentando criar a tabela...');
        } else if (existingTables && existingTables.length > 0) {
            console.log('✅ Tabela projects já existe!');
            return;
        }

        // Como não podemos executar DDL diretamente, vamos tentar inserir um registro de teste
        // para ver se a tabela existe
        console.log('🧪 Testando se a tabela projects existe tentando uma consulta...');

        const { data: testData, error: testError } = await supabase
            .from('projects')
            .select('id')
            .limit(1);

        if (testError && testError.code === 'PGRST116') {
            console.log('❌ Tabela projects não existe. Você precisa criá-la manualmente.');
            console.log('');
            console.log('📋 Instruções:');
            console.log('1. Acesse o painel do Supabase: https://supabase.com/dashboard');
            console.log('2. Vá para o seu projeto');
            console.log('3. Clique em "SQL Editor" no menu lateral');
            console.log('4. Execute o conteúdo do arquivo create_projects_table.sql');
            console.log('');
            console.log('📄 Conteúdo do SQL a ser executado:');
            console.log('==================================================');
            console.log(sqlContent);
            console.log('==================================================');
            return;
        } else if (testError) {
            console.log('❌ Erro ao testar tabela:', testError.message);
            return;
        } else {
            console.log('✅ Tabela projects já existe e está funcionando!');
            return;
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);

        // Mostrar instruções manuais
        console.log('');
        console.log('📋 Para criar a tabela manualmente:');
        console.log('1. Acesse https://supabase.com/dashboard');
        console.log('2. Vá para o seu projeto');
        console.log('3. Clique em "SQL Editor"');
        console.log('4. Execute o SQL do arquivo create_projects_table.sql');
    }
}

// Executar a função
createProjectsTable();
