// Types for the Portfolio Project
// This file contains all TypeScript interfaces and types used throughout the application

import type { SupabaseClient } from '@supabase/supabase-js';

// Database Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  demoLink?: string;
  githubLink?: string;
  downloadLink?: string;
  technologies: string[];
  status: 'draft' | 'published' | 'archived' | 'coming_soon';
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

// Settings Types
export interface AboutData {
  bio: string;
  profileImage?: string;
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    tools: string[];
  };
  experience: Experience[];
  education: Education[];
  certifications: string[];
  socialLinks: SocialLinks;
  gallery?: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  category?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  description: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  technologies?: string[];
  year?: string; // Para compatibilidade com dados mockados
  period?: string; // Para compatibilidade com dados mockados
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email: string;
  phone?: string;
  city?: string;
}

export interface HomeData {
  hero: HeroSection;
  slider: SliderSection;
  featured: FeaturedSection;
  posts: PostsSection;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface SliderSection {
  enabled: boolean;
  autoplay: boolean;
  delay: number;
  items: SliderItem[];
}

export interface SliderItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  order: number;
  subtitle?: string; // Para compatibilidade com dados mockados
}

export interface FeaturedSection {
  title: string;
  description: string;
  count: number;
}

export interface PostsSection {
  title: string;
  description: string;
  count: number;
}

// Supabase Configuration Types
export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// API Response Types
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// Utility Types
export type Status = 'draft' | 'published' | 'archived';
export type ContactStatus = 'unread' | 'read' | 'replied';

// File Upload Types
export interface FileUploadResult {
  path: string;
  fullPath: string;
  id: string;
}

export interface ImageUploadOptions {
  bucket?: string;
  folder?: string;
  fileName?: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminStats {
  projects: number;
  posts: number;
  messages: number;
  visits: number;
}

// Analytics Types
export interface PageView {
  id: string;
  page: string;
  userAgent?: string;
  ip?: string;
  timestamp: string;
}

// Newsletter Types
export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  status: 'active' | 'unsubscribed';
}

// Search Types
export interface SearchResult {
  type: 'post' | 'project';
  id: string;
  title: string;
  excerpt?: string;
  slug?: string;
  publishedAt?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
  message?: string;
}

// Type Guards
export function isPost(obj: any): obj is Post {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.excerpt === 'string' &&
    typeof obj.contentMarkdown === 'string' &&
    Array.isArray(obj.tags) &&
    typeof obj.status === 'string' &&
    typeof obj.createdAt === 'string';
}

export function isProject(obj: any): obj is Project {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.technologies) &&
    typeof obj.status === 'string' &&
    typeof obj.createdAt === 'string';
}

export function isContactMessage(obj: any): obj is ContactMessage {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.subject === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.status === 'string';
}

// Global type declarations for window object extensions
declare global {
  interface Window {
    supabase: SupabaseClient;
    supabaseInitialized: boolean;
    FeedbackSystem: {
      showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
      addFocusEnhancement: () => void;
    };
    showToast: (message: string, type?: string) => void;
  }
}
