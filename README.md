# 🚀 Portfólio com Headless CMS e Build Automatizado

Este é um projeto completo de portfólio pessoal e blog que utiliza Firebase como Headless CMS, Astro como gerador de site estático e GitHub Actions para automação do deploy.

## 📁 Estrutura do Projeto

```
/
├── admin/              # Painel de Administração
│   ├── index.html      # Interface do admin
│   ├── admin.js        # Lógica de autenticação e CRUD
│   └── style.css       # Estilos do painel
├── site/               # Site público (Astro)
│   ├── src/
│   │   ├── layouts/    # Layouts do site
│   │   ├── pages/      # Páginas do site
│   │   ├── lib/        # Configuração Firebase
│   │   └── assets/     # Assets estáticos
│   └── public/         # Arquivos públicos
└── .github/workflows/  # Configuração GitHub Actions
    └── deploy.yml      # Workflow de deploy
```

## 🛠️ Tecnologias Utilizadas

- **Frontend Site**: Astro, HTML5, CSS3, JavaScript
- **Backend/CMS**: Firebase (Firestore + Storage + Auth)
- **Painel Admin**: HTML, CSS, JavaScript Vanilla
- **Deploy**: GitHub Actions + GitHub Pages
- **Markdown**: Marked.js para conversão de conteúdo

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Conta no Firebase
- Conta no GitHub
- Git instalado

## 🚀 Configuração do Projeto

### 1. Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Adicione um aplicativo Web ao projeto
4. Anote as credenciais de configuração

#### Configurar Firestore:
1. Vá em "Cloud Firestore" e crie um banco de dados
2. Crie uma coleção chamada `posts`
3. Adicione as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth.uid == 'SEU_UID_AQUI';
    }
  }
}
```

#### Configurar Authentication:
1. Vá em "Authentication" e habilite "E-mail/senha"
2. Crie um usuário administrador
3. Anote o UID do usuário criado

#### Configurar Storage:
1. Vá em "Storage" e crie um bucket
2. Aplique as regras de segurança:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == 'SEU_UID_AQUI';
    }
  }
}
```

### 2. Configuração das Credenciais

#### No arquivo `admin/admin.js`:
```javascript
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
};
```

#### No Vercel (Environment Variables):
Configure as seguintes variáveis de ambiente no dashboard do Vercel:
- `FIREBASE_PUBLIC_API_KEY`
- `FIREBASE_PUBLIC_AUTH_DOMAIN`
- `FIREBASE_PUBLIC_PROJECT_ID`
- `FIREBASE_PUBLIC_STORAGE_BUCKET`
- `FIREBASE_PUBLIC_MESSAGING_SENDER_ID`
- `FIREBASE_PUBLIC_APP_ID`

### 3. Configuração do Site Astro

1. Navegue até a pasta `site`
2. Instale as dependências:
   ```bash
   cd site
   npm install
   ```

### 4. Deploy no Vercel (Recomendado)

1. **Conecte ao GitHub:**
   - Acesse https://vercel.com/
   - Faça login com GitHub
   - Importe o repositório

2. **Configure o Build:**
   - Framework: Astro
   - Build Command: `cd site && npm run build`
   - Output Directory: `site/dist`

3. **Adicione Environment Variables**
4. **Deploy automático a cada push!**

**URL final:** `https://seu-projeto.vercel.app`

## 💻 Como Usar

### Desenvolvimento Local

1. **Site Astro**:
   ```bash
   cd site
   npm run dev
   ```
   Acesse: http://localhost:4321

2. **Painel Admin**:
   Abra o arquivo `admin/index.html` no navegador ou use um servidor local:
   ```bash
   cd admin
   python -m http.server 3000
   ```
   Acesse: http://localhost:3000

### Criando Posts

1. Acesse o painel administrativo
2. Faça login com suas credenciais
3. Clique em "Novo Post"
4. Preencha os campos:
   - **Título**: Título do post
   - **Resumo**: Descrição curta
   - **Tags**: Tags separadas por vírgula
   - **Status**: Rascunho ou Publicado
   - **Imagem de Capa**: Upload de imagem ou URL
   - **Conteúdo**: Escreva em Markdown

### Deploy Automático

O deploy acontece automaticamente quando você:
1. Faz push para a branch `main`
2. O GitHub Actions executa o build
3. O site é publicado no GitHub Pages

## 🎨 Personalização

### Mudando Cores e Estilos

Os estilos principais estão definidos nos arquivos:
- `site/src/layouts/Layout.astro` - Layout base
- `site/src/pages/*.astro` - Páginas individuais
- `admin/style.css` - Painel administrativo

### Adicionando Novas Páginas

1. Crie um arquivo `.astro` em `site/src/pages/`
2. Adicione o link no layout base
3. O Astro irá gerar a página automaticamente

### Modificando o Schema dos Posts

Para adicionar novos campos aos posts:
1. Atualize o formulário em `admin/index.html`
2. Modifique a lógica em `admin/admin.js`
3. Ajuste as páginas Astro para exibir os novos campos

## 🔧 Scripts Disponíveis

No diretório `site/`:

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run astro        # CLI do Astro
```

## 🐛 Troubleshooting

### Erro de Autenticação Firebase
- Verifique se as credenciais estão corretas
- Confirme se o usuário tem permissões de admin
- Verifique as regras de segurança do Firestore

### Erro no Build do GitHub Actions
- Verifique se todos os secrets estão configurados
- Confirme se o `astro.config.mjs` está correto
- Verifique os logs do Actions para erros específicos

### Posts não aparecem no site
- Confirme se o status do post é "published"
- Verifique se as regras do Firestore permitem leitura
- Certifique-se de que o Firebase está configurado corretamente

## 📝 Próximos Passos

- [ ] Adicionar sistema de comentários
- [ ] Implementar busca nos posts
- [ ] Adicionar modo escuro/claro
- [ ] Criar sistema de categorias
- [ ] Adicionar RSS feed
- [ ] Implementar analytics

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
