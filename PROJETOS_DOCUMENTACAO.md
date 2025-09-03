# Gerenciamento de Projetos

A funcionalidade de projetos foi implementada com sucesso no portfólio! Agora você pode gerenciar seus projetos através do painel administrativo.

## Funcionalidades Implementadas

### 1. Página de Projetos
- **URL**: `/projetos`
- Exibe todos os projetos publicados
- Cards responsivos com imagem, título, descrição e tecnologias
- Links para demo, GitHub e download (quando disponíveis)
- Design consistente com o restante do site

### 2. Painel Administrativo
- **Novos botões de navegação**:
  - "Listar Projetos" - Visualiza todos os projetos
  - "Novo Projeto" - Cria um novo projeto

### 3. Formulário de Projeto
Campos disponíveis no admin:
- **Título do Projeto** (obrigatório)
- **Descrição** - Texto descritivo do projeto
- **Tecnologias** - Lista separada por vírgulas (ex: "React, Node.js, MongoDB")
- **Link da Demo** - URL para visualizar o projeto funcionando
- **Link do GitHub** - URL do repositório no GitHub
- **Link de Download** - URL para download direto (opcional)
- **Imagem do Projeto** - Upload de arquivo ou URL da imagem
- **Status** - Rascunho ou Publicado

### 4. Homepage Atualizada
- Seção "Projetos em Destaque" mostra os 3 projetos mais recentes
- Botão "Ver Projetos" no hero principal
- Navegação atualizada com link para projetos

## Como Usar

### Criando um Novo Projeto

1. Acesse o painel admin: `/admin/index.html`
2. Faça login com suas credenciais
3. Clique em "Novo Projeto"
4. Preencha as informações do projeto:
   - Título (obrigatório)
   - Descrição clara e concisa
   - Tecnologias utilizadas (separadas por vírgula)
   - Links relevantes (demo, GitHub, download)
   - Imagem representativa do projeto
5. Defina o status como "Publicado" para que apareça no site
6. Clique em "Salvar Projeto"

### Editando um Projeto Existente

1. Na lista de projetos, clique em "Editar"
2. Faça as alterações necessárias
3. Clique em "Salvar Projeto"

### Deletando um Projeto

1. Na lista de projetos, clique em "Excluir"
2. Confirme a exclusão

## Estrutura de Dados

Os projetos são armazenados no Firebase Firestore na coleção `projects` com os seguintes campos:

```javascript
{
  title: "Nome do Projeto",
  description: "Descrição do projeto...",
  technologies: ["React", "Node.js", "MongoDB"],
  demoLink: "https://exemplo.com/demo",
  githubLink: "https://github.com/usuario/projeto",
  downloadLink: "https://exemplo.com/download", // opcional
  image: "https://exemplo.com/imagem.jpg",
  status: "published", // ou "draft"
  createdAt: timestamp,
  updatedAt: timestamp,
  publishedAt: timestamp // apenas se status for "published"
}
```

## Arquivos Modificados/Criados

### Novos Arquivos:
- `src/pages/projetos.astro` - Página de listagem de projetos

### Arquivos Modificados:
- `src/lib/firebase.js` - Adicionadas funções para gerenciar projetos
- `src/pages/index.astro` - Adicionada seção de projetos em destaque
- `src/layouts/Layout.astro` - Adicionado link "Projetos" na navegação
- `admin/index.html` - Adicionadas seções para gerenciar projetos
- `admin/admin.js` - Implementadas funções CRUD para projetos
- `admin/style.css` - Adicionados estilos específicos para projetos

## Próximos Passos Sugeridos

1. **SEO**: Adicionar meta tags específicas para a página de projetos
2. **Filtros**: Implementar filtros por tecnologia na página de projetos
3. **Categorias**: Adicionar sistema de categorias para projetos
4. **Ordenação**: Permitir ordenar projetos por data, nome, etc.
5. **Busca**: Implementar sistema de busca na página de projetos
6. **Analytics**: Adicionar tracking de cliques nos links dos projetos

## Dicas de Uso

1. **Imagens**: Use imagens de boa qualidade (recomendado 1200x600px)
2. **Descrições**: Mantenha descrições concisas mas informativas
3. **Links**: Sempre teste os links antes de publicar
4. **Tecnologias**: Use nomes consistentes (ex: "React" ao invés de "ReactJS")
5. **Status**: Use "Rascunho" para projetos em desenvolvimento

A funcionalidade está totalmente operacional e pronta para uso!
