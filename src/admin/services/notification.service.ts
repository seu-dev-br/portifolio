// src/admin/services/notification.service.ts
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  type: NotificationType;
  message: string;
  duration?: number;
  title?: string;
}

export class NotificationService {
  private container: HTMLElement | null = null;
  private notifications: Map<string, HTMLElement> = new Map();

  constructor() {
    this.initializeContainer();
  }

  private initializeContainer(): void {
    // Criar container se não existir
    if (!this.container) {
      this.container = document.getElementById('notification-container');
    }

    if (!this.container) {
      console.log('📦 Criando container de notificações...');
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        pointer-events: none;
      `;

      // Adicionar estilos das notificações
      const style = document.createElement('style');
      style.textContent = `
        .notification {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-left: 4px solid;
          pointer-events: auto;
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.3s ease;
          position: relative;
        }

        .notification.show {
          transform: translateX(0);
          opacity: 1;
        }

        .notification.hide {
          transform: translateX(100%);
          opacity: 0;
        }

        .notification.success { border-left-color: #10b981; }
        .notification.error { border-left-color: #ef4444; }
        .notification.warning { border-left-color: #f59e0b; }
        .notification.info { border-left-color: #3b82f6; }

        .notification-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .notification-icon {
          margin-right: 8px;
          font-size: 18px;
        }

        .notification-title {
          font-weight: 600;
          margin: 0;
        }

        .notification-message {
          margin: 0;
          color: #6b7280;
        }

        .notification-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
        }

        .notification-close:hover {
          color: #6b7280;
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(this.container);
    }
  }

  show(options: NotificationOptions): string {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const notification = document.createElement('div');
    notification.className = `notification ${options.type}`;
    notification.id = id;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    notification.innerHTML = `
      <div class="notification-header">
        <span class="notification-icon">${icons[options.type]}</span>
        <h4 class="notification-title">${options.title || this.getDefaultTitle(options.type)}</h4>
      </div>
      <p class="notification-message">${options.message}</p>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    this.container?.appendChild(notification);
    this.notifications.set(id, notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Auto-hide
    const duration = options.duration || this.getDefaultDuration(options.type);
    setTimeout(() => {
      this.hide(id);
    }, duration);

    console.log(`🔔 Notificação mostrada: ${options.type} - ${options.message}`);
    return id;
  }

  hide(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.classList.add('hide');
      setTimeout(() => {
        notification.remove();
        this.notifications.delete(id);
      }, 300);
      console.log(`🔕 Notificação escondida: ${id}`);
    }
  }

  success(message: string, options?: Partial<NotificationOptions>): string {
    return this.show({ type: 'success', message, ...options });
  }

  error(message: string, options?: Partial<NotificationOptions>): string {
    return this.show({ type: 'error', message, ...options });
  }

  warning(message: string, options?: Partial<NotificationOptions>): string {
    return this.show({ type: 'warning', message, ...options });
  }

  info(message: string, options?: Partial<NotificationOptions>): string {
    return this.show({ type: 'info', message, ...options });
  }

  private getDefaultTitle(type: NotificationType): string {
    const titles = {
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Aviso',
      info: 'Informação'
    };
    return titles[type];
  }

  private getDefaultDuration(type: NotificationType): number {
    const durations = {
      success: 3000,
      error: 5000,
      warning: 4000,
      info: 3000
    };
    return durations[type];
  }
}

// Instância singleton
export const notificationService = new NotificationService();
