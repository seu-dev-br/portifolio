# 🔑 Configuração de Secrets no GitHub

## Erro Atual
O workflow está falhando porque os secrets necessários não estão configurados no GitHub.

## 📋 Secrets Necessários

### 1. Secrets do Vercel
```bash
VERCEL_TOKEN          # Token de autenticação do Vercel
VERCEL_ORG_ID         # ID da organização no Vercel
VERCEL_PROJECT_ID     # ID do projeto no Vercel
```

### 2. Secrets do Supabase
```bash
SUPABASE_URL          # URL do projeto Supabase
SUPABASE_ANON_KEY     # Chave anônima do Supabase
```

## 🚀 Como Configurar

### Passo 1: Acesse as configurações do repositório
1. Vá para o seu repositório no GitHub
2. Clique na aba **"Settings"**
3. No menu lateral esquerdo, clique em **"Secrets and variables"**
4. Clique em **"Actions"**

### Passo 2: Configure os secrets do Vercel

#### Obter VERCEL_TOKEN:
1. Acesse [vercel.com](https://vercel.com)
2. Vá para **Account Settings** → **Tokens**
3. Clique em **"Create Token"**
4. Dê um nome (ex: "GitHub Actions")
5. Copie o token gerado

#### Obter VERCEL_ORG_ID e VERCEL_PROJECT_ID:
1. No Vercel, vá para o seu projeto
2. Vá para **Settings** → **General**
3. Copie o **"Project ID"**
4. Para o **Org ID**, vá para **Account Settings** → **Teams**
5. Copie o ID da sua conta/organização

### Passo 3: Configure os secrets do Supabase

#### Obter SUPABASE_URL e SUPABASE_ANON_KEY:
1. Acesse [supabase.com](https://supabase.com)
2. Vá para o seu projeto
3. No menu lateral, clique em **"Settings"**
4. Clique em **"API"**
5. Copie:
   - **Project URL** → será o `SUPABASE_URL`
   - **anon/public** key → será o `SUPABASE_ANON_KEY`

### Passo 4: Adicione os secrets no GitHub

Para cada secret, clique em **"New repository secret"** e adicione:

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | Cole o token do Vercel |
| `VERCEL_ORG_ID` | Cole o ID da organização |
| `VERCEL_PROJECT_ID` | Cole o ID do projeto |
| `SUPABASE_URL` | Cole a URL do Supabase |
| `SUPABASE_ANON_KEY` | Cole a chave anônima |

## ✅ Verificação

Após configurar todos os secrets:

1. **Faça um novo commit** para acionar o workflow:
   ```bash
   git commit --allow-empty -m "Trigger CI/CD after secrets setup"
   git push origin main
   ```

2. **Monitore o GitHub Actions**:
   - Vá para a aba **"Actions"** no repositório
   - O workflow deve executar sem erros
   - Deve fazer deploy automaticamente no Vercel

## 🔍 Troubleshooting

### Se ainda der erro:
1. Verifique se os nomes dos secrets estão **exatamente** iguais (case-sensitive)
2. Confirme se os valores foram colados corretamente (sem espaços extras)
3. Verifique se você tem permissões para configurar secrets no repositório

### Para testar localmente:
```bash
# Teste se as variáveis estão funcionando
npm run build
```

## 🤖 Scripts Auxiliares

Para facilitar o processo de configuração, foram criados dois scripts:

### 1. Script para Configurar Segredos
Execute o arquivo `setup-github-secrets.bat` para configurar os segredos automaticamente:
```bash
./setup-github-secrets.bat
```
Este script requer que o GitHub CLI (`gh`) esteja instalado e autenticado.

### 2. Script para Testar o Workflow
Após configurar os segredos, você pode testar o workflow com um commit vazio:
```bash
./test-workflow.bat
```

## 📞 Suporte

Se continuar com problemas:
1. Verifique os logs detalhados do GitHub Actions
2. Confirme se o projeto no Vercel está conectado corretamente
3. Verifique se as credenciais do Supabase estão ativas</content>
<parameter name="filePath">c:\Users\Grupo Lidon T.I\Documents\site\GITHUB_SECRETS_SETUP.md
