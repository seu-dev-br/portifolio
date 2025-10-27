// Admin.ts - Painel Administrativo com Supabase (TypeScript)
// Atualizado para Supabase (100% GRATUITO)

// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================

let adminCurrentUser= null;
let adminEasyMDE= null;
let adminIsEditing= false;
let adminEditingPostId= null;
let adminEditingProjectId= null;

// ==========================================
// INICIALIZAÇÃO DO DOM
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded disparado, inicializando admin...');
    initializeDOMElements();
    initializeEventListeners();
    initializeTabNavigation();
    console.log('✅ Inicialização do admin concluída');
});

// ==========================================
// ELEMENTOS DOM
// ==========================================

// Containers principais
let adminLoginContainer = null;
let adminDashboardContainer = null;
let adminLoginForm = null;
let adminLoginError = null;
let adminLogoutBtn = null;
let adminLoadingSpinner = null;

// Navigation elements
let adminListPostsBtn = null;
let adminNewPostBtn = null;
let adminListProjectsBtn = null;
let adminNewProjectBtn = null;
let adminPostsListSection = null;
let adminPostEditorSection = null;
let adminProjectsListSection = null;
let adminProjectEditorSection = null;

// Editor elements
let adminPostForm = null;
let adminEditorTitle = null;
let adminCancelEditBtn = null;
let adminPostsContainer = null;
let adminProjectsContainer = null;

// Form elements - Posts
let adminPostIdInput = null;
let adminPostTitleInput = null;
let adminPostExcerptInput = null;
let adminPostTagsInput = null;
let adminPostStatusSelect = null;
let adminCoverImageInput = null;
let adminCoverImageUrlInput = null;
let adminCoverImagePreview = null;
let adminPostContentTextarea = null;

// Form elements - Projects
let adminProjectIdInput = null;
let adminProjectTitleInput = null;
let adminProjectDescriptionInput = null;
let adminProjectTechnologiesInput = null;
let adminProjectDemoLinkInput = null;
let adminProjectGithubLinkInput = null;
let adminProjectDownloadLinkInput = null;
let adminProjectStatusSelect = null;
let adminProjectImageInput = null;
let adminProjectImageUrlInput = null;
let adminProjectImagePreview = null;
let adminProjectForm = null;

// Other elements
let adminHomeManagerBtn = null;
let adminAboutManagerBtn = null;
let adminHomeManagerSection = null;
let adminAboutManagerSection = null;
let adminHomeForm = null;
let adminAboutForm = null;
// ==========================================
// INICIALIZAÇÃO DOS ELEMENTOS DOM
// ==========================================

function initializeDOMElements() {
    console.log('🔍 Inicializando elementos DOM...');

    // Containers principais
    adminLoginContainer = document.getElementById('login-container');
    adminDashboardContainer = document.getElementById('dashboard-container');
    adminLoginForm = document.getElementById('login-form');
    adminLoginError = document.getElementById('login-error');
    adminLogoutBtn = document.getElementById('logout-btn');
    adminLoadingSpinner = document.getElementById('loading-spinner');

    console.log('📦 Containers encontrados:', {
        loginContainer: !!adminLoginContainer,
        dashboardContainer: !!adminDashboardContainer,
        loginForm: !!adminLoginForm,
        loginError: !!adminLoginError,
        logoutBtn: !!adminLogoutBtn,
        loadingSpinner: !!adminLoadingSpinner
    });

    // Navigation elements
    adminListPostsBtn = document.getElementById('list-posts-btn');
    adminNewPostBtn = document.getElementById('add-post-btn');
    adminListProjectsBtn = document.getElementById('list-projects-btn');
    adminNewProjectBtn = document.getElementById('add-project-btn');
    adminPostsListSection = document.getElementById('posts-list-section');
    adminPostEditorSection = document.getElementById('post-editor-section');
    adminProjectsListSection = document.getElementById('projects-list-section');
    adminProjectEditorSection = document.getElementById('project-editor-section');

    // Editor elements
    adminPostForm = document.getElementById('post-form');
    adminEditorTitle = document.getElementById('editor-title');
    adminCancelEditBtn = document.getElementById('cancel-edit-btn');
    adminPostsContainer = document.getElementById('posts-list');
    adminProjectsContainer = document.getElementById('projects-list');

    // Form elements - Posts
    adminPostIdInput = document.getElementById('post-id');
    adminPostTitleInput = document.getElementById('post-title');
    adminPostExcerptInput = document.getElementById('post-excerpt');
    adminPostTagsInput = document.getElementById('post-tags');
    adminPostStatusSelect = document.getElementById('post-status');
    adminCoverImageInput = document.getElementById('cover-image-input');
    adminCoverImageUrlInput = document.getElementById('cover-image-url');
    adminCoverImagePreview = document.getElementById('cover-image-preview');
    adminPostContentTextarea = document.getElementById('post-content');

    // Form elements - Projects
    adminProjectForm = document.getElementById('project-form');
    adminProjectIdInput = document.getElementById('project-id');
    adminProjectTitleInput = document.getElementById('project-title');
    adminProjectDescriptionInput = document.getElementById('project-description');
    adminProjectTechnologiesInput = document.getElementById('project-technologies');
    adminProjectDemoLinkInput = document.getElementById('project-demo-link');
    adminProjectGithubLinkInput = document.getElementById('project-github-link');
    adminProjectDownloadLinkInput = document.getElementById('project-download-link');
    adminProjectStatusSelect = document.getElementById('project-status');
    adminProjectImageInput = document.getElementById('project-image-input');
    adminProjectImageUrlInput = document.getElementById('project-image-url');
    adminProjectImagePreview = document.getElementById('project-image-preview');

    // Home and About management elements
    adminHomeManagerBtn = document.getElementById('home-manager-btn');
    adminAboutManagerBtn = document.getElementById('about-manager-btn');
    adminHomeManagerSection = document.getElementById('home-manager-section');
    adminAboutManagerSection = document.getElementById('about-manager-section');
    adminHomeForm = document.getElementById('home-form');
    adminAboutForm = document.getElementById('about-form');
}

// ==========================================
// NAVEGAÇÃO ENTRE ABAS
// ==========================================

function initializeTabNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            const targetView = navItem.getAttribute('data-view');
            
            // Remove active class from all nav items
            navItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked nav item
            navItem.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show target tab content
            const targetTab = document.getElementById(targetView + '-tab');
            if (targetTab) {
                targetTab.style.display = 'block';
                
                // Load data when switching to specific tabs
                if (targetView === 'posts') {
                    loadPosts();
                } else if (targetView === 'projects') {
                    loadProjects();
                } else if (targetView === 'messages') {
                    loadMessages();
                }
            }
        });
    });
    
    // Show overview tab by default
    const overviewTab = document.getElementById('overview-tab');
    if (overviewTab) {
        // Hide all tabs first
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        // Show overview
        overviewTab.style.display = 'block';
        
        // Set first nav item as active
        if (navItems.length > 0) {
            navItems[0].classList.add('active');
        }
    }
}

// ==========================================
// INICIALIZAÇÃO DOS EVENT LISTENERS
// ==========================================

function initializeEventListeners() {
    console.log('🎧 Inicializando event listeners...');

    // Login form
    if (adminLoginForm) {
        console.log('✅ Formulário de login encontrado, configurando event listener...');
        adminLoginForm.addEventListener('submit', async (e) => {
            console.log('📝 Formulário submetido!');
            e.preventDefault();
            console.log('🛑 Default prevented');

            const email = (document.getElementById('email')).value;
            const password = (document.getElementById('password')).value;

            console.log('📧 Email:', email);
            console.log('🔑 Password length:', password.length);

            await loginAdmin(email, password);
        });
    } else {
        console.error('❌ Formulário de login não encontrado!');
    }

    // Logout button
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', async () => {
            await logoutAdmin();
        });
    }

    // Navigation buttons
    if (adminListPostsBtn) {
        adminListPostsBtn.addEventListener('click', () => {
            hideAllSections();
            adminPostsListSection.style.display = 'block';
            loadPosts();
        });
    }

    if (adminNewPostBtn) {
        adminNewPostBtn.addEventListener('click', () => {
            hideAllSections();
            adminPostEditorSection.style.display = 'block';
            clearPostForm();
        });
    }

    if (adminListProjectsBtn) {
        adminListProjectsBtn.addEventListener('click', () => {
            hideAllSections();
            adminProjectsListSection.style.display = 'block';
            loadProjects();
        });
    }

    if (adminNewProjectBtn) {
        adminNewProjectBtn.addEventListener('click', () => {
            hideAllSections();
            adminProjectEditorSection.style.display = 'block';
            clearProjectForm();
        });
    }

    // Posts container
    if (adminPostsContainer) {
        adminPostsContainer.addEventListener('click', async (e) => {
            const target = e.target;
            if (target.classList.contains('edit-post-btn')) {
                const postId = target.dataset.postId;
                await editPost(postId);
            } else if (target.classList.contains('delete-post-btn')) {
                const postId = target.dataset.postId;
                await deletePost(postId);
            }
        });
    }

    // Post form
    if (adminPostForm) {
        adminPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await savePost();
        });
    }

    // Projects container
    if (adminProjectsContainer) {
        adminProjectsContainer.addEventListener('click', async (e) => {
            const target = e.target;
            if (target.classList.contains('edit-project-btn')) {
                const projectId = target.dataset.projectId;
                await editProject(projectId);
            } else if (target.classList.contains('delete-project-btn')) {
                const projectId = target.dataset.projectId;
                await deleteProject(projectId);
            }
        });
    }

    // Project form
    if (adminProjectForm) {
        adminProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProject();
        });
    }

    // Home and About management buttons
    if (adminHomeManagerBtn) {
        adminHomeManagerBtn.addEventListener('click', async () => {
            hideAllSections();
            document.getElementById('home-manager-section').style.display = 'block';
            await loadHomeContent();
        });
    }

    if (adminAboutManagerBtn) {
        adminAboutManagerBtn.addEventListener('click', async () => {
            hideAllSections();
            document.getElementById('about-manager-section').style.display = 'block';
            await loadAboutContent();
        });
    }

    // Global click handler for modal close
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ==========================================

