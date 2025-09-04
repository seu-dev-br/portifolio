# 🚀 Guia de Manutenção do Repositório GitHub

Este documento fornece instruções sobre como manter e atualizar o repositório GitHub do projeto.

## 📋 Estrutura do Repositório

- **Repositório**: `seu-dev-br/portifolio`
- **Branch Principal**: `main`

## 🔄 Fluxo de Trabalho Recomendado

### 1. Desenvolvimento Local

1. **Clone o repositório** (apenas na primeira vez):
   ```bash
   git clone https://github.com/seu-dev-br/portifolio.git
   cd portifolio
   ```

2. **Atualize o repositório local**:
   ```bash
   git pull origin main
   ```

3. **Instale as dependências** (após atualização ou clone):
   ```bash
   npm install
   ```

4. **Desenvolva suas alterações**:
   - Faça as modificações necessárias no código
   - Teste localmente com `npm run dev`

### 2. Envio de Alterações para o GitHub

#### Método Manual:

1. **Verifique as alterações**:
   ```bash
   git status
   ```

2. **Adicione as alterações**:
   ```bash
   git add .
   ```

3. **Faça o commit**:
   ```bash
   git commit -m "Descrição clara das alterações"
   ```

4. **Envie para o GitHub**:
   ```bash
   git push origin main
   ```

#### Método Assistido:

1. **Use o script de assistência**:
   ```bash
   ./github-push.bat
   ```
   Este script guiará você por todo o processo de commit e push.

## ⚠️ Cuidados Importantes

### Arquivos Sensíveis

Nunca envie arquivos sensíveis para o GitHub:

- **Arquivos de ambiente**: `.env`, `.env.local`, `.env.production`
- **Chaves privadas**: Arquivos com senhas, tokens ou chaves de API
- **Dados pessoais**: Informações de usuários ou clientes

### Boas Práticas

1. **Mensagens de commit claras**:
   - Use mensagens descritivas que expliquem o que foi alterado
   - Evite mensagens genéricas como "atualização" ou "correção"

2. **Atualize frequentemente**:
   - Faça commits pequenos e frequentes em vez de grandes alterações
   - Isso facilita o rastreamento de problemas

3. **Teste antes de enviar**:
   - Execute `npm run test:build` para verificar se tudo está funcionando
   - Verifique se todas as funcionalidades principais estão operando corretamente

## 🔒 Segurança

### Proteção do Branch Principal

O branch `main` está protegido:
- Não é possível fazer push diretamente para ele
- As alterações devem passar por pull requests
- Os pull requests precisam de revisão antes de serem mesclados

### Secrets e Variáveis de Ambiente

- As variáveis de ambiente sensíveis estão configuradas no GitHub como secrets
- Nunca exponha esses valores no código ou em commits
- Para adicionar novos secrets, vá para:
  `Repositório → Settings → Secrets and variables → Actions`

## 🛠️ Solução de Problemas

### Erros de Push

Se encontrar erros ao tentar enviar para o GitHub:

1. **Conflitos**:
   ```bash
   git pull origin main
   # Resolva os conflitos manualmente
   git add .
   git commit -m "Resolvido conflito em [arquivo]"
   git push origin main
   ```

2. **Problemas de Autenticação**:
   - Verifique suas credenciais do GitHub
   - Use autenticação via token ou SSH

### Outros Problemas

Para outros problemas, consulte:
- [Documentação do Git](https://git-scm.com/doc)
- [Ajuda do GitHub](https://help.github.com)

## 📅 Manutenção Regular

- **Atualize as dependências**: Regularmente execute `npm update`
- **Verifique por vulnerabilidades**: Execute `npm audit`
- **Limpe branches obsoletas**: Remova branches que não são mais necessários
