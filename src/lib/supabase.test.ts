import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllPublishedPosts, getPostBySlug, formatDate } from '../lib/supabase.js';

// Mock do Supabase
const mockSupabase = {
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

// Mock do módulo supabase
vi.mock('../lib/supabase.js', () => ({
  supabase: mockSupabase,
  getAllPublishedPosts: vi.fn(),
  getPostBySlug: vi.fn(),
  formatDate: vi.fn((timestamp) => {
    if (!timestamp) return 'Data não disponível';
    return new Date(timestamp).toLocaleDateString('pt-BR');
  })
}));

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

      mockSupabase.from().select().order.mockResolvedValue({
        data: mockPosts,
        error: null
      });

      const result = await getAllPublishedPosts();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('title', 'Test Post');
      expect(result[0]).toHaveProperty('slug', 'test-post');
    });

    it('deve retornar array vazio em caso de erro', async () => {
      mockSupabase.from().select().order.mockResolvedValue({
        data: [] as any,
        error: { message: 'Database error' } as any
      });

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

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockPost,
        error: null
      });

      const result = await getPostBySlug('test-post');

      expect(result).toHaveProperty('title', 'Test Post');
      expect(result).toHaveProperty('slug', 'test-post');
    });

    it('deve retornar null se post não encontrado', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null as any,
        error: { message: 'Not found' } as any
      });

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
