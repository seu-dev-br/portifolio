// Script de debug para testar o login no navegador
console.log('🔍 Iniciando debug do login...');

// Verificar se o Supabase está carregado
window.addEventListener('load', function() {
    console.log('📄 Página carregada');

    setTimeout(() => {
        console.log('⏳ Verificando Supabase após timeout...');

        if (window.supabase) {
            console.log('✅ Supabase encontrado:', window.supabase);
        } else {
            console.error('❌ Supabase NÃO encontrado!');
        }

        // Verificar elementos do DOM
        const loginForm = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        console.log('📋 Elementos do DOM:');
        console.log('- Formulário:', loginForm ? '✅' : '❌');
        console.log('- Email input:', emailInput ? '✅' : '❌');
        console.log('- Password input:', passwordInput ? '✅' : '❌');

        // Testar login manual
        if (loginForm && emailInput && passwordInput && window.supabase) {
            console.log('🚀 Testando login manual...');

            emailInput.value = 'admin@italo.dev';
            passwordInput.value = 'Italo2025Admin!';

            // Simular submit
            const event = new Event('submit', { bubbles: true, cancelable: true });
            loginForm.dispatchEvent(event);
        }
    }, 2000);
});