async function loginAdmin(email, password){
    console.log('🔐 Iniciando login...', { email });

    try {
        showAdminLoading();
        console.log('⏳ Loading mostrado');

        if (!window.supabase) {
            console.error('❌ Supabase não inicializado');
            throw new Error('Cliente Supabase não inicializado');
        }

        console.log('✅ Supabase encontrado, fazendo login...');

        const { data, error } = await window.supabase.auth.signInWithPassword({
            email,
            password
        });

        console.log('📊 Resposta do login:', { data: data ? 'success' : null, error });

        if (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }

        if (data.user) {
            console.log('✅ Login bem-sucedido, usuário:', data.user.email);
            adminCurrentUser = {
                id: data.user.id,
                email: data.user.email || '',
            };

            console.log('🔄 Chamando showDashboard...');
            showDashboard();

            console.log('✅ Chamando showAdminSuccess...');
            showAdminSuccess('Login realizado com sucesso!');
        } else {
            console.error('❌ Login falhou - nenhum usuário retornado');
            throw new Error('Login falhou');
        }
    } catch (error) {
        console.error('❌ Erro no login:', error);
        showAdminError(error.message || 'Erro ao fazer login');
    } finally {
        console.log('🔄 Escondendo loading...');
        hideAdminLoading();
    }
}

async function logoutAdmin(){
    try {
        if (window.supabase) {
            await window.supabase.auth.signOut();
        }
        adminCurrentUser = null;
        showLogin();
        showAdminSuccess('Logout realizado com sucesso!');
    } catch (error) {
        console.error('Erro no logout:', error);
        showAdminError('Erro ao fazer logout');
    }
}

// ==========================================
// FUNÇÕES DE UI
// ==========================================

function showLogin(){
    if (adminLoginContainer && adminDashboardContainer) {
        adminLoginContainer.style.display = 'block';
        adminDashboardContainer.style.display = 'none';
    }
}

function showDashboard(){
    console.log('🔄 Mostrando dashboard...');
    console.log('adminLoginContainer:', adminLoginContainer);
    console.log('adminDashboardContainer:', adminDashboardContainer);

    if (adminLoginContainer && adminDashboardContainer) {
        adminLoginContainer.style.display = 'none';
        adminDashboardContainer.style.display = 'block';

        console.log('✅ Dashboard exibido, carregando dados...');

        // Carregar dados com delay para evitar conflitos
        setTimeout(() => {
            loadPosts();
        }, 100);

        setTimeout(() => {
            loadProjects();
        }, 200);
    } else {
        console.error('❌ Containers não encontrados:', {
            login: adminLoginContainer,
            dashboard: adminDashboardContainer
        });
    }
}

function showPostsList(){
    if (adminPostsListSection && adminPostEditorSection) {
        adminPostsListSection.style.display = 'block';
        adminPostEditorSection.style.display = 'none';
    }
    if (adminProjectsListSection) {
        adminProjectsListSection.style.display = 'none';
    }
    if (adminProjectEditorSection) {
        adminProjectEditorSection.style.display = 'none';
    }
}

function showProjectsList(){
    if (adminProjectsListSection && adminProjectEditorSection) {
        adminProjectsListSection.style.display = 'block';
        adminProjectEditorSection.style.display = 'none';
    }
    if (adminPostsListSection) {
        adminPostsListSection.style.display = 'none';
    }
    if (adminPostEditorSection) {
        adminPostEditorSection.style.display = 'none';
    }
}

function showNewPostForm(){
    hideAllSections();
    if (adminPostEditorSection) {
        adminPostEditorSection.style.display = 'block';
    }
    clearPostForm();
}

function showNewProjectForm(){
    hideAllSections();
    if (adminProjectEditorSection) {
        adminProjectEditorSection.style.display = 'block';
    }
    clearProjectForm();
}

function showPostEditor(post){
    if (adminPostsListSection && adminPostEditorSection) {
        adminPostsListSection.style.display = 'none';
        adminPostEditorSection.style.display = 'block';
    }
    if (adminProjectsListSection) {
        adminProjectsListSection.style.display = 'none';
    }
    if (adminProjectEditorSection) {
        adminProjectEditorSection.style.display = 'none';
    }

    if (adminEditorTitle) {
        adminEditorTitle.textContent = post ? 'Editar Post' : 'Novo Post';
    }

    adminIsEditing = !!post;
    adminEditingPostId = post.id || null;

    // Preencher formulário se editando
    if (post && adminPostTitleInput && adminPostExcerptInput && adminPostTagsInput && adminPostStatusSelect && adminCoverImageUrlInput) {
        adminPostTitleInput.value = post.title;
        adminPostExcerptInput.value = post.excerpt;
        adminPostTagsInput.value = post.tags.join(', ');
        adminPostStatusSelect.value = post.status;
        adminCoverImageUrlInput.value = post.cover_image || '';
        
        // Configurar EasyMDE se estiver disponível
        if (adminEasyMDE) {
            adminEasyMDE.value(post.content || '');
        } else if (adminPostContentTextarea) {
            adminPostContentTextarea.value = post.content || '';
        }
    } else {
        // Limpar formulário se novo post
        if (adminPostTitleInput) adminPostTitleInput.value = '';
        if (adminPostExcerptInput) adminPostExcerptInput.value = '';
        if (adminPostTagsInput) adminPostTagsInput.value = '';
        if (adminPostStatusSelect) adminPostStatusSelect.value = 'draft';
        if (adminCoverImageInput) adminCoverImageInput.value = '';
        if (adminCoverImageUrlInput) adminCoverImageUrlInput.value = '';
        
        // Limpar EasyMDE se estiver disponível
        if (adminEasyMDE) {
            adminEasyMDE.value('');
        } else if (adminPostContentTextarea) {
            adminPostContentTextarea.value = '';
        }
    }
}

function generateSlug(title){
    return title
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ã/g, 'a')
        .replace(/õ/g, 'o')
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ==========================================

async function adminLogin(email, password){
    if (!window.supabase) {
        showAdminError('Supabase não está inicializado');
        return;
    }

    showAdminLoading();
    const { data, error } = await window.supabase.auth.signInWithPassword({
        email,
        password,
    });

    hideAdminLoading();

    if (error || !data) {
        showAdminError(error.message || 'Erro no login');
        return;
    }

    adminCurrentUser = data.user;
    adminLoginContainer.style.display = 'none';
    adminDashboardContainer.style.display = 'block';

    // Carregar posts e projetos após o login
    await Promise.all([loadPosts(), loadProjects()]);
}

async function adminLogout(){
    if (!window.supabase) {
        showAdminError('Supabase não está inicializado');
        return;
    }

    showAdminLoading();
    await window.supabase.auth.signOut();
    hideAdminLoading();

    adminCurrentUser = null;
    adminLoginContainer.style.display = 'flex';
    adminDashboardContainer.style.display = 'none';
}

// ==========================================
// FUNÇÕES DE CONFIGURAÇÕES
// ==========================================

