// src/admin/services/api.service.ts
import { getSupabaseClient } from '../../lib/supabase/client';
import type { AdminUser, Project, Post, ContactMessage, AdminStats } from '../../lib/types';
import { CacheManager } from '../modules/cache-manager';

export class ApiService {
    private supabase = getSupabaseClient();

    // ===== AUTENTICAÇÃO =====
    async login(email: string, password: string) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getCurrentSession() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            if (error) throw error;

            return session;
        } catch (error) {
            console.error('Erro ao obter sessão:', error);
            return null;
        }
    }

    // ===== ESTATÍSTICAS =====
    async getStats(): Promise<{ success: boolean; data?: AdminStats; error?: string }> {
        try {
            // Buscar contadores de diferentes tabelas
            const [projectsResult, postsResult, messagesResult] = await Promise.all([
                this.supabase.from('projects').select('id', { count: 'exact', head: true }),
                this.supabase.from('posts').select('id', { count: 'exact', head: true }),
                this.supabase.from('contact_messages').select('id', { count: 'exact', head: true })
            ]);

            const stats: AdminStats = {
                projects: projectsResult.count || 0,
                posts: postsResult.count || 0,
                messages: messagesResult.count || 0,
                visits: 0 // TODO: Implementar analytics
            };

            return {
                success: true,
                data: stats
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ===== PROJETOS =====
    async getProjects(): Promise<{ success: boolean; data?: Project[]; error?: string }> {
        const cacheKey = CacheManager.getListCacheKey('projects');

        return CacheManager.getOrSet(cacheKey, async () => {
            try {
                const { data, error } = await this.supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                return {
                    success: true,
                    data: data || []
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }, 5 * 60 * 1000); // Cache por 5 minutos para listas
    }

    async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Project; error?: string }> {
        try {
            const { data, error } = await this.supabase
                .from('projects')
                .insert(project)
                .select()
                .single();

            if (error) throw error;

            // Invalida cache de projetos e estatísticas
            CacheManager.invalidate('api:list:projects');
            CacheManager.invalidate('api:stats');

            return {
                success: true,
                data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateProject(id: string, updates: Partial<Project>): Promise<{ success: boolean; data?: Project; error?: string }> {
        try {
            const { data, error } = await this.supabase
                .from('projects')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Invalida cache de projetos
            CacheManager.invalidate('api:list:projects');

            return {
                success: true,
                data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Invalida cache de projetos e estatísticas
            CacheManager.invalidate('api:list:projects');
            CacheManager.invalidate('api:stats');

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ===== POSTS =====
    async getPosts(): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        const cacheKey = CacheManager.getListCacheKey('posts');

        return CacheManager.getOrSet(cacheKey, async () => {
            try {
                const { data, error } = await this.supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                return {
                    success: true,
                    data: data || []
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }, 5 * 60 * 1000); // Cache por 5 minutos para listas
    }

    async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Post; error?: string }> {
        try {
            const { data, error } = await this.supabase
                .from('posts')
                .insert(post)
                .select()
                .single();

            if (error) throw error;

            // Invalida cache de posts e estatísticas
            CacheManager.invalidate('api:list:posts');
            CacheManager.invalidate('api:stats');

            return {
                success: true,
                data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updatePost(id: string, updates: Partial<Post>): Promise<{ success: boolean; data?: Post; error?: string }> {
        try {
            const { data, error } = await this.supabase
                .from('posts')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Invalida cache de posts
            CacheManager.invalidate('api:list:posts');

            return {
                success: true,
                data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deletePost(id: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Invalida cache de posts e estatísticas
            CacheManager.invalidate('api:list:posts');
            CacheManager.invalidate('api:stats');

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ===== MENSAGENS =====
    async getMessages(): Promise<{ success: boolean; data?: ContactMessage[]; error?: string }> {
        const cacheKey = CacheManager.getListCacheKey('messages');

        return CacheManager.getOrSet(cacheKey, async () => {
            try {
                const { data, error } = await this.supabase
                    .from('contact_messages')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                return {
                    success: true,
                    data: data || []
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }, 2 * 60 * 1000); // Cache por 2 minutos para mensagens (mais frequente)
    }

    async markMessageAsRead(id: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase
                .from('contact_messages')
                .update({ status: 'read' })
                .eq('id', id);

            if (error) throw error;

            // Invalida cache de mensagens
            CacheManager.invalidate('api:list:messages');

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Invalida cache de mensagens e estatísticas
            CacheManager.invalidate('api:list:messages');
            CacheManager.invalidate('api:stats');

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ===== CONFIGURAÇÕES =====
    async getSettings(): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const { data, error } = await this.supabase
                .from('settings')
                .select('*')
                .single();

            if (error) throw error;

            return {
                success: true,
                data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateSettings(settings: any): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const { data, error } = await this.supabase
                .from('settings')
                .upsert(settings)
                .select()
                .single();

            if (error) throw error;

            return {
                success: true,
                data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Instância singleton
export const apiService = new ApiService();
