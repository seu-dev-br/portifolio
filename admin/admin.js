// Configuração do Firebase
// ATENÇÃO: Substitua essas configurações pelas suas credenciais reais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxl5gZsCHyu5h12saiSTEgsT10kZx7HBE",
  authDomain: "portifolio-32038.firebaseapp.com",
  projectId: "portifolio-32038",
  storageBucket: "portifolio-32038.firebasestorage.app",
  messagingSenderId: "336134796353",
  appId: "1:336134796353:web:469cdc6b3538c7b19a82c0",
  measurementId: "G-7L0CJD9TN0"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Instâncias dos serviços
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Variáveis globais
let currentUser = null;
let easyMDE = null;
let isEditing = false;
let editingPostId = null;

// Elements DOM
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const loadingSpinner = document.getElementById('loading-spinner');

// Navigation elements
const listPostsBtn = document.getElementById('list-posts-btn');
const newPostBtn = document.getElementById('new-post-btn');
const postsListSection = document.getElementById('posts-list-section');
const postEditorSection = document.getElementById('post-editor-section');

// Editor elements
const postForm = document.getElementById('post-form');
const editorTitle = document.getElementById('editor-title');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const postsContainer = document.getElementById('posts-container');

// Form elements
const postIdInput = document.getElementById('post-id');
const postTitleInput = document.getElementById('post-title');
const postExcerptInput = document.getElementById('post-excerpt');
const postTagsInput = document.getElementById('post-tags');
const postStatusSelect = document.getElementById('post-status');
const coverImageInput = document.getElementById('cover-image-input');
const coverImageUrlInput = document.getElementById('cover-image-url');
const coverImagePreview = document.getElementById('cover-image-preview');
const postContentTextarea = document.getElementById('post-content');

// Utility Functions
function showLoading() {
    loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message, container = null) {
    const errorDiv = container || loginError;
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.dashboard-section').prepend(successDiv);
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .trim();
}

function formatDate(timestamp) {
    if (!timestamp) return 'Sem data';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Authentication Functions
function initAuth() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            showDashboard();
            loadPosts();
        } else {
            currentUser = null;
            showLogin();
        }
    });
}

function showLogin() {
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
}

function showDashboard() {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    initializeEditor();
}

async function login(email, password) {
    try {
        showLoading();
        await auth.signInWithEmailAndPassword(email, password);
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Erro no login:', error);
        showError('Erro no login: ' + error.message);
    }
}

async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Erro no logout:', error);
        showError('Erro no logout: ' + error.message);
    }
}

// Editor Functions
function initializeEditor() {
    if (!easyMDE) {
        easyMDE = new EasyMDE({
            element: postContentTextarea,
            spellChecker: false,
            status: false,
            toolbar: [
                'bold', 'italic', 'heading', '|',
                'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', '|',
                'preview', 'side-by-side', 'fullscreen', '|',
                'guide'
            ],
            placeholder: 'Escreva o conteúdo do post em Markdown...'
        });
    }
}

// Navigation Functions
function showPostsList() {
    postsListSection.style.display = 'block';
    postEditorSection.style.display = 'none';
    listPostsBtn.classList.add('active');
    newPostBtn.classList.remove('active');
    loadPosts();
}

function showPostEditor(post = null) {
    postsListSection.style.display = 'none';
    postEditorSection.style.display = 'block';
    listPostsBtn.classList.remove('active');
    newPostBtn.classList.add('active');
    
    if (post) {
        // Modo edição
        isEditing = true;
        editingPostId = post.id;
        editorTitle.textContent = 'Editar Post';
        populateForm(post);
    } else {
        // Modo criação
        isEditing = false;
        editingPostId = null;
        editorTitle.textContent = 'Criar Novo Post';
        clearForm();
    }
}

function populateForm(post) {
    postIdInput.value = post.id;
    postTitleInput.value = post.title || '';
    postExcerptInput.value = post.excerpt || '';
    postTagsInput.value = post.tags ? post.tags.join(', ') : '';
    postStatusSelect.value = post.status || 'draft';
    coverImageUrlInput.value = post.coverImage || '';
    
    if (post.coverImage) {
        showImagePreview(post.coverImage);
    }
    
    if (easyMDE) {
        easyMDE.value(post.contentMarkdown || '');
    }
}

function clearForm() {
    postForm.reset();
    postIdInput.value = '';
    coverImagePreview.style.display = 'none';
    coverImagePreview.innerHTML = '';
    
    if (easyMDE) {
        easyMDE.value('');
    }
}

// Posts CRUD Functions
async function loadPosts() {
    try {
        showLoading();
        const postsSnapshot = await db.collection('posts')
            .orderBy('createdAt', 'desc')
            .get();
        
        displayPosts(postsSnapshot.docs);
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Erro ao carregar posts:', error);
        showError('Erro ao carregar posts: ' + error.message);
    }
}

