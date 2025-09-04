// ======================================
// ADMIN DASHBOARD SUPABASE - VERSÃO MIGRADA
// ======================================

// Configuração do Supabase
const SUPABASE_URL = 'https://nattvkjaecceirxthizc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ';

// Inicializar cliente Supabase
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variáveis globais
let currentUser = null;
let easyMDE = null;
let isEditing = false;
let editingPostId = null;
let editingProjectId = null;

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
const listProjectsBtn = document.getElementById('list-projects-btn');
const newProjectBtn = document.getElementById('new-project-btn');
const postsListSection = document.getElementById('posts-list-section');
const postEditorSection = document.getElementById('post-editor-section');
const projectsListSection = document.getElementById('projects-list-section');
const projectEditorSection = document.getElementById('project-editor-section');

// Editor elements
const postForm = document.getElementById('post-form');
const editorTitle = document.getElementById('editor-title');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const postsContainer = document.getElementById('posts-container');
const projectsContainer = document.getElementById('projects-container');

// Form elements - Posts
const postIdInput = document.getElementById('post-id');
const postTitleInput = document.getElementById('post-title');
const postExcerptInput = document.getElementById('post-excerpt');
const postTagsInput = document.getElementById('post-tags');
const postStatusSelect = document.getElementById('post-status');
const coverImageInput = document.getElementById('cover-image-input');
const coverImageUrlInput = document.getElementById('cover-image-url');
const coverImagePreview = document.getElementById('cover-image-preview');
const postContentTextarea = document.getElementById('post-content');

// Form elements - Projects
const projectForm = document.getElementById('project-form');
const projectEditorTitle = document.getElementById('project-editor-title');
const cancelProjectEditBtn = document.getElementById('cancel-project-edit-btn');
const projectIdInput = document.getElementById('project-id');
const projectTitleInput = document.getElementById('project-title');
const projectDescriptionInput = document.getElementById('project-description');
const projectTechnologiesInput = document.getElementById('project-technologies');
const projectDemoLinkInput = document.getElementById('project-demo-link');
const projectGithubLinkInput = document.getElementById('project-github-link');
const projectDownloadLinkInput = document.getElementById('project-download-link');
const projectStatusSelect = document.getElementById('project-status');
const projectImageInput = document.getElementById('project-image-input');
const projectImageUrlInput = document.getElementById('project-image-url');
const projectImagePreview = document.getElementById('project-image-preview');

// ======================================
// UTILITY FUNCTIONS
// ======================================

function showLoading() {
    loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message, container = null) {
    console.error('❌ Erro:', message);
    const errorDiv = container || loginError;
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    console.log('✅ Sucesso:', message);
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

// ======================================
// AUTHENTICATION FUNCTIONS
// ======================================

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }
    
    showLoading();
    
    try {
        console.log('🔐 Tentando fazer login com Supabase...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('❌ Erro de autenticação:', error);
            if (error.message.includes('Email not confirmed')) {
                showError('Email não confirmado. Verifique sua caixa de entrada ou confirme manualmente no painel do Supabase.');
            } else if (error.message.includes('Invalid login credentials')) {
                showError('Credenciais inválidas. Verifique email e senha.');
            } else {
                showError(error.message);
            }
            return;
        }
        
        if (data.user) {
            console.log('✅ Login realizado com sucesso:', data.user.email);
            currentUser = data.user;
            showDashboard();
            showSuccess('Login realizado com sucesso!');
        }
        
    } catch (error) {
        console.error('❌ Erro no login:', error);
        showError('Erro interno. Verifique o console para mais detalhes.');
    } finally {
        hideLoading();
    }
}

async function handleLogout() {
    showLoading();
    
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('❌ Erro no logout:', error);
            showError('Erro ao fazer logout: ' + error.message);
            return;
        }
        
        console.log('✅ Logout realizado com sucesso');
        currentUser = null;
        showLogin();
        showSuccess('Logout realizado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        showError('Erro interno no logout.');
    } finally {
        hideLoading();
    }
}

// Verificar estado de autenticação
supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Estado de autenticação mudou:', event, session?.user?.email);
    
    if (session && session.user) {
        currentUser = session.user;
        showDashboard();
    } else {
        currentUser = null;
        showLogin();
    }
});

