-- SQL para corrigir as políticas RLS da tabela projects
-- Execute estes comandos no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos verificar se o RLS está habilitado
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'projects';

-- 2. Se RLS estiver habilitado, vamos criar políticas para usuários autenticados

-- Política para SELECT (ler projetos)
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
CREATE POLICY "projects_select_policy" ON projects
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política para INSERT (criar projetos)
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
CREATE POLICY "projects_insert_policy" ON projects
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para UPDATE (atualizar projetos)
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
CREATE POLICY "projects_update_policy" ON projects
FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Política para DELETE (excluir projetos)
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;
CREATE POLICY "projects_delete_policy" ON projects
FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. Alternativa: Se quiser permitir operações sem autenticação (NÃO RECOMENDADO PARA PRODUÇÃO)
-- Descomente as linhas abaixo apenas para testar:

-- DROP POLICY IF EXISTS "projects_allow_all" ON projects;
-- CREATE POLICY "projects_allow_all" ON projects FOR ALL USING (true) WITH CHECK (true);

-- 4. Verificar as políticas criadas
-- SELECT * FROM pg_policies WHERE tablename = 'projects';