async function loadHomeSettings() {
    if (!window.supabase) return;

    try {
        showAdminLoading();
        const { data, error } = await window.supabase
            .from('settings')
            .select('value')
            .eq('key', 'home')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            console.error('Erro ao carregar configurações da home:', error);
            return;
        }

        if (data && data.value) {
            const settings = data.value;

            // Preencher campos do hero
            if (settings.hero) {
                const heroTitle = document.getElementById('hero-title');
                const heroSubtitle = document.getElementById('hero-subtitle');
                const heroDescription = document.getElementById('hero-description');
                const heroCtaPrimary = document.getElementById('hero-cta-primary');
                const heroCtaSecondary = document.getElementById('hero-cta-secondary');
                
                if (heroTitle) heroTitle.value = settings.hero.title || '';
                if (heroSubtitle) heroSubtitle.value = settings.hero.subtitle || '';
                if (heroDescription) heroDescription.value = settings.hero.description || '';
                if (heroCtaPrimary) heroCtaPrimary.value = settings.hero.ctaPrimary || '';
                if (heroCtaSecondary) heroCtaSecondary.value = settings.hero.ctaSecondary || '';
            }

            // Preencher configurações do slider
            if (settings.slider) {
                const sliderEnabled = document.getElementById('slider-enabled');
                const sliderAutoplay = document.getElementById('slider-autoplay');
                const sliderDelay = document.getElementById('slider-delay');
                
                if (sliderEnabled) sliderEnabled.checked = settings.slider.enabled || false;
                if (sliderAutoplay) sliderAutoplay.checked = settings.slider.autoplay !== false;
                if (sliderDelay) sliderDelay.value = settings.slider.delay || 5000;

                // Carregar slides individuais
                if (settings.slider.items && settings.slider.items.length > 0) {
                    loadSliderItems(settings.slider.items);
                }
            }

            // Preencher seções de destaque
            if (settings.featured) {
                const featuredTitle = document.getElementById('featured-title');
                const featuredDescription = document.getElementById('featured-description');
                const featuredCount = document.getElementById('featured-count');
                
                if (featuredTitle) featuredTitle.value = settings.featured.title || '';
                if (featuredDescription) featuredDescription.value = settings.featured.description || '';
                if (featuredCount) featuredCount.value = settings.featured.count || 3;
            }

            if (settings.posts) {
                const postsTitle = document.getElementById('posts-title');
                const postsDescription = document.getElementById('posts-description');
                const postsCount = document.getElementById('posts-count');
                
                if (postsTitle) postsTitle.value = settings.posts.title || '';
                if (postsDescription) postsDescription.value = settings.posts.description || '';
                if (postsCount) postsCount.value = settings.posts.count || 3;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar configurações da home:', error);
    } finally {
        hideAdminLoading();
    }
}

async function loadHomeContent() {
    await loadHomeSettings();
}

async function loadAboutSettings() {
    if (!window.supabase) {
        console.error('Supabase não está inicializado');
        return;
    }

    try {
        console.log('Carregando configurações da about...');
        showAdminLoading();
        const { data, error } = await window.supabase
            .from('settings')
            .select('value')
            .eq('key', 'about')
            .single();

        console.log('Dados retornados do Supabase:', data);
        console.log('Erro retornado do Supabase:', error);

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            console.error('Erro ao carregar configurações da about:', error);
            return;
        }

        if (data && data.value) {
            const settings = data.value;
            console.log('Configurações encontradas:', settings);

            // Preencher bio
            const bioElement = document.getElementById('about-bio');
            if (bioElement) {
                bioElement.value = settings.bio || '';
                console.log('Bio preenchida:', settings.bio);
            }

            // Preencher foto do perfil
            const profileImageElement = document.getElementById('profile-image-url');
            if (profileImageElement) {
                profileImageElement.value = settings.profileImage || '';
                console.log('Profile image preenchida:', settings.profileImage);
            }

            // Preencher skills - verificar se é array ou objeto
            if (settings.skills) {
                if (Array.isArray(settings.skills)) {
                    // Se for array, converter para objeto
                    const skillsObj = {};
                    settings.skills.forEach(skill => {
                        if (typeof skill === 'string') {
                            // Tentar mapear baseado no conteúdo
                            if (skill.includes('HTML') || skill.includes('CSS') || skill.includes('JavaScript') || skill.includes('React')) {
                                skillsObj.frontend = (skillsObj.frontend || '') + (skillsObj.frontend ? ', ' : '') + skill;
                            } else if (skill.includes('Node') || skill.includes('Python') || skill.includes('PHP')) {
                                skillsObj.backend = (skillsObj.backend || '') + (skillsObj.backend ? ', ' : '') + skill;
                            } else if (skill.includes('MySQL') || skill.includes('PostgreSQL') || skill.includes('MongoDB')) {
                                skillsObj.database = (skillsObj.database || '') + (skillsObj.database ? ', ' : '') + skill;
                            } else {
                                skillsObj.tools = (skillsObj.tools || '') + (skillsObj.tools ? ', ' : '') + skill;
                            }
                        }
                    });

                    // Preencher campos
                    document.getElementById('skills-frontend').value = skillsObj.frontend || '';
                    document.getElementById('skills-backend').value = skillsObj.backend || '';
                    document.getElementById('skills-database').value = skillsObj.database || '';
                    document.getElementById('skills-tools').value = skillsObj.tools || '';
                } else {
                    // Se for objeto, usar diretamente
                    document.getElementById('skills-frontend').value = settings.skills.frontend || '';
                    document.getElementById('skills-backend').value = settings.skills.backend || '';
                    document.getElementById('skills-database').value = settings.skills.database || '';
                    document.getElementById('skills-tools').value = settings.skills.tools || '';
                }
            }

            // Preencher links sociais - verificar se é socialLinks ou social
            const socialData = settings.social || settings.socialLinks || {};
            document.getElementById('social-github').value = socialData.github || '';
            document.getElementById('social-linkedin').value = socialData.linkedin || '';
            document.getElementById('social-twitter').value = socialData.twitter || '';
            document.getElementById('social-email').value = socialData.email || '';
            document.getElementById('social-city').value = socialData.city || '';
            document.getElementById('social-phone').value = socialData.phone || '';

            // Carregar experiência profissional
            if (settings.experience && Array.isArray(settings.experience)) {
                settings.experience.forEach(exp => addExperienceItem(exp));
            }

            // Carregar formação
            if (settings.education && Array.isArray(settings.education)) {
                settings.education.forEach(edu => addEducationItem(edu));
            }

            // Carregar certificações
            if (settings.certifications && Array.isArray(settings.certifications)) {
                settings.certifications.forEach(cert => addCertificationItem(cert));
            }

            // Carregar galeria
            if (settings.gallery && Array.isArray(settings.gallery)) {
                settings.gallery.forEach(img => addGalleryItem(img));
            }
        } else {
            console.log('Nenhuma configuração encontrada para about');
        }
    } catch (error) {
        console.error('Erro ao carregar configurações da about:', error);
    } finally {
        hideAdminLoading();
    }
}

function getSliderItems() {
    const sliderContainer = document.getElementById('slider-container');
    if (!sliderContainer) return [];

    const slides = [];
    const slideElements = sliderContainer.querySelectorAll('.slider-item');

    slideElements.forEach(slideElement => {
        const title = slideElement.querySelector('.slider-title')?.value || '';
        const description = slideElement.querySelector('.slider-description')?.value || '';
        const image = slideElement.querySelector('.slider-image')?.value || '';
        const link = slideElement.querySelector('.slider-link')?.value || '';
        const buttonText = slideElement.querySelector('.slider-button-text')?.value || '';

        if (title || description || image) {
            slides.push({
                title,
                description,
                image,
                link,
                buttonText
            });
        }
    });

    return slides;
}

async function loadAboutContent() {
    await loadAboutSettings();
}

async function saveHomeSettings() {
    if (!window.supabase) {
        showAdminError('Supabase não está inicializado');
        return;
    }

    try {
        showAdminLoading();

        const settings = {
            hero: {
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle').value,
                description: document.getElementById('hero-description').value,
                ctaPrimary: document.getElementById('hero-cta-primary').value,
                ctaSecondary: document.getElementById('hero-cta-secondary').value
            },
            slider: {
                enabled: document.getElementById('slider-enabled').checked,
                autoplay: document.getElementById('slider-autoplay').checked,
                delay: parseInt(document.getElementById('slider-delay').value) || 5000,
                items: getSliderItems()
            },
            featured: {
                title: document.getElementById('featured-title').value,
                description: document.getElementById('featured-description').value,
                count: parseInt(document.getElementById('featured-count').value) || 3
            },
            posts: {
                title: document.getElementById('posts-title').value,
                description: document.getElementById('posts-description').value,
                count: parseInt(document.getElementById('posts-count').value) || 3
            }
        };

        const { error } = await window.supabase
            .from('settings')
            .upsert({
                key: 'home',
                value: settings,
                updated_at: new Date().toISOString()
            });

        if (error) {
            throw error;
        }

        showAdminSuccess('Configurações da página inicial salvas com sucesso!');

        // Atualizar preview
        if (window.adminPreview) {
            window.adminPreview.updatePreview('home', settings);
        }
    } catch (error) {
        console.error('Erro ao salvar configurações da home:', error);
        showAdminError('Erro ao salvar configurações: ' + error.message);
    } finally {
        hideAdminLoading();
    }
}

