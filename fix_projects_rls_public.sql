-- Corrigir RLS policies para permitir leitura pública de projetos publicados
-- Execute no SQL Editor do Supabase Dashboard

-- Política para permitir leitura pública de projetos publicados
DROP POLICY IF EXISTS "projects_public_read_policy" ON projects;
CREATE POLICY "projects_public_read_policy" ON projects
FOR SELECT USING (status = 'published');

-- Manter as outras políticas para operações autenticadas
DROP POLICY IF EXISTS "projects_authenticated_policy" ON projects;
CREATE POLICY "projects_authenticated_policy" ON projects
FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Verificar as políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE tablename = 'projects';
