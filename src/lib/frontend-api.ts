// src/lib/frontend-api.ts
// API client para o frontend consumir as configurações do admin

interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: any;
    timestamp: string;
    error?: string;
}

interface HomeSettings {
    hero: {
        title: string;
        subtitle: string;
        description: string;
        ctaPrimary?: string;
        ctaSecondary?: string;
    };
    slider: {
        enabled: boolean;
        autoplay: boolean;
        delay: number;
    };
    featured: {
        title: string;
        description: string;
        count: number;
    };
    posts: {
        title: string;
        description: string;
        count: number;
    };
}

interface AboutSettings {
    bio: string;
    profileImage: string;
    skills: {
        frontend: string;
        backend: string;
        database: string;
        tools: string;
    };
    social: {
        github: string;
        linkedin: string;
        twitter: string;
        instagram: string;
    };
}

interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    demo_link?: string;
    github_link?: string;
    download_link?: string;
    image?: string;
    published_at: string;
    created_at: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content_markdown?: string;
    cover_image?: string;
    tags: string[];
    published_at: string;
    created_at: string;
}

class FrontendAPI {
    private baseUrl: string;
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private cacheDuration = 5 * 60 * 1000; // 5 minutos em ms

    constructor() {
        // Detectar se estamos em desenvolvimento ou produção
        this.baseUrl = typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost:4321';
    }

    private async fetchWithCache<T>(endpoint: string): Promise<ApiResponse<T>> {
        const cacheKey = endpoint;
        const now = Date.now();

        // Verificar cache
        const cached = this.cache.get(cacheKey);
        if (cached && (now - cached.timestamp) < this.cacheDuration) {
            console.log(`📋 Usando dados em cache para: ${endpoint}`);
            return cached.data;
        }

        try {
            console.log(`🌐 Fazendo requisição para: ${endpoint}`);
            const response = await fetch(`${this.baseUrl}${endpoint}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data: ApiResponse<T> = await response.json();

            // Salvar no cache
            this.cache.set(cacheKey, { data, timestamp: now });

            return data;
        } catch (error) {
            console.error(`❌ Erro na requisição ${endpoint}:`, error);

            // Retornar dados em cache se disponíveis, mesmo se expirados
            if (cached) {
                console.log(`📋 Usando dados em cache expirados para: ${endpoint}`);
                return cached.data;
            }

            throw error;
        }
    }

    /**
     * Busca todas as configurações do site (home e about)
     */
    async getSettings(): Promise<{ home: HomeSettings; about: AboutSettings }> {
        const response = await this.fetchWithCache<{ home: HomeSettings; about: AboutSettings }>('/api/settings');

        if (!response.success) {
            throw new Error(response.error || 'Erro ao buscar configurações');
        }

        return response.data;
    }

    /**
     * Busca apenas as configurações da página inicial
     */
    async getHomeSettings(): Promise<HomeSettings> {
        const settings = await this.getSettings();
        return settings.home;
    }

    /**
     * Busca apenas as configurações da página sobre
     */
    async getAboutSettings(): Promise<AboutSettings> {
        const settings = await this.getSettings();
        return settings.about;
    }

    /**
     * Busca projetos publicados
     * @param options - Opções de busca
     */
    async getProjects(options: { limit?: number; offset?: number; featured?: boolean } = {}): Promise<Project[]> {
        const params = new URLSearchParams();
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.offset) params.append('offset', options.offset.toString());
        if (options.featured) params.append('featured', 'true');

        const endpoint = `/api/projects${params.toString() ? '?' + params.toString() : ''}`;
        const response = await this.fetchWithCache<Project[]>(endpoint);

        if (!response.success) {
            throw new Error(response.error || 'Erro ao buscar projetos');
        }

        return response.data;
    }

    /**
     * Busca posts publicados
     * @param options - Opções de busca
     */
    async getPosts(options: { limit?: number; offset?: number } = {}): Promise<Post[]> {
        const params = new URLSearchParams();
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.offset) params.append('offset', options.offset.toString());

        const endpoint = `/api/posts${params.toString() ? '?' + params.toString() : ''}`;
        const response = await this.fetchWithCache<Post[]>(endpoint);

        if (!response.success) {
            throw new Error(response.error || 'Erro ao buscar posts');
        }

        return response.data;
    }

    /**
     * Busca um post específico por slug
     * @param slug - Slug do post
     */
    async getPostBySlug(slug: string): Promise<Post | null> {
        const endpoint = `/api/posts?slug=${encodeURIComponent(slug)}`;
        const response = await this.fetchWithCache<Post>(endpoint);

        if (!response.success) {
            throw new Error(response.error || 'Erro ao buscar post');
        }

        return response.data;
    }

    /**
     * Limpa o cache (útil para desenvolvimento)
     */
    clearCache(): void {
        this.cache.clear();
        console.log('🧹 Cache da API limpo');
    }

    /**
     * Atualiza a duração do cache
     * @param minutes - Duração em minutos
     */
    setCacheDuration(minutes: number): void {
        this.cacheDuration = minutes * 60 * 1000;
        console.log(`⏰ Duração do cache atualizada para ${minutes} minutos`);
    }
}

// Instância global da API
const frontendAPI = new FrontendAPI();

// Exportar para uso global (pode ser usado em qualquer script)
if (typeof window !== 'undefined') {
    (window as any).frontendAPI = frontendAPI;
}

export default frontendAPI;
export type { HomeSettings, AboutSettings, Project, Post };
