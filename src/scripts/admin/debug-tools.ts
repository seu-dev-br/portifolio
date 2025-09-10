// debug-tools.ts - Ferramentas de depuração para o painel administrativo (TypeScript)

// ==========================================
// DECLARAÇÕES GLOBAIS
// ==========================================

declare global {
    function checkAuthDebug(): void;
    function reinitEditor(): void;
    function fixButtonsDebug(): void;
    function showPostsListDebug(): void;
    function showPostEditorDebug(): void;
    function updateDebugStatus(): void;
}

// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================

let debugPanel: HTMLElement | null = null;
let debugToggleButton: HTMLElement | null = null;

// ==========================================
// FUNÇÃO PRINCIPAL - CRIAR PAINEL DE DEPURAÇÃO
// ==========================================

function createDebugPanel(): void {
    console.log('🛠️ Inicializando modo de depuração do admin...');

    // Criar o botão de alternância
    debugToggleButton = document.createElement('button');
    debugToggleButton.className = 'debug-toggle';
    debugToggleButton.innerHTML = '🛠️';
    debugToggleButton.title = 'Mostrar ferramentas de depuração';
    debugToggleButton.setAttribute('aria-label', 'Alternar painel de depuração');
    document.body.appendChild(debugToggleButton);

    // Criar o painel
    debugPanel = document.createElement('div');
    debugPanel.className = 'debug-panel';
    debugPanel.style.display = 'none';
    debugPanel.setAttribute('role', 'dialog');
    debugPanel.setAttribute('aria-label', 'Painel de ferramentas de depuração');
    debugPanel.innerHTML = `
        <h3>Ferramentas de Depuração</h3>
        <div id="debug-status" role="status" aria-live="polite"></div>
        <div id="debug-actions" role="group" aria-label="Ações de depuração">
            <button id="debug-check-auth" type="button" aria-label="Verificar autenticação">Verificar Autenticação</button>
            <button id="debug-reinit-editor" type="button" aria-label="Reiniciar editor">Reiniciar Editor</button>
            <button id="debug-fix-buttons" type="button" aria-label="Corrigir botões">Corrigir Botões</button>
            <button id="debug-show-posts-list" type="button" aria-label="Mostrar lista de posts">Mostrar Lista Posts</button>
            <button id="debug-show-post-editor" type="button" aria-label="Mostrar editor de posts">Mostrar Editor Posts</button>
        </div>
        <pre id="debug-output" role="log" aria-label="Saída de depuração"></pre>
    `;
    document.body.appendChild(debugPanel);

    // Adicionar eventos
    if (debugToggleButton) {
        debugToggleButton.addEventListener('click', toggleDebugPanel);
    }

    // Eventos para os botões de ação
    const checkAuthBtn = document.getElementById('debug-check-auth') as HTMLButtonElement | null;
    const reinitEditorBtn = document.getElementById('debug-reinit-editor') as HTMLButtonElement | null;
    const fixButtonsBtn = document.getElementById('debug-fix-buttons') as HTMLButtonElement | null;
    const showPostsListBtn = document.getElementById('debug-show-posts-list') as HTMLButtonElement | null;
    const showPostEditorBtn = document.getElementById('debug-show-post-editor') as HTMLButtonElement | null;

    if (checkAuthBtn) checkAuthBtn.addEventListener('click', checkAuthDebug);
    if (reinitEditorBtn) reinitEditorBtn.addEventListener('click', reinitEditor);
    if (fixButtonsBtn) fixButtonsBtn.addEventListener('click', fixButtonsDebug);
    if (showPostsListBtn) showPostsListBtn.addEventListener('click', showPostsListDebug);
    if (showPostEditorBtn) showPostEditorBtn.addEventListener('click', showPostEditorDebug);

    console.log('✅ Painel de depuração criado');
}

// ==========================================
// FUNÇÕES DE CONTROLE DO PAINEL
// ==========================================

function toggleDebugPanel(): void {
    if (!debugPanel || !debugToggleButton) return;

    if (debugPanel.style.display === 'none') {
        debugPanel.style.display = 'block';
        debugToggleButton.innerHTML = '❌';
        debugToggleButton.setAttribute('aria-expanded', 'true');
        updateDebugStatus();
    } else {
        debugPanel.style.display = 'none';
        debugToggleButton.innerHTML = '🛠️';
        debugToggleButton.setAttribute('aria-expanded', 'false');
    }
}

