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

// ========================================
// ABOUT PAGE MANAGEMENT
// ========================================

// About page elements
const aboutManagerBtn = document.getElementById('about-manager-btn');
const aboutManagerSection = document.getElementById('about-manager-section');
const aboutForm = document.getElementById('about-form');
const cancelAboutBtn = document.getElementById('cancel-about-btn');

// About form elements
const aboutBioInput = document.getElementById('about-bio');
const profileImageInput = document.getElementById('profile-image-input');
const profileImageUrlInput = document.getElementById('profile-image-url');
const profileImagePreview = document.getElementById('profile-image-preview');

// Skills inputs
const skillsFrontendInput = document.getElementById('skills-frontend');
const skillsBackendInput = document.getElementById('skills-backend');
const skillsDatabaseInput = document.getElementById('skills-database');
const skillsToolsInput = document.getElementById('skills-tools');

// Social links inputs
const socialGithubInput = document.getElementById('social-github');
const socialLinkedinInput = document.getElementById('social-linkedin');
const socialTwitterInput = document.getElementById('social-twitter');
const socialEmailInput = document.getElementById('social-email');

// Dynamic containers
const experienceContainer = document.getElementById('experience-container');
const educationContainer = document.getElementById('education-container');
const certificationsContainer = document.getElementById('certifications-container');

// Add buttons
const addExperienceBtn = document.getElementById('add-experience-btn');
const addEducationBtn = document.getElementById('add-education-btn');
const addCertificationBtn = document.getElementById('add-certification-btn');

// About page navigation
if (aboutManagerBtn) {
    aboutManagerBtn.addEventListener('click', function() {
        showAboutManager();
    });
}

// About form submission
if (aboutForm) {
    aboutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAboutData();
    });
}

// Cancel about editing
if (cancelAboutBtn) {
    cancelAboutBtn.addEventListener('click', function() {
        showPostsList();
    });
}

// Profile image upload
if (profileImageInput) {
    profileImageInput.addEventListener('change', function(e) {
        handleProfileImageUpload(e.target.files[0]);
    });
}

// Profile image URL input
if (profileImageUrlInput) {
    profileImageUrlInput.addEventListener('input', function(e) {
        updateProfileImagePreview(e.target.value);
    });
}

// Add dynamic sections
if (addExperienceBtn) {
    addExperienceBtn.addEventListener('click', addExperienceItem);
}

if (addEducationBtn) {
    addEducationBtn.addEventListener('click', addEducationItem);
}

if (addCertificationBtn) {
    addCertificationBtn.addEventListener('click', addCertificationItem);
}

// About page functions
function showAboutManager() {
    // Hide other sections
    postsListSection.style.display = 'none';
    postEditorSection.style.display = 'none';
    aboutManagerSection.style.display = 'block';
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    aboutManagerBtn.classList.add('active');
    
    // Load current about data
    loadAboutData();
}

async function loadAboutData() {
    try {
        showLoading();
        
        const aboutRef = firebase.firestore().doc('settings/about');
        const aboutSnap = await aboutRef.get();
        
        if (aboutSnap.exists()) {
            const data = aboutSnap.data();
            populateAboutForm(data);
        } else {
            // Initialize with default values if no data exists
            populateAboutForm({});
        }
        
    } catch (error) {
        console.error('Error loading about data:', error);
        showError('Erro ao carregar dados da página sobre');
    } finally {
        hideLoading();
    }
}

function populateAboutForm(data) {
    // Basic info
    if (aboutBioInput) aboutBioInput.value = data.bio || '';
    if (profileImageUrlInput) profileImageUrlInput.value = data.profileImage || '';
    
    // Update image preview
    if (data.profileImage) {
        updateProfileImagePreview(data.profileImage);
    }
    
    // Skills
    if (data.skills) {
        if (skillsFrontendInput) skillsFrontendInput.value = (data.skills.frontend || []).join(', ');
        if (skillsBackendInput) skillsBackendInput.value = (data.skills.backend || []).join(', ');
        if (skillsDatabaseInput) skillsDatabaseInput.value = (data.skills.database || []).join(', ');
        if (skillsToolsInput) skillsToolsInput.value = (data.skills.tools || []).join(', ');
    }
    
    // Social links
    if (data.socialLinks) {
        if (socialGithubInput) socialGithubInput.value = data.socialLinks.github || '';
        if (socialLinkedinInput) socialLinkedinInput.value = data.socialLinks.linkedin || '';
        if (socialTwitterInput) socialTwitterInput.value = data.socialLinks.twitter || '';
        if (socialEmailInput) socialEmailInput.value = data.socialLinks.email || '';
    }
    
    // Dynamic sections
    populateExperience(data.experience || []);
    populateEducation(data.education || []);
    populateCertifications(data.certifications || []);
}

