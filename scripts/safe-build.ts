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
  const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
  const supabaseAnonKey: string | undefined = process.env.SUPABASE_ANON_KEY;

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

} catch (error: unknown) {
  let message = 'Erro desconhecido';
  if (error instanceof Error) message = error.message;
  else if (typeof error === 'string') message = error;
  console.error('❌ Erro durante o build:');
  console.error(message);

  if (typeof error === 'object' && error && 'stdout' in error && error.stdout) {
    // @ts-ignore
    console.log('STDOUT:', error.stdout.toString());
  }

  if (typeof error === 'object' && error && 'stderr' in error && error.stderr) {
    // @ts-ignore
    console.error('STDERR:', error.stderr.toString());
  }

  process.exit(1);
}
// Arquivo removido (script de diagnóstico)
