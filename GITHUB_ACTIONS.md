# 🔄 Configuração do CI/CD com GitHub Actions

Este documento explica como o sistema de Integração Contínua e Entrega Contínua (CI/CD) está configurado neste projeto, usando GitHub Actions para automação.

## 📋 Configuração Atual

### Workflow Principal: Vercel Deploy

Arquivo: `.github/workflows/vercel-deploy.yml`

Este workflow automatiza o processo de build e deploy na Vercel:

1. **Triggers**:
   - Push para o branch `main`
   - Pull requests para o branch `main`

2. **Etapas**:
   - Checkout do código
   - Configuração do Node.js
   - Instalação de dependências
   - Execução de testes
   - Build do projeto
   - Deploy na Vercel (produção ou preview, dependendo do contexto)

### Variáveis de Ambiente e Secrets

Os seguintes secrets são necessários no repositório GitHub:

- `VERCEL_TOKEN`: Token de API da Vercel
- `VERCEL_ORG_ID`: ID da organização na Vercel
- `VERCEL_PROJECT_ID`: ID do projeto na Vercel
- `SUPABASE_URL`: URL do projeto Supabase
- `SUPABASE_ANON_KEY`: Chave anônima do Supabase

## 🛠️ Como Configurar os Secrets

1. Acesse o repositório no GitHub
2. Vá para `Settings → Secrets and variables → Actions`
3. Clique em `New repository secret`
4. Adicione cada secret necessário com seu valor correspondente

## 📊 Monitoramento e Logs

Você pode acompanhar o progresso dos workflows:

1. Acesse o repositório no GitHub
2. Vá para a aba `Actions`
3. Selecione o workflow desejado para ver detalhes
4. Examine os logs para identificar possíveis problemas

## 🚀 Estratégia de Deploy

### Deploy de Produção

Quando um push é feito para o branch `main`:

1. O workflow é acionado
2. Os testes são executados
3. Se os testes passarem, o build é realizado
4. O site é implantado na Vercel em produção

### Deploy de Preview

Quando um pull request é aberto para o branch `main`:

1. O workflow é acionado
2. Os testes são executados
3. Se os testes passarem, o build é realizado
4. Um ambiente de preview é criado na Vercel
5. O link para o preview é adicionado ao pull request

## 🔧 Modificando os Workflows

Para modificar os workflows do GitHub Actions:

1. Edite os arquivos na pasta `.github/workflows/`
2. Commit e push das alterações
3. O GitHub Actions começará a usar a nova configuração imediatamente

## ⚠️ Solução de Problemas

Se o workflow falhar:

1. Verifique os logs de erro na aba Actions
2. Certifique-se de que todos os secrets estão configurados corretamente
3. Confirme se os testes estão passando localmente
4. Verifique se há conflitos entre dependências

## 📝 Melhores Práticas

1. **Nunca coloque secrets ou credenciais diretamente no código**
2. **Mantenha os workflows simples e focados**
3. **Use a feature de caching do GitHub Actions para acelerar builds**
4. **Monitore regularmente os workflows para garantir que estão funcionando corretamente**
