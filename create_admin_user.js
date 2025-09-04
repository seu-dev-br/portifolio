import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nattvkjaecceirxthizc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
);

async function createAdminUser() {
  console.log('🔍 Criando usuário administrador...');

  const { data, error } = await supabase.auth.signUp({
    email: 'admin@portifolio.com',
    password: 'admin123456'
  });

  if (error) {
    console.error('❌ Erro ao criar usuário:', error);
    return;
  }

  console.log('✅ Usuário criado com sucesso!');
  console.log('📧 Email:', data.user?.email);
  console.log('🔑 Senha: admin123456');
  console.log('⚠️ IMPORTANTE: Anote essas credenciais!');
}

createAdminUser();
