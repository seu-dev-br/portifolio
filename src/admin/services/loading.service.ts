// src/admin/services/loading.service.ts
export class LoadingService {
  private loadingElement: HTMLElement | null = null;
  private loadingCount = 0;

  constructor() {
    this.initializeLoadingElement();
  }

  private initializeLoadingElement(): void {
    // Criar elemento de loading se não existir
    if (!this.loadingElement) {
      this.loadingElement = document.getElementById('loading-spinner');
    }

    if (!this.loadingElement) {
      console.warn('⚠️ Elemento loading-spinner não encontrado, criando um...');
      this.loadingElement = document.createElement('div');
      this.loadingElement.id = 'loading-spinner';
      this.loadingElement.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          ">
            <div style="
              width: 40px;
              height: 40px;
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3498db;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 10px;
            "></div>
            <p>Carregando...</p>
          </div>
        </div>
      `;

      // Adicionar estilos de animação
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(this.loadingElement);
    }
  }

  show(message: string = 'Carregando...'): void {
    this.loadingCount++;
    console.log(`⏳ Mostrando loading (${this.loadingCount}): ${message}`);

    if (this.loadingElement) {
      // Atualizar mensagem se houver
      const messageElement = this.loadingElement.querySelector('p');
      if (messageElement) {
        messageElement.textContent = message;
      }

      this.loadingElement.style.display = 'flex';
    }
  }

  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    console.log(`🔄 Escondendo loading (${this.loadingCount})`);

    if (this.loadingCount === 0 && this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  forceHide(): void {
    this.loadingCount = 0;
    console.log('🛑 Forçando esconder loading');

    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  isLoading(): boolean {
    return this.loadingCount > 0;
  }
}

// Instância singleton
export const loadingService = new LoadingService();