function displayPosts(postsDocs) {
    postsContainer.innerHTML = '';
    
    if (postsDocs.length === 0) {
        postsContainer.innerHTML = '<p>Nenhum post encontrado. Crie seu primeiro post!</p>';
        return;
    }
    
    postsDocs.forEach(doc => {
        const post = { id: doc.id, ...doc.data() };
        const postCard = createPostCard(post);
        postsContainer.appendChild(postCard);
    });
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    const imageDiv = document.createElement('div');
    imageDiv.className = 'post-card-image';
    
    if (post.coverImage) {
        imageDiv.style.backgroundImage = `url(${post.coverImage})`;
    } else {
        imageDiv.textContent = 'Sem imagem';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-card-content';
    
    contentDiv.innerHTML = `
        <h3>${post.title || 'Sem título'}</h3>
        <p class="post-excerpt">${post.excerpt || 'Sem resumo disponível'}</p>
        <div class="post-meta">
            <span class="post-status ${post.status || 'draft'}">${post.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
            <span>${formatDate(post.createdAt)}</span>
        </div>
        <div class="post-card-actions">
            <button class="btn btn-primary edit-post-btn">Editar</button>
            <button class="btn btn-danger delete-post-btn">Excluir</button>
        </div>
    `;
    
    // Event listeners para os botões
    const editBtn = contentDiv.querySelector('.edit-post-btn');
    const deleteBtn = contentDiv.querySelector('.delete-post-btn');
    
    editBtn.addEventListener('click', () => showPostEditor(post));
    deleteBtn.addEventListener('click', () => deletePost(post.id, post.title));
    
    card.appendChild(imageDiv);
    card.appendChild(contentDiv);
    
    return card;
}

async function savePost(postData) {
    try {
        showLoading();
        
        if (isEditing && editingPostId) {
            // Atualizar post existente
            await db.collection('posts').doc(editingPostId).update({
                ...postData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showSuccess('Post atualizado com sucesso!');
        } else {
            // Criar novo post
            await db.collection('posts').add({
                ...postData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showSuccess('Post criado com sucesso!');
        }
        
        hideLoading();
        showPostsList();
    } catch (error) {
        hideLoading();
        console.error('Erro ao salvar post:', error);
        showError('Erro ao salvar post: ' + error.message);
    }
}

async function deletePost(postId, postTitle) {
    if (!confirm(`Tem certeza que deseja excluir o post "${postTitle}"?`)) {
        return;
    }
    
    try {
        showLoading();
        await db.collection('posts').doc(postId).delete();
        hideLoading();
        showSuccess('Post excluído com sucesso!');
        loadPosts();
    } catch (error) {
        hideLoading();
        console.error('Erro ao excluir post:', error);
        showError('Erro ao excluir post: ' + error.message);
    }
}

// Image Upload Functions
async function uploadImage(file) {
    if (!file) return null;
    
    try {
        showLoading();
        
        const fileName = `images/${Date.now()}_${file.name}`;
        const storageRef = storage.ref().child(fileName);
        
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        hideLoading();
        return downloadURL;
    } catch (error) {
        hideLoading();
        console.error('Erro no upload da imagem:', error);
        showError('Erro no upload da imagem: ' + error.message);
        return null;
    }
}

function showImagePreview(imageUrl) {
    coverImagePreview.innerHTML = `<img src="${imageUrl}" alt="Preview da imagem de capa">`;
    coverImagePreview.style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar autenticação
    initAuth();
    
    // Login form
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await login(email, password);
    });
    
    // Logout button
    logoutBtn.addEventListener('click', logout);
    
    // Navigation
    listPostsBtn.addEventListener('click', showPostsList);
    newPostBtn.addEventListener('click', () => showPostEditor());
    cancelEditBtn.addEventListener('click', showPostsList);
    
    // Cover image upload
    coverImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                coverImageUrlInput.value = imageUrl;
                showImagePreview(imageUrl);
            }
        }
    });
    
    // Cover image URL preview
    coverImageUrlInput.addEventListener('input', (e) => {
        const imageUrl = e.target.value.trim();
        if (imageUrl) {
            showImagePreview(imageUrl);
        } else {
            coverImagePreview.style.display = 'none';
        }
    });
    
    // Post form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = postTitleInput.value.trim();
        const excerpt = postExcerptInput.value.trim();
        const tagsString = postTagsInput.value.trim();
        const status = postStatusSelect.value;
        const coverImage = coverImageUrlInput.value.trim();
        const content = easyMDE ? easyMDE.value() : '';
        
        if (!title) {
            showError('O título é obrigatório!');
            return;
        }
        
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
        const slug = generateSlug(title);
        
        const postData = {
            title,
            slug,
            excerpt,
            tags,
            status,
            coverImage,
            contentMarkdown: content
        };
        
        // Se for um post publicado, adicionar publishedAt
        if (status === 'published' && (!isEditing || editingPostId)) {
            postData.publishedAt = firebase.firestore.FieldValue.serverTimestamp();
        }
        
        await savePost(postData);
    });
});

// Auto-save draft (opcional)
let autoSaveTimer;
function autoSaveDraft() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        if (easyMDE && postTitleInput.value.trim() && isEditing) {
            // Implementar auto-save se necessário
            console.log('Auto-save draft...');
        }
    }, 30000); // 30 segundos
}

// Adicionar listeners para auto-save
if (postTitleInput) {
    postTitleInput.addEventListener('input', autoSaveDraft);
}

console.log('Admin panel initialized successfully!');
