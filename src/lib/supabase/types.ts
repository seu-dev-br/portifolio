// src/lib/supabase/types.ts
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

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
