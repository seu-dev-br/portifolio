// Script de teste para as seções dinâmicas da página Sobre
console.log('=== TESTE DAS SEÇÕES DINÂMICAS ===');

// Função para testar se os elementos existem
function testDynamicSections() {
    const tests = [
        { id: 'experience-container', name: 'Container de Experiência' },
        { id: 'education-container', name: 'Container de Formação' },
        { id: 'certifications-container', name: 'Container de Certificações' },
        { id: 'gallery-container', name: 'Container de Galeria' },
        { id: 'add-experience-btn', name: 'Botão Adicionar Experiência' },
        { id: 'add-education-btn', name: 'Botão Adicionar Formação' },
        { id: 'add-certification-btn', name: 'Botão Adicionar Certificação' },
        { id: 'add-gallery-btn', name: 'Botão Adicionar Galeria' }
    ];

    console.log('Verificando elementos HTML:');
    tests.forEach(test => {
        const element = document.getElementById(test.id);
        if (element) {
            console.log(`✅ ${test.name}: Encontrado`);
        } else {
            console.log(`❌ ${test.name}: NÃO encontrado`);
        }
    });

    // Testar funções
    console.log('\nVerificando funções:');
    const functions = [
        { name: 'addExperienceItem', exists: typeof addExperienceItem === 'function' },
        { name: 'addEducationItem', exists: typeof addEducationItem === 'function' },
        { name: 'addCertificationItem', exists: typeof addCertificationItem === 'function' },
        { name: 'addGalleryItem', exists: typeof addGalleryItem === 'function' },
        { name: 'getExperienceData', exists: typeof getExperienceData === 'function' },
        { name: 'getEducationData', exists: typeof getEducationData === 'function' },
        { name: 'getCertificationsData', exists: typeof getCertificationsData === 'function' },
        { name: 'getGalleryData', exists: typeof getGalleryData === 'function' }
    ];

    functions.forEach(func => {
        if (func.exists) {
            console.log(`✅ Função ${func.name}: Disponível`);
        } else {
            console.log(`❌ Função ${func.name}: NÃO encontrada`);
        }
    });
}

// Executar teste quando a página carregar
window.addEventListener('load', () => {
    setTimeout(() => {
        // Só executar se estiver na seção about
        const aboutSection = document.getElementById('about-manager-section');
        if (aboutSection && aboutSection.style.display !== 'none') {
            testDynamicSections();
        }
    }, 1000);
});

// Adicionar botão de teste na página
function addTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Testar Seções Dinâmicas';
    testButton.style.cssText = `
        position: fixed;
        top: 60px;
        right: 10px;
        z-index: 9999;
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    testButton.onclick = testDynamicSections;
    document.body.appendChild(testButton);
}

// Executar quando a página carregar
window.addEventListener('load', () => {
    setTimeout(addTestButton, 1000);
});
// Arquivo removido (script de teste)
