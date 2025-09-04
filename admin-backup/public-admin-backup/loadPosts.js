async function loadPosts() {
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
        document.getElementById('posts-list').style.display = 'block';
        document.getElementById('post-editor').style.display = 'none';
        
        // Limpar container
        postsContainer.innerHTML = '';
        
        // Verificar se temos posts para exibir
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum post encontrado</h3>
                    <p>Comece criando seu primeiro post clicando no botão "Novo Post".</p>
                </div>
            `;
            hideLoading();
            return;
        }
        
        // Exibir posts
        posts.forEach(post => {
            const postCard = createPostCard(post);
            postsContainer.appendChild(postCard);
        });
        
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('❌ Erro ao carregar posts:', error);
        
        // Exibir estado de erro
        postsContainer.innerHTML = `
            <div class="error-state">
                <h3>Erro ao carregar posts</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary retry-btn">
                    <i class="fas fa-sync-alt"></i> Tentar novamente
                </button>
            </div>
        `;
        
        // Adicionar evento para tentar novamente
        const retryBtn = postsContainer.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', loadPosts);
        }
    }
}
