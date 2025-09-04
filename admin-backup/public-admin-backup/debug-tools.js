// Modo de depuração para o painel administrativo
console.log('🛠️ Inicializando modo de depuração do admin...');

// Função para criar o painel de depuração
function createDebugPanel() {
    // Criar o botão de alternância
    const toggleButton = document.createElement('button');
    toggleButton.className = 'debug-toggle';
    toggleButton.innerHTML = '🛠️';
    toggleButton.title = 'Mostrar ferramentas de depuração';
    document.body.appendChild(toggleButton);
    
    // Criar o painel
    const debugPanel = document.createElement('div');
    debugPanel.className = 'debug-panel';
    debugPanel.style.display = 'none';
    debugPanel.innerHTML = `
        <h3>Ferramentas de Depuração</h3>
        <div id="debug-status"></div>
        <div id="debug-actions">
            <button id="debug-check-auth">Verificar Autenticação</button>
            <button id="debug-reinit-editor">Reiniciar Editor</button>
            <button id="debug-fix-buttons">Corrigir Botões</button>
            <button id="debug-show-posts-list">Mostrar Lista Posts</button>
            <button id="debug-show-post-editor">Mostrar Editor Posts</button>
        </div>
        <pre id="debug-output"></pre>
    `;
    document.body.appendChild(debugPanel);
    
    // Adicionar eventos
    toggleButton.addEventListener('click', function() {
        if (debugPanel.style.display === 'none') {
            debugPanel.style.display = 'block';
            toggleButton.innerHTML = '❌';
            updateDebugStatus();
        } else {
            debugPanel.style.display = 'none';
            toggleButton.innerHTML = '🛠️';
        }
    });
    
    // Eventos para os botões de ação
    document.getElementById('debug-check-auth').addEventListener('click', checkAuthDebug);
    document.getElementById('debug-reinit-editor').addEventListener('click', reinitEditor);
    document.getElementById('debug-fix-buttons').addEventListener('click', fixButtonsDebug);
    document.getElementById('debug-show-posts-list').addEventListener('click', showPostsListDebug);
    document.getElementById('debug-show-post-editor').addEventListener('click', showPostEditorDebug);
    
    console.log('✅ Painel de depuração criado');
}

// Atualizar o status no painel
function updateDebugStatus() {
    const statusElement = document.getElementById('debug-status');
    if (!statusElement) return;
    
    // Verificar elementos importantes
    const elements = {
        'newPostBtn': document.getElementById('new-post-btn'),
        'postsListSection': document.getElementById('posts-list-section'),
        'postEditorSection': document.getElementById('post-editor-section'),
        'supabaseClient': window.supabaseClient || window.supabase
    };
    
    let html = '<ul>';
    for (const [key, element] of Object.entries(elements)) {
        html += `<li>${key}: <strong>${element ? '✅ OK' : '❌ Ausente'}</strong></li>`;
    }
    html += '</ul>';
    
    statusElement.innerHTML = html;
}

// Verificar autenticação
async function checkAuthDebug() {
    const outputElement = document.getElementById('debug-output');
    if (!outputElement) return;
    
    try {
        outputElement.innerText = 'Verificando autenticação...';
        
        const client = window.supabaseClient || window.supabase;
        if (!client) {
            outputElement.innerText = '❌ Cliente Supabase não encontrado!';
            return;
        }
        
        const { data, error } = await client.auth.getSession();
        
        if (error) {
            outputElement.innerText = `❌ Erro: ${error.message}`;
            return;
        }
        
        if (data?.session) {
            outputElement.innerText = `✅ Autenticado como: ${data.session.user.email}\n\nDetalhes:\n${JSON.stringify(data.session.user, null, 2)}`;
        } else {
            outputElement.innerText = '❌ Não autenticado';
        }
    } catch (error) {
        outputElement.innerText = `❌ Erro: ${error.message}`;
    }
}

// Reinicializar o editor
function reinitEditor() {
    const outputElement = document.getElementById('debug-output');
    if (!outputElement) return;
    
    try {
        outputElement.innerText = 'Reinicializando editor...';
        
        // Verificar se a função existe
        if (typeof initializeEditor === 'function') {
            initializeEditor();
            outputElement.innerText = '✅ Editor reinicializado';
        } else {
            outputElement.innerText = '❌ Função initializeEditor não encontrada';
        }
    } catch (error) {
        outputElement.innerText = `❌ Erro: ${error.message}`;
    }
}

// Corrigir botões
function fixButtonsDebug() {
    const outputElement = document.getElementById('debug-output');
    if (!outputElement) return;
    
    try {
        outputElement.innerText = 'Corrigindo botões...';
        
        // Verificar se a função existe
        if (typeof fixNewPostButton === 'function') {
            fixNewPostButton();
            outputElement.innerText = '✅ Botões corrigidos';
        } else {
            outputElement.innerText = '❌ Função fixNewPostButton não encontrada';
            
            // Tentar implementar a correção aqui mesmo
            const newPostBtn = document.getElementById('new-post-btn');
            if (newPostBtn) {
                newPostBtn.onclick = function() {
                    const postsListSection = document.getElementById('posts-list-section');
                    const postEditorSection = document.getElementById('post-editor-section');
                    
                    if (postsListSection) postsListSection.style.display = 'none';
                    if (postEditorSection) postEditorSection.style.display = 'block';
                    
                    outputElement.innerText = '✅ Navegação forçada para o editor de posts';
                };
                outputElement.innerText = '✅ Novo handler adicionado ao botão Novo Post';
            } else {
                outputElement.innerText = '❌ Botão novo post não encontrado';
            }
        }
        
        updateDebugStatus();
    } catch (error) {
        outputElement.innerText = `❌ Erro: ${error.message}`;
    }
}

// Mostrar lista de posts
function showPostsListDebug() {
    const outputElement = document.getElementById('debug-output');
    if (!outputElement) return;
    
    try {
        const postsListSection = document.getElementById('posts-list-section');
        const postEditorSection = document.getElementById('post-editor-section');
        
        if (!postsListSection || !postEditorSection) {
            outputElement.innerText = '❌ Seções não encontradas';
            return;
        }
        
        postsListSection.style.display = 'block';
        postEditorSection.style.display = 'none';
        
        if (typeof loadPosts === 'function') {
            loadPosts();
        }
        
        outputElement.innerText = '✅ Lista de posts exibida';
    } catch (error) {
        outputElement.innerText = `❌ Erro: ${error.message}`;
    }
}

// Mostrar editor de posts
function showPostEditorDebug() {
    const outputElement = document.getElementById('debug-output');
    if (!outputElement) return;
    
    try {
        const postsListSection = document.getElementById('posts-list-section');
        const postEditorSection = document.getElementById('post-editor-section');
        
        if (!postsListSection || !postEditorSection) {
            outputElement.innerText = '❌ Seções não encontradas';
            return;
        }
        
        postsListSection.style.display = 'none';
        postEditorSection.style.display = 'block';
        
        if (typeof initializeEditor === 'function') {
            initializeEditor();
        }
        
        outputElement.innerText = '✅ Editor de posts exibido';
    } catch (error) {
        outputElement.innerText = `❌ Erro: ${error.message}`;
    }
}

// Adicionar ao carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM carregado, inicializando painel de depuração...');
    
    // Esperar um pouco para garantir que todos os outros scripts foram carregados
    setTimeout(createDebugPanel, 2000);
});

// Executar também imediatamente caso o DOM já esteja carregado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🔄 DOM já carregado, inicializando painel de depuração imediatamente...');
    setTimeout(createDebugPanel, 200);
}
