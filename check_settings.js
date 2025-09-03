import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function checkAndCreateSettingsTable() {
  try {
    const envPath = '.env.local';
    const envContent = fs.readFileSync(envPath, 'utf8');
    const supabaseUrl = envContent.match(/SUPABASE_URL=(.+)/)[1];
    const supabaseKey = envContent.match(/SUPABASE_ANON_KEY=(.+)/)[1];
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to select from settings table
    const { data, error } = await supabase.from('settings').select('*').limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('Tabela settings não existe. Você precisa criá-la manualmente no painel do Supabase.');
      console.log('Vá para o SQL Editor no Supabase e execute:');
      console.log(`
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users" ON settings
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for all users" ON settings
FOR SELECT USING (true);
      `);
    } else if (error) {
      console.error('Erro ao verificar tabela settings:', error);
    } else {
      console.log('✅ Tabela settings já existe e está funcionando!');
    }
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

checkAndCreateSettingsTable();
