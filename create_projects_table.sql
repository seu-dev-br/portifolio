-- SQL para criar a tabela projects no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela projects
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    technologies TEXT[],
    demo_link TEXT,
    github_link TEXT,
    download_link TEXT,
    image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'coming_soon')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON projects(published_at);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para projetos
-- Política para SELECT (todos podem ver projetos publicados e coming soon)
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
CREATE POLICY "projects_select_policy" ON projects
    FOR SELECT USING (status IN ('published', 'coming_soon') OR auth.uid() IS NOT NULL);

-- Política para INSERT (apenas usuários autenticados podem criar)
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
CREATE POLICY "projects_insert_policy" ON projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para UPDATE (apenas usuários autenticados podem editar)
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
CREATE POLICY "projects_update_policy" ON projects
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para DELETE (apenas usuários autenticados podem excluir)
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;
CREATE POLICY "projects_delete_policy" ON projects
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar se a tabela foi criada corretamente
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE tablename = 'projects';

-- Verificar as colunas da tabela
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;
