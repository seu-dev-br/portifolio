// src/lib/integrate-settings.ts
// Script para integrar as configurações do admin nas páginas públicas
// Este arquivo pode ser incluído nas páginas que precisam das configurações

import frontendAPI from './frontend-api';

class SettingsIntegrator {
    private settings: any = null;
    private isLoading = false;

    /**
     * Carrega as configurações e aplica nas páginas
     */
    async loadAndApplySettings(): Promise<void> {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            console.log('🚀 Carregando configurações do admin...');

            // Carregar configurações
            this.settings = await frontendAPI.getSettings();
            console.log('✅ Configurações carregadas:', this.settings);

            // Aplicar configurações baseado na página atual
            const currentPath = window.location.pathname;

            if (currentPath === '/' || currentPath === '/index.html') {
                await this.applyHomeSettings();
            } else if (currentPath === '/sobre' || currentPath === '/sobre.html') {
                await this.applyAboutSettings();
            }

            // Aplicar configurações globais (como slider se estiver habilitado)
            await this.applyGlobalSettings();

        } catch (error) {
            console.error('❌ Erro ao carregar configurações:', error);
            // Usar configurações padrão em caso de erro
            this.applyDefaultSettings();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Aplica configurações da página inicial
     */
    private async applyHomeSettings(): Promise<void> {
        if (!this.settings?.home) return;

        const homeSettings = this.settings.home;
        console.log('🏠 Aplicando configurações da página inicial...');

        // Aplicar configurações do hero
        if (homeSettings.hero) {
            this.updateHeroSection(homeSettings.hero);
        }

        // Aplicar configurações do slider
        if (homeSettings.slider) {
            this.updateSliderSettings(homeSettings.slider);
        }

        // Aplicar configurações dos projetos em destaque
        if (homeSettings.featured) {
            await this.updateFeaturedProjects(homeSettings.featured);
        }

        // Aplicar configurações dos posts
        if (homeSettings.posts) {
            await this.updateRecentPosts(homeSettings.posts);
        }
    }

    /**
     * Aplica configurações da página sobre
     */
    private async applyAboutSettings(): Promise<void> {
        if (!this.settings?.about) return;

        const aboutSettings = this.settings.about;
        console.log('👤 Aplicando configurações da página sobre...');

        // Aplicar bio
        if (aboutSettings.bio) {
            this.updateBio(aboutSettings.bio);
        }

        // Aplicar imagem de perfil
        if (aboutSettings.profileImage) {
            this.updateProfileImage(aboutSettings.profileImage);
        }

        // Aplicar skills
        if (aboutSettings.skills) {
            this.updateSkills(aboutSettings.skills);
        }

        // Aplicar redes sociais
        if (aboutSettings.social) {
            this.updateSocialLinks(aboutSettings.social);
        }
    }

    /**
     * Aplica configurações globais
     */
    private async applyGlobalSettings(): Promise<void> {
        // Aqui você pode aplicar configurações que afetam todas as páginas
        console.log('🌍 Aplicando configurações globais...');

        // Exemplo: Atualizar título do site se houver configuração global
        if (this.settings?.global?.siteTitle) {
            document.title = this.settings.global.siteTitle;
        }
    }

    /**
     * Aplica configurações padrão em caso de erro
     */
    private applyDefaultSettings(): void {
        console.log('📋 Aplicando configurações padrão...');
        // Aqui você pode definir comportamentos padrão
        // quando não conseguir carregar as configurações do admin
    }

    // ===========================================
    // MÉTODOS PARA ATUALIZAR ELEMENTOS DA PÁGINA
    // ===========================================

    private updateHeroSection(hero: any): void {
        // Atualizar título do hero
        const heroTitle = document.querySelector('.hero-title, h1, .main-title');
        if (heroTitle && hero.title) {
            heroTitle.textContent = hero.title;
        }

        // Atualizar subtítulo
        const heroSubtitle = document.querySelector('.hero-subtitle, .subtitle, h2');
        if (heroSubtitle && hero.subtitle) {
            heroSubtitle.textContent = hero.subtitle;
        }

        // Atualizar descrição
        const heroDescription = document.querySelector('.hero-description, .description, p');
        if (heroDescription && hero.description) {
            heroDescription.textContent = hero.description;
        }

        console.log('✅ Seção hero atualizada');
    }

    private updateSliderSettings(slider: any): void {
        // Aqui você implementaria a lógica para configurar o slider
        // baseado nas configurações do admin
        console.log('🎠 Configurações do slider aplicadas:', slider);
    }

    private async updateFeaturedProjects(featured: any): Promise<void> {
        try {
            // Buscar projetos em destaque
            const projects = await frontendAPI.getProjects({
                limit: featured.count || 6,
                featured: true
            });

            // Atualizar título da seção
            const sectionTitle = document.querySelector('.featured-title, .projects-title');
            if (sectionTitle && featured.title) {
                sectionTitle.textContent = featured.title;
            }

            // Atualizar descrição da seção
            const sectionDescription = document.querySelector('.featured-description, .projects-description');
            if (sectionDescription && featured.description) {
                sectionDescription.textContent = featured.description;
            }

            // Aqui você pode atualizar a lista de projetos
            // Implemente a lógica para renderizar os projetos

            console.log(`✅ ${projects.length} projetos em destaque carregados`);
        } catch (error) {
            console.error('❌ Erro ao carregar projetos em destaque:', error);
        }
    }

    private async updateRecentPosts(posts: any): Promise<void> {
        try {
            // Buscar posts recentes
            const recentPosts = await frontendAPI.getPosts({
                limit: posts.count || 3
            });

            // Atualizar título da seção
            const sectionTitle = document.querySelector('.posts-title, .blog-title');
            if (sectionTitle && posts.title) {
                sectionTitle.textContent = posts.title;
            }

            // Atualizar descrição da seção
            const sectionDescription = document.querySelector('.posts-description, .blog-description');
            if (sectionDescription && posts.description) {
                sectionDescription.textContent = posts.description;
            }

            // Aqui você pode atualizar a lista de posts
            // Implemente a lógica para renderizar os posts

            console.log(`✅ ${recentPosts.length} posts recentes carregados`);
        } catch (error) {
            console.error('❌ Erro ao carregar posts recentes:', error);
        }
    }

    private updateBio(bio: string): void {
        const bioElement = document.querySelector('.bio, .about-bio, .description');
        if (bioElement) {
            bioElement.textContent = bio;
            console.log('✅ Bio atualizada');
        }
    }

    private updateProfileImage(imageUrl: string): void {
        const profileImg = document.querySelector('.profile-image, .about-image, img');
        if (profileImg && imageUrl) {
            (profileImg as HTMLImageElement).src = imageUrl;
            console.log('✅ Imagem de perfil atualizada');
        }
    }

    private updateSkills(skills: any): void {
        // Atualizar skills do frontend
        if (skills.frontend) {
            const frontendElement = document.querySelector('.skills-frontend, .frontend-skills');
            if (frontendElement) {
                frontendElement.textContent = skills.frontend;
            }
        }

        // Atualizar skills do backend
        if (skills.backend) {
            const backendElement = document.querySelector('.skills-backend, .backend-skills');
            if (backendElement) {
                backendElement.textContent = skills.backend;
            }
        }

        // E assim por diante para database e tools...
        console.log('✅ Skills atualizadas');
    }

    private updateSocialLinks(social: any): void {
        // Atualizar links das redes sociais
        Object.keys(social).forEach(platform => {
            const link = social[platform];
            if (link) {
                const socialElement = document.querySelector(`.social-${platform}, a[href*="${platform}"]`);
                if (socialElement) {
                    socialElement.setAttribute('href', link);
                }
            }
        });

        console.log('✅ Redes sociais atualizadas');
    }
}

// Instância global do integrador
const settingsIntegrator = new SettingsIntegrator();

// Função para inicializar quando o DOM estiver pronto
function initializeSettingsIntegration(): void {
    // Aguardar o DOM estar completamente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            settingsIntegrator.loadAndApplySettings();
        });
    } else {
        settingsIntegrator.loadAndApplySettings();
    }
}

// Inicializar automaticamente
if (typeof window !== 'undefined') {
    initializeSettingsIntegration();

    // Expor globalmente para debug
    (window as any).settingsIntegrator = settingsIntegrator;
}

export default settingsIntegrator;
