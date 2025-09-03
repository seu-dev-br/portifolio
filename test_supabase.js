// Teste rápido do Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');

    // Teste básico de conexão
    const { data, error } = await supabase.from('posts').select('count').limit(1);

    if (error) {
      console.error('❌ Erro na conexão:', error);
    } else {
      console.log('✅ Conexão com Supabase funcionando!');
      console.log('📊 Dados recebidos:', data);
    }
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testConnection();
