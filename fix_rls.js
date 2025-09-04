import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nattvkjaecceirxthizc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
);

async function checkUsers() {
  console.log('🔍 Verificando usuários no Supabase Auth...');

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    console.log('💡 Isso pode indicar que estamos usando a chave anônima, não a chave de serviço');
    return;
  }

  console.log(`✅ Encontrados ${data.users.length} usuários:`);
  data.users.forEach(user => {
    console.log(`- ${user.email} (ID: ${user.id})`);
  });
}

async function createTestUser() {
  console.log('🔍 Criando usuário de teste...');

  const { data, error } = await supabase.auth.signUp({
    email: 'admin@teste.com',
    password: 'senha123'
  });

  if (error) {
    console.error('❌ Erro ao criar usuário:', error);
    return;
  }

  console.log('✅ Usuário criado:', data.user?.email);
}

async function createRLSPolicies() {
  console.log('🔧 Criando políticas RLS para projetos...');

  // Para usuários autenticados
  const policies = [
    {
      name: 'projects_select_policy',
      command: 'SELECT',
      using: 'auth.uid() IS NOT NULL'
    },
    {
      name: 'projects_insert_policy',
      command: 'INSERT',
      check: 'auth.uid() IS NOT NULL'
    },
    {
      name: 'projects_update_policy',
      command: 'UPDATE',
      using: 'auth.uid() IS NOT NULL',
      check: 'auth.uid() IS NOT NULL'
    },
    {
      name: 'projects_delete_policy',
      command: 'DELETE',
      using: 'auth.uid() IS NOT NULL'
    }
  ];

  for (const policy of policies) {
    try {
      // Usando SQL raw para criar políticas
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          DROP POLICY IF EXISTS ${policy.name} ON projects;
          CREATE POLICY ${policy.name} ON projects
          FOR ${policy.command}
          ${policy.using ? `USING (${policy.using})` : ''}
          ${policy.check ? `WITH CHECK (${policy.check})` : ''};
        `
      });

      if (error) {
        console.error(`❌ Erro ao criar política ${policy.name}:`, error);
      } else {
        console.log(`✅ Política ${policy.name} criada`);
      }
    } catch (err) {
      console.error(`❌ Erro ao criar política ${policy.name}:`, err);
    }
  }
}

// Executar as funções
await checkUsers();
// await createTestUser(); // Descomente se quiser criar um usuário
// await createRLSPolicies(); // Descomente se quiser criar políticas