async function saveAboutData() {
    try {
        showLoading();
        
        const aboutData = {
            bio: aboutBioInput.value.trim(),
            profileImage: profileImageUrlInput.value.trim(),
            skills: {
                frontend: skillsFrontendInput.value.split(',').map(s => s.trim()).filter(s => s),
                backend: skillsBackendInput.value.split(',').map(s => s.trim()).filter(s => s),
                database: skillsDatabaseInput.value.split(',').map(s => s.trim()).filter(s => s),
                tools: skillsToolsInput.value.split(',').map(s => s.trim()).filter(s => s)
            },
            socialLinks: {
                github: socialGithubInput.value.trim(),
                linkedin: socialLinkedinInput.value.trim(),
                twitter: socialTwitterInput.value.trim(),
                email: socialEmailInput.value.trim()
            },
            experience: collectExperienceData(),
            education: collectEducationData(),
            certifications: collectCertificationData(),
            updatedAt: new Date()
        };
        
        const aboutRef = firebase.firestore().doc('settings/about');
        await aboutRef.set(aboutData);
        
        showSuccess('Informações da página "Sobre" salvas com sucesso!');
        
    } catch (error) {
        console.error('Error saving about data:', error);
        showError('Erro ao salvar informações da página sobre');
    } finally {
        hideLoading();
    }
}

async function handleProfileImageUpload(file) {
    if (!file) return;
    
    try {
        showLoading();
        
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`about/profile-${Date.now()}-${file.name}`);
        
        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();
        
        profileImageUrlInput.value = downloadURL;
        updateProfileImagePreview(downloadURL);
        
        showSuccess('Imagem do perfil enviada com sucesso!');
        
    } catch (error) {
        console.error('Error uploading profile image:', error);
        showError('Erro ao enviar imagem do perfil');
    } finally {
        hideLoading();
    }
}

function updateProfileImagePreview(imageUrl) {
    if (!profileImagePreview) return;
    
    if (imageUrl) {
        profileImagePreview.innerHTML = `<img src="${imageUrl}" alt="Prévia da imagem do perfil" />`;
    } else {
        profileImagePreview.innerHTML = '';
    }
}

// Dynamic Experience Management
function addExperienceItem() {
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.innerHTML = `
        <button type="button" class="item-remove-btn" onclick="this.parentElement.remove()">×</button>
        <h4>Nova Experiência</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Cargo:</label>
                <input type="text" class="exp-position" placeholder="Ex: Desenvolvedor Full Stack">
            </div>
            <div class="form-group">
                <label>Empresa:</label>
                <input type="text" class="exp-company" placeholder="Ex: Tech Solutions Inc.">
            </div>
        </div>
        <div class="form-group">
            <label>Período:</label>
            <input type="text" class="exp-period" placeholder="Ex: Jan 2020 - Atual">
        </div>
        <div class="form-group">
            <label>Descrição:</label>
            <textarea class="exp-description" rows="3" placeholder="Descreva suas responsabilidades e conquistas..."></textarea>
        </div>
        <div class="form-group">
            <label>Tecnologias Utilizadas:</label>
            <input type="text" class="exp-technologies" placeholder="React, Node.js, MongoDB... (separados por vírgula)">
        </div>
    `;
    experienceContainer.appendChild(experienceItem);
}

function populateExperience(experiences) {
    experienceContainer.innerHTML = '';
    experiences.forEach(exp => {
        addExperienceItem();
        const item = experienceContainer.lastElementChild;
        item.querySelector('.exp-position').value = exp.position || '';
        item.querySelector('.exp-company').value = exp.company || '';
        item.querySelector('.exp-period').value = exp.period || '';
        item.querySelector('.exp-description').value = exp.description || '';
        item.querySelector('.exp-technologies').value = (exp.technologies || []).join(', ');
    });
}

