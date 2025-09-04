// Chamada para iniciar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - iniciando aplicação admin');
    initApp().catch(error => {
        console.error('❌ Erro ao inicializar a aplicação:', error);
        showError('Erro ao inicializar a aplicação: ' + error.message);
    });
});
