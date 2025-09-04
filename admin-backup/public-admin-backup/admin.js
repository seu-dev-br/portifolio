// Admin.js - Atualizado para Supabase (100% GRATUITO)
// Supabase será inicializado pelo script na página

// Aguardar o Supabase estar disponível
function waitForSupabase() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100; // 10 segundos máximo

        console.log('🔄 Waiting for Supabase client...');

        // Se o Supabase já estiver inicializado
        if (window.supabaseInitialized && window.supabase) {
            console.log('✅ Supabase client already initialized and ready!');
            console.log('🔗 Supabase URL:', window.supabase.supabaseUrl);
            return resolve(window.supabase);
        }

        // Adicionar listener para o evento 'supabaseReady'
        window.addEventListener('supabaseReady', () => {
            console.log('✅ Supabase client initialized via event!');
            if (window.supabase) {
                console.log('🔗 Supabase URL (from event):', window.supabase.supabaseUrl);
                resolve(window.supabase);
            } else {
                console.error('❌ Evento supabaseReady disparado, mas window.supabase não está definido!');
                reject(new Error('Evento supabaseReady disparado, mas window.supabase não está definido'));
            }
        }, { once: true });

        const checkSupabase = () => {
            attempts++;
            console.log(`🔄 Attempt ${attempts}/${maxAttempts} - Checking Supabase...`);

            if (window.supabase) {
                console.log('✅ Supabase client found and ready!');
                console.log('🔗 Supabase URL:', window.supabase.supabaseUrl);
                resolve(window.supabase);
            } else if (attempts >= maxAttempts) {
                console.error('❌ Supabase client not found after 10 seconds');
                reject(new Error('Supabase client not found after 10 seconds. Check if Supabase SDK is loaded correctly.'));
            } else {
                setTimeout(checkSupabase, 100);
            }
        };
        checkSupabase();
    });
}

// Variáveis globais
let currentUser = null;
let easyMDE = null;
let isEditing = false;
let editingPostId = null;
let editingProjectId = null;
let supabaseClient = null;

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
async function initAuth() {
    try {
        supabaseClient = await waitForSupabase();
        console.log('✅ Supabase client ready:', supabaseClient);

        // Verifica URLs para depuração
        console.log('🌐 URL do Supabase:', supabaseClient.supabaseUrl);
        
        // Check if user is already logged in
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        
        if (error) {
            console.error('❌ Erro ao verificar usuário atual:', error.message);
            showLogin();
            return;
        }
        
        if (user) {
            console.log('👤 Usuário já logado:', user.email);
            currentUser = user;
            showDashboard();
            loadPosts();
        } else {
            console.log('ℹ️ Nenhum usuário logado, mostrando tela de login');
            showLogin();
        }

        // Listen for auth changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Evento de autenticação:', event);
            if (session?.user) {
                currentUser = session.user;
                showDashboard();
                loadPosts();
            } else {
                currentUser = null;
                showLogin();
            }
        });
    } catch (error) {
        console.error('❌ Erro crítico na inicialização da autenticação:', error);
        showError('Erro ao inicializar autenticação: ' + error.message);
        showLogin();
    }
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
        console.log('🔐 Attempting login for:', email);
        showLoading();

        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        console.log('📡 Sending login request to Supabase...');
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('❌ Login error:', error);
            throw error;
        }

        console.log('✅ Login successful:', data.user?.email);
        hideLoading();

    } catch (error) {
        hideLoading();
        console.error('❌ Error during login:', error);
        showError('Erro no login: ' + error.message);
    }
}

async function logout() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Erro no logout:', error);
        showError('Erro no logout: ' + error.message);
    }
}