async function saveAboutSettings() {
    if (!window.supabase) {
        showAdminError('Supabase não está inicializado');
        return;
    }

    try {
        console.log('Salvando configurações da about...');
        showAdminLoading();

        const settings = {
            bio: document.getElementById('about-bio').value,
            profileImage: document.getElementById('profile-image-url').value,
            skills: [
                ...document.getElementById('skills-frontend').value.split(',').map(s => s.trim()).filter(s => s),
                ...document.getElementById('skills-backend').value.split(',').map(s => s.trim()).filter(s => s),
                ...document.getElementById('skills-database').value.split(',').map(s => s.trim()).filter(s => s),
                ...document.getElementById('skills-tools').value.split(',').map(s => s.trim()).filter(s => s)
            ],
            socialLinks: {
                github: document.getElementById('social-github').value,
                linkedin: document.getElementById('social-linkedin').value,
                twitter: document.getElementById('social-twitter').value,
                email: document.getElementById('social-email').value,
                city: document.getElementById('social-city').value,
                phone: document.getElementById('social-phone').value
            },
            // Dados dinâmicos
            experience: getExperienceData(),
            education: getEducationData(),
            certifications: getCertificationsData(),
            gallery: getGalleryData(),
            // Manter campos existentes para compatibilidade
            updatedAt: new Date().toISOString()
        };

        console.log('Dados a serem salvos:', settings);

        const { error } = await window.supabase
            .from('settings')
            .upsert({
                key: 'about',
                value: settings,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Erro ao salvar no Supabase:', error);
            throw error;
        }

        console.log('Configurações salvas com sucesso!');
        showAdminSuccess('Configurações da página sobre salvas com sucesso!');

        // Atualizar preview
        if (window.adminPreview) {
            window.adminPreview.updatePreview('about', settings);
        }
    } catch (error) {
        console.error('Erro ao salvar configurações da about:', error);
        showAdminError('Erro ao salvar configurações: ' + error.message);
    } finally {
        hideAdminLoading();
    }
}

// ==========================================
// FUNÇÕES PARA GERENCIAR SEÇÕES DINÂMICAS DA PÁGINA SOBRE
// ==========================================

// Funções para Experiência Profissional
function addExperienceItem(experience = null) {
    const container = document.getElementById('experience-container');
    if (!container) return;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-item';
    itemDiv.innerHTML = `
        <div class="form-group">
            <label>Cargo:</label>
            <input type="text" class="experience-position" value="${experience?.position || ''}" placeholder="Ex: Desenvolvedor Full Stack">
        </div>
        <div class="form-group">
            <label>Empresa:</label>
            <input type="text" class="experience-company" value="${experience?.company || ''}" placeholder="Ex: Empresa XYZ">
        </div>
        <div class="form-group">
            <label>Período:</label>
            <input type="text" class="experience-period" value="${experience?.period || ''}" placeholder="Ex: Jan 2020 - Dez 2023">
        </div>
        <div class="form-group">
            <label>Descrição:</label>
            <textarea class="experience-description" rows="3" placeholder="Descreva suas responsabilidades...">${experience?.description || ''}</textarea>
        </div>
        <button type="button" class="btn btn-danger remove-experience-btn">Remover</button>
    `;

    // Adicionar event listener para remover
    itemDiv.querySelector('.remove-experience-btn').addEventListener('click', function() {
        itemDiv.remove();
    });

    container.appendChild(itemDiv);
}

function getExperienceData() {
    const items = document.querySelectorAll('#experience-container .dynamic-item');
    return Array.from(items).map(item => ({
        position: item.querySelector('.experience-position').value,
        company: item.querySelector('.experience-company').value,
        period: item.querySelector('.experience-period').value,
        description: item.querySelector('.experience-description').value
    })).filter(exp => exp.position || exp.company || exp.period || exp.description);
}

// Funções para Formação
function addEducationItem(education = null) {
    const container = document.getElementById('education-container');
    if (!container) return;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-item';
    itemDiv.innerHTML = `
        <div class="form-group">
            <label>Curso:</label>
            <input type="text" class="education-course" value="${education?.course || ''}" placeholder="Ex: Análise e Desenvolvimento de Sistemas">
        </div>
        <div class="form-group">
            <label>Instituição:</label>
            <input type="text" class="education-institution" value="${education?.institution || ''}" placeholder="Ex: Universidade XYZ">
        </div>
        <div class="form-group">
            <label>Período:</label>
            <input type="text" class="education-period" value="${education?.period || ''}" placeholder="Ex: 2020 - 2024">
        </div>
        <div class="form-group">
            <label>Status:</label>
            <select class="education-status">
                <option value="concluido" ${education?.status === 'concluido' ? 'selected' : ''}>Concluído</option>
                <option value="cursando" ${education?.status === 'cursando' ? 'selected' : ''}>Cursando</option>
                <option value="trancado" ${education?.status === 'trancado' ? 'selected' : ''}>Trancado</option>
            </select>
        </div>
        <button type="button" class="btn btn-danger remove-education-btn">Remover</button>
    `;

    // Adicionar event listener para remover
    itemDiv.querySelector('.remove-education-btn').addEventListener('click', function() {
        itemDiv.remove();
    });

    container.appendChild(itemDiv);
}

function getEducationData() {
    const items = document.querySelectorAll('#education-container .dynamic-item');
    return Array.from(items).map(item => ({
        course: item.querySelector('.education-course').value,
        institution: item.querySelector('.education-institution').value,
        period: item.querySelector('.education-period').value,
        status: item.querySelector('.education-status').value
    })).filter(edu => edu.course || edu.institution || edu.period);
}

// Funções para Certificações
function addCertificationItem(certification = null) {
    const container = document.getElementById('certifications-container');
    if (!container) return;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-item';
    itemDiv.innerHTML = `
        <div class="form-group">
            <label>Nome da Certificação:</label>
            <input type="text" class="certification-name" value="${certification?.name || ''}" placeholder="Ex: AWS Certified Developer">
        </div>
        <div class="form-group">
            <label>Organização Emissora:</label>
            <input type="text" class="certification-issuer" value="${certification?.issuer || ''}" placeholder="Ex: Amazon Web Services">
        </div>
        <div class="form-group">
            <label>Data de Emissão:</label>
            <input type="date" class="certification-date" value="${certification?.date ? formatDateForInput(certification.date) : ''}">
        </div>
        <div class="form-group">
            <label>URL da Credencial:</label>
            <input type="url" class="certification-url" value="${certification?.url || ''}" placeholder="https://...">
        </div>
        <button type="button" class="btn btn-danger remove-certification-btn">Remover</button>
    `;

    // Adicionar event listener para remover
    itemDiv.querySelector('.remove-certification-btn').addEventListener('click', function() {
        itemDiv.remove();
    });

    container.appendChild(itemDiv);
}

function getCertificationsData() {
    const items = document.querySelectorAll('#certifications-container .dynamic-item');
    return Array.from(items).map(item => ({
        name: item.querySelector('.certification-name').value,
        issuer: item.querySelector('.certification-issuer').value,
        date: item.querySelector('.certification-date').value,
        url: item.querySelector('.certification-url').value
    })).filter(cert => cert.name || cert.issuer || cert.date);
}

// Funções para Galeria
function addGalleryItem(image = null) {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-item gallery-item';
    itemDiv.innerHTML = `
        <div class="form-group">
            <label>URL da Imagem:</label>
            <input type="url" class="gallery-url" value="${image?.url || ''}" placeholder="https://...">
        </div>
        <div class="form-group">
            <label>Descrição:</label>
            <input type="text" class="gallery-description" value="${image?.description || ''}" placeholder="Descrição da imagem">
        </div>
        <div class="form-group">
            <label>Alt Text:</label>
            <input type="text" class="gallery-alt" value="${image?.alt || ''}" placeholder="Texto alternativo">
        </div>
        ${image?.url ? `<img src="${image.url}" alt="${image.alt || ''}" style="max-width: 200px; max-height: 150px; margin: 10px 0;">` : ''}
        <button type="button" class="btn btn-danger remove-gallery-btn">Remover</button>
    `;

    // Adicionar event listener para remover
    itemDiv.querySelector('.remove-gallery-btn').addEventListener('click', function() {
        itemDiv.remove();
    });

    // Adicionar event listener para preview da imagem
    const urlInput = itemDiv.querySelector('.gallery-url');
    urlInput.addEventListener('input', function() {
        const existingImg = itemDiv.querySelector('img');
        if (existingImg) existingImg.remove();

        if (this.value) {
            const img = document.createElement('img');
            img.src = this.value;
            img.alt = itemDiv.querySelector('.gallery-alt').value || '';
            img.style.cssText = 'max-width: 200px; max-height: 150px; margin: 10px 0;';
            itemDiv.insertBefore(img, itemDiv.querySelector('.remove-gallery-btn'));
        }
    });

    container.appendChild(itemDiv);
}

function getGalleryData() {
    const items = document.querySelectorAll('#gallery-container .dynamic-item');
    return Array.from(items).map(item => ({
        url: item.querySelector('.gallery-url').value,
        description: item.querySelector('.gallery-description').value,
        alt: item.querySelector('.gallery-alt').value
    })).filter(img => img.url);
}

// ==========================================
// FUNÇÕES DE POSTAGENS
// ==========================================

async function loadPosts(){
    console.log('🔄 Carregando posts...');

    if (!window.supabase) {
        console.error('❌ Supabase não está inicializado');
        showAdminError('Supabase não está inicializado');
        return;
    }

    console.log('✅ Supabase encontrado, carregando posts...');
    showAdminLoading();

    try {
        const { data, error } = await window.supabase.from('posts').select('*');

        console.log('📊 Resposta do Supabase:', { data, error });

        hideAdminLoading();

        if (error) {
            console.error('❌ Erro ao carregar posts:', error);
            showAdminError(error.message);
            return;
        }

        console.log(`✅ ${data.length} posts carregados`);

        if (adminPostsContainer) {
            adminPostsContainer.innerHTML = '';
            data.forEach((post) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <p>Status: ${post.status}</p>
                    <button class="edit-post-btn" data-id="${post.id}">Editar</button>
                    <button class="delete-post-btn" data-id="${post.id}">Excluir</button>
                `;
                adminPostsContainer.appendChild(postElement);
            });
            console.log('✅ Posts exibidos na interface');
        } else {
            console.error('❌ adminPostsContainer não encontrado');
        }
    } catch (error) {
        console.error('❌ Erro inesperado ao carregar posts:', error);
        hideAdminLoading();
        showAdminError('Erro ao carregar posts');
    }
}

async function createPost(){
    if (!window.supabase || !adminPostTitleInput || !adminPostContentTextarea) return;

    const postData = {
        title: adminPostTitleInput.value,
        content: adminEasyMDE ? adminEasyMDE.value() : adminPostContentTextarea.value,
        excerpt: adminPostExcerptInput?.value || '',
        tags: adminPostTagsInput?.value.split(',').map((tag) => tag.trim()) || [],
        status: adminPostStatusSelect?.value,
        cover_image: adminCoverImageUrlInput?.value || '',
        author_id: adminCurrentUser?.id || '',
    };

    const { data, error } = await window.supabase.from('posts').insert([postData]);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Post criado com sucesso!');
    if (adminPostTitleInput) adminPostTitleInput.value = '';
    if (adminPostContentTextarea) adminPostContentTextarea.value = '';
    if (adminPostExcerptInput) adminPostExcerptInput.value = '';
    if (adminPostTagsInput) adminPostTagsInput.value = '';
    if (adminPostStatusSelect) adminPostStatusSelect.value = 'draft';
    if (adminCoverImageInput) adminCoverImageInput.value = '';
    if (adminCoverImageUrlInput) adminCoverImageUrlInput.value = '';
    if (adminCoverImagePreview) adminCoverImagePreview.src = '';
    loadPosts();
}

async function updatePost(postId){
    if (!window.supabase || !adminPostTitleInput || !adminPostContentTextarea) return;

    const postData = {
        title: adminPostTitleInput.value,
        content: adminEasyMDE ? adminEasyMDE.value() : adminPostContentTextarea.value,
        excerpt: adminPostExcerptInput?.value || '',
        tags: adminPostTagsInput?.value.split(',').map((tag) => tag.trim()) || [],
        status: adminPostStatusSelect?.value,
        cover_image: adminCoverImageUrlInput?.value || '',
    };

    const { data, error } = await window.supabase.from('posts').update(postData).eq('id', postId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Post atualizado com sucesso!');
    loadPosts();
}

async function deletePost(postId){
    if (!window.supabase) return;

    const { data, error } = await window.supabase.from('posts').delete().eq('id', postId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Post excluído com sucesso!');
    loadPosts();
}

async function savePost(){
    if (adminIsEditing && adminEditingPostId) {
        await updatePost(adminEditingPostId);
    } else {
        await createPost();
    }
}

async function editPost(postId){
    if (!window.supabase) return;

    const { data, error } = await window.supabase.from('posts').select('*').eq('id', postId).single();

    if (error) {
        showAdminError(error.message);
        return;
    }

    if (data) {
        // Preencher o formulário com os dados do post
        if (adminPostIdInput) adminPostIdInput.value = data.id;
        if (adminPostTitleInput) adminPostTitleInput.value = data.title || '';
        if (adminPostExcerptInput) adminPostExcerptInput.value = data.excerpt || '';
        if (adminPostTagsInput) adminPostTagsInput.value = data.tags ? data.tags.join(', ') : '';
        if (adminPostStatusSelect) adminPostStatusSelect.value = data.status || 'draft';
        if (adminCoverImageUrlInput) adminCoverImageUrlInput.value = data.cover_image || '';
        if (adminCoverImagePreview) adminCoverImagePreview.src = data.cover_image || '';
        if (adminPostContentTextarea) adminPostContentTextarea.value = data.content || '';

        // Resetar EasyMDE e definir novo valor
        if (adminEasyMDE) {
            adminEasyMDE.value(data.content || '');
        }

        // Definir estado de edição
        adminIsEditing = true;
        adminEditingPostId = postId;

        // Mostrar seção do editor
        hideAllSections();
        if (adminPostEditorSection) {
            adminPostEditorSection.style.display = 'block';
        }
    }
}

// ==========================================
// FUNÇÕES DE PROJETOS
// ==========================================

async function loadProjects(){
    console.log('🔄 Carregando projetos...');

    if (!window.supabase) {
        console.error('❌ Supabase não está inicializado');
        showAdminError('Supabase não está inicializado');
        return;
    }

    console.log('✅ Supabase encontrado, carregando projetos...');
    showAdminLoading();

    try {
        const { data, error } = await window.supabase.from('projects').select('*');

        console.log('📊 Resposta do Supabase para projetos:', { data, error });

        hideAdminLoading();

        if (error) {
            console.error('❌ Erro ao carregar projetos:', error);
            showAdminError(error.message);
            return;
        }

        console.log(`✅ ${data.length} projetos carregados`);

        if (adminProjectsContainer) {
            adminProjectsContainer.innerHTML = '';
            data.forEach((project) => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project';
                projectElement.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <p>Status: ${project.status}</p>
                    <button class="edit-project-btn" data-id="${project.id}">Editar</button>
                    <button class="delete-project-btn" data-id="${project.id}">Excluir</button>
                `;
                adminProjectsContainer.appendChild(projectElement);
            });
            console.log('✅ Projetos exibidos na interface');
        } else {
            console.error('❌ adminProjectsContainer não encontrado');
        }
    } catch (error) {
        console.error('❌ Erro inesperado ao carregar projetos:', error);
        hideAdminLoading();
        showAdminError('Erro ao carregar projetos');
    }
}

