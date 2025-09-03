// Supabase configuration for Astro build process
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, hasValidSupabaseConfig } from './supabase-config.js';

// Supabase config - These will be set as environment variables during build
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || SUPABASE_CONFIG.url;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey;

// Lazy initialization of Supabase client
let supabaseClient = null;

function getSupabaseClient() {
    if (!supabaseClient) {
        // Validate required environment variables
        if (!hasValidSupabaseConfig() && !supabaseUrl.includes('placeholder')) {
            throw new Error(
                'Missing Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
            );
        }

        // During build, if we don't have valid config, create a mock client
        if (!hasValidSupabaseConfig()) {
            console.warn('⚠️ Using placeholder Supabase configuration during build');
            supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        } else {
            supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        }
    }
    return supabaseClient;
}

// Export the client getter for direct access
export const supabase = getSupabaseClient();

// Helper functions for fetching data during build
export async function getAllPublishedPosts() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching published posts:', error);
            return [];
        }

        return posts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            contentMarkdown: post.content_markdown,
            coverImage: post.cover_image,
            tags: post.tags || [],
            publishedAt: post.published_at,
            createdAt: post.created_at
        }));
    } catch (error) {
        console.error('Error fetching published posts:', error);
        return [];
    }
}

export async function getPostBySlug(slug) {
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
            publishedAt: posts.published_at,
            createdAt: posts.created_at
        };
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

export async function getAllPostSlugs() {
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
export function formatDate(timestamp) {
    if (!timestamp) return 'Data não disponível';

    const date = new Date(timestamp);

    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Helper function to get reading time estimate
export function getReadingTime(content) {
    if (!content) return '0 min';

    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return `${minutes} min`;
}

export { supabase };

// About Page Management Functions
export async function getAboutData() {
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

        return about.value;
    } catch (error) {
        console.error('Error fetching about data:', error);
        return null;
    }
}

export async function updateAboutData(data) {
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
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error updating about data:', error);
        return false;
    }
}

// Projects Management Functions
export async function getAllPublishedProjects() {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching published projects:', error);
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
        console.error('Error fetching published projects:', error);
        return [];
    }
}

export async function getProjectById(projectId) {
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
export async function uploadImage(file, bucket = 'images') {
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

        return { data, error: null };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { data: null, error };
    }
}

export function getImageUrl(path, bucket = 'images') {
    if (!path) return '';

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
}