// ======================================
// UI FUNCTIONS
// ======================================

function showLogin() {
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
}

function showDashboard() {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    
    // Mostrar lista de posts por padrão
    showPostsList();
}

function showSection(sectionId) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Mostrar seção específica
    document.getElementById(sectionId).style.display = 'block';
    
    // Atualizar navegação ativa
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
}

function showPostsList() {
    showSection('posts-list-section');
    listPostsBtn.classList.add('active');
    loadPosts();
}

function showNewPost() {
    showSection('post-editor-section');
    newPostBtn.classList.add('active');
    resetPostForm();
    editorTitle.textContent = 'Criar Novo Post';
    isEditing = false;
    editingPostId = null;
}

function showProjectsList() {
    showSection('projects-list-section');
    listProjectsBtn.classList.add('active');
    loadProjects();
}

function showNewProject() {
    showSection('project-editor-section');
    newProjectBtn.classList.add('active');
    resetProjectForm();
    projectEditorTitle.textContent = 'Criar Novo Projeto';
    isEditing = false;
    editingProjectId = null;
}

// ======================================
// POSTS FUNCTIONS
// ======================================

async function loadPosts() {
    showLoading();
    
    try {
        console.log('📥 Carregando posts do Supabase...');
        
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Erro ao carregar posts:', error);
            showError('Erro ao carregar posts: ' + error.message);
            return;
        }
        
        console.log('✅ Posts carregados:', data?.length || 0);
        displayPosts(data || []);
        
    } catch (error) {
        console.error('❌ Erro ao carregar posts:', error);
        showError('Erro interno ao carregar posts.');
    } finally {
        hideLoading();
    }
}