function collectExperienceData() {
    const experiences = [];
    experienceContainer.querySelectorAll('.experience-item').forEach(item => {
        const technologies = item.querySelector('.exp-technologies').value
            .split(',').map(s => s.trim()).filter(s => s);
            
        experiences.push({
            position: item.querySelector('.exp-position').value.trim(),
            company: item.querySelector('.exp-company').value.trim(),
            period: item.querySelector('.exp-period').value.trim(),
            description: item.querySelector('.exp-description').value.trim(),
            technologies: technologies
        });
    });
    return experiences.filter(exp => exp.position && exp.company);
}

// Dynamic Education Management
function addEducationItem() {
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.innerHTML = `
        <button type="button" class="item-remove-btn" onclick="this.parentElement.remove()">×</button>
        <h4>Nova Formação</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Curso/Grau:</label>
                <input type="text" class="edu-degree" placeholder="Ex: Bacharelado em Ciência da Computação">
            </div>
            <div class="form-group">
                <label>Instituição:</label>
                <input type="text" class="edu-institution" placeholder="Ex: Universidade Federal">
            </div>
        </div>
        <div class="form-group">
            <label>Período:</label>
            <input type="text" class="edu-period" placeholder="Ex: 2018 - 2022">
        </div>
        <div class="form-group">
            <label>Descrição (opcional):</label>
            <textarea class="edu-description" rows="2" placeholder="Informações adicionais sobre a formação..."></textarea>
        </div>
    `;
    educationContainer.appendChild(educationItem);
}

function populateEducation(education) {
    educationContainer.innerHTML = '';
    education.forEach(edu => {
        addEducationItem();
        const item = educationContainer.lastElementChild;
        item.querySelector('.edu-degree').value = edu.degree || '';
        item.querySelector('.edu-institution').value = edu.institution || '';
        item.querySelector('.edu-period').value = edu.period || '';
        item.querySelector('.edu-description').value = edu.description || '';
    });
}

function collectEducationData() {
    const education = [];
    educationContainer.querySelectorAll('.education-item').forEach(item => {
        education.push({
            degree: item.querySelector('.edu-degree').value.trim(),
            institution: item.querySelector('.edu-institution').value.trim(),
            period: item.querySelector('.edu-period').value.trim(),
            description: item.querySelector('.edu-description').value.trim()
        });
    });
    return education.filter(edu => edu.degree && edu.institution);
}

// Dynamic Certification Management
function addCertificationItem() {
    const certificationItem = document.createElement('div');
    certificationItem.className = 'certification-item';
    certificationItem.innerHTML = `
        <button type="button" class="item-remove-btn" onclick="this.parentElement.remove()">×</button>
        <h4>Nova Certificação</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Nome da Certificação:</label>
                <input type="text" class="cert-name" placeholder="Ex: AWS Solutions Architect">
            </div>
            <div class="form-group">
                <label>Emissor:</label>
                <input type="text" class="cert-issuer" placeholder="Ex: Amazon Web Services">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Data de Obtenção:</label>
                <input type="text" class="cert-date" placeholder="Ex: Janeiro 2023">
            </div>
            <div class="form-group">
                <label>URL da Credencial:</label>
                <input type="url" class="cert-url" placeholder="https://credenciais.exemplo.com/123">
            </div>
        </div>
        <div class="form-group">
            <label>Imagem da Certificação:</label>
            <input type="url" class="cert-image" placeholder="URL da imagem da certificação">
        </div>
    `;
    certificationsContainer.appendChild(certificationItem);
}

function populateCertifications(certifications) {
    certificationsContainer.innerHTML = '';
    certifications.forEach(cert => {
        addCertificationItem();
        const item = certificationsContainer.lastElementChild;
        item.querySelector('.cert-name').value = cert.name || '';
        item.querySelector('.cert-issuer').value = cert.issuer || '';
        item.querySelector('.cert-date').value = cert.date || '';
        item.querySelector('.cert-url').value = cert.credentialUrl || '';
        item.querySelector('.cert-image').value = cert.image || '';
    });
}

function collectCertificationData() {
    const certifications = [];
    certificationsContainer.querySelectorAll('.certification-item').forEach(item => {
        certifications.push({
            name: item.querySelector('.cert-name').value.trim(),
            issuer: item.querySelector('.cert-issuer').value.trim(),
            date: item.querySelector('.cert-date').value.trim(),
            credentialUrl: item.querySelector('.cert-url').value.trim(),
            image: item.querySelector('.cert-image').value.trim()
        });
    });
    return certifications.filter(cert => cert.name && cert.issuer);
}
