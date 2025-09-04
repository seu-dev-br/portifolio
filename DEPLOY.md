# 🚀 Guia de Deploy - Projeto Astro + Supabase

Este projeto está configurado para deploy em múltiplas plataformas. Escolha a que melhor se adapta às suas necessidades.

## 📋 Pré-requisitos

1. **Projeto compilado**: Execute `npm run build`
2. **Variáveis de ambiente**: Configure as variáveis do Supabase
3. **Conta na plataforma**: Escolha seu provedor de hospedagem

## 🌐 Opções de Deploy

### 1. 🚀 Vercel (Recomendado)

**Vantagens:**
- ✅ Deploy automático via Git
- ✅ Domínio personalizado gratuito
- ✅ Performance otimizada
- ✅ Preview deployments

**Como fazer:**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy para produção
npm run deploy:vercel

# Ou preview
vercel
```

**Configuração automática:**
- O arquivo `vercel.json` já está configurado
- Variáveis de ambiente serão solicitadas durante o deploy

### 2. 🔥 Firebase Hosting

**Vantagens:**
- ✅ CDN global
- ✅ SSL automático
- ✅ Integração com Firebase (se usar outros serviços)

**Como fazer:**

### 2. 🌍 Netlify

**Vantagens:**
- ✅ Deploy via Git automático
- ✅ Formulários e funções serverless
- ✅ CDN global

**Como fazer:**

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy
npm run deploy:netlify
```

### 4. 📁 Deploy Manual

**Para qualquer hospedagem:**

```bash
# 1. Compilar o projeto
npm run build

# 2. O resultado estará na pasta dist/
# 3. Faça upload de todos os arquivos da pasta dist/
# 4. Configure as variáveis de ambiente no painel do seu provedor
```

## 🔧 Variáveis de Ambiente

Configure estas variáveis no seu provedor de hospedagem:

```env
SUPABASE_URL=https://nattvkjaecceirxthizc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ
```

## 📝 Configuração do Supabase

Antes do deploy, certifique-se de que:

1. **Banco de dados criado** no Supabase
2. **Tabelas criadas** (ver `FIREBASE_SETUP_NOVO.md`)
3. **RLS configurado** (Row Level Security)
4. **Storage bucket** criado (se usar imagens)
5. **Políticas de segurança** aplicadas

## 🎯 URLs de Produção

Após o deploy, seu site estará disponível em:

- **Vercel**: `https://portifolio-seu-dev-br.vercel.app`
- **Firebase**: `https://portifolio-seu-dev-br.web.app`
- **Netlify**: URL gerada automaticamente
- **Outros**: URL do seu provedor

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:

1. ✅ **Página inicial** carrega corretamente
2. ✅ **Posts e projetos** são exibidos
3. ✅ **Admin panel** funciona (`/admin`)
4. ✅ **Imagens** carregam do Supabase Storage
5. ✅ **Formulários** funcionam (se houver)

## 🚨 Troubleshooting

### Erro: "SUPABASE_URL not found"
- Configure as variáveis de ambiente no painel do seu provedor
- Verifique se as URLs estão corretas

### Erro: "Build failed"
- Execute `npm run build` localmente primeiro
- Verifique se não há erros de TypeScript
- Certifique-se de que todas as dependências estão instaladas

### Erro: "Database connection failed"
- Verifique se o Supabase está online
- Confirme as credenciais da API
- Verifique as políticas RLS

## 📊 Performance

Para otimizar o desempenho:

1. **Imagens**: Use WebP e otimize tamanhos
2. **CSS/JS**: Minificação automática no build
3. **Cache**: Configure headers apropriados
4. **CDN**: Use provedores com CDN global

## 🔄 Atualizações

Para atualizar o site:

```bash
# Para Vercel/Netlify (deploy automático)
git add .
git commit -m "Atualização do site"
git push

# Para deploy manual
npm run build
# Upload da pasta dist/
```

---

**🎉 Pronto para deploy!** Escolha sua plataforma preferida e siga os passos acima.
