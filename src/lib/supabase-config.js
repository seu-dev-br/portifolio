// Build-time configuration for Supabase
// This file provides fallback values during build when environment variables are not available

export const SUPABASE_CONFIG = {
  url: process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key'
};

// Check if we have valid configuration
export function hasValidSupabaseConfig() {
  // Tentar obter variáveis do Astro
  const clientUrl = typeof import.meta !== 'undefined' ? 
    import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL : null;
  const clientKey = typeof import.meta !== 'undefined' ? 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY : null;
    
  // Tentar obter variáveis do Node.js
  const serverUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serverKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  
  // Usar o primeiro valor não-nulo
  const url = clientUrl || serverUrl;
  const key = clientKey || serverKey;
  
  return Boolean(
    url && key && 
    url !== 'https://placeholder.supabase.co' &&
    key !== 'placeholder-key'
  );
}
