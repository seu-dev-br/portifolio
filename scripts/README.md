# Scripts de Automação e Manutenção

Esta pasta contém scripts essenciais para automação, build, deploy e manutenção do projeto. Todos os scripts aqui devem ser úteis para ambientes de produção, desenvolvimento ou CI/CD.

## Scripts disponíveis

- **check-env.ts**: Verifica se todas as variáveis de ambiente obrigatórias estão definidas.
- **check-secrets.ts**: Valida a presença de segredos sensíveis necessários para o funcionamento do sistema.
- **create-admin-user.ts**: Cria um usuário administrador no banco de dados.
- **diagnose-build-deploy.js**: Executa diagnósticos de build e deploy para identificar possíveis problemas.
- **diagnose-posts.ts**: Diagnóstico e validação de posts no banco de dados.
- **diagnose-supabase-connection.js**: Testa a conexão com o Supabase.
- **generate-sw.js**: Gera o service worker para PWA.
- **safe-build.ts**: Executa o build de forma segura, com validações extras.

## Como usar

Execute qualquer script com:

```sh
npm run tsx scripts/<nome-do-script>.ts
# ou
node scripts/<nome-do-script>.js
```

> Consulte o cabeçalho de cada script para detalhes e exemplos de uso.

## Observações
- Scripts de teste/manual foram movidos para `manual-tests/scripts/`.
- Mantenha esta pasta limpa e documentada para facilitar a manutenção do projeto.
