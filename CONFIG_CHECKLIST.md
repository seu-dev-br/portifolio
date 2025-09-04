# 🔧 Verificação de Configurações - Supabase + Vercel

## ✅ **Status Atual:**
- ✅ **Conexão Supabase:** Funcionando
- ✅ **Database:** Acessível
- ⚠️ **Autenticação:** Possível problema de configuração

## 🚀 **Verificações Necessárias:**

### **1. Configurações do Supabase**

#### **A. Site URL e Redirect URLs**
1. **Acesse:** https://supabase.com/dashboard
2. **Projeto:** `nattvkjaecceirxthizc`
3. **Vá para:** Authentication → Settings → URL Configuration

#### **Configurações Necessárias:**
```
Site URL: https://portifolio-seu-dev-br.vercel.app
Additional Redirect URLs:
- https://portifolio-seu-dev-br.vercel.app/admin
- https://portifolio-git-main-seu-dev-br.vercel.app
- https://portifolio-git-main-seu-dev-br.vercel.app/admin
- http://localhost:4321 (para desenvolvimento)
- http://localhost:4321/admin
```

> ⚠️ **IMPORTANTE:** Para instruções detalhadas sobre como configurar estas URLs, consulte o arquivo [REDIRECT_URLS.md](./REDIRECT_URLS.md).

#### **B. Confirmação de Email**
- **Desmarque:** "Enable email confirmations" (para desenvolvimento)

### **2. Configurações do Vercel**

#### **A. Environment Variables**
Verifique se estas variáveis estão configuradas no Vercel:

```
SUPABASE_URL=https://nattvkjaecceirxthizc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Como verificar:**
1. **Vá para:** Vercel Dashboard → Project Settings → Environment Variables
2. **Confirme que existem** as variáveis acima
3. **Re-deploy** se necessário

### **3. Teste no Navegador**

#### **Script de Teste para Console:**
```javascript
// Execute no console do navegador (F12)
console.log('🔍 Teste de conectividade Supabase');

// Teste 1: Verificar se Supabase está carregado
if (window.supabase) {
  console.log('✅ Supabase carregado');
} else {
  console.log('❌ Supabase não carregado');
}

// Teste 2: Verificar URL
console.log('📡 URL configurada:', window.supabase?.supabaseUrl);

// Teste 3: Teste de conectividade
window.supabase?.from('posts').select('count').then(result => {
  if (result.error) {
    console.error('❌ Erro de conectividade:', result.error);
  } else {
    console.log('✅ Conectividade OK');
  }
});
```

### **4. Possíveis Problemas e Soluções**

#### **Problema 1: CORS Error**
**Sintomas:** `Failed to fetch`, `CORS error`
**Solução:** Verificar/adicionar URLs na seção "Site URL" do Supabase

#### **Problema 2: Environment Variables**
**Sintomas:** `seu_project_ref.supabase.co` no erro
**Solução:** Verificar variáveis no Vercel e re-deploy

#### **Problema 3: Email Confirmation**
**Sintomas:** `Email not confirmed`
**Solução:** Desabilitar confirmação ou confirmar email manualmente

### **5. Checklist de Verificação**

- [ ] **Supabase Dashboard:**
  - [ ] Site URL configurada corretamente
  - [ ] Redirect URLs incluem domínios do Vercel
  - [ ] Email confirmation desabilitada

- [ ] **Vercel Dashboard:**
  - [ ] Environment variables configuradas
  - [ ] Último deploy bem-sucedido
  - [ ] Domínio correto

- [ ] **Navegador:**
  - [ ] Cache limpo (`Ctrl + Shift + R`)
  - [ ] Console mostra "Supabase initialized successfully"
  - [ ] Tentativa de login mostra erro específico

### **6. Comandos Úteis**

#### **Redeploy no Vercel:**
```bash
# Via GitHub Actions (automático)
git push origin main

# Ou manualmente no dashboard
Vercel Dashboard → Deployments → Redeploy
```

#### **Limpar cache do navegador:**
- `Ctrl + Shift + R` (Windows/Linux)
- `Cmd + Shift + R` (Mac)
- Ou: DevTools → Network → "Disable cache"

### **7. Logs para Verificar**

#### **Console do navegador deve mostrar:**
```
✅ Supabase initialized successfully at: [timestamp]
✅ Supabase connection test successful
🔐 Attempting login for: [email]
📡 Sending login request to Supabase...
✅ Login successful: [email]
```

#### **Se ainda falhar, verificar:**
- URL do erro (não deve conter "seu_project_ref")
- Status code do erro
- Headers de resposta

## 🎯 **Próximos Passos:**

1. **Verificar configurações do Supabase** (Site URL + Redirect URLs)
2. **Confirmar variáveis no Vercel**
3. **Limpar cache do navegador**
4. **Testar login novamente**
5. **Verificar logs do console**

**A configuração está quase correta - é só ajustar os domínios autorizados!** 🚀
