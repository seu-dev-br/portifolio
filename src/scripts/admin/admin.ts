// Admin.ts - Painel Administrativo com Supabase (TypeScript)
// Atualizado para Supabase (100% GRATUITO)

import type { SupabaseClient, Post, Project, User } from './types';

// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================

let adminCurrentUser: User | null = null;
let adminEasyMDE: any = null;
let adminIsEditing: boolean = false;
let adminEditingPostId: string | null = null;
let adminEditingProjectId: string | null = null;

// Supabase client reference
const adminSupabaseClient = (window as any).supabase;

// ==========================================
// ELEMENTOS DOM
// ==========================================

// Containers principais
const adminLoginContainer = document.getElementById('login-container') as HTMLElement | null;
const adminDashboardContainer = document.getElementById('dashboard-container') as HTMLElement | null;
const adminLoginForm = document.getElementById('login-form') as HTMLFormElement | null;
const adminLoginError = document.getElementById('login-error') as HTMLElement | null;
const adminLogoutBtn = document.getElementById('logout-btn') as HTMLElement | null;
const adminLoadingSpinner = document.getElementById('loading-spinner') as HTMLElement | null;

// Navigation elements
const adminListPostsBtn = document.getElementById('list-posts-btn') as HTMLElement | null;
const adminNewPostBtn = document.getElementById('new-post-btn') as HTMLElement | null;
const adminListProjectsBtn = document.getElementById('list-projects-btn') as HTMLElement | null;
const adminNewProjectBtn = document.getElementById('new-project-btn') as HTMLElement | null;
const adminPostsListSection = document.getElementById('posts-list-section') as HTMLElement | null;
const adminPostEditorSection = document.getElementById('post-editor-section') as HTMLElement | null;
const adminProjectsListSection = document.getElementById('projects-list-section') as HTMLElement | null;
const adminProjectEditorSection = document.getElementById('project-editor-section') as HTMLElement | null;

// Editor elements
const adminPostForm = document.getElementById('post-form') as HTMLFormElement | null;
const adminEditorTitle = document.getElementById('editor-title') as HTMLElement | null;
const adminCancelEditBtn = document.getElementById('cancel-edit-btn') as HTMLElement | null;
const adminPostsContainer = document.getElementById('posts-container') as HTMLElement | null;
const adminProjectsContainer = document.getElementById('projects-container') as HTMLElement | null;

// Form elements - Posts
const adminPostIdInput = document.getElementById('post-id') as HTMLInputElement | null;
const adminPostTitleInput = document.getElementById('post-title') as HTMLInputElement | null;
const adminPostExcerptInput = document.getElementById('post-excerpt') as HTMLInputElement | null;
const adminPostTagsInput = document.getElementById('post-tags') as HTMLInputElement | null;
const adminPostStatusSelect = document.getElementById('post-status') as HTMLSelectElement | null;
const adminCoverImageInput = document.getElementById('cover-image-input') as HTMLInputElement | null;
const adminCoverImageUrlInput = document.getElementById('cover-image-url') as HTMLInputElement | null;
const adminCoverImagePreview = document.getElementById('cover-image-preview') as HTMLImageElement | null;
const adminPostContentTextarea = document.getElementById('post-content') as HTMLTextAreaElement | null;

// Form elements - Projects
const adminProjectForm = document.getElementById('project-form') as HTMLFormElement | null;
const adminProjectEditorTitle = document.getElementById('project-editor-title') as HTMLElement | null;
const adminCancelProjectEditBtn = document.getElementById('cancel-project-edit-btn') as HTMLElement | null;
const adminProjectIdInput = document.getElementById('project-id') as HTMLInputElement | null;
const adminProjectTitleInput = document.getElementById('project-title') as HTMLInputElement | null;
const adminProjectDescriptionInput = document.getElementById('project-description') as HTMLTextAreaElement | null;
const adminProjectTechnologiesInput = document.getElementById('project-technologies') as HTMLInputElement | null;
const adminProjectDemoLinkInput = document.getElementById('project-demo-link') as HTMLInputElement | null;
const adminProjectGithubLinkInput = document.getElementById('project-github-link') as HTMLInputElement | null;
const adminProjectDownloadLinkInput = document.getElementById('project-download-link') as HTMLInputElement | null;
const adminProjectStatusSelect = document.getElementById('project-status') as HTMLSelectElement | null;
const adminProjectImageInput = document.getElementById('project-image-input') as HTMLInputElement | null;
const adminProjectImageUrlInput = document.getElementById('project-image-url') as HTMLInputElement | null;
const adminProjectImagePreview = document.getElementById('project-image-preview') as HTMLImageElement | null;

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

