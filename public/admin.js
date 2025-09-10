// Admin Panel Client-Side JavaScript
// Simplified version without complex service dependencies

class AdminPanel {
    constructor() {
        this.currentView = 'overview';
        this.isLoggedIn = false;
        this.projectsData = [];
        this.postsData = [];
        this.messagesData = [];
        this.init();
    }

    init() {
        console.log('🚀 Initializing admin panel...');
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                if (view) {
                    this.switchView(view);
                }
            });
        });

        // Action buttons
        this.setupActionButtons();
    }

    setupActionButtons() {
        console.log('🔧 Setting up action buttons...');

        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                if (typeof this.showProjectModal === 'function') {
                    this.showProjectModal();
                } else {
                    console.log('showProjectModal function not found');
                }
            });
        }

        const addPostBtn = document.getElementById('add-post-btn');
        if (addPostBtn) {
            addPostBtn.addEventListener('click', () => {
                if (typeof this.showPostModal === 'function') {
                    this.showPostModal();
                } else {
                    console.log('showPostModal function not found');
                }
            });
        }

        const refreshMessagesBtn = document.getElementById('refresh-messages-btn');
        if (refreshMessagesBtn) {
            refreshMessagesBtn.addEventListener('click', () => {
                if (typeof this.loadMessages === 'function') {
                    this.loadMessages();
                } else {
                    console.log('loadMessages function not found');
                }
            });
        }

        // Home page management
        const saveHomeBtn = document.getElementById('save-home-btn');
        if (saveHomeBtn) {
            saveHomeBtn.addEventListener('click', () => {
                if (typeof this.saveHomeData === 'function') {
                    this.saveHomeData();
                } else {
                    console.log('saveHomeData function not found');
                }
            });
        }

        const addSlideBtn = document.getElementById('add-slide-btn');
        if (addSlideBtn) {
            addSlideBtn.addEventListener('click', () => {
                if (typeof this.addSlideItem === 'function') {
                    this.addSlideItem();
                } else {
                    console.log('addSlideItem function not found');
                }
            });
        }

        // About page management
        const saveAboutBtn = document.getElementById('save-about-btn');
        if (saveAboutBtn) {
            saveAboutBtn.addEventListener('click', () => {
                if (typeof this.saveAboutData === 'function') {
                    this.saveAboutData();
                } else {
                    console.log('saveAboutData function not found');
                }
            });
        }

        const addExperienceBtn = document.getElementById('add-experience-btn');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => {
                if (typeof this.addExperienceItem === 'function') {
                    this.addExperienceItem();
                } else {
                    console.log('addExperienceItem function not found');
                }
            });
        }

        const addEducationBtn = document.getElementById('add-education-btn');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => {
                if (typeof this.addEducationItem === 'function') {
                    this.addEducationItem();
                } else {
                    console.log('addEducationItem function not found');
                }
            });
        }

        console.log('✅ Action buttons setup complete');
    }

    async checkAuthentication() {
        try {
            this.showLoading();

            // Check if user is logged in (simplified)
            const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';

            if (isLoggedIn) {
                console.log('✅ User authenticated');
                this.showDashboard();
                await this.loadDashboardData();
            } else {
                console.log('❌ User not authenticated');
                this.showLogin();
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            this.showLogin();
        } finally {
            this.hideLoading();
        }
    }

    async handleLogin(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showLoginError('Please fill in all fields');
            return;
        }

        try {
            this.showLoading();

            // Simplified login - in production, this would call your auth service
            if (email === 'admin@italo.dev' && password === 'Italo2025Admin!') {
                localStorage.setItem('admin_logged_in', 'true');
                this.showDashboard();
                await this.loadDashboardData();
                console.log('✅ Login successful');
            } else {
                this.showLoginError('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showLoginError('Login failed');
        } finally {
            this.hideLoading();
        }
    }

    handleLogout() {
        localStorage.removeItem('admin_logged_in');
        this.showLogin();
        console.log('✅ Logged out');
    }

    showLogin() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('login-container').style.display = 'flex';
        document.getElementById('dashboard-container').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard-container').style.display = 'flex';

        // Initialize with overview tab active
        this.switchView('overview');
    }

    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showLoginError(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    switchView(viewName) {
        console.log('🔄 Switching to view:', viewName);

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNav = document.querySelector(`[data-view="${viewName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
            console.log('✅ Navigation updated for:', viewName);
        } else {
            console.log('❌ Navigation item not found for:', viewName);
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.getElementById(`${viewName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
            console.log('✅ Tab content activated for:', viewName);
        } else {
            console.log('❌ Tab content not found for:', viewName);
        }

        this.currentView = viewName;

        // Load data for specific views
        if (viewName === 'home') {
            this.loadHomeData();
        } else if (viewName === 'about') {
            this.loadAboutData();
        }
    }

    async loadDashboardData() {
        try {
            // Load real data from Supabase
            await Promise.all([
                this.loadProjects(),
                this.loadPosts(),
                this.loadMessages()
            ]);

            // Update stats after loading data
            this.updateStatsDisplay({
                projects: this.projectsData?.length || 0,
                posts: this.postsData?.length || 0,
                messages: this.messagesData?.length || 0,
                visits: 1250 // This would come from analytics
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            // Fallback to mock data if Supabase fails
            this.loadMockData();
        }
    }

    async loadMockData() {
        console.log('🔄 Loading mock data as fallback...');
        this.updateStatsDisplay({
            projects: 5,
            posts: 12,
            messages: 8,
            visits: 1250
        });

        // Mock data for fallback
        const mockProjects = [
            { id: 1, title: 'Portfolio Website', description: 'Personal portfolio built with Astro', technologies: 'Astro, TypeScript', status: 'completed' },
            { id: 2, title: 'E-commerce Platform', description: 'Full-stack e-commerce solution', technologies: 'React, Node.js', status: 'in-progress' }
        ];

        const mockPosts = [
            { id: 1, title: 'Getting Started with Astro', excerpt: 'Learn how to build fast websites with Astro framework', status: 'published', createdAt: '2024-01-15' },
            { id: 2, title: 'TypeScript Best Practices', excerpt: 'Tips and tricks for writing better TypeScript code', status: 'draft', createdAt: '2024-01-10' }
        ];

        const mockMessages = [
            { id: 1, name: 'João Silva', email: 'joao@example.com', subject: 'Project Inquiry', message: 'I am interested in your services...', status: 'unread', createdAt: '2024-01-20' }
        ];

        this.renderProjects(mockProjects);
        this.renderPosts(mockPosts);
        this.renderMessages(mockMessages);
    }

    updateStatsDisplay(stats) {
        // If no stats provided, use stored data
        if (!stats) {
            stats = {
                projects: this.projectsData?.length || 0,
                posts: this.postsData?.length || 0,
                messages: this.messagesData?.length || 0,
                visits: 1250 // This would come from analytics
            };
        }

        const elements = {
            'projects-count': stats.projects,
            'posts-count': stats.posts,
            'messages-count': stats.messages,
            'visits-count': stats.visits
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || '0';
            }
        });
    }

    async loadProjects() {
        try {
            console.log('📂 Loading projects from Supabase...');

            // Initialize Supabase if not already done
            if (!window.supabase) {
                const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
                window.supabase = createClient(
                    'https://nattvkjaecceirxthizc.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
                );
            }

            const { data: projects, error } = await window.supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error loading projects:', error);
                throw error;
            }

            console.log('✅ Projects loaded:', projects?.length || 0);
            this.projectsData = projects || [];
            this.renderProjects(this.projectsData);

        } catch (error) {
            console.error('❌ Failed to load projects:', error);
            // Fallback to mock data
            this.loadMockProjects();
        }
    }

    async loadMockProjects() {
        console.log('🔄 Loading mock projects...');
        const mockProjects = [
            { id: 1, title: 'Portfolio Website', description: 'Personal portfolio built with Astro', technologies: ['Astro', 'TypeScript'], status: 'published', created_at: '2024-01-15' },
            { id: 2, title: 'E-commerce Platform', description: 'Full-stack e-commerce solution', technologies: ['React', 'Node.js'], status: 'draft', created_at: '2024-01-10' }
        ];
        this.projectsData = mockProjects;
        this.renderProjects(mockProjects);
    }

    renderProjects(projects) {
        const container = document.getElementById('projects-list');
        if (!container) return;

        if (projects.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-project-diagram"></i><h3>No projects found</h3><p>Start by creating your first project!</p></div>';
            return;
        }

        let html = '';
        projects.forEach(project => {
            // Handle both Supabase format and mock format
            const title = project.title || 'Untitled Project';
            const description = project.description || 'No description available';
            const technologies = Array.isArray(project.technologies)
                ? project.technologies.join(', ')
                : (project.technologies || 'Not specified');
            const status = project.status || 'draft';
            const createdAt = project.created_at || project.createdAt || 'Unknown date';
            const projectId = project.id;

            html += `
                <div class="project-card">
                    <div class="project-header">
                        <h4>${title}</h4>
                        <div class="project-actions">
                            <button class="btn btn-secondary" onclick="adminPanel.editProject(${projectId})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger" onclick="adminPanel.deleteProject(${projectId})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="project-description">${description}</p>
                    <div class="project-meta">
                        <span class="project-tech">${technologies}</span>
                        <span class="project-status status-${status}">${status}</span>
                        <span class="project-date">${new Date(createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    async loadPosts() {
        try {
            console.log('📝 Loading posts from Supabase...');

            // Initialize Supabase if not already done
            if (!window.supabase) {
                const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
                window.supabase = createClient(
                    'https://nattvkjaecceirxthizc.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
                );
            }

            const { data: posts, error } = await window.supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error loading posts:', error);
                throw error;
            }

            console.log('✅ Posts loaded:', posts?.length || 0);
            this.postsData = posts || [];
            this.renderPosts(this.postsData);

        } catch (error) {
            console.error('❌ Failed to load posts:', error);
            // Fallback to mock data
            this.loadMockPosts();
        }
    }

    async loadMockPosts() {
        console.log('🔄 Loading mock posts...');
        const mockPosts = [
            { id: 1, title: 'Getting Started with Astro', excerpt: 'Learn how to build fast websites with Astro framework', status: 'published', created_at: '2024-01-15' },
            { id: 2, title: 'TypeScript Best Practices', excerpt: 'Tips and tricks for writing better TypeScript code', status: 'draft', created_at: '2024-01-10' }
        ];
        this.postsData = mockPosts;
        this.renderPosts(mockPosts);
    }

    renderPosts(posts) {
        const container = document.getElementById('posts-list');
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-blog"></i><h3>No posts found</h3><p>Start by creating your first post!</p></div>';
            return;
        }

        let html = '';
        posts.forEach(post => {
            // Handle both Supabase format and mock format
            const title = post.title || 'Untitled Post';
            const excerpt = post.excerpt || post.content_markdown?.substring(0, 100) + '...' || 'No excerpt available';
            const status = post.status || 'draft';
            const createdAt = post.created_at || post.createdAt || 'Unknown date';
            const postId = post.id;

            html += `
                <div class="post-card">
                    <div class="post-header">
                        <h4>${title}</h4>
                        <div class="post-actions">
                            <button class="btn btn-secondary" onclick="adminPanel.editPost(${postId})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger" onclick="adminPanel.deletePost(${postId})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="post-excerpt">${excerpt}</p>
                    <div class="post-meta">
                        <span class="post-status status-${status}">${status}</span>
                        <span class="post-date">${new Date(createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    async loadMessages() {
        try {
            console.log('💬 Loading messages from Supabase...');

            // Initialize Supabase if not already done
            if (!window.supabase) {
                const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
                window.supabase = createClient(
                    'https://nattvkjaecceirxthizc.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
                );
            }

            const { data: messages, error } = await window.supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error loading messages:', error);
                throw error;
            }

            console.log('✅ Messages loaded:', messages?.length || 0);
            this.messagesData = messages || [];
            this.renderMessages(this.messagesData);

        } catch (error) {
            console.error('❌ Failed to load messages:', error);
            // Fallback to mock data
            this.loadMockMessages();
        }
    }

    async loadMockMessages() {
        console.log('🔄 Loading mock messages...');
        const mockMessages = [
            { id: 1, name: 'João Silva', email: 'joao@example.com', subject: 'Project Inquiry', message: 'I am interested in your services...', status: 'unread', created_at: '2024-01-20' },
            { id: 2, name: 'Maria Santos', email: 'maria@example.com', subject: 'Collaboration', message: 'Would love to work together...', status: 'read', created_at: '2024-01-18' }
        ];
        this.messagesData = mockMessages;
        this.renderMessages(mockMessages);
    }

    renderMessages(messages) {
        const container = document.getElementById('messages-list');
        if (!container) return;

        if (messages.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-envelope"></i><h3>No messages found</h3><p>Messages will appear here when they arrive!</p></div>';
            return;
        }

        let html = '';
        messages.forEach(message => {
            // Handle both Supabase format and mock format
            const name = message.name || 'Anonymous';
            const email = message.email || 'no-email@example.com';
            const subject = message.subject || 'No subject';
            const messageText = message.message || 'No message content';
            const status = message.status || 'unread';
            const createdAt = message.created_at || message.createdAt || 'Unknown date';
            const messageId = message.id;

            const statusClass = status === 'unread' ? 'unread' : '';
            const statusText = status === 'unread' ? 'Unread' : 'Read';
            const dateText = new Date(createdAt).toLocaleDateString('pt-BR');

            html += `
                <div class="message-card ${statusClass}">
                    <div class="message-header">
                        <div class="message-info">
                            <h4>${name}</h4>
                            <span class="message-email">${email}</span>
                        </div>
                        <div class="message-actions">
                            <button class="btn btn-secondary" onclick="adminPanel.markAsRead(${messageId})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-danger" onclick="adminPanel.deleteMessage(${messageId})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="message-subject"><strong>${subject}</strong></p>
                    <p class="message-content">${messageText}</p>
                    <div class="message-meta">
                        <span class="message-date">${dateText}</span>
                        <span class="message-status status-${status}">${statusText}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Action methods
    editProject(id) {
        console.log('Edit project:', id);
        alert('Edit project functionality coming soon!');
    }

    deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            console.log('Delete project:', id);
            // TODO: Implement delete functionality
        }
    }

    editPost(id) {
        console.log('Edit post:', id);
        alert('Edit post functionality coming soon!');
    }

    deletePost(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            console.log('Delete post:', id);
            // TODO: Implement delete functionality
        }
    }

    markAsRead(id) {
        console.log('Mark as read:', id);
        // TODO: Implement mark as read functionality
    }

    deleteMessage(id) {
        if (confirm('Are you sure you want to delete this message?')) {
            console.log('Delete message:', id);
            // TODO: Implement delete functionality
        }
    }

    showProjectModal() {
        alert('Add new project functionality coming soon!');
    }

    showPostModal() {
        alert('Add new post functionality coming soon!');
    }
}

// Home Page Management Methods
AdminPanel.prototype.loadHomeData = async function() {
    try {
        console.log('📄 Loading home page data...');

        if (!window.supabase) {
            const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
            window.supabase = createClient(
                'https://nattvkjaecceirxthizc.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
            );
        }

        const { data: home, error } = await window.supabase
            .from('settings')
            .select('*')
            .eq('key', 'home')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('❌ Error loading home data:', error);
            this.loadDefaultHomeData();
            return;
        }

        if (home?.value) {
            this.populateHomeForm(home.value);
        } else {
            this.loadDefaultHomeData();
        }

    } catch (error) {
        console.error('❌ Failed to load home data:', error);
        this.loadDefaultHomeData();
    }
};

AdminPanel.prototype.loadDefaultHomeData = function() {
    console.log('🔄 Loading default home data...');
    const defaultData = {
        hero: {
            title: 'Olá, eu sou Ítalo Antonio',
            subtitle: 'Desenvolvedor Full Stack',
            description: 'Criando experiências digitais excepcionais com tecnologias modernas e melhores práticas de desenvolvimento.',
            ctaPrimary: 'Ver Projetos',
            ctaSecondary: 'Sobre Mim'
        },
        slider: {
            enabled: false,
            autoplay: true,
            delay: 5000,
            items: []
        },
        featured: {
            title: 'Projetos em Destaque',
            description: 'Alguns dos meus trabalhos mais recentes e desafiadores',
            count: 3
        },
        posts: {
            title: 'Últimas Publicações',
            description: 'Confira minhas últimas publicações no blog',
            count: 3
        }
    };
    this.populateHomeForm(defaultData);
};

AdminPanel.prototype.populateHomeForm = function(data) {
    // Hero section
    document.getElementById('hero-title').value = data.hero?.title || '';
    document.getElementById('hero-subtitle').value = data.hero?.subtitle || '';
    document.getElementById('hero-description').value = data.hero?.description || '';
    document.getElementById('hero-cta-primary').value = data.hero?.ctaPrimary || '';
    document.getElementById('hero-cta-secondary').value = data.hero?.ctaSecondary || '';

    // Slider section
    document.getElementById('slider-enabled').checked = data.slider?.enabled || false;
    document.getElementById('slider-autoplay').checked = data.slider?.autoplay || false;
    document.getElementById('slider-delay').value = data.slider?.delay || 5000;

    // Clear existing slides
    const slidesContainer = document.getElementById('slider-items-container');
    slidesContainer.innerHTML = '';

    // Add existing slides
    if (data.slider?.items) {
        data.slider.items.forEach((slide, index) => {
            this.addSlideItem(slide, index);
        });
    }

    // Featured section
    document.getElementById('featured-title').value = data.featured?.title || '';
    document.getElementById('featured-description').value = data.featured?.description || '';
    document.getElementById('featured-count').value = data.featured?.count || 3;

    // Posts section
    document.getElementById('posts-title').value = data.posts?.title || '';
    document.getElementById('posts-description').value = data.posts?.description || '';
    document.getElementById('posts-count').value = data.posts?.count || 3;
};

AdminPanel.prototype.saveHomeData = async function() {
    try {
        this.showLoading();

        const homeData = {
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
                items: this.getSliderItems()
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

        if (!window.supabase) {
            const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
            window.supabase = createClient(
                'https://nattvkjaecceirxthizc.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
            );
        }

        const { error } = await window.supabase
            .from('settings')
            .upsert({
                key: 'home',
                value: homeData,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('❌ Error saving home data:', error);
            alert('Erro ao salvar dados da página inicial: ' + error.message);
        } else {
            console.log('✅ Home data saved successfully');
            alert('Dados da página inicial salvos com sucesso!');
        }

    } catch (error) {
        console.error('❌ Failed to save home data:', error);
        alert('Erro ao salvar dados da página inicial');
    } finally {
        this.hideLoading();
    }
};

AdminPanel.prototype.addSlideItem = function(slideData = null, index = null) {
    const slidesContainer = document.getElementById('slider-items-container');
    const slideIndex = index !== null ? index : slidesContainer.children.length;

    const slideItem = document.createElement('div');
    slideItem.className = 'slide-item';
    slideItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Título:</label>
                <input type="text" class="slide-title" value="${slideData?.title || ''}" placeholder="Título do slide">
            </div>
            <div class="form-group">
                <label>Subtítulo:</label>
                <input type="text" class="slide-subtitle" value="${slideData?.subtitle || ''}" placeholder="Subtítulo do slide">
            </div>
        </div>
        <div class="form-group">
            <label>Descrição:</label>
            <textarea class="slide-description" rows="2" placeholder="Descrição do slide">${slideData?.description || ''}</textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Imagem (URL):</label>
                <input type="text" class="slide-image" value="${slideData?.image || ''}" placeholder="URL da imagem">
            </div>
            <div class="form-group">
                <label>Link (opcional):</label>
                <input type="text" class="slide-link" value="${slideData?.link || ''}" placeholder="Link do slide">
            </div>
        </div>
        <div class="slide-actions">
            <button class="btn btn-danger" onclick="adminPanel.removeSlideItem(this)">
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
    `;

    slidesContainer.appendChild(slideItem);
};

AdminPanel.prototype.removeSlideItem = function(button) {
    const slideItem = button.closest('.slide-item');
    slideItem.remove();
};

AdminPanel.prototype.getSliderItems = function() {
    const slides = [];
    const slideItems = document.querySelectorAll('.slide-item');

    slideItems.forEach((item, index) => {
        const title = item.querySelector('.slide-title').value;
        const subtitle = item.querySelector('.slide-subtitle').value;
        const description = item.querySelector('.slide-description').value;
        const image = item.querySelector('.slide-image').value;
        const link = item.querySelector('.slide-link').value;

        if (title || subtitle || description) {
            slides.push({
                id: `slide-${index}`,
                title,
                subtitle,
                description,
                image,
                link,
                order: index
            });
        }
    });

    return slides;
};

// About Page Management Methods
AdminPanel.prototype.loadAboutData = async function() {
    try {
        console.log('👤 Loading about page data...');

        if (!window.supabase) {
            const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
            window.supabase = createClient(
                'https://nattvkjaecceirxthizc.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
            );
        }

        const { data: about, error } = await window.supabase
            .from('settings')
            .select('*')
            .eq('key', 'about')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('❌ Error loading about data:', error);
            this.loadDefaultAboutData();
            return;
        }

        if (about?.value) {
            this.populateAboutForm(about.value);
        } else {
            this.loadDefaultAboutData();
        }

    } catch (error) {
        console.error('❌ Failed to load about data:', error);
        this.loadDefaultAboutData();
    }
};

AdminPanel.prototype.loadDefaultAboutData = function() {
    console.log('🔄 Loading default about data...');
    const defaultData = {
        bio: 'Olá! Sou um desenvolvedor full stack apaixonado por criar soluções digitais inovadoras.',
        profileImage: '',
        skills: {
            frontend: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Astro'],
            backend: ['Node.js', 'Python', 'PHP', 'Express.js', 'FastAPI', 'Laravel'],
            database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis'],
            tools: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code']
        },
        experience: [],
        education: [],
        socialLinks: {
            github: 'https://github.com/Ganjamanbr',
            linkedin: '',
            twitter: '',
            email: 'italo.antonio@exemplo.com'
        }
    };
    this.populateAboutForm(defaultData);
};

AdminPanel.prototype.populateAboutForm = function(data) {
    // Bio section
    document.getElementById('about-bio').value = data.bio || '';
    document.getElementById('about-profile-image').value = data.profileImage || '';

    // Skills section
    document.getElementById('skills-frontend').value = (data.skills?.frontend || []).join(', ');
    document.getElementById('skills-backend').value = (data.skills?.backend || []).join(', ');
    document.getElementById('skills-database').value = (data.skills?.database || []).join(', ');
    document.getElementById('skills-tools').value = (data.skills?.tools || []).join(', ');

    // Social links
    document.getElementById('social-github').value = data.socialLinks?.github || '';
    document.getElementById('social-linkedin').value = data.socialLinks?.linkedin || '';
    document.getElementById('social-twitter').value = data.socialLinks?.twitter || '';
    document.getElementById('social-email').value = data.socialLinks?.email || '';

    // Clear existing items
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');
    experienceContainer.innerHTML = '';
    educationContainer.innerHTML = '';

    // Add existing experience
    if (data.experience) {
        data.experience.forEach((exp, index) => {
            this.addExperienceItem(exp, index);
        });
    }

    // Add existing education
    if (data.education) {
        data.education.forEach((edu, index) => {
            this.addEducationItem(edu, index);
        });
    }
};

AdminPanel.prototype.saveAboutData = async function() {
    try {
        this.showLoading();

        const aboutData = {
            bio: document.getElementById('about-bio').value,
            profileImage: document.getElementById('about-profile-image').value,
            skills: {
                frontend: document.getElementById('skills-frontend').value.split(',').map(s => s.trim()).filter(s => s),
                backend: document.getElementById('skills-backend').value.split(',').map(s => s.trim()).filter(s => s),
                database: document.getElementById('skills-database').value.split(',').map(s => s.trim()).filter(s => s),
                tools: document.getElementById('skills-tools').value.split(',').map(s => s.trim()).filter(s => s)
            },
            socialLinks: {
                github: document.getElementById('social-github').value,
                linkedin: document.getElementById('social-linkedin').value,
                twitter: document.getElementById('social-twitter').value,
                email: document.getElementById('social-email').value
            },
            experience: this.getExperienceItems(),
            education: this.getEducationItems()
        };

        if (!window.supabase) {
            const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
            window.supabase = createClient(
                'https://nattvkjaecceirxthizc.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHR2a2phZWNjZWlyeHRoaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjM2NTMsImV4cCI6MjA3MjQ5OTY1M30.K6Nfu5oGeoo6bZyToBNWkBdA1CncXEjWIrSydlMU2WQ'
            );
        }

        const { error } = await window.supabase
            .from('settings')
            .upsert({
                key: 'about',
                value: aboutData,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('❌ Error saving about data:', error);
            alert('Erro ao salvar dados da página sobre: ' + error.message);
        } else {
            console.log('✅ About data saved successfully');
            alert('Dados da página sobre salvos com sucesso!');
        }

    } catch (error) {
        console.error('❌ Failed to save about data:', error);
        alert('Erro ao salvar dados da página sobre');
    } finally {
        this.hideLoading();
    }
};

AdminPanel.prototype.addExperienceItem = function(expData = null, index = null) {
    const expContainer = document.getElementById('experience-container');
    const expIndex = index !== null ? index : expContainer.children.length;

    const expItem = document.createElement('div');
    expItem.className = 'experience-item';
    expItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Empresa:</label>
                <input type="text" class="exp-company" value="${expData?.company || ''}" placeholder="Nome da empresa">
            </div>
            <div class="form-group">
                <label>Cargo:</label>
                <input type="text" class="exp-position" value="${expData?.position || ''}" placeholder="Seu cargo">
            </div>
        </div>
        <div class="form-group">
            <label>Descrição:</label>
            <textarea class="exp-description" rows="2" placeholder="Descreva suas responsabilidades">${expData?.description || ''}</textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Data Início:</label>
                <input type="text" class="exp-start-date" value="${expData?.startDate || ''}" placeholder="Jan 2020">
            </div>
            <div class="form-group">
                <label>Data Fim:</label>
                <input type="text" class="exp-end-date" value="${expData?.endDate || ''}" placeholder="Presente">
            </div>
        </div>
        <div class="experience-actions">
            <button class="btn btn-danger" onclick="adminPanel.removeExperienceItem(this)">
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
    `;

    expContainer.appendChild(expItem);
};

AdminPanel.prototype.removeExperienceItem = function(button) {
    const expItem = button.closest('.experience-item');
    expItem.remove();
};

AdminPanel.prototype.getExperienceItems = function() {
    const experiences = [];
    const expItems = document.querySelectorAll('.experience-item');

    expItems.forEach((item, index) => {
        const company = item.querySelector('.exp-company').value;
        const position = item.querySelector('.exp-position').value;
        const description = item.querySelector('.exp-description').value;
        const startDate = item.querySelector('.exp-start-date').value;
        const endDate = item.querySelector('.exp-end-date').value;

        if (company || position) {
            experiences.push({
                id: `exp-${index}`,
                company,
                position,
                description,
                startDate,
                endDate,
                current: endDate.toLowerCase() === 'presente' || !endDate
            });
        }
    });

    return experiences;
};

AdminPanel.prototype.addEducationItem = function(eduData = null, index = null) {
    const eduContainer = document.getElementById('education-container');
    const eduIndex = index !== null ? index : eduContainer.children.length;

    const eduItem = document.createElement('div');
    eduItem.className = 'education-item';
    eduItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Instituição:</label>
                <input type="text" class="edu-institution" value="${eduData?.institution || ''}" placeholder="Nome da instituição">
            </div>
            <div class="form-group">
                <label>Curso:</label>
                <input type="text" class="edu-degree" value="${eduData?.degree || ''}" placeholder="Nome do curso">
            </div>
        </div>
        <div class="form-group">
            <label>Área:</label>
            <input type="text" class="edu-field" value="${eduData?.field || ''}" placeholder="Área de estudo">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Data Início:</label>
                <input type="text" class="edu-start-date" value="${eduData?.startDate || ''}" placeholder="2020">
            </div>
            <div class="form-group">
                <label>Data Fim:</label>
                <input type="text" class="edu-end-date" value="${eduData?.endDate || ''}" placeholder="2024">
            </div>
        </div>
        <div class="education-actions">
            <button class="btn btn-danger" onclick="adminPanel.removeEducationItem(this)">
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
    `;

    eduContainer.appendChild(eduItem);
};

AdminPanel.prototype.removeEducationItem = function(button) {
    const eduItem = button.closest('.education-item');
    eduItem.remove();
};

AdminPanel.prototype.getEducationItems = function() {
    const education = [];
    const eduItems = document.querySelectorAll('.education-item');

    eduItems.forEach((item, index) => {
        const institution = item.querySelector('.edu-institution').value;
        const degree = item.querySelector('.edu-degree').value;
        const field = item.querySelector('.edu-field').value;
        const startDate = item.querySelector('.edu-start-date').value;
        const endDate = item.querySelector('.edu-end-date').value;

        if (institution || degree) {
            education.push({
                id: `edu-${index}`,
                institution,
                degree,
                field,
                startDate,
                endDate,
                current: !endDate
            });
        }
    });

    return education;
};

// Global instance
let adminPanel;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});

// Make it globally available
window.adminPanel = adminPanel;
