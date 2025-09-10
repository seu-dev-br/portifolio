-- SQL para inserir dados de teste na tabela settings
-- Execute estes comandos no SQL Editor do seu projeto Supabase

-- Inserir configurações da página inicial (home)
INSERT INTO settings (key, value, updated_at) VALUES (
  'home',
  '{
    "hero": {
      "title": "Olá, eu sou Ítalo Antonio",
      "subtitle": "Desenvolvedor Full Stack",
      "description": "Criando experiências digitais excepcionais com paixão por tecnologia e inovação.",
      "ctaPrimary": "Ver Projetos",
      "ctaSecondary": "Entrar em Contato"
    },
    "slider": {
      "enabled": true,
      "autoplay": true,
      "delay": 5000
    },
    "featured": {
      "title": "Projetos em Destaque",
      "description": "Alguns dos meus trabalhos mais recentes...",
      "count": 3
    },
    "posts": {
      "title": "Últimas Publicações",
      "description": "Confira minhas últimas publicações...",
      "count": 3
    }
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Inserir configurações da página sobre (about)
INSERT INTO settings (key, value, updated_at) VALUES (
  'about',
  '{
    "bio": "Desenvolvedor Full Stack apaixonado por criar soluções tecnológicas inovadoras. Com experiência em desenvolvimento web e mobile, busco sempre entregar produtos de alta qualidade que fazem a diferença na vida das pessoas.",
    "profileImage": "https://example.com/profile.jpg",
    "skills": {
      "frontend": "HTML5, CSS3, JavaScript, TypeScript, React, Vue.js, Angular",
      "backend": "Node.js, Python, PHP, Java, C#",
      "database": "PostgreSQL, MySQL, MongoDB, Redis",
      "tools": "Git, Docker, AWS, Linux, VS Code"
    },
    "social": {
      "github": "https://github.com/seu-usuario",
      "linkedin": "https://linkedin.com/in/seu-perfil",
      "twitter": "https://twitter.com/seu-usuario",
      "email": "contato@italoantonio.dev",
      "city": "São Paulo, SP",
      "phone": "+55 (11) 99999-9999"
    }
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Verificar se os dados foram inseridos
SELECT key, value FROM settings WHERE key IN ('home', 'about');
