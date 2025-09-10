// src/admin/modules/cache-manager.ts
// Sistema de cache para otimizar requisições da API

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

export class CacheManager {
    private static cache = new Map<string, CacheEntry<any>>();
    private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

    // Armazena dados no cache
    static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl
        };
        this.cache.set(key, entry);
    }

    // Recupera dados do cache
    static get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        // Verifica se o cache expirou
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    // Remove entrada do cache
    static delete(key: string): void {
        this.cache.delete(key);
    }

    // Limpa todo o cache
    static clear(): void {
        this.cache.clear();
    }

    // Verifica se uma chave existe no cache e não expirou
    static has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    // Obtém ou define dados no cache (cache-first strategy)
    static async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = this.DEFAULT_TTL
    ): Promise<T> {
        // Tenta obter do cache primeiro
        const cached = this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        // Se não estiver no cache, busca os dados
        try {
            const data = await fetcher();
            this.set(key, data, ttl);
            return data;
        } catch (error) {
            // Se a busca falhar, tenta retornar dados antigos se existirem
            const staleEntry = this.cache.get(key) as CacheEntry<T> | undefined;
            if (staleEntry) {
                console.warn(`Usando dados obsoletos do cache para ${key}:`, error);
                return staleEntry.data;
            }
            throw error;
        }
    }

    // Invalida cache por padrão (regex)
    static invalidate(pattern: string): void {
        const regex = new RegExp(pattern);
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    // Obtém estatísticas do cache
    static getStats() {
        const now = Date.now();
        let totalEntries = 0;
        let expiredEntries = 0;
        let validEntries = 0;

        for (const [key, entry] of this.cache.entries()) {
            totalEntries++;
            if (now - entry.timestamp > entry.ttl) {
                expiredEntries++;
            } else {
                validEntries++;
            }
        }

        return {
            totalEntries,
            validEntries,
            expiredEntries,
            cacheSize: this.cache.size
        };
    }

    // Cache específico para API responses
    static getApiCacheKey(endpoint: string, params?: Record<string, any>): string {
        const paramString = params ? JSON.stringify(params) : '';
        return `api:${endpoint}:${paramString}`;
    }

    // Cache para estatísticas (TTL mais curto)
    static getStatsCacheKey(): string {
        return 'api:stats';
    }

    // Cache para listas (TTL médio)
    static getListCacheKey(type: string, filters?: Record<string, any>): string {
        const filterString = filters ? JSON.stringify(filters) : '';
        return `api:list:${type}:${filterString}`;
    }
}

// Hook para usar cache em componentes
export function useCache() {
    return {
        get: <T>(key: string) => CacheManager.get<T>(key),
        set: <T>(key: string, data: T, ttl?: number) => CacheManager.set(key, data, ttl),
        has: (key: string) => CacheManager.has(key),
        delete: (key: string) => CacheManager.delete(key),
        clear: () => CacheManager.clear(),
        getOrSet: <T>(key: string, fetcher: () => Promise<T>, ttl?: number) =>
            CacheManager.getOrSet<T>(key, fetcher, ttl),
        invalidate: (pattern: string) => CacheManager.invalidate(pattern),
        getStats: () => CacheManager.getStats()
    };
}
