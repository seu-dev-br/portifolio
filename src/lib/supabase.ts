// Supabase configuration for Astro build process
import { createClient } from '@supabase/supabase-js';
import type {
  Post,
  Project,
  AboutData,
  HomeData,
  SupabaseResponse,
  FileUploadResult
} from './types';

// Supabase config - These will be set as environment variables during build
const supabaseUrl = (import.meta as any).env?.PUBLIC_SUPABASE_URL ||
                   (import.meta as any).env?.SUPABASE_URL ||
                   process.env.SUPABASE_URL ||
                   'https://nattvkjaecceirxthizc.supabase.co';

const supabaseAnonKey = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY ||
                       (import.meta as any).env?.SUPABASE_ANON_KEY ||
                       process.env.SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

// Create Supabase client directly
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for fetching data during build
export async function getAllPublishedPosts(): Promise<Post[]> {
    try {
        console.log('🔍 [getAllPublishedPosts] Buscando posts com status="published"...');
        
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('❌ [getAllPublishedPosts] Erro ao buscar posts:', error);
            return [];
        }

        console.log(`✅ [getAllPublishedPosts] ${posts?.length || 0} posts encontrados`);
        if (posts && posts.length > 0) {
            console.log('📝 [getAllPublishedPosts] Posts:', posts.map(p => ({ id: p.id, title: p.title, status: p.status })));
        }

        return posts.map(post => ({
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
    } catch (error) {
        console.error('Error fetching published posts:', error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error || !posts) {
            return null;
        }

        return {
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            excerpt: posts.excerpt,
            contentMarkdown: posts.content_markdown,
            coverImage: posts.cover_image,
            tags: posts.tags || [],
            status: posts.status,
            publishedAt: posts.published_at,
            createdAt: posts.created_at
        };
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

export async function getAllPostSlugs(): Promise<string[]> {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('slug')
            .eq('status', 'published');

        if (error) {
            console.error('Error fetching post slugs:', error);
            return [];
        }

        return posts.map(post => post.slug).filter(Boolean);
    } catch (error) {
        console.error('Error fetching post slugs:', error);
        return [];
    }
}

// Helper function to format dates
export function formatDate(timestamp: string | null | undefined): string {
    if (!timestamp) return 'Data não disponível';

    const date = new Date(timestamp);

    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Helper function to get reading time estimate
export function getReadingTime(content: string | null | undefined): string {
    if (!content) return '0 min';

    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return `${minutes} min`;
}

// About Page Management Functions
// Helper function to convert comma-separated strings to arrays
function parseSkills(skills: any): { frontend: string[]; backend: string[]; database: string[]; tools: string[] } {
    return {
        frontend: typeof skills?.frontend === 'string' ? skills.frontend.split(',').map((s: string) => s.trim()).filter(Boolean) : skills?.frontend || [],
        backend: typeof skills?.backend === 'string' ? skills.backend.split(',').map((s: string) => s.trim()).filter(Boolean) : skills?.backend || [],
        database: typeof skills?.database === 'string' ? skills.database.split(',').map((s: string) => s.trim()).filter(Boolean) : skills?.database || [],
        tools: typeof skills?.tools === 'string' ? skills.tools.split(',').map((s: string) => s.trim()).filter(Boolean) : skills?.tools || []
    };
}

export async function getAboutData(): Promise<AboutData | null> {
    try {
        const { data: about, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'about')
            .single();

        if (error || !about) {
            // Return default data if no document exists
            return {
                bio: 'Olá! Sou um desenvolvedor full stack apaixonado por criar soluções digitais inovadoras.',
                profileImage: '',
                skills: {
                    frontend: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Astro'],
                    backend: ['Node.js', 'Python', 'PHP', 'Express.js', 'FastAPI', 'Laravel'],
                    database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis'],
                    tools: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code']
                },
                experience: [],
                education: [],
                certifications: [],
                socialLinks: {
                    github: 'https://github.com/Ganjamanbr',
                    linkedin: '',
                    twitter: '',
                    email: 'italo.antonio@exemplo.com'
                }
            };
        }

        // Parse the data and convert skills strings to arrays
        const rawData = about.value;
        const processedData = {
            ...rawData,
            skills: parseSkills(rawData.skills)
        };

        return processedData;
    } catch (error) {
        console.error('Error fetching about data:', error);
        return null;
    }
}

export async function updateAboutData(data: Partial<AboutData>): Promise<SupabaseResponse<void>> {
    try {
        const { error } = await supabase
            .from('settings')
            .upsert({
                key: 'about',
                value: {
                    ...data,
                    updatedAt: new Date().toISOString()
                }
            });

        if (error) {
            console.error('Error updating about data:', error);
            return { data: null, error };
        }

        return { data: undefined, error: null };
    } catch (error) {
        console.error('Error updating about data:', error);
        return { data: null, error: error as Error };
    }
}

// Home Page Management Functions
export async function getHomeData(): Promise<HomeData> {
    try {
        const { data: home, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'home')
            .single();

        if (error || !home) {
            // Return default data if no document exists
            return {
                hero: {
                    title: 'Olá, eu sou Ítalo Antonio',
                    subtitle: 'Desenvolvedor Full Stack',
                    description: 'Criando experiências digitais excepcionais com tecnologias modernas e melhores práticas de desenvolvimento. Especializado em React, Node.js e soluções escaláveis.',
                    ctaPrimary: 'Ver Projetos',
                    ctaSecondary: 'Entrar em Contato'
                },
                slider: {
                    enabled: false,
                    autoplay: true,
                    delay: 5000,
                    items: []
                },
                featured: {
                    title: 'Projetos em Destaque',
                    description: 'Alguns dos meus trabalhos mais recentes e desafiadores',
                    count: 3
                },
                posts: {
                    title: 'Últimas Publicações',
                    description: 'Confira minhas últimas publicações no blog',
                    count: 3
                }
            };
        }

        return home.value;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return {
            hero: {
                title: 'Olá, eu sou Ítalo Antonio',
                subtitle: 'Desenvolvedor Full Stack',
                description: 'Apaixonado por criar soluções digitais inovadoras',
                ctaPrimary: 'Ver Projetos',
                ctaSecondary: 'Sobre Mim'
            },
            slider: {
                enabled: true,
                autoplay: true,
                delay: 5000,
                items: []
            },
            featured: {
                title: 'Projetos em Destaque',
                description: 'Alguns dos meus trabalhos mais recentes',
                count: 6
            },
            posts: {
                title: 'Últimos Posts',
                description: 'Compartilhando conhecimento e experiências',
                count: 3
            }
        };
    }
}

export async function updateHomeData(data: Partial<HomeData>): Promise<SupabaseResponse<void>> {
    try {
        const { error } = await supabase
            .from('settings')
            .upsert({
                key: 'home',
                value: {
                    ...data,
                    updatedAt: new Date().toISOString()
                }
            });

        if (error) {
            console.error('Error updating home data:', error);
            return { data: null, error };
        }

        return { data: undefined, error: null };
    } catch (error) {
        console.error('Error updating home data:', error);
        return { data: null, error: error as Error };
    }
}

// Projects Management Functions
export async function getAllPublishedProjects() {
    try {
        console.log('🔍 [getAllPublishedProjects] Buscando projetos com status="published"...');
        
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('❌ [getAllPublishedProjects] Erro ao buscar projetos:', error);
            return [];
        }

        console.log(`✅ [getAllPublishedProjects] ${projects?.length || 0} projetos encontrados`);
        if (projects && projects.length > 0) {
            console.log('📁 [getAllPublishedProjects] Projetos:', projects.map(p => ({ id: p.id, title: p.title, status: p.status })));
        }

        return projects.map(project => ({
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
    } catch (error) {
        console.error('Error fetching published projects:', error);
        return [];
    }
}

export async function getComingSoonProjects() {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'coming_soon')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching coming soon projects:', error);
            return [];
        }

        return projects.map(project => ({
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
    } catch (error) {
        console.error('Error fetching coming soon projects:', error);
        return [];
    }
}

export async function getAllProjects() {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .in('status', ['published', 'coming_soon'])
            .order('status', { ascending: false })
            .order('published_at', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all projects:', error);
            return [];
        }

        return projects.map(project => ({
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
    } catch (error) {
        console.error('Error fetching all projects:', error);
        return [];
    }
}

export async function getProjectById(projectId: string): Promise<Project | null> {
    try {
        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (error || !project) {
            return null;
        }

        return {
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
        };
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        return null;
    }
}

// Storage helper functions for images
export async function uploadImage(file: File, bucket = 'images'): Promise<SupabaseResponse<string>> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            return { data: null, error };
        }

        return { data: data.path, error: null };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { data: null, error: error as Error };
    }
}

export function getImageUrl(path: string, bucket = 'images'): string {
    if (!path) return '';

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
}
