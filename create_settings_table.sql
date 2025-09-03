-- SQL para criar a tabela settings no Supabase
-- Execute estes comandos no SQL Editor do seu projeto Supabase

-- 1. Criar a tabela settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança
-- Política para leitura pública (todos podem ler as configurações)
CREATE POLICY "Public read access for settings" ON settings
FOR SELECT USING (true);

-- Política para usuários autenticados poderem fazer tudo
CREATE POLICY "Authenticated users can manage settings" ON settings
FOR ALL USING (auth.role() = 'authenticated');

-- 4. Verificar se a tabela foi criada
SELECT * FROM settings LIMIT 1;
