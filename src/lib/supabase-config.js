// Build-time configuration for Supabase
// This file provides fallback values during build when environment variables are not available

export const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-key'
};

// Check if we have valid configuration
export function hasValidSupabaseConfig() {
  return Boolean(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_ANON_KEY &&
    process.env.SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    process.env.SUPABASE_ANON_KEY !== 'placeholder-key'
  );
}