function showAdminLoading(): void {
    if (adminLoadingSpinner) {
        adminLoadingSpinner.style.display = 'flex';
    }
}

function hideAdminLoading(): void {
    if (adminLoadingSpinner) {
        adminLoadingSpinner.style.display = 'none';
    }
}

function showAdminError(message: string, container?: HTMLElement | null): void {
    const errorDiv = container || adminLoginError;
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function showAdminSuccess(message: string): void {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    const dashboardSection = document.querySelector('.dashboard-section');
    if (dashboardSection) {
        dashboardSection.prepend(successDiv);
    }
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ==========================================

async function loginAdmin(email: string, password: string): Promise<void> {
    try {
        showAdminLoading();

        if (!window.supabase) {
            throw new Error('Cliente Supabase não inicializado');
        }

        const { data, error } = await window.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw error;
        }

        if (data.user) {
            adminCurrentUser = {
                id: data.user.id,
                email: data.user.email || '',
            };
            showDashboard();
            showAdminSuccess('Login realizado com sucesso!');
        }
    } catch (error: any) {
        console.error('Erro no login:', error);
        showAdminError(error.message || 'Erro ao fazer login');
    } finally {
        hideAdminLoading();
    }
}

async function logoutAdmin(): Promise<void> {
    try {
        if (adminSupabaseClient) {
            await adminSupabaseClient.auth.signOut();
        }
        adminCurrentUser = null;
        showLogin();
        showAdminSuccess('Logout realizado com sucesso!');
    } catch (error: any) {
        console.error('Erro no logout:', error);
        showAdminError('Erro ao fazer logout');
    }
}

// ==========================================
// FUNÇÕES DE UI
// ==========================================

function showLogin(): void {
    if (adminLoginContainer && adminDashboardContainer) {
        adminLoginContainer.style.display = 'block';
        adminDashboardContainer.style.display = 'none';
    }
}

function showDashboard(): void {
    if (adminLoginContainer && adminDashboardContainer) {
        adminLoginContainer.style.display = 'none';
        adminDashboardContainer.style.display = 'block';
        loadPosts();
    }
}

function showPostsList(): void {
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

function showPostEditor(post?: Post): void {
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
    adminEditingPostId = post?.id || null;

    // Preencher formulário se editando
    if (post && adminPostTitleInput && adminPostExcerptInput && adminPostTagsInput && adminPostStatusSelect && adminCoverImageUrlInput) {
        adminPostTitleInput.value = post.title;
        adminPostExcerptInput.value = post.excerpt;
        adminPostTagsInput.value = post.tags.join(', ');
        adminPostStatusSelect.value = post.status;
        adminCoverImageUrlInput.value = post.cover_image || '';
    } else {
        // Limpar formulário se novo post
        if (adminPostTitleInput) adminPostTitleInput.value = '';
        if (adminPostExcerptInput) adminPostExcerptInput.value = '';
        if (adminPostTagsInput) adminPostTagsInput.value = '';
        if (adminPostStatusSelect) adminPostStatusSelect.value = 'draft';
        if (adminCoverImageInput) adminCoverImageInput.value = '';
        if (adminCoverImageUrlInput) adminCoverImageUrlInput.value = '';
    }
}

function generateSlug(title: string): string {
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

async function adminLogin(email: string, password: string): Promise<void> {
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
        showAdminError(error?.message || 'Erro no login');
        return;
    }

    adminCurrentUser = data.user;
    adminLoginContainer!.style.display = 'none';
    adminDashboardContainer!.style.display = 'block';

    // Carregar posts e projetos após o login
    await Promise.all([loadPosts(), loadProjects()]);
}

async function adminLogout(): Promise<void> {
    if (!window.supabase) {
        showAdminError('Supabase não está inicializado');
        return;
    }

    showAdminLoading();
    await window.supabase.auth.signOut();
    hideAdminLoading();

    adminCurrentUser = null;
    adminLoginContainer!.style.display = 'flex';
    adminDashboardContainer!.style.display = 'none';
}

// ==========================================
// FUNÇÕES DE POSTAGENS
// ==========================================

async function loadPosts(): Promise<void> {
    if (!window.supabase) {
        showAdminError('Supabase não está inicializado');
        return;
    }

    showAdminLoading();
    const { data: posts, error } = await window.supabase.from('posts').select('*');

    hideAdminLoading();

    if (error) {
        showAdminError(error.message);
        return;
    }

    adminPostsContainer!.innerHTML = '';
    posts?.forEach((post: Post) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <p>Status: ${post.status}</p>
            <button class="edit-post-btn" data-id="${post.id}">Editar</button>
            <button class="delete-post-btn" data-id="${post.id}">Excluir</button>
        `;
        adminPostsContainer!.appendChild(postElement);
    });
}

async function createPost(): Promise<void> {
    if (!adminSupabaseClient || !adminPostTitleInput || !adminPostContentTextarea) return;

    const postData: Omit<Post, 'id' | 'created_at' | 'updated_at'> = {
        title: adminPostTitleInput.value,
        content: adminPostContentTextarea.value,
        excerpt: adminPostExcerptInput?.value || '',
        tags: adminPostTagsInput?.value.split(',').map((tag) => tag.trim()) || [],
        status: adminPostStatusSelect?.value as 'draft' | 'published',
        cover_image: adminCoverImageUrlInput?.value || '',
        author_id: adminCurrentUser?.id || '',
    };

    const { data, error } = await adminSupabaseClient.from('posts').insert([postData]);

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
    if (adminCoverImagePreview) adminCoverImagePreview!.src = '';
    loadPosts();
}

async function updatePost(postId: string): Promise<void> {
    if (!adminSupabaseClient || !adminPostTitleInput || !adminPostContentTextarea) return;

    const postData: Partial<Post> = {
        title: adminPostTitleInput.value,
        content: adminPostContentTextarea.value,
        excerpt: adminPostExcerptInput?.value || '',
        tags: adminPostTagsInput?.value.split(',').map((tag) => tag.trim()) || [],
        status: adminPostStatusSelect?.value as 'draft' | 'published',
        cover_image: adminCoverImageUrlInput?.value || '',
    };

    const { data, error } = await adminSupabaseClient.from('posts').update(postData).eq('id', postId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Post atualizado com sucesso!');
    loadPosts();
}

async function deletePost(postId: string): Promise<void> {
    if (!adminSupabaseClient) return;

    const { data, error } = await adminSupabaseClient.from('posts').delete().eq('id', postId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Post excluído com sucesso!');
    loadPosts();
}

// ==========================================
// FUNÇÕES DE PROJETOS
// ==========================================

async function loadProjects(): Promise<void> {
    if (!window.supabase) {
        showAdminError('Supabase não está inicializado');
        return;
    }

    showAdminLoading();
    const { data: projects, error } = await window.supabase.from('projects').select('*');

    hideAdminLoading();

    if (error) {
        showAdminError(error.message);
        return;
    }

    adminProjectsContainer!.innerHTML = '';
    projects?.forEach((project: Project) => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        projectElement.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p>Status: ${project.status}</p>
            <button class="edit-project-btn" data-id="${project.id}">Editar</button>
            <button class="delete-project-btn" data-id="${project.id}">Excluir</button>
        `;
        adminProjectsContainer!.appendChild(projectElement);
    });
}

async function createProject(): Promise<void> {
    if (!adminSupabaseClient || !adminProjectTitleInput || !adminProjectDescriptionInput) return;

    const projectData = {
        title: adminProjectTitleInput.value,
        description: adminProjectDescriptionInput.value,
        technologies: adminProjectTechnologiesInput?.value.split(',').map((tech) => tech.trim()) || [],
        demo_link: adminProjectDemoLinkInput?.value || '',
        github_link: adminProjectGithubLinkInput?.value || '',
        download_link: adminProjectDownloadLinkInput?.value || '',
        status: adminProjectStatusSelect?.value as 'draft' | 'published',
        image: adminProjectImageUrlInput?.value || '',
        author_id: adminCurrentUser?.id || '',
    };

    const { data, error } = await adminSupabaseClient.from('projects').insert([projectData]);

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
    if (adminProjectImagePreview) adminProjectImagePreview!.src = '';
    loadProjects();
}

async function updateProject(projectId: string): Promise<void> {
    if (!adminSupabaseClient || !adminProjectTitleInput || !adminProjectDescriptionInput) return;

    const projectData: Partial<Project> = {
        title: adminProjectTitleInput.value,
        description: adminProjectDescriptionInput.value,
        technologies: adminProjectTechnologiesInput?.value.split(',').map((tech) => tech.trim()) || [],
        demo_link: adminProjectDemoLinkInput?.value || '',
        github_link: adminProjectGithubLinkInput?.value || '',
        download_link: adminProjectDownloadLinkInput?.value || '',
        status: adminProjectStatusSelect?.value as 'draft' | 'published',
        image: adminProjectImageUrlInput?.value || '',
    };

    const { data, error } = await adminSupabaseClient.from('projects').update(projectData).eq('id', projectId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Projeto atualizado com sucesso!');
    loadProjects();
}

async function deleteProject(projectId: string): Promise<void> {
    if (!adminSupabaseClient) return;

    const { data, error } = await adminSupabaseClient.from('projects').delete().eq('id', projectId);

    if (error) {
        showAdminError(error.message);
        return;
    }

    showAdminSuccess('Projeto excluído com sucesso!');
    loadProjects();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

adminLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    await adminLogin(email, password);
});

adminLogoutBtn?.addEventListener('click', async () => {
    await adminLogout();
});

adminListPostsBtn?.addEventListener('click', () => {
    adminPostsListSection!.style.display = 'block';
    adminPostEditorSection!.style.display = 'none';
    adminProjectsListSection!.style.display = 'none';
    adminProjectEditorSection!.style.display = 'none';
});

adminNewPostBtn?.addEventListener('click', () => {
    adminPostsListSection!.style.display = 'none';
    adminPostEditorSection!.style.display = 'block';
    adminProjectsListSection!.style.display = 'none';
    adminProjectEditorSection!.style.display = 'none';
    adminIsEditing = false;
    adminPostIdInput!.value = '';
    adminPostTitleInput!.value = '';
    adminPostExcerptInput!.value = '';
    adminPostTagsInput!.value = '';
    adminPostStatusSelect!.value = 'draft';
    adminCoverImageInput!.value = '';
    adminCoverImageUrlInput!.value = '';
    adminCoverImagePreview!.src = '';
    adminPostContentTextarea!.value = '';
});

adminPostsContainer?.addEventListener('click', async (e) => {
    if (!(e.target instanceof HTMLButtonElement)) return;

    const postId = e.target.getAttribute('data-id');
    if (!postId) return;

    if (e.target.classList.contains('edit-post-btn')) {
        if (!adminSupabaseClient) return;

        const { data: post, error } = await (adminSupabaseClient as any).from('posts').select('*').eq('id', postId).single();

        if (error || !post) {
            showAdminError(error.message);
            return;
        }

        adminIsEditing = true;
        adminEditingPostId = postId;
        adminPostIdInput!.value = post.id;
        adminPostTitleInput!.value = post.title;
        adminPostExcerptInput!.value = post.excerpt;
        adminPostTagsInput!.value = post.tags.join(', ');
        adminPostStatusSelect!.value = post.status;
        adminCoverImageInput!.value = post.cover_image;
        adminCoverImageUrlInput!.value = post.cover_image;
        adminCoverImagePreview!.src = post.cover_image;
        adminPostContentTextarea!.value = post.content;

        adminPostsListSection!.style.display = 'none';
        adminPostEditorSection!.style.display = 'block';
    } else if (e.target.classList.contains('delete-post-btn')) {
        if (confirm('Tem certeza que deseja excluir este post?')) {
            await deletePost(postId);
        }
    }
});

adminPostForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const postId = adminPostIdInput?.value;

    if (adminIsEditing && postId) {
        await updatePost(postId);
    } else {
        await createPost();
    }
});

