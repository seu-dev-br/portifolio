// Admin Debug Fix
console.log('🐛 Iniciando debug do botão Novo Post');

// Função para garantir que o botão de novo post funcione
function fixNewPostButton() {
    const newPostBtn = document.getElementById('new-post-btn');
    if (!newPostBtn) {
        console.error('❌ Botão novo post não encontrado no DOM');
        return;
    }

    // Remover qualquer event listener anterior para evitar duplicação
    const newBtn = newPostBtn.cloneNode(true);
    if (newPostBtn.parentNode) {
        newPostBtn.parentNode.replaceChild(newBtn, newPostBtn);
    }

    console.log('✅ Adicionando event listener diretamente ao botão novo post');
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Botão novo post clicado!');
        
        // Elementos necessários
        const postsListSection = document.getElementById('posts-list-section');
        const postEditorSection = document.getElementById('post-editor-section');
        const listPostsBtn = document.getElementById('list-posts-btn');
        
        if (!postsListSection || !postEditorSection) {
            console.error('❌ Seções de posts não encontradas', {
                postsListSection,
                postEditorSection
            });
            return;
        }
        
        // Alternar visibilidade
        postsListSection.style.display = 'none';
        postEditorSection.style.display = 'block';
        
        // Atualizar classes ativas
        if (listPostsBtn) listPostsBtn.classList.remove('active');
        newBtn.classList.add('active');
        
        // Limpar formulário
        const postForm = document.getElementById('post-form');
        const editorTitle = document.getElementById('editor-title');
        if (postForm) postForm.reset();
        if (editorTitle) editorTitle.textContent = 'Criar Novo Post';

        console.log('✅ Formulário de novo post exibido com sucesso');
    });
    
    console.log('✅ Correção do botão novo post concluída');
}

// Adicionar ao carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM carregado, inicializando correções...');
    
    // Esperar um pouco para garantir que todos os outros scripts foram carregados
    setTimeout(fixNewPostButton, 1000);
});

// Executar também imediatamente caso o DOM já esteja carregado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🔄 DOM já carregado, aplicando correções imediatamente...');
    setTimeout(fixNewPostButton, 100);
}
