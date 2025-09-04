# 🚀 Guia de Deploy no Vercel

## Problema Identificado
O site funciona localmente, mas no Vercel não consegue criar projetos/posts devido a:
1. **Variáveis de ambiente não configuradas** no Vercel
2. **Possíveis problemas com RLS policies** no Supabase

## ✅ Solução - Configurar Variáveis no Vercel

### Passo 1: Acessar Vercel Dashboard
1. Vá para: https://vercel.com/dashboard
2. Selecione seu projeto do portfólio

### Passo 2: Configurar Environment Variables
1. Clique em **Settings** (engrenagem)
2. Vá para **Environment Variables**
3. Adicione as seguintes variáveis:

```
SUPABASE_URL=https://nattvkjaecceirxthizc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ
PUBLIC_SUPABASE_URL=https://nattvkjaecceirxthizc.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ
```

### Passo 3: Fazer Redeploy
1. Vá para **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**

## 🔧 Solução Alternativa - Corrigir RLS Policies

Se ainda não funcionar, execute este SQL no **Supabase Dashboard**:

```sql
-- Permitir leitura pública de projetos publicados
DROP POLICY IF EXISTS "projects_public_read_policy" ON projects;
CREATE POLICY "projects_public_read_policy" ON projects
FOR SELECT USING (status = 'published');

-- Permitir operações autenticadas
DROP POLICY IF EXISTS "projects_authenticated_policy" ON projects;
CREATE POLICY "projects_authenticated_policy" ON projects
FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
```

## 🧪 Como Testar

Após configurar, teste:
1. **Admin Panel**: `https://seu-site.vercel.app/admin`
2. **Criar Projeto**: Faça login e tente criar um projeto
3. **Página Projetos**: `https://seu-site.vercel.app/projetos`

## 📊 Status Atual
- ✅ **Local**: Funcionando perfeitamente
- ❌ **Vercel**: Problema com variáveis de ambiente
- ✅ **Supabase**: Conectado e funcionando
- ✅ **GitHub**: Código atualizado

## 🔍 Debug Adicional

Se ainda não funcionar, verifique:
1. **Console do navegador** (F12) para erros
2. **Logs do Vercel** na aba Functions
3. **Network tab** para requests com erro 400/500
