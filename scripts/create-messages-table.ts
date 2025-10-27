// Script para criar a tabela contact_messages no Supabase
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createMessagesTable() {
  console.log('🔧 Criando tabela contact_messages...');

  const createTableSQL = `
    -- Criar tabela contact_messages
    CREATE TABLE IF NOT EXISTS contact_messages (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Índices para performance
    CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

    -- Habilitar RLS
    ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

    -- Políticas RLS
    DROP POLICY IF EXISTS "contact_messages_select_policy" ON contact_messages;
    CREATE POLICY "contact_messages_select_policy" ON contact_messages
        FOR SELECT USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "contact_messages_insert_policy" ON contact_messages;
    CREATE POLICY "contact_messages_insert_policy" ON contact_messages
        FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "contact_messages_update_policy" ON contact_messages;
    CREATE POLICY "contact_messages_update_policy" ON contact_messages
        FOR UPDATE USING (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "contact_messages_delete_policy" ON contact_messages;
    CREATE POLICY "contact_messages_delete_policy" ON contact_messages
        FOR DELETE USING (auth.uid() IS NOT NULL);

    -- Trigger para updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
    CREATE TRIGGER update_contact_messages_updated_at
        BEFORE UPDATE ON contact_messages
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Erro ao criar tabela:', error);
      process.exit(1);
    }

    console.log('✅ Tabela contact_messages criada com sucesso!');
    
    // Testar se a tabela existe fazendo uma consulta
    const { data: testData, error: testError } = await supabase
      .from('contact_messages')
      .select('count', { count: 'exact' });

    if (testError) {
      console.error('❌ Erro ao testar tabela:', testError);
    } else {
      console.log('✅ Tabela contact_messages está funcionando!');
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
  }
}

createMessagesTable();