// ==========================================
// LOAD MESSAGES
// ==========================================

async function loadMessages() {
    console.log('🔄 Carregando mensagens...');
    
    if (!window.supabase) {
        console.error('❌ Supabase não encontrado');
        return;
    }

    try {
        console.log('✅ Supabase encontrado, carregando mensagens...');
        
        showAdminLoading();
        const { data: messages, error } = await window.supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        hideAdminLoading();

        if (error) {
            console.error('❌ Erro do Supabase ao carregar mensagens:', error);
            
            // Se a tabela não existe, mostrar mensagem específica
            if (error.code === 'PGRST106' || error.message.includes('table') || error.message.includes('does not exist')) {
                console.log('ℹ️ Tabela contact_messages não existe ainda');
                displayNoMessagesTable();
            } else {
                showAdminError('Erro ao carregar mensagens: ' + error.message);
            }
            return;
        }

        console.log('📊 Resposta do Supabase para mensagens:', { messages, count: messages?.length });

        if (messages && messages.length > 0) {
            console.log(`✅ ${messages.length} mensagens carregadas`);
            displayMessages(messages);
        } else {
            console.log('ℹ️ Nenhuma mensagem encontrada');
            displayNoMessages();
        }
    } catch (error) {
        console.error('❌ Erro inesperado ao carregar mensagens:', error);
        hideAdminLoading();
        showAdminError('Erro ao carregar mensagens');
    }
}

function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages-list');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message-card';
            messageElement.innerHTML = `
                <div class="message-header">
                    <h3>${message.name || 'Sem nome'}</h3>
                    <span class="message-email">${message.email || 'Sem email'}</span>
                    <span class="message-date">${new Date(message.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div class="message-content">
                    <p><strong>Assunto:</strong> ${message.subject || 'Sem assunto'}</p>
                    <p>${message.message || 'Sem mensagem'}</p>
                </div>
                <div class="message-actions">
                    <button class="btn btn-outline" onclick="markMessageAsRead('${message.id}')">Marcar como lida</button>
                    <button class="btn btn-danger" onclick="deleteMessage('${message.id}')">Excluir</button>
                </div>
            `;
            messagesContainer.appendChild(messageElement);
        });
    } else {
        console.error('❌ Container de mensagens não encontrado');
    }
}

function displayNoMessages() {
    const messagesContainer = document.getElementById('messages-list');
    if (messagesContainer) {
        messagesContainer.innerHTML = '<p>Nenhuma mensagem encontrada.</p>';
    }
}

