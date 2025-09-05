-- Script para criar e configurar o bucket de imagens no Supabase Storage
-- Execute este script no SQL Editor do Supabase

-- 1. Criar o bucket 'images' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar políticas de acesso para o bucket images
-- Permitir upload para usuários autenticados
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
);

-- Permitir leitura pública das imagens
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Permitir atualização para usuários autenticados
CREATE POLICY "Allow authenticated users to update images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
);

-- Permitir exclusão para usuários autenticados
CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
);

-- 3. Verificar se o bucket foi criado
SELECT id, name, public FROM storage.buckets WHERE name = 'images';

-- 4. Verificar as políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';
