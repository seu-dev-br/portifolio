import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

export const GET: APIRoute = async ({ request }) => {
  if (!supabase) {
    console.warn('[api/posts.json] Variáveis SUPABASE_URL/SUPABASE_ANON_KEY não configuradas. Retornando lista vazia.');
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache'
      }
    });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number.parseInt(searchParams.get('limit') ?? '', 10);
  const featuredParam = searchParams.get('featured');

  console.log('[api/posts.json] Iniciando busca de posts publicados.', {
    limit: Number.isNaN(limitParam) ? null : limitParam,
    featured: featuredParam ?? null
  });

  let query = supabase
    .from('posts')
    .select(
      'id, title, slug, summary, content_markdown, tags, thumbnail_url, featured, published_at, created_at, updated_at'
    )
    .eq('status', 'published')
  .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (!Number.isNaN(limitParam) && limitParam > 0) {
    query = query.limit(limitParam);
  }

  if (featuredParam === 'true') {
    query = query.eq('featured', true);
  } else if (featuredParam === 'false') {
    query = query.eq('featured', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[api/posts.json] Erro ao buscar posts:', error);
    return new Response(JSON.stringify({ error: 'Falha ao carregar posts publicados.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const payload = (data ?? []).map((post) => ({
    id: post.id,
    title: post.title ?? '',
    slug: post.slug ?? '',
    summary: post.summary ?? '',
    excerpt: post.summary ?? '',
    contentMarkdown: post.content_markdown ?? '',
    tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : [],
    thumbnailUrl: post.thumbnail_url ?? null,
    coverImage: post.thumbnail_url ?? null,
    featured: Boolean(post.featured),
    publishedAt: post.published_at ?? post.created_at ?? null,
    createdAt: post.created_at ?? null,
    updatedAt: post.updated_at ?? null
  }));

  console.log('[api/posts.json] Posts encontrados:', payload.length);

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache'
    }
  });
};
