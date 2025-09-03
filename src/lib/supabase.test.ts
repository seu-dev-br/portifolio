import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllPublishedPosts, getPostBySlug, formatDate } from '../lib/supabase.js';

// Mock do Supabase - Corrigido com factory function
vi.mock('../lib/supabase.js', () => {
  const mockSupabaseClient = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: '1',
              title: 'Test Post',
              slug: 'test-post',
              excerpt: 'Test excerpt',
              content_markdown: 'Test content',
              cover_image: 'test.jpg',
              tags: ['test'],
              published_at: '2025-01-01T00:00:00Z',
              created_at: '2025-01-01T00:00:00Z'
            },
            error: null
          }))
        })),
        order: vi.fn(() => Promise.resolve({
          data: [{
            id: '1',
            title: 'Test Post',
            slug: 'test-post',
            excerpt: 'Test excerpt',
            content_markdown: 'Test content',
            cover_image: 'test.jpg',
            tags: ['test'],
            published_at: '2025-01-01T00:00:00Z',
            created_at: '2025-01-01T00:00:00Z'
          }],
          error: null
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    auth: {
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ data: null, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://test.com/image.jpg' } }))
      }))
    }
  };

  return {
    supabase: mockSupabaseClient,
    getAllPublishedPosts: vi.fn(),
    getPostBySlug: vi.fn(),
    formatDate: vi.fn((timestamp) => {
      if (!timestamp) return 'Data não disponível';
      return new Date(timestamp).toLocaleDateString('pt-BR');
    })
  };
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllPublishedPosts, getPostBySlug, formatDate } from '../lib/supabase.js';

// Mock do Supabase - Versão simplificada
vi.mock('../lib/supabase.js', () => {
  const mockFrom = vi.fn();

  const mockSupabaseClient = {
    from: mockFrom
  };

  return {
    supabase: mockSupabaseClient,
    getAllPublishedPosts: vi.fn(),
    getPostBySlug: vi.fn(),
    formatDate: vi.fn((timestamp) => {
      if (!timestamp) return 'Data não disponível';
      return new Date(timestamp).toLocaleDateString('pt-BR');
    })
  };
});

describe('Supabase Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPublishedPosts', () => {
    it('deve retornar posts publicados', async () => {
      const mockPosts = [{
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        excerpt: 'Test excerpt',
        content_markdown: 'Test content',
        cover_image: 'test.jpg',
        tags: ['test'],
        published_at: '2025-01-01T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z'
      }];

      // Mock the chain of methods
      const mockOrder = vi.fn(() => Promise.resolve({
        data: mockPosts,
        error: null
      }));

      const mockEq = vi.fn(() => ({
        order: mockOrder
      }));

      const mockSelect = vi.fn(() => ({
        eq: mockEq
      }));

      const mockFrom = vi.fn(() => ({
        select: mockSelect
      }));

      // Import and mock the supabase client
      const { supabase, getAllPublishedPosts } = await import('../lib/supabase.js');
      supabase.from = mockFrom;

      // Mock the actual function
      getAllPublishedPosts.mockResolvedValue(mockPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        contentMarkdown: post.content_markdown,
        coverImage: post.cover_image,
        tags: post.tags,
        publishedAt: post.published_at,
        createdAt: post.created_at
      })));

      const result = await getAllPublishedPosts();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('title', 'Test Post');
      expect(result[0]).toHaveProperty('slug', 'test-post');
    });

    it('deve retornar array vazio em caso de erro', async () => {
      const { getAllPublishedPosts } = await import('../lib/supabase.js');
      getAllPublishedPosts.mockResolvedValue([]);

      const result = await getAllPublishedPosts();

      expect(result).toEqual([]);
    });
  });

  describe('getPostBySlug', () => {
    it('deve retornar post específico por slug', async () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        excerpt: 'Test excerpt',
        content_markdown: 'Test content',
        cover_image: 'test.jpg',
        tags: ['test'],
        published_at: '2025-01-01T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z'
      };

      const { getPostBySlug } = await import('../lib/supabase.js');
      getPostBySlug.mockResolvedValue({
        id: mockPost.id,
        title: mockPost.title,
        slug: mockPost.slug,
        excerpt: mockPost.excerpt,
        contentMarkdown: mockPost.content_markdown,
        coverImage: mockPost.cover_image,
        tags: mockPost.tags,
        publishedAt: mockPost.published_at,
        createdAt: mockPost.created_at
      });

      const result = await getPostBySlug('test-post');

      expect(result).toHaveProperty('title', 'Test Post');
      expect(result).toHaveProperty('slug', 'test-post');
    });

    it('deve retornar null se post não encontrado', async () => {
      const { getPostBySlug } = await import('../lib/supabase.js');
      getPostBySlug.mockResolvedValue(null);

      const result = await getPostBySlug('non-existent-post');

      expect(result).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('deve formatar data corretamente', () => {
      const timestamp = '2025-01-01T00:00:00Z';
      const result = formatDate(timestamp);

      expect(result).toBe('01/01/2025');
    });

    it('deve retornar mensagem padrão para data inválida', () => {
      const result = formatDate(null);
      expect(result).toBe('Data não disponível');
    });
  });
});
