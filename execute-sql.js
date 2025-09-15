import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configurações do Supabase
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function executeSQL() {
    try {
        console.log('🔧 Executando correções na tabela settings...');

        // Ler o arquivo SQL
        const sqlContent = fs.readFileSync('./fix_settings_rls.sql', 'utf8');

        // Dividir o SQL em comandos individuais
        const commands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);

        for (const command of commands) {
            if (command.trim().startsWith('--') || command.trim() === '') continue;

            console.log('Executando:', command.trim().substring(0, 50) + '...');

            try {
                const { error } = await supabase.rpc('exec_sql', { sql: command.trim() });
                if (error) {
                    console.error('Erro no comando:', error);
                }
            } catch (err) {
                console.error('Erro ao executar comando:', err);
            }
        }

        console.log('✅ Script executado com sucesso!');

        // Verificar se os dados foram inseridos
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'about');

        if (error) {
            console.error('Erro ao verificar dados:', error);
        } else {
            console.log('Dados na tabela settings:', data);
        }

    } catch (error) {
        console.error('Erro geral:', error);
    }
}

executeSQL();

npm install @astrojs/vercel
