-- SQL para criar TODAS as tabelas necessárias no Supabase
-- Execute este script no SQL Editor do Supabase
-- Este script cria: projects, posts, contact_messages, settings

-- ===========================================
-- 1. CRIAR TABELA PROJECTS
-- ===========================================
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    technologies TEXT[],
    demo_link TEXT,
    github_link TEXT,
    download_link TEXT,
    image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 2. CRIAR TABELA POSTS
-- ===========================================
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content_markdown TEXT,
    cover_image TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 3. CRIAR TABELA CONTACT_MESSAGES
-- ===========================================
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

-- ===========================================
-- 4. CRIAR TABELA SETTINGS
-- ===========================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ÍNDICES PARA PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON projects(published_at);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ===========================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ===========================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- POLÍTICAS RLS PARA PROJECTS
-- ===========================================
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
CREATE POLICY "projects_select_policy" ON projects
    FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
CREATE POLICY "projects_insert_policy" ON projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "projects_update_policy" ON projects;
CREATE POLICY "projects_update_policy" ON projects
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "projects_delete_policy" ON projects;
CREATE POLICY "projects_delete_policy" ON projects
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- ===========================================
-- POLÍTICAS RLS PARA POSTS
-- ===========================================
DROP POLICY IF EXISTS "posts_select_policy" ON posts;
CREATE POLICY "posts_select_policy" ON posts
    FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
CREATE POLICY "posts_insert_policy" ON posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "posts_update_policy" ON posts;
CREATE POLICY "posts_update_policy" ON posts
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "posts_delete_policy" ON posts;
CREATE POLICY "posts_delete_policy" ON posts
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- ===========================================
-- POLÍTICAS RLS PARA CONTACT_MESSAGES
-- ===========================================
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

-- ===========================================
-- POLÍTICAS RLS PARA SETTINGS
-- ===========================================
DROP POLICY IF EXISTS "settings_select_policy" ON settings;
CREATE POLICY "settings_select_policy" ON settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "settings_insert_policy" ON settings;
CREATE POLICY "settings_insert_policy" ON settings
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "settings_update_policy" ON settings;
CREATE POLICY "settings_update_policy" ON settings
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "settings_delete_policy" ON settings;
CREATE POLICY "settings_delete_policy" ON settings
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- ===========================================
-- FUNÇÃO PARA ATUALIZAR UPDATED_AT
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ===========================================
-- TRIGGERS PARA ATUALIZAR UPDATED_AT
-- ===========================================
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- VERIFICAÇÃO FINAL
-- ===========================================
SELECT 'projects table created' as status, COUNT(*) as count FROM projects
UNION ALL
SELECT 'posts table created', COUNT(*) FROM posts
UNION ALL
SELECT 'contact_messages table created', COUNT(*) FROM contact_messages
UNION ALL
SELECT 'settings table created', COUNT(*) FROM settings;
