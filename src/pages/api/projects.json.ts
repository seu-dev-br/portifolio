import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 [API /api/projects.json] Buscando projetos...');
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ [API /api/projects.json] Erro:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    console.log(`✅ [API /api/projects.json] ${projects?.length || 0} projetos encontrados`);

    const formattedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      demoLink: project.demo_link,
      githubLink: project.github_link,
      downloadLink: project.download_link,
      technologies: project.technologies || [],
      status: project.status,
      publishedAt: project.published_at,
      createdAt: project.created_at
    }));

    return new Response(JSON.stringify(formattedProjects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('❌ [API /api/projects.json] Erro crítico:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
