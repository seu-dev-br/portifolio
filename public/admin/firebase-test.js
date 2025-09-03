// Teste do Firebase - Coloque este código no console do navegador
console.log('🔥 Testando Firebase...');

// Verificar se Firebase foi carregado
if (typeof firebase === 'undefined') {
    console.error('❌ Firebase não foi carregado!');
} else {
    console.log('✅ Firebase carregado');
}

// Verificar inicialização
try {
    const app = firebase.app();
    console.log('✅ Firebase app inicializado:', app.name);
} catch (error) {
    console.error('❌ Erro na inicialização:', error);
}

// Verificar Auth
try {
    const auth = firebase.auth();
    console.log('✅ Firebase Auth disponível');
    
    // Verificar estado de autenticação
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('✅ Usuário logado:', user.email);
        } else {
            console.log('⚠️ Nenhum usuário logado');
        }
    });
} catch (error) {
    console.error('❌ Erro no Auth:', error);
}

// Teste de login (substitua email e senha)
function testLogin(email, password) {
    console.log('🧪 Testando login...');
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('✅ Login bem-sucedido:', userCredential.user.email);
        })
        .catch((error) => {
            console.error('❌ Erro no login:', error.code, error.message);
        });
}

console.log('Para testar login, execute: testLogin("seu@email.com", "suaSenha")');
