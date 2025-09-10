// admin-new.ts - Funções auxiliares para o painel de administração (TypeScript)

// ==========================================
// INTERFACES
// ==========================================

interface ImageModalOptions {
    imageUrl: string;
    altText?: string;
    title?: string;
}

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

/**
 * Formatar data para exibição em português brasileiro
 */
function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Data desconhecida';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Data inválida';
        }

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.warn('Erro ao formatar data:', error);
        return 'Data inválida';
    }
}

/**
 * Formatar data relativa (há X tempo atrás)
 */
function formatRelativeDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Data desconhecida';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Data inválida';
        }

        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'Agora mesmo';
        if (diffInMinutes < 60) return `Há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
        if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
        if (diffInDays < 7) return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;

        return formatDate(dateString);
    } catch (error) {
        console.warn('Erro ao formatar data relativa:', error);
        return 'Data inválida';
    }
}

/**
 * Truncar texto com reticências
 */
function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Converter tags string para array
 */
function parseTags(tagsString: string): string[] {
    if (!tagsString) return [];

    return tagsString
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
}

/**
 * Converter array de tags para string
 */
function stringifyTags(tags: string[]): string {
    if (!tags || tags.length === 0) return '';
    return tags.join(', ');
}

// ==========================================
// MODAL DE IMAGEM
// ==========================================

/**
 * Mostrar modal para visualizar imagem em tamanho maior
 */
function showImageModal(imageUrl: string, altText?: string, title?: string): void {
    // Remover modal existente se houver
    const existingModal = document.querySelector('.image-modal-container');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    // Criar modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'image-modal-container';
    modalContainer.setAttribute('role', 'dialog');
    modalContainer.setAttribute('aria-modal', 'true');
    modalContainer.setAttribute('aria-labelledby', 'image-modal-title');

    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';

    // Adicionar título se fornecido
    if (title) {
        const titleElement = document.createElement('h3');
        titleElement.id = 'image-modal-title';
        titleElement.textContent = title;
        modal.appendChild(titleElement);
    }

    // Adicionar imagem
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altText || 'Imagem';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '80vh';
    img.setAttribute('loading', 'lazy');

    // Adicionar botões
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'image-modal-actions';

    // Botão de fechar
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-danger';
    closeBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> Fechar';
    closeBtn.setAttribute('aria-label', 'Fechar modal de imagem');
    closeBtn.addEventListener('click', () => {
        if (modalContainer.parentNode) {
            document.body.removeChild(modalContainer);
        }
    });

    // Botão para abrir em nova aba
    const openBtn = document.createElement('button');
    openBtn.className = 'btn btn-primary';
    openBtn.innerHTML = '<i class="fas fa-external-link-alt" aria-hidden="true"></i> Abrir em nova aba';
    openBtn.setAttribute('aria-label', 'Abrir imagem em nova aba');
    openBtn.addEventListener('click', () => {
        window.open(imageUrl, '_blank', 'noopener,noreferrer');
    });

    // Adicionar botões ao container de ações
    actionsDiv.appendChild(openBtn);
    actionsDiv.appendChild(closeBtn);

    // Montar modal
    modal.appendChild(img);
    modal.appendChild(actionsDiv);
    modalContainer.appendChild(modal);

    // Adicionar ao body
    document.body.appendChild(modalContainer);

    // Focar no modal
    modalContainer.focus();

    // Fechar ao clicar fora da imagem
    modalContainer.addEventListener('click', (e: Event) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });

    // Fechar com tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (modalContainer.parentNode) {
                document.body.removeChild(modalContainer);
            }
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    console.log('🖼️ Modal de imagem exibido:', imageUrl);
}

// ==========================================
// CONFIRMAÇÃO DE AÇÃO
// ==========================================

/**
 * Mostrar diálogo de confirmação
 */
function showConfirmDialog(message: string, onConfirm: () => void, onCancel?: () => void): void {
    // Remover diálogo existente se houver
    const existingDialog = document.querySelector('.confirm-dialog-overlay');
    if (existingDialog) {
        document.body.removeChild(existingDialog);
    }

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'confirm-dialog-overlay';

    // Criar diálogo
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'confirm-dialog-title');

    // Título
    const title = document.createElement('h3');
    title.id = 'confirm-dialog-title';
    title.textContent = 'Confirmação';

    // Mensagem
    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    // Botões
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'confirm-dialog-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.setAttribute('aria-label', 'Cancelar ação');
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-danger';
    confirmBtn.textContent = 'Confirmar';
    confirmBtn.setAttribute('aria-label', 'Confirmar ação');
    confirmBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        onConfirm();
    });

    // Montar diálogo
    buttonsDiv.appendChild(cancelBtn);
    buttonsDiv.appendChild(confirmBtn);

    dialog.appendChild(title);
    dialog.appendChild(messageElement);
    dialog.appendChild(buttonsDiv);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Focar no botão de cancelar (mais seguro)
    cancelBtn.focus();

    // Fechar com tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    console.log('❓ Diálogo de confirmação exibido:', message);
}

// ==========================================
// UTILITÁRIOS DE VALIDAÇÃO
// ==========================================

/**
 * Validar email
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validar URL
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Sanitizar HTML básico
 */
function sanitizeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// EXPORTS
// ==========================================

export {
    formatDate,
    formatRelativeDate,
    truncateText,
    parseTags,
    stringifyTags,
    showImageModal,
    showConfirmDialog,
    isValidEmail,
    isValidUrl,
    sanitizeHtml
};