// Editor Functions
function initializeEditor() {
    if (!easyMDE && postContentTextarea) {
        console.log('🖊️ Inicializando editor Markdown');
        try {
            easyMDE = new EasyMDE({
                element: postContentTextarea,
                spellChecker: false,
                autosave: {
                    enabled: true,
                    delay: 5000,
                    uniqueId: 'post-editor-autosave'
                },
                status: ['autosave', 'words', 'lines', 'length'],
                toolbar: [
                    'bold', 'italic', 'heading', '|',
                    'quote', 'unordered-list', 'ordered-list', '|',
                    'link', 'image', '|',
                    'code', 'table', 'horizontal-rule', '|',
                    'preview', 'side-by-side', 'fullscreen', '|',
                    'guide'
                ],
                placeholder: 'Escreva o conteúdo do post em Markdown...',
                uploadImage: true,
                imageUploadFunction: async (file, onSuccess, onError) => {
                    try {
                        const imageUrl = await uploadImage(file, 'posts/content');
                        onSuccess(imageUrl);
                    } catch (error) {
                        console.error('❌ Erro ao fazer upload da imagem:', error);
                        onError('Erro ao fazer upload da imagem: ' + error.message);
                    }
                }
            });
            
            console.log('✅ Editor Markdown inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar editor Markdown:', error);
        }
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
    console.log('🔄 Função showPostEditor chamada', { post });
    
    // Verificar se os elementos necessários existem
    if (!postsListSection || !postEditorSection) {
        console.error('❌ Seções de posts não encontradas', {
            postsListSection: document.getElementById('posts-list-section'),
            postEditorSection: document.getElementById('post-editor-section')
        });
        return;
    }
    
    // Alternar visibilidade
    postsListSection.style.display = 'none';
    postEditorSection.style.display = 'block';
    
    // Atualizar classes ativas
    if (listPostsBtn) listPostsBtn.classList.remove('active');
    if (newPostBtn) newPostBtn.classList.add('active');
    
    console.log('✅ Alternou a visibilidade das seções com sucesso');
    
    if (post) {
        // Modo edição
        console.log('📝 Modo de edição para post:', post.title);
        isEditing = true;
        editingPostId = post.id;
        if (editorTitle) editorTitle.textContent = 'Editar Post';
        populateForm(post);
    } else {
        // Modo criação
        console.log('🆕 Modo de criação de novo post');
        isEditing = false;
        editingPostId = null;
        if (editorTitle) editorTitle.textContent = 'Criar Novo Post';
        clearForm();
    }
    
    // Inicializar o editor Markdown
    initializeEditor();
    console.log('✅ Editor Markdown inicializado');
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
        console.log('🔄 Carregando posts do Supabase...');
        
        const { data: posts, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        console.log(`✅ ${posts.length} posts carregados com sucesso`);
        
        // Verificar se temos posts para exibir
        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum post encontrado</h3>
                    <p>Comece criando seu primeiro post clicando no botão "Novo Post".</p>
                </div>
            `;
        } else {
            displayPosts(posts);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('❌ Erro ao carregar posts:', error);
        showError('Erro ao carregar posts: ' + error.message);
        
        // Exibir estado de erro
        postsContainer.innerHTML = `
            <div class="error-state">
                <h3>Erro ao carregar posts</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary retry-btn">Tentar novamente</button>
            </div>
        `;
        
        // Adicionar evento para tentar novamente
        const retryBtn = postsContainer.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', loadPosts);
        }
    }
}

function displayPosts(postsDocs) {
    postsContainer.innerHTML = '';
    
    if (postsDocs.length === 0) {
        postsContainer.innerHTML = '<p>Nenhum post encontrado. Crie seu primeiro post!</p>';
        return;
    }
    
    postsDocs.forEach(post => {
        const postCard = createPostCard(post);
        postsContainer.appendChild(postCard);
    });
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.dataset.postId = post.id;
    
    const imageDiv = document.createElement('div');
    imageDiv.className = 'post-card-image';
    
    if (post.coverImage) {
        imageDiv.style.backgroundImage = `url(${post.coverImage})`;
        
        // Adicionar botão para visualizar imagem em tamanho maior
        const zoomBtn = document.createElement('button');
        zoomBtn.className = 'image-zoom-btn';
        zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomBtn.title = 'Ampliar imagem';
        zoomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImageModal(post.coverImage, post.title);
        });
        imageDiv.appendChild(zoomBtn);
    } else {
        imageDiv.innerHTML = '<div class="no-image"><i class="fas fa-image"></i><span>Sem imagem</span></div>';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-card-content';
    
    // Formatar a data corretamente
    const formattedDate = formatDate(post.created_at);
    const publishedDate = post.published_at ? formatDate(post.published_at) : '';
    
    contentDiv.innerHTML = `
        <h3 title="${post.title || 'Sem título'}">${post.title || 'Sem título'}</h3>
        <div class="slug-container" title="/blog/${post.slug}">
            <span class="slug-label">Slug:</span>
            <span class="slug-value">${post.slug}</span>
            <button class="copy-slug-btn" title="Copiar URL"><i class="fas fa-copy"></i></button>
        </div>
        <p class="post-excerpt">${post.excerpt || post.description || 'Sem resumo disponível'}</p>
        <div class="post-meta">
            <div class="meta-group">
                <span class="post-status ${post.status || 'draft'}">${post.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                ${post.published_at ? `<span class="published-date" title="Data de publicação"><i class="fas fa-globe"></i> ${publishedDate}</span>` : ''}
            </div>
            <div class="meta-date" title="Data de criação">
                <i class="fas fa-calendar-alt"></i> ${formattedDate}
            </div>
        </div>
        <div class="post-card-actions">
            <button class="btn btn-primary edit-post-btn" title="Editar post">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger delete-post-btn" title="Excluir post">
                <i class="fas fa-trash-alt"></i> Excluir
            </button>
            <button class="btn ${post.status === 'published' ? 'btn-warning unpublish-post-btn' : 'btn-success publish-post-btn'}" title="${post.status === 'published' ? 'Despublicar post' : 'Publicar post'}">
                <i class="fas ${post.status === 'published' ? 'fa-eye-slash' : 'fa-globe'}"></i>
                ${post.status === 'published' ? 'Despublicar' : 'Publicar'}
            </button>
            ${post.status === 'published' ? 
                `<a href="/blog/${post.slug}" class="btn btn-outline-primary view-post-btn" target="_blank" title="Visualizar post no site">
                    <i class="fas fa-external-link-alt"></i> Ver
                </a>` : 
                `<button class="btn btn-outline-secondary preview-post-btn" title="Pré-visualizar post">
                    <i class="fas fa-eye"></i> Prévia
                </button>`
            }
        </div>
    `;
    
    // Event listeners para os botões
    const editBtn = contentDiv.querySelector('.edit-post-btn');
    const deleteBtn = contentDiv.querySelector('.delete-post-btn');
    const publishBtn = contentDiv.querySelector('.publish-post-btn, .unpublish-post-btn');
    const previewBtn = contentDiv.querySelector('.preview-post-btn');
    const copySlugBtn = contentDiv.querySelector('.copy-slug-btn');
    
    editBtn.addEventListener('click', () => showPostEditor(post));
    deleteBtn.addEventListener('click', () => deletePost(post.id, post.title));
    
    if (publishBtn) {
        publishBtn.addEventListener('click', () => togglePostStatus(post.id, post.status === 'published' ? 'draft' : 'published'));
    }
    
    if (previewBtn) {
        previewBtn.addEventListener('click', () => previewPost(post));
    }
    
    if (copySlugBtn) {
        copySlugBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/blog/${post.slug}`;
            navigator.clipboard.writeText(url)
                .then(() => {
                    showToast('URL copiada para a área de transferência!', 'success');
                    copySlugBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copySlugBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erro ao copiar URL:', err);
                    showToast('Erro ao copiar URL', 'error');
                });
        });
    }
    
    card.appendChild(imageDiv);
    card.appendChild(contentDiv);
    
    return card;
}

