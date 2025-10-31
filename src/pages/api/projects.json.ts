import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Criar cliente Supabase direto aqui (sem dependências)
const supabaseUrl = 'https://nattvkjaecceirxthizc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
  console.log('🔍 [API] Buscando projetos...');
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro:', error);
    return new Response(JSON.stringify({ error: error.message, projects: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log(`✅ ${data?.length || 0} projetos`);
  
  return new Response(JSON.stringify(data || []), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
};
