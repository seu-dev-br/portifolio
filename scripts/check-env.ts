#!/usr/bin/env node

/**
 * Script de verificação de ambiente para build
 * Executado automaticamente antes do comando npm run build
 */

// Carregar variáveis de ambiente do arquivo .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

console.log('🔍 Verificando variáveis de ambiente...\n');

// Verificar variáveis do Supabase
const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.SUPABASE_ANON_KEY;

console.log('📋 Variáveis encontradas:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ Definida' : '❌ Ausente'}`);
console.log(`   SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Definida' : '❌ Ausente'}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ ERRO: Variáveis de ambiente do Supabase não encontradas!');
  console.log('\n📝 Para corrigir:');
  console.log('1. No Vercel Dashboard:');
  console.log('   - Vá para Project Settings → Environment Variables');
  console.log('   - Adicione:');
  console.log('     SUPABASE_URL=https://[seu-project-ref].supabase.co');
  console.log('     SUPABASE_ANON_KEY=[sua-chave-anon]');
  console.log('\n2. Ou crie um arquivo .env.local com:');
  console.log('   SUPABASE_URL=https://[seu-project-ref].supabase.co');
  console.log('   SUPABASE_ANON_KEY=[sua-chave-anon]');

  process.exit(1);
}

console.log('\n✅ Todas as variáveis de ambiente estão configuradas!');
console.log('🚀 Prosseguindo com o build...\n');

// Garantir que o script termine com sucesso para continuar o build
process.exit(0);
