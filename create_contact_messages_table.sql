-- SQL para criar a tabela contact_messages no Supabase
-- Execute este script no SQL Editor do Supabase

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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para mensagens de contato
-- Política para SELECT (apenas usuários autenticados podem ver mensagens)
DROP POLICY IF EXISTS "contact_messages_select_policy" ON contact_messages;
CREATE POLICY "contact_messages_select_policy" ON contact_messages
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política para INSERT (todos podem enviar mensagens)
DROP POLICY IF EXISTS "contact_messages_insert_policy" ON contact_messages;
CREATE POLICY "contact_messages_insert_policy" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Política para UPDATE (apenas usuários autenticados podem atualizar)
DROP POLICY IF EXISTS "contact_messages_update_policy" ON contact_messages;
CREATE POLICY "contact_messages_update_policy" ON contact_messages
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para DELETE (apenas usuários autenticados podem excluir)
DROP POLICY IF EXISTS "contact_messages_delete_policy" ON contact_messages;
CREATE POLICY "contact_messages_delete_policy" ON contact_messages
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela contact_messages
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