async function savePost(postData) {
    try {
        showLoading();
        
        // Gerar slug se não for fornecido
        if (!postData.slug) {
            postData.slug = generateSlug(postData.title);
        }
        
        // Adicionar data de publicação se o status for 'published'
        if (postData.status === 'published' && !postData.published_at) {
            postData.published_at = new Date().toISOString();
        }

        console.log('📝 Salvando post:', postData);

        if (isEditing && editingPostId) {
            // Atualizar post existente
            const { data, error } = await supabaseClient
                .from('posts')
                .update({
                    ...postData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingPostId)
                .select();

            if (error) throw error;
            console.log('✅ Post atualizado com sucesso:', data);
            showSuccess('Post atualizado com sucesso!');
        } else {
            // Criar novo post
            const { data, error } = await supabaseClient
                .from('posts')
                .insert([{
                    ...postData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            console.log('✅ Post criado com sucesso:', data);
            showSuccess('Post criado com sucesso!');
        }

        hideLoading();
        showPostsList();
    } catch (error) {
        hideLoading();
        console.error('❌ Erro ao salvar post:', error);
        showError('Erro ao salvar post: ' + error.message);
    }
}

async function deletePost(postId, postTitle) {
    if (!confirm(`Tem certeza que deseja excluir o post "${postTitle}"?`)) {
        return;
    }

    try {
        showLoading();
        const { error } = await supabaseClient
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) throw error;

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
async function uploadImage(file, folder = 'posts') {
    if (!file) return null;

    try {
        showLoading();
        console.log('📤 Iniciando upload de imagem:', file.name);

        // Sanitize filename
        const fileExt = file.name.split('.').pop().toLowerCase();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const uniqueName = `${Date.now()}-${sanitizedName}`;
        const filePath = `${folder}/${uniqueName}`;

        // Validate file type
        const validImageTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!validImageTypes.includes(fileExt)) {
            throw new Error(`Tipo de arquivo inválido. Use: ${validImageTypes.join(', ')}`);
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error(`Arquivo muito grande. O tamanho máximo é 5MB.`);
        }

        console.log(`🔄 Enviando arquivo para ${filePath}...`);
        const { data, error } = await supabaseClient.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
            .from('images')
            .getPublicUrl(filePath);

        console.log('✅ Upload concluído:', publicUrl);
        hideLoading();
        return publicUrl;
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

function showProjectImagePreview(imageUrl) {
    projectImagePreview.innerHTML = `<img src="${imageUrl}" alt="Preview da imagem do projeto">`;
    projectImagePreview.style.display = 'block';
}

// ========================================
// PROJECTS MANAGEMENT
// ========================================

// Projects Navigation Functions
function showProjectsList() {
    // Hide all sections
    postsListSection.style.display = 'none';
    postEditorSection.style.display = 'none';
    projectsListSection.style.display = 'block';
    projectEditorSection.style.display = 'none';
    
    // Update nav buttons
    listPostsBtn.classList.remove('active');
    newPostBtn.classList.remove('active');
    listProjectsBtn.classList.add('active');
    newProjectBtn.classList.remove('active');
    
    loadProjects();
}

function showProjectEditor(project = null) {
    // Hide all sections
    postsListSection.style.display = 'none';
    postEditorSection.style.display = 'none';
    projectsListSection.style.display = 'none';
    projectEditorSection.style.display = 'block';
    
    // Update nav buttons
    listPostsBtn.classList.remove('active');
    newPostBtn.classList.remove('active');
    listProjectsBtn.classList.remove('active');
    newProjectBtn.classList.add('active');
    
    if (project) {
        // Modo edição
        isEditing = true;
        editingProjectId = project.id;
        projectEditorTitle.textContent = 'Editar Projeto';
        populateProjectForm(project);
    } else {
        // Modo criação
        isEditing = false;
        editingProjectId = null;
        projectEditorTitle.textContent = 'Criar Novo Projeto';
        clearProjectForm();
    }
}

function populateProjectForm(project) {
    projectIdInput.value = project.id;
    projectTitleInput.value = project.title || '';
    projectDescriptionInput.value = project.description || '';
    projectTechnologiesInput.value = project.technologies ? project.technologies.join(', ') : '';
    projectDemoLinkInput.value = project.demoLink || '';
    projectGithubLinkInput.value = project.githubLink || '';
    projectDownloadLinkInput.value = project.downloadLink || '';
    projectStatusSelect.value = project.status || 'draft';
    projectImageUrlInput.value = project.image || '';
    
    if (project.image) {
        showProjectImagePreview(project.image);
    }
}

function clearProjectForm() {
    projectForm.reset();
    projectIdInput.value = '';
    projectImagePreview.style.display = 'none';
    projectImagePreview.innerHTML = '';
}

// Projects CRUD Functions
async function loadProjects() {
    try {
        showLoading();
        const { data: projects, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        displayProjects(projects);
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Erro ao carregar projetos:', error);
        showError('Erro ao carregar projetos: ' + error.message);
    }
}

function displayProjects(projectsDocs) {
    projectsContainer.innerHTML = '';
    
    if (projectsDocs.length === 0) {
        projectsContainer.innerHTML = '<p>Nenhum projeto encontrado. Crie seu primeiro projeto!</p>';
        return;
    }
    
    projectsDocs.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsContainer.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    const imageDiv = document.createElement('div');
    imageDiv.className = 'post-card-image';
    
    if (project.image) {
        imageDiv.style.backgroundImage = `url(${project.image})`;
    } else {
        imageDiv.textContent = 'Sem imagem';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-card-content';
    
    contentDiv.innerHTML = `
        <h3>${project.title || 'Sem título'}</h3>
        <p class="post-excerpt">${project.description || 'Sem descrição disponível'}</p>
        <div class="project-technologies">
            ${project.technologies ? project.technologies.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('') : ''}
        </div>
        <div class="post-meta">
            <span class="post-status ${project.status || 'draft'}">${project.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
            <span>${formatDate(project.created_at)}</span>
        </div>
        <div class="post-card-actions">
            <button class="btn btn-primary edit-project-btn">Editar</button>
            <button class="btn btn-danger delete-project-btn">Excluir</button>
        </div>
    `;
    
    // Event listeners para os botões
    const editBtn = contentDiv.querySelector('.edit-project-btn');
    const deleteBtn = contentDiv.querySelector('.delete-project-btn');
    
    editBtn.addEventListener('click', () => showProjectEditor(project));
    deleteBtn.addEventListener('click', () => deleteProject(project.id, project.title));
    
    card.appendChild(imageDiv);
    card.appendChild(contentDiv);
    
    return card;
}

async function saveProject(projectData) {
    try {
        showLoading();

        if (isEditing && editingProjectId) {
            // Atualizar projeto existente
            const { error } = await supabaseClient
                .from('projects')
                .update({
                    ...projectData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingProjectId);

            if (error) throw error;
            showSuccess('Projeto atualizado com sucesso!');
        } else {
            // Criar novo projeto
            const { error } = await supabaseClient
                .from('projects')
                .insert([{
                    ...projectData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);

            if (error) throw error;
            showSuccess('Projeto criado com sucesso!');
        }

        hideLoading();
        showProjectsList();
    } catch (error) {
        hideLoading();
        console.error('Erro ao salvar projeto:', error);
        showError('Erro ao salvar projeto: ' + error.message);
    }
}

async function deleteProject(projectId, projectTitle) {
    if (!confirm(`Tem certeza que deseja excluir o projeto "${projectTitle}"?`)) {
        return;
    }

    try {
        showLoading();
        const { error } = await supabaseClient
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) throw error;

        hideLoading();
        showSuccess('Projeto excluído com sucesso!');
        loadProjects();
    } catch (error) {
        hideLoading();
        console.error('Erro ao excluir projeto:', error);
        showError('Erro ao excluir projeto: ' + error.message);
    }
}

// Event Listeners - Agora gerenciados pelo init.js
// As funções de inicialização foram movidas para init.js

// Funções de navegação e outros event listeners
function setupEventListeners() {
    if (listPostsBtn) listPostsBtn.addEventListener('click', showPostsList);
    if (newPostBtn) newPostBtn.addEventListener('click', () => showPostEditor());
    if (listProjectsBtn) listProjectsBtn.addEventListener('click', showProjectsList);
    if (newProjectBtn) newProjectBtn.addEventListener('click', () => showProjectEditor());
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', showPostsList);
    if (cancelProjectEditBtn) cancelProjectEditBtn.addEventListener('click', showProjectsList);
}

// Expor função para ser chamada pelo init.js
window.setupAdminEventListeners = setupEventListeners;
    
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

    // Project image upload
    projectImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                projectImageUrlInput.value = imageUrl;
                showProjectImagePreview(imageUrl);
            }
        }
    });
    
    // Project image URL preview
    projectImageUrlInput.addEventListener('input', (e) => {
        const imageUrl = e.target.value.trim();
        if (imageUrl) {
            showProjectImagePreview(imageUrl);
        } else {
            projectImagePreview.style.display = 'none';
        }
    });
    
    // Post form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Validação de campos
            const title = postTitleInput.value.trim();
            const excerpt = postExcerptInput.value.trim();
            const tagsString = postTagsInput.value.trim();
            const status = postStatusSelect.value;
            let coverImage = coverImageUrlInput.value.trim();
            const content = easyMDE ? easyMDE.value() : '';
            
            // Validar campos obrigatórios
            const errors = [];
            if (!title) errors.push('O título é obrigatório');
            if (!excerpt) errors.push('O resumo é obrigatório');
            if (!content) errors.push('O conteúdo é obrigatório');
            
            if (errors.length > 0) {
                showError(`Por favor, corrija os seguintes campos: ${errors.join(', ')}`);
                return;
            }
            
            // Processar imagem de capa, se houver upload
            if (coverImageInput.files.length > 0) {
                console.log('🖼️ Nova imagem de capa detectada, iniciando upload...');
                coverImage = await uploadImage(coverImageInput.files[0], 'posts/covers');
                if (!coverImage) {
                    throw new Error('Falha ao enviar a imagem de capa');
                }
            }
            
            // Processar tags
            const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
            
            // Gerar slug
            const slug = generateSlug(title);
            
            // Preparar dados do post
            const postData = {
                title,
                slug,
                excerpt,
                tags,
                status,
                cover_image: coverImage,
                content_markdown: content
            };
            
            // Se for um post publicado, adicionar data de publicação
            if (status === 'published') {
                postData.published_at = new Date().toISOString();
            }
            
            console.log('📝 Enviando dados do post:', postData);
            await savePost(postData);
            
        } catch (error) {
            console.error('❌ Erro ao processar formulário:', error);
            showError('Erro ao processar formulário: ' + error.message);
        }
    });

    // Project form submit
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = projectTitleInput.value.trim();
        const description = projectDescriptionInput.value.trim();
        const technologiesString = projectTechnologiesInput.value.trim();
        const demoLink = projectDemoLinkInput.value.trim();
        const githubLink = projectGithubLinkInput.value.trim();
        const downloadLink = projectDownloadLinkInput.value.trim();
        const status = projectStatusSelect.value;
        const image = projectImageUrlInput.value.trim();
        
        if (!title) {
            showError('O título é obrigatório!');
            return;
        }
        
        const technologies = technologiesString ? technologiesString.split(',').map(tech => tech.trim()) : [];
        
        const projectData = {
            title,
            description,
            technologies,
            demoLink,
            githubLink,
            downloadLink,
            status,
            image
        };
        
        // Se for um projeto publicado, adicionar publishedAt
        if (status === 'published' && (!isEditing || editingProjectId)) {
            projectData.publishedAt = new Date().toISOString();
        }
        
        await saveProject(projectData);
    });
    
    // Finalizar configuração de eventos
    console.log('Event listeners configurados com sucesso');
}

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

        const { data: aboutData, error } = await supabaseClient
            .from('settings')
            .select('*')
            .eq('key', 'about')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error;
        }

        if (aboutData) {
            populateAboutForm(aboutData.value);
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
            updatedAt: new Date().toISOString()
        };

        const { error } = await supabaseClient
            .from('settings')
            .upsert({
                key: 'about',
                value: aboutData,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

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

        const fileExt = file.name.split('.').pop();
        const fileName = `profile-${Date.now()}.${fileExt}`;
        const filePath = `about/${fileName}`;

        const { data, error } = await supabaseClient.storage
            .from('images')
            .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
            .from('images')
            .getPublicUrl(filePath);

        profileImageUrlInput.value = publicUrl;
        updateProfileImagePreview(publicUrl);

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

// Formatar data para exibição
function formatDate(dateString) {
    if (!dateString) return 'Data desconhecida';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Modal para visualizar imagem em tamanho maior
function showImageModal(imageUrl, altText) {
    // Criar modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'image-modal-container';
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    
    // Adicionar imagem
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altText || 'Imagem do post';
    
    // Adicionar botões
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'image-modal-actions';
    
    // Botão de fechar
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-danger';
    closeBtn.innerHTML = '<i class="fas fa-times"></i> Fechar';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    // Botão para abrir em nova aba
    const openBtn = document.createElement('button');
    openBtn.className = 'btn btn-primary';
    openBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Abrir em nova aba';
    openBtn.addEventListener('click', () => {
        window.open(imageUrl, '_blank');
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
    
    // Fechar modal ao clicar fora
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

// Função para mostrar notificações toast
function showToast(message, type = 'info') {
    // Remover toast existente
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }
    
    // Criar novo toast
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    
    // Adicionar toast ao body
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Alternar status do post (publicado/rascunho)
async function togglePostStatus(postId, newStatus) {
    if (!postId) {
        showToast('ID do post inválido', 'error');
        return;
    }
    
    try {
        showLoading();
        
        const updateData = {
            status: newStatus
        };
        
        // Adicionar ou remover data de publicação
        if (newStatus === 'published') {
            updateData.published_at = new Date().toISOString();
        }
        
        const { data, error } = await supabaseClient
            .from('posts')
            .update(updateData)
            .eq('id', postId);
            
        if (error) {
            throw error;
        }
        
        showToast(`Post ${newStatus === 'published' ? 'publicado' : 'despublicado'} com sucesso!`, 'success');
        loadPosts(); // Recarregar a lista
    } catch (error) {
        console.error('Erro ao alterar status do post:', error);
        showToast(`Erro ao alterar status: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// Pré-visualizar post
function previewPost(post) {
    // Criar modal para pré-visualização
    const modalContainer = document.createElement('div');
    modalContainer.className = 'preview-modal-container';
    
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    
    // Cabeçalho do modal
    const header = document.createElement('div');
    header.className = 'preview-modal-header';
    header.innerHTML = `
        <h2>Pré-visualização: ${post.title}</h2>
        <button class="close-preview-btn"><i class="fas fa-times"></i></button>
    `;
    
    // Conteúdo do post
    const content = document.createElement('div');
    content.className = 'preview-modal-content';
    
    // Adicionar imagem de capa se existir
    if (post.coverImage) {
        const coverImg = document.createElement('div');
        coverImg.className = 'preview-cover-image';
        coverImg.style.backgroundImage = `url(${post.coverImage})`;
        content.appendChild(coverImg);
    }
    
    // Adicionar título e meta dados
    const postHeader = document.createElement('div');
    postHeader.className = 'preview-post-header';
    postHeader.innerHTML = `
        <h1>${post.title}</h1>
        <div class="preview-post-meta">
            <span>${formatDate(post.created_at)}</span>
        </div>
    `;
    content.appendChild(postHeader);
    
    // Adicionar conteúdo
    const postContent = document.createElement('div');
    postContent.className = 'preview-post-content markdown-body';
    
    // Converter markdown para HTML usando a biblioteca marked
    if (typeof marked !== 'undefined') {
        postContent.innerHTML = marked.parse(post.content || '');
    } else {
        // Fallback se marked não estiver disponível
        postContent.innerHTML = `<pre>${post.content || ''}</pre>`;
    }
    
    content.appendChild(postContent);
    
    // Montar modal
    modal.appendChild(header);
    modal.appendChild(content);
    modalContainer.appendChild(modal);
    
    // Adicionar ao body
    document.body.appendChild(modalContainer);
    
    // Event listeners
    const closeBtn = header.querySelector('.close-preview-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    // Fechar ao clicar fora
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

// Confirmar exclusão de post
function deletePost(postId, postTitle) {
    if (!postId) {
        showToast('ID do post inválido', 'error');
        return;
    }
    
    // Criar modal de confirmação
    const modalContainer = document.createElement('div');
    modalContainer.className = 'confirm-modal-container';
    
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    
    modal.innerHTML = `
        <div class="confirm-modal-header">
            <h3>Confirmar exclusão</h3>
        </div>
        <div class="confirm-modal-body">
            <p>Tem certeza que deseja excluir o post <strong>"${postTitle || 'Sem título'}"</strong>?</p>
            <p class="warning-text">Esta ação não pode ser desfeita!</p>
        </div>
        <div class="confirm-modal-footer">
            <button class="btn btn-outline-secondary cancel-btn">Cancelar</button>
            <button class="btn btn-danger confirm-btn">Excluir</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);
    
    // Event listeners
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    confirmBtn.addEventListener('click', async () => {
        try {
            showLoading();
            document.body.removeChild(modalContainer);
            
            const { error } = await supabaseClient
                .from('posts')
                .delete()
                .eq('id', postId);
                
            if (error) {
                throw error;
            }
            
            showToast('Post excluído com sucesso!', 'success');
            loadPosts(); // Recarregar a lista
        } catch (error) {
            console.error('Erro ao excluir post:', error);
            showToast(`Erro ao excluir post: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    });
    
    // Fechar ao clicar fora
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}

// Função para verificar a sessão do usuário
async function checkSession() {
    console.log('🔄 Verificando sessão do usuário...');
    try {
        const { data, error } = await supabaseClient.auth.getSession();
        
        if (error) {
            console.error('❌ Erro ao verificar sessão:', error.message);
            throw error;
        }
        
        if (data?.session) {
            console.log('✅ Usuário autenticado:', data.session.user.email);
            currentUser = data.session.user;
            showDashboard();
            loadPosts();
            return true;
        } else {
            console.log('ℹ️ Nenhum usuário autenticado');
            showLogin();
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        showLogin();
        return false;
    }
}

// Adicionar carregamento automático de posts quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Configurar todos os event listeners
    console.log('🔄 Configurando event listeners...');
    
    // Chamar a função que configura os event listeners
    setupEventListeners();
    console.log('✅ Event listeners configurados com sucesso');
    
    // Inicializar autenticação
    console.log('🔐 Inicializando autenticação...');
    initAuth();
    
    // Adicionar logs para debugging de todos os botões
    if (newPostBtn) {
        console.log('🔍 Botão Novo Post encontrado:', newPostBtn);
        // Adicionar um listener direto aqui também para garantir
        newPostBtn.addEventListener('click', function() {
            console.log('🖱️ Botão Novo Post clicado!');
            showPostEditor();
        });
    } else {
        console.error('❌ Botão Novo Post não encontrado!');
    }
    
    // Verificar outros elementos importantes
    console.log('🔍 Seção de editor de posts:', postEditorSection ? '✅ Encontrada' : '❌ Não encontrada');
    console.log('🔍 Seção de lista de posts:', postsListSection ? '✅ Encontrada' : '❌ Não encontrada');
    
    // Adicionar evento para carregar posts quando clicar na aba Posts
    if (navPosts) {
        const originalClickHandler = navPosts.onclick;
        navPosts.onclick = function(e) {
            if (originalClickHandler) originalClickHandler(e);
            setTimeout(() => {
                loadPosts();
            }, 100);
        };
    }
});
