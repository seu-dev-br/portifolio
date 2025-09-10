// src/pages/api/projects.ts
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
        console.log('📡 API Projects: Recebendo requisição para projetos...');

        // Parâmetros de query
        const limit = parseInt(url.searchParams.get('limit') || '6');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const featured = url.searchParams.get('featured') === 'true';

        let query = supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Se for para projetos em destaque, ordenar por data de criação
        if (featured) {
            query = query.order('created_at', { ascending: false });
        }

        const { data: projects, error } = await query;

        if (error) {
            console.error('❌ Erro ao buscar projetos:', error);
            return new Response(JSON.stringify({
                success: false,
                error: 'Erro ao buscar projetos',
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
        const formattedProjects = projects?.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            technologies: project.technologies || [],
            demo_link: project.demo_link,
            github_link: project.github_link,
            download_link: project.download_link,
            image: project.image,
            published_at: project.published_at,
            created_at: project.created_at
        })) || [];

        console.log(`✅ API Projects: Retornados ${formattedProjects.length} projetos`);

        return new Response(JSON.stringify({
            success: true,
            data: formattedProjects,
            meta: {
                total: formattedProjects.length,
                limit,
                offset
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
        console.error('❌ API Projects: Erro interno:', error);

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
