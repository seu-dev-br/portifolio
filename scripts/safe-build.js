#!/usr/bin/env node

/**
 * Script de build seguro com tratamento de erros
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

console.log('🚀 Iniciando build seguro...\n');

try {
  // Verificar variáveis de ambiente
  console.log('🔍 Verificando variáveis de ambiente...');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variáveis de ambiente do Supabase não encontradas');
  }

  console.log('✅ Variáveis OK');

  // Executar build do Astro
  console.log('🏗️  Executando build do Astro...');
  execSync('npx astro build', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ Build concluído com sucesso!');

} catch (error) {
  console.error('❌ Erro durante o build:');
  console.error(error.message);

  if (error.stdout) {
    console.log('STDOUT:', error.stdout.toString());
  }

  if (error.stderr) {
    console.error('STDERR:', error.stderr.toString());
  }

  process.exit(1);
}
