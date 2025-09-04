# 🔄 URLs de Redirecionamento - Supabase

## 📋 Configuração de URLs de Redirecionamento no Supabase

Para que a autenticação do Supabase funcione corretamente em todos os ambientes, é necessário configurar as URLs de redirecionamento adequadamente.

### Passos para configurar:

1. **Acesse o painel do Supabase:**
   - URL: https://supabase.com/dashboard
   - Projeto: `nattvkjaecceirxthizc`

2. **Navegue até as configurações de autenticação:**
   - Vá para: Authentication → Settings → URL Configuration

3. **Configure as URLs:**

   a. **Site URL:**
   ```
   https://portifolio-seu-dev-br.vercel.app
   ```

   b. **Redirect URLs:**
   ```
   https://portifolio-seu-dev-br.vercel.app/admin
   https://portifolio-git-main-seu-dev-br.vercel.app
   https://portifolio-git-main-seu-dev-br.vercel.app/admin
   http://localhost:4321
   http://localhost:4321/admin
   ```

4. **Salve as configurações**

### 🔒 Configurações de Email:

Para desenvolvimento local, é recomendado desabilitar a confirmação de email:

1. Vá para: Authentication → Settings → Email
2. Desmarque a opção "Enable email confirmations"
3. Salve as alterações

## ✅ Verificação

Após a configuração, verifique se a autenticação está funcionando corretamente em:

1. **Ambiente de produção:**
   - https://portifolio-seu-dev-br.vercel.app/admin

2. **Ambiente de desenvolvimento:**
   - http://localhost:4321/admin

## 🔍 Solução de Problemas

Se encontrar erros de autenticação:

1. **Verifique os logs do navegador** para mensagens de erro específicas
2. **Confirme que as URLs de redirecionamento** estão configuradas corretamente
3. **Verifique as configurações de CORS** no Supabase
   - Vá para: Authentication → Settings → CORS
   - Certifique-se de que os domínios do seu site estão na lista de origens permitidas
