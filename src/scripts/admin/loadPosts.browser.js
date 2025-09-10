// loadPosts.ts - Carregamento de posts para o painel administrativo (TypeScript)

// ==========================================
// IMPORTS E TIPOS
// ==========================================

// ==========================================
// DECLARAÇÕES GLOBAIS
// ==========================================

// ==========================================
// ELEMENTOS DOM
// ==========================================

const postsContainer = document.getElementById('posts-container');

// ==========================================
// FUNÇÃO PRINCIPAL
// ==========================================

async function loadPosts(){
    try {
        console.log('🔄 Carregando posts do Supabase...');
        showLoading();

        const { data, error } = await window.supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        console.log(`✅ ${data.length} posts carregados com sucesso`);

        // Mostrar a seção de lista de posts
        const postsList = document.getElementById('posts-list');
        const postEditor = document.getElementById('post-editor');

        if (postsList) postsList.style.display = 'block';
        if (postEditor) postEditor.style.display = 'none';

        // Limpar container
        if (postsContainer) {
            postsContainer.innerHTML = '';
        }

        // Verificar se temos posts para exibir
        if (!data || data.length === 0) {
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
        data.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <p>Status: ${post.status}</p>
                <button class="edit-post-btn" data-id="${post.id}">Editar</button>
                <button class="delete-post-btn" data-id="${post.id}">Excluir</button>
            `;
            if (postsContainer) {
                postsContainer.appendChild(postElement);
            }
        });

        hideLoading();
    } catch (error) {
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

// Tornar a função loadPosts disponível globalmente
window.loadPosts = loadPosts;
