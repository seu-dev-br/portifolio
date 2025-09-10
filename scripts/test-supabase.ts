#!/usr/bin/env node

/**
 * Script de teste do Supabase
 * Verifica se a conexão com o banco está funcionando
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.SUPABASE_ANON_KEY;

console.log('🧪 Testando conexão com Supabase...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Variáveis de ambiente não encontradas!');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  process.exit(1);
}

console.log('📋 Credenciais encontradas:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
console.log();

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔗 Testando conexão básica...');

    // Teste básico - verificar tabelas disponíveis
    const { data: tables, error: tablesError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.log('⚠️  Erro ao acessar tabela posts:', tablesError.message);
      console.log('Código do erro:', tablesError.code);
      console.log('Detalhes:', tablesError.details);
    } else {
      console.log('✅ Tabela posts acessível!');
      console.log('Dados encontrados:', tables?.length || 0, 'registros');
    }

    // Teste de outra tabela possível
    console.log('\n� Testando tabela projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (projectsError) {
      console.log('⚠️  Erro ao acessar tabela projects:', projectsError.message);
    } else {
      console.log('✅ Tabela projects acessível!');
      console.log('Dados encontrados:', projects?.length || 0, 'registros');
    }

  } catch (err: unknown) {
    let message = 'Erro desconhecido';
    if (err instanceof Error) message = err.message;
    else if (typeof err === 'string') message = err;
    console.log('❌ Erro geral:', message);
  }
}

testConnection();