// Projetos
adminListProjectsBtn?.addEventListener('click', () => {
    adminPostsListSection!.style.display = 'none';
    adminPostEditorSection!.style.display = 'none';
    adminProjectsListSection!.style.display = 'block';
    adminProjectEditorSection!.style.display = 'none';
});

adminNewProjectBtn?.addEventListener('click', () => {
    adminPostsListSection!.style.display = 'none';
    adminPostEditorSection!.style.display = 'none';
    adminProjectsListSection!.style.display = 'none';
    adminProjectEditorSection!.style.display = 'block';
    adminIsEditing = false;
    adminProjectIdInput!.value = '';
    adminProjectTitleInput!.value = '';
    adminProjectDescriptionInput!.value = '';
    adminProjectTechnologiesInput!.value = '';
    adminProjectDemoLinkInput!.value = '';
    adminProjectGithubLinkInput!.value = '';
    adminProjectDownloadLinkInput!.value = '';
    adminProjectStatusSelect!.value = 'draft';
    adminProjectImageInput!.value = '';
    adminProjectImageUrlInput!.value = '';
    adminProjectImagePreview!.src = '';
});

adminProjectsContainer?.addEventListener('click', async (e) => {
    if (!(e.target instanceof HTMLButtonElement)) return;

    const projectId = e.target.getAttribute('data-id');
    if (!projectId) return;

    if (e.target.classList.contains('edit-project-btn')) {
        if (!adminSupabaseClient) return;

        const { data: project, error } = await (adminSupabaseClient as any).from('projects').select('*').eq('id', projectId).single();

        if (error || !project) {
            showAdminError(error.message);
            return;
        }

        adminIsEditing = true;
        adminEditingProjectId = projectId;
        adminProjectIdInput!.value = project.id;
        adminProjectTitleInput!.value = project.title;
        adminProjectDescriptionInput!.value = project.description;
        adminProjectTechnologiesInput!.value = project.technologies.join(', ');
        adminProjectDemoLinkInput!.value = project.demo_link;
        adminProjectGithubLinkInput!.value = project.github_link;
        adminProjectDownloadLinkInput!.value = project.download_link;
        adminProjectStatusSelect!.value = project.status;
        adminProjectImageInput!.value = project.image;
        adminProjectImageUrlInput!.value = project.image;
        adminProjectImagePreview!.src = project.image;

        adminPostsListSection!.style.display = 'none';
        adminPostEditorSection!.style.display = 'none';
        adminProjectsListSection!.style.display = 'none';
        adminProjectEditorSection!.style.display = 'block';
    } else if (e.target.classList.contains('delete-project-btn')) {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            await deleteProject(projectId);
        }
    }
});

adminProjectForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const projectId = adminProjectIdInput?.value;

    if (adminIsEditing && projectId) {
        await updateProject(projectId);
    } else {
        await createProject();
    }
});

// ==========================================
// SUPABASE REALTIME - POSTS (DESABILITADO TEMPORARIAMENTE)
// ==========================================

/*
if (window.supabase) {
    window.supabase
        .from('posts')
        .on('INSERT', (payload: any) => {
            const post = payload.new;
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <p>Status: ${post.status}</p>
                <button class="edit-post-btn" data-id="${post.id}">Editar</button>
                <button class="delete-post-btn" data-id="${post.id}">Excluir</button>
            `;
            adminPostsContainer!.prepend(postElement);
        })
        .on('UPDATE', (payload: any) => {
            const post = payload.new;
            const postElements = Array.from(adminPostsContainer!.children);
            const postElement = postElements.find((el) => el.querySelector('.edit-post-btn')?.getAttribute('data-id') === post.id);

            if (postElement) {
                postElement.querySelector('h3')!.textContent = post.title;
                postElement.querySelector('p')!.textContent = post.excerpt;
                postElement.querySelector('p:nth-of-type(2)')!.textContent = `Status: ${post.status}`;
            }
        })
        .on('DELETE', (payload: any) => {
            const postId = payload.old.id;
            const postElements = Array.from(adminPostsContainer!.children);
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
        .on('INSERT', (payload: any) => {
            const project = payload.new;
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            projectElement.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p>Status: ${project.status}</p>
                <button class="edit-project-btn" data-id="${project.id}">Editar</button>
                <button class="delete-project-btn" data-id="${project.id}">Excluir</button>
            `;
            adminProjectsContainer!.prepend(projectElement);
        })
        .on('UPDATE', (payload: any) => {
            const project = payload.new;
            const projectElements = Array.from(adminProjectsContainer!.children);
            const projectElement = projectElements.find((el) => el.querySelector('.edit-project-btn')?.getAttribute('data-id') === project.id);

            if (projectElement) {
                projectElement.querySelector('h3')!.textContent = project.title;
                projectElement.querySelector('p')!.textContent = project.description;
                projectElement.querySelector('p:nth-of-type(2)')!.textContent = `Status: ${project.status}`;
            }
        })
        .on('DELETE', (payload: any) => {
            const projectId = payload.old.id;
            const projectElements = Array.from(adminProjectsContainer!.children);
            const projectElement = projectElements.find((el) => el.querySelector('.edit-project-btn')?.getAttribute('data-id') === projectId);

            if (projectElement) {
                projectElement.remove();
            }
        })
        .subscribe();
}
*/
