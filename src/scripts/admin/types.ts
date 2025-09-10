// types.ts - Definições de tipos para o painel administrativo

// ==========================================
// IMPORTAÇÕES
// ==========================================

import type { SupabaseClient } from '@supabase/supabase-js';

// ==========================================
// TIPOS DE AUTENTICAÇÃO
// ==========================================

export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
}

// ==========================================
// TIPOS DE POST
// ==========================================

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  cover_image?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}

// ==========================================
// TIPOS DE PROJETO
// ==========================================

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  demo_link?: string;
  github_link?: string;
  download_link?: string;
  technologies: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// ==========================================
// EXTENSÕES DO WINDOW
// ==========================================

declare global {
  interface Window {
    supabase: SupabaseClient;
    supabaseInitialized: boolean;
    supabaseReady: CustomEvent;
    setupAdminEventListeners?: () => void;
    showError?: (message: string) => void;
    showSuccess?: (message: string) => void;
    showLoading?: (message?: string) => void;
    hideLoading?: () => void;
    FeedbackSystem: {
      showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
      addFocusEnhancement: () => void;
    };
    showToast: (message: string, type?: string) => void;
  }
}

export {};

export type { SupabaseClient };
