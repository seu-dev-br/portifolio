import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 [API /api/posts.json] Buscando posts...');
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ [API /api/posts.json] Erro:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    console.log(`✅ [API /api/posts.json] ${posts?.length || 0} posts encontrados`);

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      contentMarkdown: post.content_markdown,
      coverImage: post.cover_image,
      tags: post.tags || [],
      status: post.status,
      publishedAt: post.published_at,
      createdAt: post.created_at
    }));

    return new Response(JSON.stringify(formattedPosts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('❌ [API /api/posts.json] Erro crítico:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
