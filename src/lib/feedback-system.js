// feedback-system.js - Sistema global de feedback visual
class FeedbackSystem {
	constructor() {
		this.container = null;
		this.init();
	}

	init() {
		// Criar container para notificações
		this.container = document.createElement('div');
		this.container.id = 'feedback-container';
		this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
		document.body.appendChild(this.container);

		// Adicionar estilos globais
		this.addGlobalStyles();
	}

	addGlobalStyles() {
		const style = document.createElement('style');
		style.textContent = `
			/* Feedback system styles */
			.feedback-toast {
				transform: translateX(100%);
				opacity: 0;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			}

			.feedback-toast.show {
				transform: translateX(0);
				opacity: 1;
			}

			.feedback-toast.hide {
				transform: translateX(100%);
				opacity: 0;
			}

			/* Loading states */
			.loading-overlay {
				position: fixed;
				inset: 0;
				background: rgba(0, 0, 0, 0.5);
				backdrop-filter: blur(4px);
				z-index: 9999;
				display: flex;
				align-items: center;
				justify-content: center;
				opacity: 0;
				pointer-events: none;
				transition: opacity 0.3s ease;
			}

			.loading-overlay.show {
				opacity: 1;
				pointer-events: auto;
			}

			/* Success animations */
			@keyframes success-bounce {
				0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
				40% { transform: translateY(-10px); }
				60% { transform: translateY(-5px); }
			}

			.success-animation {
				animation: success-bounce 1s ease;
			}

			/* Error shake animation */
			@keyframes error-shake {
				0%, 100% { transform: translateX(0); }
				10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
				20%, 40%, 60%, 80% { transform: translateX(5px); }
			}

			.error-animation {
				animation: error-shake 0.5s ease;
			}

			/* Focus enhancements */
			.focus-ring {
				transition: box-shadow 0.2s ease;
			}

			.focus-ring:focus-visible {
				box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
			}
		`;
		document.head.appendChild(style);
	}

	showToast(message, type = 'info', duration = 5000) {
		const toast = document.createElement('div');
		toast.className = `feedback-toast max-w-sm p-4 rounded-lg border backdrop-blur-sm shadow-xl ${this.getToastClasses(type)}`;

		const icons = {
			success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
			error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
			warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>`,
			info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
		};

		toast.innerHTML = `
			<div class="flex items-center gap-3">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 rounded-full bg-current/20 flex items-center justify-center">
						<div class="text-current">${icons[type]}</div>
					</div>
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium">${message}</p>
				</div>
				<button class="toast-close flex-shrink-0 w-5 h-5 rounded-full hover:bg-current/20 transition-colors duration-200 flex items-center justify-center group">
					<svg class="w-3 h-3 text-current/70 group-hover:text-current transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
		`;

		this.container.appendChild(toast);

		// Show animation
		setTimeout(() => toast.classList.add('show'), 10);

		// Auto-hide
		const hideTimeout = setTimeout(() => this.hideToast(toast), duration);

		// Close button
		const closeBtn = toast.querySelector('.toast-close');
		closeBtn.addEventListener('click', () => {
			clearTimeout(hideTimeout);
			this.hideToast(toast);
		});
	}

	hideToast(toast) {
		toast.classList.remove('show');
		toast.classList.add('hide');
		setTimeout(() => toast.remove(), 300);
	}

	getToastClasses(type) {
		const classes = {
			success: 'bg-green-900/90 border-green-500/30 text-green-300',
			error: 'bg-red-900/90 border-red-500/30 text-red-300',
			warning: 'bg-yellow-900/90 border-yellow-500/30 text-yellow-300',
			info: 'bg-blue-900/90 border-blue-500/30 text-blue-300'
		};
		return classes[type] || classes.info;
	}

	showLoading(message = 'Carregando...') {
		let overlay = document.getElementById('global-loading-overlay');
		if (!overlay) {
			overlay = document.createElement('div');
			overlay.id = 'global-loading-overlay';
			overlay.className = 'loading-overlay';
			overlay.innerHTML = `
				<div class="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 max-w-sm mx-4 text-center">
					<div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
					</div>
					<p class="text-white font-medium">${message}</p>
				</div>
			`;
			document.body.appendChild(overlay);
		}
		setTimeout(() => overlay.classList.add('show'), 10);
	}

	hideLoading() {
		const overlay = document.getElementById('global-loading-overlay');
		if (overlay) {
			overlay.classList.remove('show');
			setTimeout(() => overlay.remove(), 300);
		}
	}

	showSuccess(element, message = 'Sucesso!') {
		element.classList.add('success-animation');
		this.showToast(message, 'success', 3000);
		setTimeout(() => element.classList.remove('success-animation'), 1000);
	}

	showError(element, message = 'Erro!') {
		element.classList.add('error-animation');
		this.showToast(message, 'error', 4000);
		setTimeout(() => element.classList.remove('error-animation'), 500);
	}

	// Utility methods
	addFocusEnhancement(selector = 'button, a, input, textarea, select') {
		document.querySelectorAll(selector).forEach(el => {
			el.classList.add('focus-ring');
		});
	}

	scrollToElement(element, offset = 0) {
		const elementPosition = element.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}
}

// Initialize globally
window.FeedbackSystem = new FeedbackSystem();

// Convenience methods
window.showToast = (message, type, duration) => window.FeedbackSystem.showToast(message, type, duration);
window.showLoading = (message) => window.FeedbackSystem.showLoading(message);
window.hideLoading = () => window.FeedbackSystem.hideLoading();
window.showSuccess = (element, message) => window.FeedbackSystem.showSuccess(element, message);
window.showError = (element, message) => window.FeedbackSystem.showError(element, message);
