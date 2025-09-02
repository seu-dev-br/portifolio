# � DEPLOY NO VERCEL - GUIA COMPLETO

## 1. Criar conta no Vercel

1. Acesse: https://vercel.com/
2. Clique em "Sign up"
3. **IMPORTANTE:** Faça login com sua conta do GitHub para integração automática

## 2. Conectar seu repositório

1. No dashboard do Vercel, clique em "New Project"
2. Selecione "Import Git Repository" 
3. Escolha seu repositório: `Ganjamanbr/portifolio`
4. Clique em "Import"

## 3. Configurar o projeto

### Build & Development Settings:
- **Framework Preset:** Astro
- **Build Command:** `cd site && npm run build`
- **Output Directory:** `site/dist`
- **Install Command:** `cd site && npm ci`
- **Root Directory:** Deixe em branco

### ⚙️ Advanced Settings (opcional):
- **Node.js Version:** 18.x (recomendado)
- **Environment:** Production

## 4. Configurar Environment Variables

Na seção "Environment Variables", adicione uma por uma:

```
FIREBASE_PUBLIC_API_KEY = AIzaSyAxl5gZsCHyu5h12saiSTEgsT10kZx7HBE
FIREBASE_PUBLIC_AUTH_DOMAIN = portifolio-32038.firebaseapp.com
FIREBASE_PUBLIC_PROJECT_ID = portifolio-32038
FIREBASE_PUBLIC_STORAGE_BUCKET = portifolio-32038.firebasestorage.app
FIREBASE_PUBLIC_MESSAGING_SENDER_ID = 336134796353
FIREBASE_PUBLIC_APP_ID = 1:336134796353:web:469cdc6b3538c7b19a82c0
```

⚠️ **Importante:** Copie e cole cada valor exatamente como mostrado acima.

## 5. Deploy

1. Clique em "Deploy"
2. Aguarde o build (1-2 minutos)
3. 🎉 Seu site ficará disponível em: `https://portifolio-xxxx.vercel.app`

## ✅ Vantagens do Vercel:

- 🚀 **Deploy automático** a cada push no GitHub
- 🔄 **Preview deployments** para cada branch/PR
- ⚡ **CDN global** com cache inteligente
- 📊 **Analytics** e Web Vitals integrados
- 🔧 **Zero configuração** para projetos Astro
- 🌐 **Domínio personalizado** gratuito (.vercel.app)
- ⚙️ **Edge Functions** para recursos avançados

## 🔄 Deploy automático configurado!

Após a configuração inicial:
- ✅ Todo `git push` para `main` = deploy automático
- ✅ Branches = preview deployments automáticos
- ✅ Rollback com 1 clique se algo der errado

## 🌐 URLs do seu projeto:

- **🖥️ Site Principal:** https://portifolio-xxxx.vercel.app
- **⚙️ Painel Admin:** http://localhost:3000 (sempre local)
- **📱 Preview:** Vercel gera para cada branch

## 🎯 Para testar agora:

1. **Commit e push as mudanças:**
   ```bash
   git add .
   git commit -m "Migrar para Vercel - configuração otimizada"
   git push origin main
   ```

2. **Configure no Vercel conforme o guia acima**

3. **Teste o painel admin localmente:** http://127.0.0.1:3000

**Qualquer dúvida, me avise! 🚀**