function displayNoMessagesTable() {
    const messagesContainer = document.getElementById('messages-list');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="no-table-message">
                <h3>📬 Tabela de mensagens não configurada</h3>
                <p>A tabela <code>contact_messages</code> ainda não foi criada no Supabase.</p>
                <p>Para habilitar o sistema de mensagens:</p>
                <ol>
                    <li>Acesse o <a href="https://supabase.com/dashboard" target="_blank">Painel do Supabase</a></li>
                    <li>Vá para <strong>SQL Editor</strong></li>
                    <li>Execute o script <code>create_all_tables.sql</code> do projeto</li>
                </ol>
                <p><small>Após criar a tabela, recarregue esta página.</small></p>
            </div>
        `;
    }
}

async function createProject(){
    if (!window.supabase || !adminProjectTitleInput || !adminProjectDescriptionInput) return;

    const projectData = {
        title: adminProjectTitleInput.value,
        description: adminProjectDescriptionInput.value,
        technologies: adminProjectTechnologiesInput?.value.split(',').map((tech) => tech.trim()) || [],
        demo_link: adminProjectDemoLinkInput?.value || '',
        github_link: adminProjectGithubLinkInput?.value || '',
        download_link: adminProjectDownloadLinkInput?.value || '',
        status: adminProjectStatusSelect?.value,
        image: adminProjectImageUrlInput?.value || '',
        author_id: adminCurrentUser?.id || '',
    };

    const { data, error } = await window.supabase.from('projects').insert([projectData]);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Projeto criado com sucesso!');
    if (adminProjectTitleInput) adminProjectTitleInput.value = '';
    if (adminProjectDescriptionInput) adminProjectDescriptionInput.value = '';
    if (adminProjectTechnologiesInput) adminProjectTechnologiesInput.value = '';
    if (adminProjectDemoLinkInput) adminProjectDemoLinkInput.value = '';
    if (adminProjectGithubLinkInput) adminProjectGithubLinkInput.value = '';
    if (adminProjectDownloadLinkInput) adminProjectDownloadLinkInput.value = '';
    if (adminProjectStatusSelect) adminProjectStatusSelect.value = 'draft';
    if (adminProjectImageInput) adminProjectImageInput.value = '';
    if (adminProjectImageUrlInput) adminProjectImageUrlInput.value = '';
    if (adminProjectImagePreview) adminProjectImagePreview.src = '';
    loadProjects();
}

async function updateProject(projectId){
    if (!window.supabase || !adminProjectTitleInput || !adminProjectDescriptionInput) return;

    const projectData = {
        title: adminProjectTitleInput.value,
        description: adminProjectDescriptionInput.value,
        technologies: adminProjectTechnologiesInput?.value.split(',').map((tech) => tech.trim()) || [],
        demo_link: adminProjectDemoLinkInput?.value || '',
        github_link: adminProjectGithubLinkInput?.value || '',
        download_link: adminProjectDownloadLinkInput?.value || '',
        status: adminProjectStatusSelect?.value,
        image: adminProjectImageUrlInput?.value || '',
    };

    const { data, error } = await window.supabase.from('projects').update(projectData).eq('id', projectId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Projeto atualizado com sucesso!');
    loadProjects();
}

async function deleteProject(projectId){
    if (!window.supabase) return;

    const { data, error } = await window.supabase.from('projects').delete().eq('id', projectId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Projeto excluído com sucesso!');
    loadProjects();
}

async function saveProject(){
    if (adminIsEditing && adminEditingProjectId) {
        await updateProject(adminEditingProjectId);
    } else {
        await createProject();
    }
}

async function editProject(projectId){
    if (!window.supabase) return;

    const { data, error } = await window.supabase.from('projects').select('*').eq('id', projectId).single();

    if (error) {
        showAdminError(error.message);
        return;
    }

    if (data) {
        // Preencher o formulário com os dados do projeto
        if (adminProjectIdInput) adminProjectIdInput.value = data.id;
        if (adminProjectTitleInput) adminProjectTitleInput.value = data.title || '';
        if (adminProjectDescriptionInput) adminProjectDescriptionInput.value = data.description || '';
        if (adminProjectTechnologiesInput) adminProjectTechnologiesInput.value = data.technologies ? data.technologies.join(', ') : '';
        if (adminProjectDemoLinkInput) adminProjectDemoLinkInput.value = data.demo_link || '';
        if (adminProjectGithubLinkInput) adminProjectGithubLinkInput.value = data.github_link || '';
        if (adminProjectDownloadLinkInput) adminProjectDownloadLinkInput.value = data.download_link || '';
        if (adminProjectStatusSelect) adminProjectStatusSelect.value = data.status || 'draft';
        if (adminProjectImageInput) adminProjectImageInput.value = data.image || '';
        if (adminProjectImageUrlInput) adminProjectImageUrlInput.value = data.image || '';
        if (adminProjectImagePreview) adminProjectImagePreview.src = data.image || '';

        // Definir estado de edição
        adminIsEditing = true;
        adminEditingProjectId = projectId;

        // Mostrar seção do editor
        hideAllSections();
        if (adminProjectEditorSection) {
            adminProjectEditorSection.style.display = 'block';
        }
    }
}

// ==========================================
// FUNÇÕES DE NAVEGAÇÃO ENTRE ABAS
// ==========================================

// Função para ocultar todas as seções
function hideAllSections() {
    const sections = [
        'posts-list-section',
        'post-editor-section', 
        'projects-list-section',
        'project-editor-section',
        'old-project-editor-section',
        'home-manager-section',
        'about-manager-section'
    ];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
}

// ==========================================
// EVENT LISTENERS DAS ABAS
// ==========================================



// Projetos



// Home and About forms event listeners

// Home and About management event listeners

// Event listeners para botões dinâmicos da seção About
document.addEventListener('click', function(e) {
    // Botão adicionar experiência
    if (e.target.id === 'add-experience-btn') {
        addExperienceItem();
    }

    // Botão adicionar formação
    if (e.target.id === 'add-education-btn') {
        addEducationItem();
    }

    // Botão adicionar certificação
    if (e.target.id === 'add-certification-btn') {
        addCertificationItem();
    }

    // Botão adicionar imagem à galeria
    if (e.target.id === 'add-gallery-btn') {
        addGalleryItem();
    }
});

// ==========================================
// SUPABASE REALTIME - POSTS (DESABILITADO TEMPORARIAMENTE)
// ==========================================

/*
if (window.supabase) {
    window.supabase
        .from('posts')
        .on('INSERT', (payload) => {
            const post = payload.new;
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <p>Status${post.status}</p>
                <button class="edit-post-btn" data-id="${post.id}">Editar</button>
                <button class="delete-post-btn" data-id="${post.id}">Excluir</button>
            `;
            adminPostsContainer.prepend(postElement);
        })
        .on('UPDATE', (payload) => {
            const post = payload.new;
            const postElements = Array.from(adminPostsContainer.children);
            const postElement = postElements.find((el) => el.querySelector('.edit-post-btn')?.getAttribute('data-id') === post.id);

            if (postElement) {
                postElement.querySelector('h3').textContent = post.title;
                postElement.querySelector('p').textContent = post.excerpt;
                postElement.querySelector('p-of-type(2)').textContent = `Status${post.status}`;
            }
        })
        .on('DELETE', (payload) => {
            const postId = payload.old.id;
            const postElements = Array.from(adminPostsContainer.children);
            const postElement = postElements.find((el) => el.querySelector('.edit-post-btn')?.getAttribute('data-id') === postId);

            if (postElement) {
                postElement.remove();
            }
        })
        .subscribe();
}
*/

// ==========================================
// SUPABASE REALTIME - PROJETOS (DESABILITADO TEMPORARIAMENTE)
// ==========================================

/*
if (window.supabase) {
    window.supabase
        .from('projects')
        .on('INSERT', (payload) => {
            const project = payload.new;
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            projectElement.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p>Status${project.status}</p>
                <button class="edit-project-btn" data-id="${project.id}">Editar</button>
                <button class="delete-project-btn" data-id="${project.id}">Excluir</button>
            `;
            adminProjectsContainer.prepend(projectElement);
        })
        .on('UPDATE', (payload) => {
            const project = payload.new;
            const projectElements = Array.from(adminProjectsContainer.children);
            const projectElement = projectElements.find((el) => el.querySelector('.edit-project-btn')?.getAttribute('data-id') === project.id);

            if (projectElement) {
                projectElement.querySelector('h3').textContent = project.title;
                projectElement.querySelector('p').textContent = project.description;
                projectElement.querySelector('p-of-type(2)').textContent = `Status${project.status}`;
            }
        })
        .on('DELETE', (payload) => {
            const projectId = payload.old.id;
            const projectElements = Array.from(adminProjectsContainer.children);
            const projectElement = projectElements.find((el) => el.querySelector('.edit-project-btn')?.getAttribute('data-id') === projectId);

            if (projectElement) {
                projectElement.remove();
            }
        })
        .subscribe();
}
*/

// ==========================================
// INICIALIZAÇÃO E CONFIGURAÇÕES ADICIONAIS
// ==========================================

// Inicializar EasyMDE quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EasyMDE para o editor de posts
    if (document.getElementById('post-content')) {
        adminEasyMDE = new EasyMDE({
            element: document.getElementById('post-content'),
            spellChecker: false,
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
            },
            toolbar: [
                'bold', 'italic', 'heading', '|',
                'code', 'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', '|',
                'preview', 'side-by-side', 'fullscreen', '|',
                'guide'
            ]
        });
    }

    // Inicializar event listeners para slides
    initializeSliderManagement();
});

// ==========================================
// FUNÇÕES DE UPLOAD DE IMAGENS
// ==========================================

