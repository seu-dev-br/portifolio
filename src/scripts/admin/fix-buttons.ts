// fix-buttons.ts - Correções para botões do painel administrativo (TypeScript)

// ==========================================
// DECLARAÇÕES GLOBAIS
// ==========================================

declare global {
    function fixNewPostButton(): void;
    function fixListPostsButton(): void;
    function fixAllButtons(): void;
}

// ==========================================
// FUNÇÃO PARA CORRIGIR BOTÃO NOVO POST
// ==========================================

function fixNewPostButton(): void {
    console.log('🐛 Iniciando debug do botão Novo Post');

    const newPostBtn = document.getElementById('new-post-btn') as HTMLElement | null;
    if (!newPostBtn) {
        console.error('❌ Botão novo post não encontrado no DOM');
        return;
    }

    // Remover qualquer event listener anterior para evitar duplicação
    const newBtn = newPostBtn.cloneNode(true) as HTMLElement;
    if (newPostBtn.parentNode) {
        newPostBtn.parentNode.replaceChild(newBtn, newPostBtn);
    }

    console.log('✅ Adicionando event listener diretamente ao botão novo post');
    newBtn.addEventListener('click', function(e: Event) {
        e.preventDefault();
        console.log('🖱️ Botão novo post clicado!');

        // Elementos necessários
        const postsListSection = document.getElementById('posts-list-section') as HTMLElement | null;
        const postEditorSection = document.getElementById('post-editor-section') as HTMLElement | null;
        const listPostsBtn = document.getElementById('list-posts-btn') as HTMLElement | null;

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
        const postForm = document.getElementById('post-form') as HTMLFormElement | null;
        const editorTitle = document.getElementById('editor-title') as HTMLElement | null;
        if (postForm) postForm.reset();
        if (editorTitle) editorTitle.textContent = 'Criar Novo Post';

        console.log('✅ Formulário de novo post exibido com sucesso');
    });

    // Adicionar atributos de acessibilidade
    newBtn.setAttribute('aria-label', 'Criar novo post');
    newBtn.setAttribute('role', 'button');
}

// ==========================================
// FUNÇÃO PARA CORRIGIR BOTÃO LISTAR POSTS
// ==========================================

function fixListPostsButton(): void {
    console.log('🐛 Iniciando debug do botão Listar Posts');

    const listPostsBtn = document.getElementById('list-posts-btn') as HTMLElement | null;
    if (!listPostsBtn) {
        console.error('❌ Botão listar posts não encontrado no DOM');
        return;
    }

    // Remover qualquer event listener anterior para evitar duplicação
    const newBtn = listPostsBtn.cloneNode(true) as HTMLElement;
    if (listPostsBtn.parentNode) {
        listPostsBtn.parentNode.replaceChild(newBtn, listPostsBtn);
    }

    console.log('✅ Adicionando event listener diretamente ao botão listar posts');
    newBtn.addEventListener('click', function(e: Event) {
        e.preventDefault();
        console.log('🖱️ Botão listar posts clicado!');

        // Elementos necessários
        const postsListSection = document.getElementById('posts-list-section') as HTMLElement | null;
        const postEditorSection = document.getElementById('post-editor-section') as HTMLElement | null;
        const newPostBtn = document.getElementById('new-post-btn') as HTMLElement | null;

        if (!postsListSection || !postEditorSection) {
            console.error('❌ Seções de posts não encontradas', {
                postsListSection,
                postEditorSection
            });
            return;
        }

        // Alternar visibilidade
        postsListSection.style.display = 'block';
        postEditorSection.style.display = 'none';

        // Atualizar classes ativas
        if (newPostBtn) newPostBtn.classList.remove('active');
        newBtn.classList.add('active');

        console.log('✅ Lista de posts exibida com sucesso');
    });

    // Adicionar atributos de acessibilidade
    newBtn.setAttribute('aria-label', 'Listar posts');
    newBtn.setAttribute('role', 'button');
}

// ==========================================
// FUNÇÃO PARA CORRIGIR TODOS OS BOTÕES
// ==========================================

function fixAllButtons(): void {
    console.log('🔧 Iniciando correção de todos os botões');

    try {
        fixNewPostButton();
        fixListPostsButton();

        // Corrigir outros botões se existirem
        const buttons = document.querySelectorAll('button[id]');
        buttons.forEach((button: Element) => {
            const htmlButton = button as HTMLButtonElement;

            // Garantir que todos os botões tenham atributos básicos
            if (!htmlButton.hasAttribute('aria-label')) {
                const buttonText = htmlButton.textContent?.trim() || htmlButton.id;
                htmlButton.setAttribute('aria-label', buttonText);
            }

            if (!htmlButton.hasAttribute('role')) {
                htmlButton.setAttribute('role', 'button');
            }

            // Garantir que botões sejam focáveis
            if (htmlButton.tabIndex === -1) {
                htmlButton.tabIndex = 0;
            }
        });

        console.log('✅ Todos os botões corrigidos com sucesso');
    } catch (error: any) {
        console.error('❌ Erro ao corrigir botões:', error);
    }
}

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Inicializando correções de botões...');

    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(() => {
        fixAllButtons();
    }, 1000);
});

// ==========================================
// EXPORTS
// ==========================================

export {
    fixNewPostButton,
    fixListPostsButton,
    fixAllButtons
};
