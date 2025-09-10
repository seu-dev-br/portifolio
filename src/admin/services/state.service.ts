// src/admin/services/state.service.ts
import type { User, Session } from '../../lib/supabase/types';

export interface AdminState {
  isAuthenticated: boolean;
  currentUser: User | null;
  currentSession: Session | null;
  isLoading: boolean;
  currentView: 'login' | 'dashboard' | 'posts' | 'projects' | 'settings';
  error: string | null;
}

export type AdminStateListener = (state: AdminState) => void;

export class StateService {
  private state: AdminState = {
    isAuthenticated: false,
    currentUser: null,
    currentSession: null,
    isLoading: false,
    currentView: 'login',
    error: null
  };

  private listeners: AdminStateListener[] = [];

  // Getters
  getState(): AdminState {
    return { ...this.state };
  }

  get isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.state.currentUser;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get currentView(): AdminState['currentView'] {
    return this.state.currentView;
  }

  get error(): string | null {
    return this.state.error;
  }

  // Setters
  setAuthenticated(isAuthenticated: boolean, user?: User | null, session?: Session | null): void {
    this.state.isAuthenticated = isAuthenticated;
    this.state.currentUser = user || null;
    this.state.currentSession = session || null;

    if (isAuthenticated) {
      this.state.currentView = 'dashboard';
      this.state.error = null;
    } else {
      this.state.currentView = 'login';
    }

    this.notifyListeners();
  }

  setLoading(isLoading: boolean): void {
    this.state.isLoading = isLoading;
    this.notifyListeners();
  }

  setView(view: AdminState['currentView']): void {
    this.state.currentView = view;
    this.notifyListeners();
  }

  setError(error: string | null): void {
    this.state.error = error;
    this.notifyListeners();
  }

  // Methods
  login(user: User, session: Session): void {
    this.setAuthenticated(true, user, session);
    console.log('🔐 Estado: Login realizado', { user: user.email });
  }

  logout(): void {
    this.setAuthenticated(false);
    console.log('👋 Estado: Logout realizado');
  }

  // Listeners
  subscribe(listener: AdminStateListener): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('❌ Erro em listener do estado:', error);
      }
    });
  }

  // Reset state
  reset(): void {
    this.state = {
      isAuthenticated: false,
      currentUser: null,
      currentSession: null,
      isLoading: false,
      currentView: 'login',
      error: null
    };
    this.notifyListeners();
  }
}

// Instância singleton
export const stateService = new StateService();
