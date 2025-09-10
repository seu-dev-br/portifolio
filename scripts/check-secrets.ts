#!/usr/bin/env node

/**
 * Script para verificar se os secrets necessários estão configurados
 * Este script ajuda a identificar quais secrets estão faltando
 */

console.log('🔍 Verificando configuração de secrets...\n');

// Lista de secrets necessários
const requiredSecrets: string[] = [
  'VERCEL_TOKEN',
  'VERCEL_ORG_ID',
  'VERCEL_PROJECT_ID',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

console.log('📋 Secrets necessários para o workflow:');
console.log('=====================================');

let allConfigured: boolean = true;

requiredSecrets.forEach((secret: string) => {
  const value: string | undefined = process.env[secret];
  const status: string = value ? '✅ Configurado' : '❌ Ausente';

  console.log(`${secret.padEnd(20)}: ${status}`);

  if (!value) {
    allConfigured = false;
  }
});

console.log('\n=====================================');

if (allConfigured) {
  console.log('✅ Todos os secrets estão configurados!');
  console.log('🚀 O workflow deve funcionar corretamente.');
} else {
  console.log('❌ Alguns secrets estão faltando!');
  console.log('\n📝 Para corrigir:');
  console.log('1. Vá para o repositório no GitHub');
  console.log('2. Settings → Secrets and variables → Actions');
  console.log('3. Adicione os secrets faltantes');
  console.log('4. Consulte GITHUB_SECRETS_SETUP.md para instruções detalhadas');
}

console.log('\n💡 Dica: Você pode testar este script localmente com:');
console.log('   VERCEL_TOKEN=test VERCEL_ORG_ID=test ... npm run check-secrets');
