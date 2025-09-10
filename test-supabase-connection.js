// Teste de conexão com Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nattvkjaecceirxthizc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
);

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...');

    // Test projects table
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);

    if (projectsError) {
      console.log('❌ Erro na tabela projects:', projectsError.message);
    } else {
      console.log('✅ Projects table:', projects?.length || 0, 'registros encontrados');
      if (projects && projects.length > 0) {
        console.log('📋 Primeiro projeto:', projects[0]);
      }
    }

    // Test posts table
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(5);

    if (postsError) {
      console.log('❌ Erro na tabela posts:', postsError.message);
    } else {
      console.log('✅ Posts table:', posts?.length || 0, 'registros encontrados');
      if (posts && posts.length > 0) {
        console.log('📝 Primeiro post:', posts[0]);
      }
    }

    // Test contact_messages table
    const { data: messages, error: messagesError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(5);

    if (messagesError) {
      console.log('❌ Erro na tabela contact_messages:', messagesError.message);
    } else {
      console.log('✅ Contact messages table:', messages?.length || 0, 'registros encontrados');
      if (messages && messages.length > 0) {
        console.log('💬 Primeira mensagem:', messages[0]);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testConnection();