function displayPosts(posts) {
    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<p>Nenhum post encontrado. <a href="#" onclick="showNewPost()">Criar primeiro post</a></p>';
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3>${post.title}</h3>
            <p class="post-meta">
                Status: <span class="status-badge ${post.status}">${post.status}</span>
                ${post.created_at ? `• Criado: ${new Date(post.created_at).toLocaleDateString('pt-BR')}` : ''}
            </p>
            <p class="post-excerpt">${post.excerpt || 'Sem resumo'}</p>
            <div class="post-actions">
                <button onclick="editPost('${post.id}')" class="btn btn-sm btn-primary">Editar</button>
                <button onclick="deletePost('${post.id}')" class="btn btn-sm btn-danger">Excluir</button>
            </div>
        </div>
    `).join('');
}

async function savePost(event) {
    event.preventDefault();
    showLoading();
    
    try {
        const postData = {
            title: postTitleInput.value,
            slug: generateSlug(postTitleInput.value),
            excerpt: postExcerptInput.value,
            content: postContentTextarea.value,
            tags: postTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag),
            status: postStatusSelect.value,
            cover_image: coverImageUrlInput.value,
            updated_at: new Date().toISOString()
        };
        
        let result;
        
        if (isEditing && editingPostId) {
            console.log('🔄 Atualizando post:', editingPostId);
            result = await supabase
                .from('posts')
                .update(postData)
                .eq('id', editingPostId)
                .select();
        } else {
            console.log('➕ Criando novo post');
            postData.created_at = new Date().toISOString();
            result = await supabase
                .from('posts')
                .insert([postData])
                .select();
        }
        
        if (result.error) {
            console.error('❌ Erro ao salvar post:', result.error);
            showError('Erro ao salvar post: ' + result.error.message);
            return;
        }
        
        console.log('✅ Post salvo com sucesso');
        showSuccess(isEditing ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!');
        showPostsList();
        
    } catch (error) {
        console.error('❌ Erro ao salvar post:', error);
        showError('Erro interno ao salvar post.');
    } finally {
        hideLoading();
    }
}

async function editPost(postId) {
    showLoading();
    
    try {
        console.log('📝 Carregando post para edição:', postId);
        
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();
        
        if (error) {
            console.error('❌ Erro ao carregar post:', error);
            showError('Erro ao carregar post: ' + error.message);
            return;
        }
        
        // Preencher formulário
        postIdInput.value = data.id;
        postTitleInput.value = data.title;
        postExcerptInput.value = data.excerpt || '';
        postTagsInput.value = data.tags ? data.tags.join(', ') : '';
        postStatusSelect.value = data.status;
        coverImageUrlInput.value = data.cover_image || '';
        postContentTextarea.value = data.content || '';
        
        // Configurar modo de edição
        isEditing = true;
        editingPostId = postId;
        editorTitle.textContent = 'Editar Post';
        
        showSection('post-editor-section');
        
    } catch (error) {
        console.error('❌ Erro ao carregar post:', error);
        showError('Erro interno ao carregar post.');
    } finally {
        hideLoading();
    }
}

async function deletePost(postId) {
    if (!confirm('Tem certeza que deseja excluir este post?')) {
        return;
    }
    
    showLoading();
    
    try {
        console.log('🗑️ Excluindo post:', postId);
        
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);
        
        if (error) {
            console.error('❌ Erro ao excluir post:', error);
            showError('Erro ao excluir post: ' + error.message);
            return;
        }
        
        console.log('✅ Post excluído com sucesso');
        showSuccess('Post excluído com sucesso!');
        loadPosts();
        
    } catch (error) {
        console.error('❌ Erro ao excluir post:', error);
        showError('Erro interno ao excluir post.');
    } finally {
        hideLoading();
    }
}

function resetPostForm() {
    postIdInput.value = '';
    postTitleInput.value = '';
    postExcerptInput.value = '';
    postTagsInput.value = '';
    postStatusSelect.value = 'draft';
    coverImageUrlInput.value = '';
    postContentTextarea.value = '';
    coverImagePreview.innerHTML = '';
}

// ======================================
// PROJECTS FUNCTIONS
// ======================================

async function loadProjects() {
    showLoading();
    
    try {
        console.log('📥 Carregando projetos do Supabase...');
        
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Erro ao carregar projetos:', error);
            showError('Erro ao carregar projetos: ' + error.message);
            return;
        }
        
        console.log('✅ Projetos carregados:', data?.length || 0);
        displayProjects(data || []);
        
    } catch (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        showError('Erro interno ao carregar projetos.');
    } finally {
        hideLoading();
    }
}

function displayProjects(projects) {
    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = '<p>Nenhum projeto encontrado. <a href="#" onclick="showNewProject()">Criar primeiro projeto</a></p>';
        return;
    }
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="post-card">
            <h3>${project.title}</h3>
            <p class="post-meta">
                Status: <span class="status-badge ${project.status}">${project.status}</span>
                ${project.created_at ? `• Criado: ${new Date(project.created_at).toLocaleDateString('pt-BR')}` : ''}
            </p>
            <p class="post-excerpt">${project.description || 'Sem descrição'}</p>
            <div class="post-actions">
                <button onclick="editProject('${project.id}')" class="btn btn-sm btn-primary">Editar</button>
                <button onclick="deleteProject('${project.id}')" class="btn btn-sm btn-danger">Excluir</button>
            </div>
        </div>
    `).join('');
}

