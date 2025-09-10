// Arquivo para expor configurações do Supabase para componentes client-side
const SUPABASE_URL: string = import.meta.env.PUBLIC_SUPABASE_URL || 'https://nattvkjaecceirxthizc.supabase.co';
const SUPABASE_ANON_KEY: string = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

export {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
};
