# 🔧 INSTRUÇÕES DE CONFIGURAÇÃO DO FIREBASE

## 1. Criar Projeto no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Clique em "Criar um projeto"
3. Nome sugerido: "meu-portfolio" (ou o nome que preferir)
4. Prossiga com as configurações popadrão

## 2. Configurar Aplicativo Web

1. No painel do projeto, clique no ícone Web "</>"
2. Nome do app: "Portfolio Admin"
3. Marque "Também configure o Firebase Hosting"
4. ANOTE AS CREDENCIAIS que aparecerão (exemplo):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "meu-portfolio-xxxxx.firebaseapp.com",
  projectId: "meu-portfolio-xxxxx",
  storageBucket: "meu-portfolio-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxx"
};
```

## 3. Configurar Firestore Database

1. No menu lateral, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de produção"
4. Escolha uma localização (ex: southamerica-east1)
5. Crie uma coleção chamada "posts"
6. Adicione um documento de teste com ID automático e os campos:
   - title: "Post de Exemplo"
   - slug: "post-de-exemplo"
   - status: "published"
   - contentMarkdown: "Este é um post de **teste**!"

## 4. Configurar Authentication

1. No menu lateral, vá em "Authentication"
2. Clique em "Vamos começar"
3. Aba "Sign-in method"
4. Clique em "E-mail/senha" e ATIVE
5. Salve as alterações

## 5. Criar Usuário Administrador

1. Na aba "Users" do Authentication
2. Clique em "Adicionar usuário"
3. Email: seu-email@exemplo.com
4. Senha: uma senha segura
5. ANOTE O UID que será gerado (ex: "kXXXXXXXXXXXXXXXXXXXXXXXXX")

## 6. Configurar Storage

1. No menu lateral, vá em "Storage"
2. Clique em "Vamos começar"
3. Escolha "Iniciar no modo de produção"
4. Manter a localização padrão

## 7. Aplicar Regras de Segurança

### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth.uid == 'SEU_UID_AQUI';
    }
    match /{collection}/{docId} {
      allow read: if true;
      allow write: if request.auth.uid == 'SEU_UID_AQUI';
    }
  }
}
```

### Storage Rules:
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

⚠️ **IMPORTANTE**: Substitua "SEU_UID_AQUI" pelo UID real do seu usuário administrador!

## ✅ Próximo Passo

Depois de configurar o Firebase, você precisará:
1. Editar o arquivo admin/admin.js com suas credenciais
2. Configurar os secrets no GitHub
3. Testar o painel administrativo

Salve este arquivo e me avise quando terminar a configuração do Firebase!
