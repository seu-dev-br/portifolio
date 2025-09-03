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
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

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

  console.log('\n2. No GitHub (para CI/CD):');
  console.log('   - Vá para Settings → Secrets and variables → Actions');
  console.log('   - Adicione os secrets: SUPABASE_URL e SUPABASE_ANON_KEY');

  console.log('\n3. Localmente:');
  console.log('   - Crie arquivo .env.local com as variáveis');

  console.log('\n⚠️  Build será executado com configuração placeholder');
  console.log('   Funcionalidades do Supabase podem não funcionar corretamente\n');

  // Não sair com erro para permitir build com placeholder
  process.exit(0);
}

console.log('\n✅ Todas as variáveis de ambiente estão configuradas!');
console.log('🚀 Prosseguindo com o build...\n');

// Garantir que o script termine com sucesso para continuar o build
process.exit(0);
