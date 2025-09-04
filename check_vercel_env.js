import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

// Simular o comportamento do Astro no Vercel
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log('🌐 Simulação Vercel Environment:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅' : '❌', supabaseUrl);
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌', supabaseAnonKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ CRÍTICO: Variáveis não encontradas!');
    console.log('💡 SOLUÇÃO: Configure as variáveis no Vercel Dashboard');
    process.exit(1);
}

console.log('✅ Ambiente configurado corretamente para Vercel');
