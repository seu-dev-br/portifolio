# Documentação de Engenharia e Uso

## Visão Geral
Este projeto é um portfólio profissional construído com Astro, Vite, TailwindCSS e integração com Supabase. O objetivo é fornecer uma base moderna, otimizada e fácil de manter para apresentação de projetos, blog e área administrativa.

## Estrutura de Pastas
- `src/` — Código-fonte principal (componentes, páginas, layouts, estilos)
- `public/` — Arquivos estáticos acessíveis diretamente (imagens, manifest, favicon)
- `scripts/` — Scripts utilitários para build, deploy e manutenção
- `database/` — Scripts SQL para criação e manutenção do banco de dados
- `admin/` — Interface administrativa (HTML/CSS)

## Principais Tecnologias
- **Astro**: Framework principal para geração de páginas estáticas e SSR
- **Vite**: Bundler e dev server
- **TailwindCSS**: Utilitário de CSS para estilização
- **Supabase**: Backend as a Service (autenticação, banco de dados, storage)

## Scripts Úteis
- `npm run dev` — Inicia o servidor de desenvolvimento
- `npm run build` — Gera o build de produção
- `npm run preview` — Visualiza o build localmente
- `npm run deploy` — Build otimizado para deploy manual
- `npm run deploy:vercel` — Build e deploy automático no Vercel

## Deploy
- Recomenda-se o uso do Vercel para deploy contínuo.
- O build de produção é gerado na pasta `dist/`.
- Variáveis de ambiente devem ser configuradas conforme o README principal.

## Integração com Supabase
- As credenciais do Supabase devem ser definidas em variáveis de ambiente.
- Scripts SQL para criação de tabelas estão em `database/`.

## Boas Práticas
- Mantenha apenas arquivos essenciais nas pastas do projeto.
- Utilize scripts da pasta `scripts/` para automações e manutenção.
- Documente sempre novos scripts e comandos no README.

## Contato e Suporte
Para dúvidas técnicas ou sugestões, entre em contato com o mantenedor do projeto.
