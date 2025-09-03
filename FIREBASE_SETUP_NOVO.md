// ========================================
// CONFIGURAÇÃO SUPABASE - ALTERNATIVA 100% GRATUITA
// ========================================

// SUPABASE É UMA ALTERNATIVA GRATUITA AO FIREBASE COM:
// - 500MB de banco de dados PostgreSQL
// - 1GB de armazenamento de arquivos (perfeito para imagens)
// - 5GB de tráfego de saída
// - Autenticação, Realtime, etc.

// CONFIGURAÇÃO SUPABASE (substitua pelos valores do seu projeto)
const SUPABASE_CONFIG = {
  url: "https://SEU_PROJECT_REF.supabase.co",
  anonKey: "SEU_ANON_KEY_AQUI"
};

// EXEMPLO (NÃO USAR - apenas para referência):
const SUPABASE_CONFIG_EXAMPLE = {
  url: "https://abcdefghijk.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
};

/*
PASSOS PARA CRIAR PROJETO SUPABASE GRATUITO:

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Crie uma conta gratuita
4. Crie um novo projeto
5. Aguarde a criação (pode levar alguns minutos)
6. Vá para Settings > API
7. Copie o Project URL e anon public key
8. Cole acima substituindo "SEU_*_AQUI"

VANTAGENS DO SUPABASE:
- 100% gratuito para projetos pequenos
- PostgreSQL (mais poderoso que Firestore)
- Armazenamento de arquivos incluído
- Autenticação integrada
- Realtime subscriptions
- SDKs para JavaScript, React, etc.

PARA INSTALAR O SDK:
npm install @supabase/supabase-js

EXEMPLO DE USO NO CÓDIGO:
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)

// Para upload de imagens:
const uploadImage = async (file) => {
  const { data, error } = await supabase.storage
    .from('images') // bucket name
    .upload(`public/${file.name}`, file)
  return { data, error }
}

// Para buscar imagens:
const getImageUrl = (path) => {
  return supabase.storage.from('images').getPublicUrl(path)
}

REGRAS DE SEGURANÇA (RLS) PARA STORAGE:
-- Habilitar RLS no bucket 'images'
-- Políticas:
-- SELECT: true (leitura pública)
-- INSERT/UPDATE/DELETE: auth.uid() IS NOT NULL (apenas usuários logados)

REGRAS PARA TABELAS (equivalente ao Firestore):
-- Para posts/projetos publicados:
CREATE POLICY "Public read for published content" ON posts
FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated write" ON posts
FOR ALL USING (auth.uid() IS NOT NULL);

CREDENCIAIS ADMIN PADRÃO:
- Você define ao criar o projeto
- Recomendado: admin@italo.dev / Italo2025Admin!

MIGRAÇÃO DO FIREBASE PARA SUPABASE:
1. Instale o SDK do Supabase
2. Substitua as chamadas do Firebase pelas do Supabase
3. Para Firestore -> Tabelas PostgreSQL
4. Para Storage -> Supabase Storage
5. Para Auth -> Supabase Auth

SUPABASE É 100% GRATUITO PARA:
- Até 500MB de banco
- Até 1GB de arquivos
- Até 5GB de tráfego/mês
- Até 50.000 usuários ativos/mês
- APIs ilimitadas

PERFEITO PARA PORTFÓLIOS E PROJETOS PESSOAIS!

CONFIGURAÇÃO DO BANCO DE DADOS SUPABASE:

1. No painel do Supabase, vá para "SQL Editor"
2. Execute estes comandos para criar as tabelas:

-- Tabela de posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content_markdown TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de projetos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  demo_link TEXT,
  github_link TEXT,
  download_link TEXT,
  technologies TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

3. Habilite Row Level Security (RLS) em cada tabela
4. Crie políticas de segurança (já mostradas acima)

5. Crie um bucket de storage chamado "images":
- Vá para Storage no painel
- Crie bucket "images"
- Políticas: leitura pública, escrita apenas autenticada

VARIÁVEIS DE AMBIENTE PARA ASTRO:
Adicione no seu .env:
SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=SEU_ANON_KEY

SUPABASE É MAIS PODEROSO QUE FIREBASE:
- PostgreSQL completo (joins, views, funções)
- Melhor performance para queries complexas
- Storage integrado
- Realtime nativo
- Autenticação robusta
- E TUDO ISSO GRÁTIS!
*/

// ========================================
// FIREBASE CONFIGURATION - NOVO PROJETO (CASO QUEIRA MANTER)
// ========================================

// SUBSTITUA ESTAS CONFIGURAÇÕES PELAS DO SEU NOVO PROJETO FIREBASE
const FIREBASE_CONFIG_NEW = {
  apiKey: "SEU_API_KEY_AQUI",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

// EXEMPLO (NÃO USAR - apenas para referência):
const FIREBASE_CONFIG_EXAMPLE = {
  apiKey: "AIzaSyA...",
  authDomain: "portfolio-italo-2025.firebaseapp.com",
  projectId: "portfolio-italo-2025",
  storageBucket: "portfolio-italo-2025.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF123"
};

/*
PASSOS PARA OBTER ESSAS CONFIGURAÇÕES:

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Clique no ícone de engrenagem ⚙️ (Project Settings)
4. Na aba "General", desça até "Your apps"
5. Se não tiver app web, clique em "Add app" → Web
6. Copie o objeto firebaseConfig que aparece
7. Cole as informações acima substituindo "SEU_*_AQUI"

CREDENCIAIS DO USUÁRIO ADMIN:
- Email: admin@italo.dev  
- Senha: Italo2025Admin!

REGRAS FIRESTORE (aplicar no console):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública para posts e projetos publicados
    match /posts/{document} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    
    match /projects/{document} {
      allow read: if resource.data.status == 'published';  
      allow write: if request.auth != null;
    }
    
    // Permitir leitura pública para configurações
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Bloquear todo o resto por padrão
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

REGRAS STORAGE (aplicar no console):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
*/
