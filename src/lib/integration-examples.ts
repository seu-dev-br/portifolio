// ===========================================
// EXEMPLO: Como integrar nas páginas existentes
// ===========================================

/**
 * Este arquivo mostra como adicionar a integração
 * das configurações do admin nas páginas públicas
 * SEM MODIFICAR a estrutura existente das páginas.
 */

// ===========================================
// MÉTODO 1: Adicionar no final de index.astro
// ===========================================

/*
Adicione estas linhas ANTES do </Layout> no final do arquivo:

---

// ...existing code...

</Layout>

<script>
  // Integrar configurações dinâmicas do admin
  import settingsIntegrator from '../lib/integrate-settings';
  // O script se inicializa automaticamente quando o DOM estiver pronto
</script>

<style>
  // ...existing styles...
</style>
*/

// ===========================================
// MÉTODO 2: Adicionar no final de sobre.astro
// ===========================================

/*
Adicione estas linhas no final do arquivo sobre.astro:

---

// ...existing code...

</Layout>

<script>
  // Integrar configurações dinâmicas do admin
  import settingsIntegrator from '../lib/integrate-settings';
</script>

*/

// ===========================================
// MÉTODO 3: Para páginas HTML puras (se existirem)
// ===========================================

/*
Adicione esta linha no final do <body>:

<body>
  <!-- ...existing content... -->

  <script type="module" src="/lib/integrate-settings.ts"></script>
</body>
*/

// ===========================================
// MÉTODO 4: Inclusão condicional (avançado)
// ===========================================

/*
Para incluir apenas em certas condições:

---

// ...existing code...

</Layout>

<script>
  // Verificar se estamos em produção ou se o usuário tem permissão
  const shouldLoadSettings = import.meta.env.PROD || localStorage.getItem('enable-settings-integration') === 'true';

  if (shouldLoadSettings) {
    import('../lib/integrate-settings');
  }
</script>

*/

// ===========================================
// MÉTODO 5: Com configuração personalizada
// ===========================================

/*
Para personalizar a integração por página:

---

// ...existing code...

</Layout>

<script>
  // Importar e configurar
  import settingsIntegrator from '../lib/integrate-settings';
  import settingsConfig from '../lib/settings-config';

  // Personalizar seletores para esta página específica
  settingsConfig.updateConfig({
    pages: {
      home: {
        selectors: {
          title: '.hero-title-custom', // seletor personalizado
          description: '.hero-description-custom'
        }
      }
    }
  });
</script>

*/

// ===========================================
// VERIFICAÇÃO DE FUNCIONAMENTO
// ===========================================

/*
Após adicionar o script, você pode verificar no console do navegador:

1. Abra o console (F12)
2. Navegue até a página
3. Procure por logs como:
   - "🚀 Carregando configurações do admin..."
   - "✅ Configurações carregadas:"
   - "📡 Fazendo requisição para: /api/settings"

4. Teste as funções globais:
   - window.frontendAPI.getSettings()
   - window.settingsIntegrator
   - window.settingsConfig

5. Modifique algo no admin e veja as mudanças refletirem
   automaticamente na página (com cache de 5 minutos)
*/

// ===========================================
// ELEMENTOS QUE SERÃO ATUALIZADOS AUTOMATICAMENTE
// ===========================================

/*
O sistema procura e atualiza automaticamente estes elementos:

🏠 PÁGINA INICIAL:
- .hero-title, h1, .main-title → Título do hero
- .hero-subtitle, .subtitle, h2 → Subtítulo
- .hero-description, .description, p → Descrição
- .featured-title, .projects-title → Título projetos
- .featured-description, .projects-description → Descrição projetos
- .posts-title, .blog-title → Título posts
- .posts-description, .blog-description → Descrição posts

👤 PÁGINA SOBRE:
- .about-title, h1 → Título da página
- .about-description, .bio → Biografia
- .profile-image, .about-image → Imagem de perfil
- .skills-frontend, .frontend-skills → Skills frontend
- .skills-backend, .backend-skills → Skills backend
- .skills-database, .database-skills → Skills database
- .skills-tools, .tools-skills → Skills ferramentas
- .social-github, .social-linkedin, etc. → Links sociais

🎠 SLIDER:
- Configurado automaticamente baseado nas settings
- Habilita/desabilita autoplay
- Controla delay entre slides

📊 CONTEÚDO DINÂMICO:
- Projetos em destaque (carregados do banco)
- Posts recentes (carregados do banco)
- Contadores e limites respeitados
*/

// ===========================================
// DICAS PARA DESENVOLVIMENTO
// ===========================================

/*
1. Sempre teste no console primeiro:
   window.frontendAPI.getSettings()

2. Use seletores CSS específicos para evitar conflitos

3. O cache dura 5 minutos por padrão, mas pode ser alterado:
   window.frontendAPI.setCacheDuration(1) // 1 minuto

4. Para debug detalhado:
   window.settingsConfig.updateConfig({
     debug: { enabled: true, logLevel: 'debug' }
   })

5. Resetar tudo se necessário:
   window.settingsConfig.resetToDefault()
   window.frontendAPI.clearCache()

6. Verificar se as configurações estão sendo aplicadas:
   - Abra o admin e modifique algo
   - Aguarde ou limpe o cache
   - Recarregue a página pública
   - As mudanças devem aparecer automaticamente
*/

// ===========================================
// EXEMPLO COMPLETO PARA INDEX.ASTRO
// ===========================================

/*
Este é um exemplo completo de como ficaria o final do index.astro:

---

// ...existing code...

</Layout>

<script>
  // ===========================================
  // INTEGRAÇÃO COM CONFIGURAÇÕES DO ADMIN
  // ===========================================
  // Este script carrega automaticamente as configurações
  // salvas no painel admin e aplica na página pública

  import settingsIntegrator from '../lib/integrate-settings';

  // Opcional: Configurações específicas para esta página
  import settingsConfig from '../lib/settings-config';

  // Exemplo: Personalizar seletores se necessário
  settingsConfig.updateConfig({
    pages: {
      home: {
        selectors: {
          // Use os seletores exatos da sua página
          title: '.hero-title, h1',
          description: '.hero-description'
        }
      }
    }
  });
</script>

<style>
  // ...existing styles...
</style>
*/

export {}; // Este arquivo é apenas para documentação
