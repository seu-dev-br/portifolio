// Admin Panel Client-Side JavaScript
// Simplified version for testing

class AdminPanel {
    constructor() {
        this.currentView = 'overview';
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        console.log('🚀 Initializing admin panel...');
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        console.log('📋 Setting up event listeners...');

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

        console.log('✅ Event listeners setup complete');
    }

    async checkAuthentication() {
        console.log('🔐 Checking authentication...');

        // Check if user is logged in (simplified)
        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';

        if (isLoggedIn) {
            console.log('✅ User authenticated');
            this.showDashboard();
        } else {
            console.log('❌ User not authenticated');
            this.showLogin();
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        console.log('🔑 Handling login...');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showLoginError('Por favor, preencha todos os campos.');
            return;
        }

        // Simple authentication (for testing)
        if (email === 'admin@italo.dev' && password === 'Italo2025Admin!') {
            localStorage.setItem('admin_logged_in', 'true');
            this.showDashboard();
        } else {
            this.showLoginError('Credenciais inválidas.');
        }
    }

    handleLogout() {
        console.log('🚪 Handling logout...');
        localStorage.removeItem('admin_logged_in');
        this.showLogin();
    }

    showDashboard() {
        console.log('📊 Showing dashboard...');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard-container').style.display = 'flex';

        // Initialize with overview tab active
        this.switchView('overview');
    }

    showLogin() {
        console.log('🔐 Showing login...');
        document.getElementById('login-container').style.display = 'flex';
        document.getElementById('dashboard-container').style.display = 'none';
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
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();
