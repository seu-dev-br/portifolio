async function testAboutSettings() {
    console.log('=== TESTE DA SEÇÃO SOBRE ===');

    // Verificar se Supabase está inicializado
    if (!window.supabase) {
        console.error('❌ Supabase não está inicializado');
        return;
    }
    console.log('✅ Supabase inicializado');

    // Testar carregamento
    try {
        console.log('🔍 Testando carregamento...');
        const { data: loadData, error: loadError } = await window.supabase
            .from('settings')
            .select('value')
            .eq('key', 'about')
            .single();

        console.log('Dados carregados:', loadData);
        console.log('Erro no carregamento:', loadError);

        // Testar salvamento
        console.log('💾 Testando salvamento...');
        const testSettings = {
            bio: 'Teste de biografia',
            profileImage: 'https://example.com/test.jpg',
            skills: {
                frontend: 'HTML, CSS, JS',
                backend: 'Node.js',
                database: 'PostgreSQL',
                tools: 'Git, VS Code'
            },
            social: {
                github: 'https://github.com/test',
                linkedin: 'https://linkedin.com/test',
                twitter: 'https://twitter.com/test',
                email: 'test@example.com',
                city: 'São Paulo',
                phone: '(11) 99999-9999'
            }
        };

        const { error: saveError } = await window.supabase
            .from('settings')
            .upsert({
                key: 'about',
                value: testSettings,
                updated_at: new Date().toISOString()
            });

        console.log('Erro no salvamento:', saveError);

        if (!saveError) {
            console.log('✅ Salvamento realizado com sucesso');

            // Testar carregamento novamente
            console.log('🔍 Testando carregamento após salvamento...');
            const { data: reloadData, error: reloadError } = await window.supabase
                .from('settings')
                .select('value')
                .eq('key', 'about')
                .single();

            console.log('Dados recarregados:', reloadData);
            console.log('Erro no recarregamento:', reloadError);
        }

    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
    }
}

// Adicionar botão de teste na página admin
function addTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Testar Seção Sobre';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    testButton.onclick = testAboutSettings;
    document.body.appendChild(testButton);
}

// Executar quando a página carregar
window.addEventListener('load', () => {
    setTimeout(addTestButton, 1000);
});
