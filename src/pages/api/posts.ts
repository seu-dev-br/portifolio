// src/pages/api/posts.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async ({ url }) => {
    try {
        console.log('📡 API Posts: Recebendo requisição para posts...');

        // Parâmetros de query
        const limit = parseInt(url.searchParams.get('limit') || '3');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const slug = url.searchParams.get('slug');

        let query = supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        // Se for um post específico por slug
        if (slug) {
            query = query.eq('slug', slug).limit(1);
        } else {
            query = query.range(offset, offset + limit - 1);
        }

        const { data: posts, error } = await query;

        if (error) {
            console.error('❌ Erro ao buscar posts:', error);
            return new Response(JSON.stringify({
                success: false,
                error: 'Erro ao buscar posts',
                timestamp: new Date().toISOString()
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Formatar os dados para o frontend
        const formattedPosts = posts?.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content_markdown: post.content_markdown,
            cover_image: post.cover_image,
            tags: post.tags || [],
            published_at: post.published_at,
            created_at: post.created_at
        })) || [];

        console.log(`✅ API Posts: Retornados ${formattedPosts.length} posts`);

        return new Response(JSON.stringify({
            success: true,
            data: slug ? formattedPosts[0] || null : formattedPosts,
            meta: {
                total: formattedPosts.length,
                limit: slug ? 1 : limit,
                offset: slug ? 0 : offset
            },
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });

    } catch (error) {
        console.error('❌ API Posts: Erro interno:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Erro interno do servidor',
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