function updateDebugStatus(): void {
    const debugStatus = document.getElementById('debug-status') as HTMLElement | null;
    if (!debugStatus) return;

    const status = {
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        supabase: (window as any).supabase ? '✅ Conectado' : '❌ Desconectado',
        user: (window as any).currentUser ? '✅ Logado' : '❌ Não logado'
    };

    debugStatus.innerHTML = `
        <strong>Status do Sistema:</strong><br>
        📅 ${status.timestamp}<br>
        🌐 ${status.url}<br>
        🔗 Supabase: ${status.supabase}<br>
        👤 Usuário: ${status.user}<br>
        📱 User Agent: ${status.userAgent.substring(0, 50)}...
    `;
}

// ==========================================
// FUNÇÕES DE DEPURAÇÃO
// ==========================================

function checkAuthDebug(): void {
    const output = document.getElementById('debug-output') as HTMLElement | null;
    if (!output) return;

    try {
        const supabase = (window as any).supabase;
        const currentUser = (window as any).currentUser;

        output.textContent = JSON.stringify({
            supabaseAvailable: !!supabase,
            userLoggedIn: !!currentUser,
            userData: currentUser || null,
            timestamp: new Date().toISOString()
        }, null, 2);
    } catch (error: any) {
        output.textContent = `Erro ao verificar autenticação: ${error.message}`;
    }
}

function reinitEditor(): void {
    const output = document.getElementById('debug-output') as HTMLElement | null;
    if (!output) return;

    try {
        // Tentar reinicializar o editor EasyMDE
        if ((window as any).easyMDE) {
            (window as any).easyMDE.toTextArea();
            (window as any).easyMDE = null;
        }

        // Recriar o editor
        const textarea = document.getElementById('post-content') as HTMLTextAreaElement | null;
        if (textarea && (window as any).EasyMDE) {
            (window as any).easyMDE = new (window as any).EasyMDE({
                element: textarea,
                spellChecker: false,
                renderingConfig: {
                    singleLineBreaks: false
                }
            });
            output.textContent = '✅ Editor reinicializado com sucesso';
        } else {
            output.textContent = '❌ Editor não pôde ser reinicializado - EasyMDE não disponível';
        }
    } catch (error: any) {
        output.textContent = `Erro ao reinicializar editor: ${error.message}`;
    }
}

function fixButtonsDebug(): void {
    const output = document.getElementById('debug-output') as HTMLElement | null;
    if (!output) return;

    try {
        // Corrigir event listeners dos botões
        const buttons = document.querySelectorAll('button');
        let fixedCount = 0;

        buttons.forEach((button: HTMLButtonElement) => {
            // Verificar se o botão tem event listeners
            const hasClickListener = button.onclick !== null ||
                                   button.getAttribute('data-has-listener') === 'true';

            if (!hasClickListener) {
                // Adicionar listener genérico se necessário
                button.addEventListener('click', () => {
                    console.log(`Botão clicado: ${button.id || button.textContent}`);
                });
                button.setAttribute('data-has-listener', 'true');
                fixedCount++;
            }
        });

        output.textContent = `✅ ${fixedCount} botões corrigidos`;
    } catch (error: any) {
        output.textContent = `Erro ao corrigir botões: ${error.message}`;
    }
}

function showPostsListDebug(): void {
    const output = document.getElementById('debug-output') as HTMLElement | null;
    if (!output) return;

    try {
        const postsList = document.getElementById('posts-list-section') as HTMLElement | null;
        const postEditor = document.getElementById('post-editor-section') as HTMLElement | null;

        if (postsList && postEditor) {
            postsList.style.display = 'block';
            postEditor.style.display = 'none';
            output.textContent = '✅ Lista de posts exibida';
        } else {
            output.textContent = '❌ Elementos da lista de posts não encontrados';
        }
    } catch (error: any) {
        output.textContent = `Erro ao mostrar lista de posts: ${error.message}`;
    }
}

function showPostEditorDebug(): void {
    const output = document.getElementById('debug-output') as HTMLElement | null;
    if (!output) return;

    try {
        const postsList = document.getElementById('posts-list-section') as HTMLElement | null;
        const postEditor = document.getElementById('post-editor-section') as HTMLElement | null;

        if (postsList && postEditor) {
            postsList.style.display = 'none';
            postEditor.style.display = 'block';
            output.textContent = '✅ Editor de posts exibido';
        } else {
            output.textContent = '❌ Elementos do editor de posts não encontrados';
        }
    } catch (error: any) {
        output.textContent = `Erro ao mostrar editor de posts: ${error.message}`;
    }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Inicializar o painel de depuração quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Inicializando ferramentas de depuração...');
    createDebugPanel();
});

// ==========================================
// EXPORTS
// ==========================================

export {
    createDebugPanel,
    toggleDebugPanel,
    updateDebugStatus,
    checkAuthDebug,
    reinitEditor,
    fixButtonsDebug,
    showPostsListDebug,
    showPostEditorDebug
};