async function uploadSliderImage(file) {
    if (!window.supabase) {
        throw new Error('Supabase não está inicializado');
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5MB');
    }

    try {
        // Gerar nome único para o arquivo
        const fileExt = file.name.split('.').pop();
        const fileName = `slider_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `slider/${fileName}`;

        // Fazer upload para o Supabase Storage
        const { data, error } = await window.supabase.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Obter URL pública da imagem
        const { data: urlData } = window.supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        if (!urlData.publicUrl) {
            throw new Error('Erro ao obter URL da imagem');
        }

        return urlData.publicUrl;
    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        throw error;
    }
}

// ==========================================
// FUNÇÕES DE GERENCIAMENTO DE SLIDES
// ==========================================

function initializeSliderManagement() {
    const addSliderBtn = document.getElementById('add-slider-item-btn');
    const sliderContainer = document.getElementById('slider-container');

    if (addSliderBtn && sliderContainer) {
        addSliderBtn.addEventListener('click', addSliderItem);
    }

    // Carregar slides salvos
    loadSavedSlides();

    // Inicializar sistemas avançados
    // Inicializar preview
    window.adminPreview = new AdminPreview();

    // Inicializar drag and drop
    window.dragManager = new DragAndDropManager();

    // Inicializar toast notifications
    window.toastManager = new ToastManager();

    // Adicionar drag handles aos elementos existentes
    setTimeout(() => {
        document.querySelectorAll('.card, .dynamic-item').forEach(item => {
            if (!item.querySelector('.drag-handle')) {
                const handle = document.createElement('div');
                handle.className = 'drag-handle';
                handle.innerHTML = '⋮⋮';
                handle.title = 'Arraste para reordenar';
                item.appendChild(handle);
                window.dragManager.makeDraggable(item);
            }
        });

        // Configurar preview em tempo real para formulários
        setupRealTimePreview();
    }, 1000);

    console.log('🎉 Sistemas avançados do Admin Panel inicializados!');

    // Definir seção padrão (Lista de Posts)
    setTimeout(() => {
        hideAllSections();
        if (adminPostsListSection) adminPostsListSection.style.display = 'block';
    }, 100);
}

function addSliderItem() {
    const sliderContainer = document.getElementById('slider-container');
    if (!sliderContainer) return;

    const slideIndex = sliderContainer.children.length;
    const slideElement = document.createElement('div');
    slideElement.className = 'slider-item';
    slideElement.innerHTML = `
        <div class="form-group">
            <label>Título do Slide ${slideIndex + 1}:</label>
            <input type="text" class="slider-title" placeholder="Título do slide">
        </div>
        <div class="form-group">
            <label>Descrição:</label>
            <textarea class="slider-description" rows="3" placeholder="Descrição do slide"></textarea>
        </div>
        <div class="form-group">
            <label>Upload de Imagem:</label>
            <input type="file" class="slider-image-file" accept="image/*" style="margin-bottom: 10px;">
            <div class="image-preview" style="margin-bottom: 10px;"></div>
            <small>Ou insira uma URL:</small>
        </div>
        <div class="form-group">
            <label>URL da Imagem:</label>
            <input type="text" class="slider-image" placeholder="https://exemplo.com/imagem.jpg">
        </div>
        <div class="form-group">
            <label>Link do Botão:</label>
            <input type="text" class="slider-link" placeholder="https://exemplo.com">
        </div>
        <div class="form-group">
            <label>Texto do Botão:</label>
            <input type="text" class="slider-button-text" placeholder="Saiba Mais">
        </div>
        <button type="button" class="btn btn-danger remove-slide-btn">Remover Slide</button>
        <hr>
    `;

    sliderContainer.appendChild(slideElement);

    // Configurar event listeners para o slide
    setupSlideEventListeners(slideElement);
}

function loadSliderItems(slides) {
    const sliderContainer = document.getElementById('slider-container');
    if (!sliderContainer || !slides.length) return;

    // Limpar slides existentes
    sliderContainer.innerHTML = '';

    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = 'slider-item';
        slideElement.innerHTML = `
            <div class="form-group">
                <label>Título do Slide ${index + 1}:</label>
                <input type="text" class="slider-title" value="${slide.title || ''}" placeholder="Título do slide">
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea class="slider-description" rows="3" placeholder="Descrição do slide">${slide.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Upload de Imagem:</label>
                <input type="file" class="slider-image-file" accept="image/*" style="margin-bottom: 10px;">
                <div class="image-preview" style="margin-bottom: 10px;">${slide.image ? `<img src="${slide.image}" style="max-width: 200px; max-height: 150px; border: 1px solid #ddd; margin-top: 10px;">` : ''}</div>
                <small>Ou insira uma URL:</small>
            </div>
            <div class="form-group">
                <label>URL da Imagem:</label>
                <input type="text" class="slider-image" value="${slide.image || ''}" placeholder="https://exemplo.com/imagem.jpg">
            </div>
            <div class="form-group">
                <label>Link do Botão:</label>
                <input type="text" class="slider-link" value="${slide.link || ''}" placeholder="https://exemplo.com">
            </div>
            <div class="form-group">
                <label>Texto do Botão:</label>
                <input type="text" class="slider-button-text" value="${slide.buttonText || ''}" placeholder="Saiba Mais">
            </div>
            <button type="button" class="btn btn-danger remove-slide-btn">Remover Slide</button>
            <hr>
        `;

        sliderContainer.appendChild(slideElement);

        // Adicionar event listeners
        setupSlideEventListeners(slideElement);
    });
}

function setupSlideEventListeners(slideElement) {
    // Event listener para upload de imagem
    const imageFileInput = slideElement.querySelector('.slider-image-file');
    const imageUrlInput = slideElement.querySelector('.slider-image');
    const imagePreview = slideElement.querySelector('.image-preview');

    if (imageFileInput) {
        imageFileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    showAdminLoading();
                    const uploadedUrl = await uploadSliderImage(file);
                    if (uploadedUrl) {
                        imageUrlInput.value = uploadedUrl;
                        // Mostrar preview da imagem
                        if (imagePreview) {
                            imagePreview.innerHTML = `<img src="${uploadedUrl}" style="max-width: 200px; max-height: 150px; border: 1px solid #ddd; margin-top: 10px;">`;
                        }
                        showAdminSuccess('Imagem enviada com sucesso!');
                    }
                } catch (error) {
                    console.error('Erro ao fazer upload da imagem:', error);
                    showAdminError('Erro ao fazer upload da imagem: ' + error.message);
                } finally {
                    hideAdminLoading();
                }
            }
        });
    }

    // Event listener para remover slide
    const removeBtn = slideElement.querySelector('.remove-slide-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            slideElement.remove();
        });
    }
}

// ==========================================
// FUNCIONALIDADES AVANÇADAS DO ADMIN PANEL
// ==========================================

// Sistema de Preview em Tempo Real
class AdminPreview {
    constructor() {
        this.previewContent = document.getElementById('preview-content');
        this.previewToggle = document.getElementById('preview-toggle');
        this.dashboardPreview = document.getElementById('dashboard-preview');
        this.currentSection = null;
        this.init();
    }

    init() {
        // Toggle preview visibility
        if (this.previewToggle) {
            this.previewToggle.addEventListener('click', () => {
                this.dashboardPreview.classList.toggle('show');
                this.previewToggle.textContent = this.dashboardPreview.classList.contains('show') ? 'Ocultar' : 'Mostrar';
            });
        }

        // Auto-hide preview on mobile
        if (window.innerWidth <= 768) {
            this.dashboardPreview.classList.remove('show');
        }
    }

    updatePreview(section, data) {
        if (!this.previewContent) return;

        this.currentSection = section;

        let previewHTML = '';

        switch (section) {
            case 'about':
                previewHTML = this.generateAboutPreview(data);
                break;
            case 'home':
                previewHTML = this.generateHomePreview(data);
                break;
            case 'post':
                previewHTML = this.generatePostPreview(data);
                break;
            case 'project':
                previewHTML = this.generateProjectPreview(data);
                break;
            default:
                previewHTML = '<div class="preview-placeholder"><p>💡 Faça alterações para ver o preview aqui</p></div>';
        }

        this.previewContent.innerHTML = previewHTML;
    }

    generateAboutPreview(data) {
        return `
            <div class="preview-section">
                <h4>👤 Preview - Página Sobre</h4>
                <div class="preview-about">
                    <div class="preview-bio">
                        <h5>Biografia:</h5>
                        <p>${data.bio || 'Nenhuma biografia definida'}</p>
                    </div>
                    ${data.profileImage ? `<img src="${data.profileImage}" alt="Foto de perfil" style="max-width: 150px; border-radius: 8px; margin: 10px 0;">` : ''}
                    ${data.skills && data.skills.length > 0 ? `
                        <div class="preview-skills">
                            <h5>Habilidades:</h5>
                            <div class="skills-tags">
                                ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateHomePreview(data) {
        return `
            <div class="preview-section">
                <h4>🏠 Preview - Página Inicial</h4>
                <div class="preview-home">
                    <div class="preview-hero">
                        <h5>Seção Hero:</h5>
                        <h3>${data.heroTitle || 'Título não definido'}</h3>
                        <p>${data.heroSubtitle || 'Subtítulo não definido'}</p>
                        <p>${data.heroDescription || 'Descrição não definida'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    generatePostPreview(data) {
        return `
            <div class="preview-section">
                <h4>📝 Preview - Post</h4>
                <div class="preview-post">
                    <h3>${data.title || 'Título do post'}</h3>
                    <p><strong>Slug:</strong> ${data.slug || 'url-do-post'}</p>
                    <p><strong>Resumo:</strong> ${data.excerpt || 'Resumo do post'}</p>
                    ${data.coverImage ? `<img src="${data.coverImage}" alt="Capa" style="max-width: 200px; border-radius: 8px; margin: 10px 0;">` : ''}
                    ${data.tags ? `<p><strong>Tags:</strong> ${data.tags}</p>` : ''}
                </div>
            </div>
        `;
    }

    generateProjectPreview(data) {
        return `
            <div class="preview-section">
                <h4>🚀 Preview - Projeto</h4>
                <div class="preview-project">
                    <h3>${data.title || 'Nome do projeto'}</h3>
                    ${data.link ? `<p><strong>Link:</strong> <a href="${data.link}" target="_blank">${data.link}</a></p>` : ''}
                    <p><strong>Descrição:</strong> ${data.description || 'Descrição do projeto'}</p>
                    ${data.image ? `<img src="${data.image}" alt="Projeto" style="max-width: 200px; border-radius: 8px; margin: 10px 0;">` : ''}
                    ${data.technologies ? `<p><strong>Tecnologias:</strong> ${data.technologies}</p>` : ''}
                </div>
            </div>
        `;
    }
}

// Sistema de Drag and Drop
class DragAndDropManager {
    constructor() {
        this.draggedElement = null;
        this.placeholder = null;
        this.init();
    }

    init() {
        document.addEventListener('dragstart', this.handleDragStart.bind(this));
        document.addEventListener('dragend', this.handleDragEnd.bind(this));
        document.addEventListener('dragover', this.handleDragOver.bind(this));
        document.addEventListener('drop', this.handleDrop.bind(this));
    }

    makeDraggable(element) {
        element.draggable = true;
        element.classList.add('draggable-item');

        const dragHandle = element.querySelector('.drag-handle');
        if (dragHandle) {
            dragHandle.addEventListener('mousedown', () => {
                element.draggable = true;
            });
        }
    }

    handleDragStart(e) {
        this.draggedElement = e.target;
        this.draggedElement.classList.add('dragging');

        // Criar placeholder
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'drag-placeholder';
        this.placeholder.innerHTML = '⬇️ Solte aqui';
    }

    handleDragEnd(e) {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
        }

        if (this.placeholder && this.placeholder.parentNode) {
            this.placeholder.remove();
        }

        this.draggedElement = null;
        this.placeholder = null;
    }

    handleDragOver(e) {
        e.preventDefault();

        const target = e.target.closest('.draggable-item');
        if (!target || target === this.draggedElement) return;

        const rect = target.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (e.clientY < midpoint) {
            // Inserir antes
            if (this.placeholder && this.placeholder.parentNode) {
                this.placeholder.remove();
            }
            target.parentNode.insertBefore(this.placeholder, target);
        } else {
            // Inserir depois
            if (this.placeholder && this.placeholder.parentNode) {
                this.placeholder.remove();
            }
            target.parentNode.insertBefore(this.placeholder, target.nextSibling);
        }
    }

    handleDrop(e) {
        e.preventDefault();

        if (!this.draggedElement || !this.placeholder) return;

        // Substituir placeholder pelo elemento arrastado
        this.placeholder.parentNode.replaceChild(this.draggedElement, this.placeholder);

        // Salvar nova ordem
        this.saveNewOrder(this.draggedElement.parentNode);

        // Limpar
        this.placeholder = null;
    }

    saveNewOrder(container) {
        const items = container.querySelectorAll('.draggable-item');
        const order = Array.from(items).map((item, index) => ({
            id: item.dataset.id,
            order: index
        }));

        console.log('Nova ordem salva:', order);

        // Aqui você pode implementar a lógica para salvar no banco
        // Por exemplo: updateOrderInDatabase(order);
    }
}

// Sistema de Notificações Toast
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Criar container para toasts
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-title">${this.getTitle(type)}</div>
            <div class="toast-message">${message}</div>
        `;

        // Tornar clicável
        toast.style.pointerEvents = 'auto';
        toast.style.cursor = 'pointer';

        this.container.appendChild(toast);

        // Mostrar toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-remover
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);

        // Remover ao clicar
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });
    }

    getTitle(type) {
        const titles = {
            success: '✅ Sucesso',
            error: '❌ Erro',
            warning: '⚠️ Aviso',
            info: 'ℹ️ Informação'
        };
        return titles[type] || titles.info;
    }
}

// Funções de utilidade aprimoradas
function showAdminSuccess(message) {
    if (window.FeedbackSystem) {
        window.FeedbackSystem.showToast(message, 'success');
    } else {
        alert(message);
    }
}

function showAdminError(message) {
    if (window.FeedbackSystem) {
        window.FeedbackSystem.showToast(message, 'error');
    } else {
        alert('Erro: ' + message);
    }
}

function showAdminLoading() {
    const overlay = document.getElementById('loading-spinner');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideAdminLoading() {
    const overlay = document.getElementById('loading-spinner');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function closeModal() {
    // Fechar qualquer modal aberto
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// ==========================================
// FUNÇÕES DE LIMPEZA DE FORMULÁRIOS
// ==========================================

function clearPostForm() {
    // Limpar campos do formulário de posts
    if (adminPostIdInput) adminPostIdInput.value = '';
    if (adminPostTitleInput) adminPostTitleInput.value = '';
    if (adminPostExcerptInput) adminPostExcerptInput.value = '';
    if (adminPostTagsInput) adminPostTagsInput.value = '';
    if (adminPostStatusSelect) adminPostStatusSelect.value = 'draft';
    if (adminCoverImageInput) adminCoverImageInput.value = '';
    if (adminCoverImageUrlInput) adminCoverImageUrlInput.value = '';
    if (adminCoverImagePreview) adminCoverImagePreview.src = '';
    if (adminPostContentTextarea) adminPostContentTextarea.value = '';
    
    // Resetar estado de edição
    adminIsEditing = false;
    adminEditingPostId = null;
    
    // Resetar EasyMDE se existir
    if (adminEasyMDE) {
        adminEasyMDE.value('');
    }
}

function clearProjectForm() {
    // Limpar campos do formulário de projetos
    if (adminProjectIdInput) adminProjectIdInput.value = '';
    if (adminProjectTitleInput) adminProjectTitleInput.value = '';
    if (adminProjectDescriptionInput) adminProjectDescriptionInput.value = '';
    if (adminProjectTechnologiesInput) adminProjectTechnologiesInput.value = '';
    if (adminProjectDemoLinkInput) adminProjectDemoLinkInput.value = '';
    if (adminProjectGithubLinkInput) adminProjectGithubLinkInput.value = '';
    if (adminProjectDownloadLinkInput) adminProjectDownloadLinkInput.value = '';
    if (adminProjectStatusSelect) adminProjectStatusSelect.value = 'draft';
    if (adminProjectImageInput) adminProjectImageInput.value = '';
    if (adminProjectImageUrlInput) adminProjectImageUrlInput.value = '';
    if (adminProjectImagePreview) adminProjectImagePreview.src = '';
    
    // Resetar estado de edição
    adminIsEditing = false;
    adminEditingProjectId = null;
}

// Configurar preview em tempo real
function setupRealTimePreview() {
    // Preview para formulário About
    const aboutForm = document.getElementById('about-form');
    if (aboutForm) {
        aboutForm.addEventListener('input', () => {
            const data = {
                bio: document.getElementById('about-bio').value,
                profileImage: document.getElementById('profile-image-url').value,
                skills: [
                    ...document.getElementById('skills-frontend').value.split(',').map(s => s.trim()).filter(s => s),
                    ...document.getElementById('skills-backend').value.split(',').map(s => s.trim()).filter(s => s),
                    ...document.getElementById('skills-database').value.split(',').map(s => s.trim()).filter(s => s),
                    ...document.getElementById('skills-tools').value.split(',').map(s => s.trim()).filter(s => s)
                ]
            };
            if (window.adminPreview) {
                window.adminPreview.updatePreview('about', data);
            }
        });
    }

    // Preview para formulário Home
    const homeForm = document.getElementById('home-form');
    if (homeForm) {
        homeForm.addEventListener('input', () => {
            const data = {
                heroTitle: document.getElementById('hero-title').value,
                heroSubtitle: document.getElementById('hero-subtitle').value,
                heroDescription: document.getElementById('hero-description').value
            };
            if (window.adminPreview) {
                window.adminPreview.updatePreview('home', data);
            }
        });
    }

    // Preview para formulário de Posts
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('input', () => {
            const data = {
                title: document.getElementById('post-title').value,
                slug: document.getElementById('post-slug').value,
                excerpt: document.getElementById('post-excerpt').value,
                coverImage: document.getElementById('post-cover-image').value,
                tags: document.getElementById('post-tags').value
            };
            if (window.adminPreview) {
                window.adminPreview.updatePreview('post', data);
            }
        });
    }

    // Preview para formulário de Projetos
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('input', () => {
            const data = {
                title: document.getElementById('project-title').value,
                link: document.getElementById('project-link').value,
                description: document.getElementById('project-description').value,
                image: document.getElementById('project-image').value,
                technologies: document.getElementById('project-technologies').value
            };
            if (window.adminPreview) {
                window.adminPreview.updatePreview('project', data);
            }
        });
    }
}

function loadSavedSlides() {
    // Carregar slides salvos das configurações
    if (!window.supabase) return;

    window.supabase
        .from('settings')
        .select('value')
        .eq('key', 'home')
        .single()
        .then(({ data, error }) => {
            if (error && error.code !== 'PGRST116') {
                console.error('Erro ao carregar slides:', error);
                return;
            }

            if (data && data.value && data.value.slider && data.value.slider.items) {
                const slides = data.value.slider.items;
                loadSliderItems(slides);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar slides salvos:', error);
        });
}

// Função auxiliar para formatar datas para campos de input date
function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    // Se já estiver no formato yyyy-MM-dd, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    
    // Tentar converter de "Mês Ano" para yyyy-MM-dd
    const months = {
        'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
        'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
        'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
    };
    
    const match = dateString.toLowerCase().match(/^(\w+)\s+(\d{4})$/);
    if (match) {
        const month = months[match[1]];
        const year = match[2];
        if (month) {
            return `${year}-${month}-01`; // Assume primeiro dia do mês
        }
    }
    
    // Retorna string vazia se não conseguir converter
    return '';
}
