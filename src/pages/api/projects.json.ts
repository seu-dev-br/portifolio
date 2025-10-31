import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

export const GET: APIRoute = async ({ request }) => {
  if (!supabase) {
    console.warn('[api/projects.json] Variáveis SUPABASE_URL/SUPABASE_ANON_KEY não configuradas. Retornando lista vazia.');
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

  console.log('[api/projects.json] Iniciando busca de projetos publicados.', {
    limit: Number.isNaN(limitParam) ? null : limitParam,
    featured: featuredParam ?? null
  });

  let query = supabase
    .from('projects')
    .select(
      'id, title, slug, description, technologies, thumbnail_url, link_url, repo_url, featured, published_at, created_at, updated_at'
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
    console.error('[api/projects.json] Erro ao buscar projetos:', error);
    return new Response(JSON.stringify({ error: 'Falha ao carregar projetos publicados.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const payload = (data ?? []).map((project) => ({
    id: project.id,
    title: project.title ?? '',
    slug: project.slug ?? '',
    description: project.description ?? '',
    technologies: Array.isArray(project.technologies) ? project.technologies.filter(Boolean) : [],
    thumbnailUrl: project.thumbnail_url ?? null,
    demoUrl: project.link_url ?? null,
    repoUrl: project.repo_url ?? null,
    featured: Boolean(project.featured),
    publishedAt: project.published_at ?? project.created_at ?? null,
    createdAt: project.created_at ?? null,
    updatedAt: project.updated_at ?? null
  }));

  console.log('[api/projects.json] Projetos encontrados:', payload.length);

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache'
    }
  });
};
