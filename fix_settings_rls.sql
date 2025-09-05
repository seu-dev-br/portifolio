-- Script para corrigir as políticas RLS da tabela settings
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar as políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'settings';

-- 2. Remover políticas existentes que podem estar causando problemas
DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON settings;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON settings;

-- 3. Criar novas políticas mais permissivas para desenvolvimento
-- Permitir leitura para todos (incluindo usuários não autenticados)
CREATE POLICY "Enable read access for all users" ON settings
FOR SELECT USING (true);

-- Permitir inserção para todos (para desenvolvimento)
CREATE POLICY "Enable insert for all users" ON settings
FOR INSERT WITH CHECK (true);

-- Permitir atualização para todos (para desenvolvimento)
CREATE POLICY "Enable update for all users" ON settings
FOR UPDATE USING (true);

-- Permitir exclusão para todos (para desenvolvimento)
CREATE POLICY "Enable delete for all users" ON settings
FOR DELETE USING (true);

-- 4. Verificar se a tabela settings tem a estrutura correta
-- Se não existir, criar a tabela
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- 6. Verificar se há dados existentes
SELECT * FROM settings WHERE key = 'about';

-- 7. Se não houver dados, inserir dados padrão
INSERT INTO settings (key, value, updated_at)
VALUES (
    'about',
    '{
        "bio": "Olá! Sou um desenvolvedor Full Stack apaixonado por criar soluções digitais inovadoras.",
        "profileImage": "",
        "skills": {
            "frontend": ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "TypeScript"],
            "backend": ["Node.js", "Python", "PHP", "Express.js", "PostgreSQL"],
            "database": ["MySQL", "PostgreSQL", "MongoDB", "Firebase"],
            "tools": ["Git", "Docker", "AWS", "Figma", "VS Code"]
        },
        "experience": [],
        "education": [],
        "certifications": [],
        "gallery": [],
        "socialLinks": {
            "github": "https://github.com/seu-usuario",
            "linkedin": "",
            "twitter": "",
            "email": "contato@exemplo.com"
        },
        "updatedAt": "' || NOW() || '"
    }'::jsonb,
    NOW()
)
ON CONFLICT (key) DO NOTHING;

-- 8. Verificar se os dados foram inseridos corretamente
SELECT key, value->>'bio' as bio_preview FROM settings WHERE key = 'about';
