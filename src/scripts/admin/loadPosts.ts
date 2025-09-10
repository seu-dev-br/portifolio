// loadPosts.ts - Carregamento de posts para o painel administrativo (TypeScript)

// ==========================================
// IMPORTS E TIPOS
// ==========================================

interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    status: 'draft' | 'published';
    cover_image?: string;
    created_at: string;
    updated_at: string;
    author_id: string;
}

// ==========================================
// DECLARAÇÕES GLOBAIS
// ==========================================

declare global {
    const supabaseClient: any;
    function showLoading(): void;
    function hideLoading(): void;
    function createPostCard(post: Post): HTMLElement;
}

// ==========================================
// ELEMENTOS DOM
// ==========================================

const postsContainer = document.getElementById('posts-container') as HTMLElement | null;

// ==========================================
// FUNÇÃO PRINCIPAL
// ==========================================

async function loadPosts(): Promise<void> {
    try {
        console.log('🔄 Carregando posts do Supabase...');
        showLoading();

        const { data: posts, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        console.log(`✅ ${posts.length} posts carregados com sucesso`);

        // Mostrar a seção de lista de posts
        const postsList = document.getElementById('posts-list') as HTMLElement | null;
        const postEditor = document.getElementById('post-editor') as HTMLElement | null;

        if (postsList) postsList.style.display = 'block';
        if (postEditor) postEditor.style.display = 'none';

        // Limpar container
        if (postsContainer) {
            postsContainer.innerHTML = '';
        }

        // Verificar se temos posts para exibir
        if (!posts || posts.length === 0) {
            if (postsContainer) {
                postsContainer.innerHTML = `
                    <div class="empty-state">
                        <h3>Nenhum post encontrado</h3>
                        <p>Comece criando seu primeiro post clicando no botão "Novo Post".</p>
                    </div>
                `;
            }
            hideLoading();
            return;
        }

        // Exibir posts
        posts.forEach((post: Post) => {
            const postCard = createPostCard(post);
            if (postsContainer) {
                postsContainer.appendChild(postCard);
            }
        });

        hideLoading();
    } catch (error: any) {
        hideLoading();
        console.error('❌ Erro ao carregar posts:', error);

        // Exibir estado de erro
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="error-state">
                    <h3>Erro ao carregar posts</h3>
                    <p>${error.message}</p>
                    <button onclick="loadPosts()">Tentar novamente</button>
                </div>
            `;
        }
    }
}

// ==========================================
// EXPORTS
// ==========================================

export { loadPosts };