async function saveProject(event) {
    event.preventDefault();
    showLoading();
    
    try {
        const projectData = {
            title: projectTitleInput.value,
            description: projectDescriptionInput.value,
            technologies: projectTechnologiesInput.value.split(',').map(tech => tech.trim()).filter(tech => tech),
            demo_link: projectDemoLinkInput.value,
            github_link: projectGithubLinkInput.value,
            download_link: projectDownloadLinkInput.value,
            status: projectStatusSelect.value,
            image_url: projectImageUrlInput.value,
            updated_at: new Date().toISOString()
        };
        
        let result;
        
        if (isEditing && editingProjectId) {
            console.log('🔄 Atualizando projeto:', editingProjectId);
            result = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', editingProjectId)
                .select();
        } else {
            console.log('➕ Criando novo projeto');
            projectData.created_at = new Date().toISOString();
            result = await supabase
                .from('projects')
                .insert([projectData])
                .select();
        }
        
        if (result.error) {
            console.error('❌ Erro ao salvar projeto:', result.error);
            showError('Erro ao salvar projeto: ' + result.error.message);
            return;
        }
        
        console.log('✅ Projeto salvo com sucesso');
        showSuccess(isEditing ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
        showProjectsList();
        
    } catch (error) {
        console.error('❌ Erro ao salvar projeto:', error);
        showError('Erro interno ao salvar projeto.');
    } finally {
        hideLoading();
    }
}

async function editProject(projectId) {
    showLoading();
    
    try {
        console.log('📝 Carregando projeto para edição:', projectId);
        
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
        
        if (error) {
            console.error('❌ Erro ao carregar projeto:', error);
            showError('Erro ao carregar projeto: ' + error.message);
            return;
        }
        
        // Preencher formulário
        projectIdInput.value = data.id;
        projectTitleInput.value = data.title;
        projectDescriptionInput.value = data.description || '';
        projectTechnologiesInput.value = data.technologies ? data.technologies.join(', ') : '';
        projectDemoLinkInput.value = data.demo_link || '';
        projectGithubLinkInput.value = data.github_link || '';
        projectDownloadLinkInput.value = data.download_link || '';
        projectStatusSelect.value = data.status;
        projectImageUrlInput.value = data.image_url || '';
        
        // Configurar modo de edição
        isEditing = true;
        editingProjectId = projectId;
        projectEditorTitle.textContent = 'Editar Projeto';
        
        showSection('project-editor-section');
        
    } catch (error) {
        console.error('❌ Erro ao carregar projeto:', error);
        showError('Erro interno ao carregar projeto.');
    } finally {
        hideLoading();
    }
}

async function deleteProject(projectId) {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) {
        return;
    }
    
    showLoading();
    
    try {
        console.log('🗑️ Excluindo projeto:', projectId);
        
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);
        
        if (error) {
            console.error('❌ Erro ao excluir projeto:', error);
            showError('Erro ao excluir projeto: ' + error.message);
            return;
        }
        
        console.log('✅ Projeto excluído com sucesso');
        showSuccess('Projeto excluído com sucesso!');
        loadProjects();
        
    } catch (error) {
        console.error('❌ Erro ao excluir projeto:', error);
        showError('Erro interno ao excluir projeto.');
    } finally {
        hideLoading();
    }
}

function resetProjectForm() {
    projectIdInput.value = '';
    projectTitleInput.value = '';
    projectDescriptionInput.value = '';
    projectTechnologiesInput.value = '';
    projectDemoLinkInput.value = '';
    projectGithubLinkInput.value = '';
    projectDownloadLinkInput.value = '';
    projectStatusSelect.value = 'draft';
    projectImageUrlInput.value = '';
    projectImagePreview.innerHTML = '';
}

// ======================================
// EVENT LISTENERS
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin dashboard inicializado com Supabase');
    
    // Verificar se Supabase está carregado
    if (typeof supabaseJs === 'undefined') {
        showError('Supabase SDK não carregado. Verifique a conexão com a internet.');
        return;
    }
    
    // Event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (listPostsBtn) {
        listPostsBtn.addEventListener('click', showPostsList);
    }
    
    if (newPostBtn) {
        newPostBtn.addEventListener('click', showNewPost);
    }
    
    if (listProjectsBtn) {
        listProjectsBtn.addEventListener('click', showProjectsList);
    }
    
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', showNewProject);
    }
    
    if (postForm) {
        postForm.addEventListener('submit', savePost);
    }
    
    if (projectForm) {
        projectForm.addEventListener('submit', saveProject);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', showPostsList);
    }
    
    if (cancelProjectEditBtn) {
        cancelProjectEditBtn.addEventListener('click', showProjectsList);
    }
    
    // Image preview handlers
    if (coverImageUrlInput) {
        coverImageUrlInput.addEventListener('input', function() {
            const url = this.value;
            if (url) {
                coverImagePreview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 200px; height: auto;">`;
            } else {
                coverImagePreview.innerHTML = '';
            }
        });
    }
    
    if (projectImageUrlInput) {
        projectImageUrlInput.addEventListener('input', function() {
            const url = this.value;
            if (url) {
                projectImagePreview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 200px; height: auto;">`;
            } else {
                projectImagePreview.innerHTML = '';
            }
        });
    }
    
    // Inicializar EasyMDE se disponível
    if (typeof EasyMDE !== 'undefined' && postContentTextarea) {
        easyMDE = new EasyMDE({
            element: postContentTextarea,
            spellChecker: false,
            status: false,
            toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen"]
        });
    }
    
    console.log('✅ Event listeners configurados');
});
