-- Script para ajustar políticas RLS para testes
-- Execute este script no SQL Editor do Supabase

-- ===========================================
-- POLÍTICAS TEMPORÁRIAS PARA TESTES (DESENVOLVIMENTO)
-- ===========================================

-- Permitir inserção de posts sem autenticação (apenas para testes)
DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
CREATE POLICY "posts_insert_policy" ON posts
    FOR INSERT WITH CHECK (true);

-- Permitir atualização de posts sem autenticação (apenas para testes)
DROP POLICY IF EXISTS "posts_update_policy" ON posts;
CREATE POLICY "posts_update_policy" ON posts
    FOR UPDATE USING (true);

-- Permitir exclusão de posts sem autenticação (apenas para testes)
DROP POLICY IF EXISTS "posts_delete_policy" ON posts;
CREATE POLICY "posts_delete_policy" ON posts
    FOR DELETE USING (true);

-- ===========================================
-- POLÍTICAS PARA PRODUÇÃO (reverter após testes)
-- ===========================================

/*
-- Para reverter para produção, execute:

DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
CREATE POLICY "posts_insert_policy" ON posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "posts_update_policy" ON posts;
CREATE POLICY "posts_update_policy" ON posts
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "posts_delete_policy" ON posts;
CREATE POLICY "posts_delete_policy" ON posts
    FOR DELETE USING (auth.uid() IS NOT NULL);

*/