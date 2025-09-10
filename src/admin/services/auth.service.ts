// src/admin/services/auth.service.ts
import { getSupabaseClient } from '../../lib/supabase/client';
import type { AuthResult, LoginCredentials, User, Session } from '../../lib/supabase/types';

export class AuthService {
  private supabase = getSupabaseClient();

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      console.log('🔐 Iniciando login...', { email: credentials.email });

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido:', data.user.email);

        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at,
          last_sign_in_at: data.user.last_sign_in_at
        };

        const session: Session = {
          user,
          access_token: data.session?.access_token || '',
          refresh_token: data.session?.refresh_token || ''
        };

        return {
          success: true,
          user,
          session
        };
      }

      return {
        success: false,
        error: 'Login falhou - usuário não encontrado'
      };

    } catch (error: any) {
      console.error('❌ Erro geral no login:', error);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor'
      };
    }
  }

  async logout(): Promise<AuthResult> {
    try {
      console.log('👋 Fazendo logout...');

      const { error } = await this.supabase.auth.signOut();

      if (error) {
        console.error('❌ Erro no logout:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Logout realizado com sucesso');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Erro geral no logout:', error);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor'
      };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();

      if (error) {
        console.error('❌ Erro ao obter usuário atual:', error);
        return null;
      }

      if (user) {
        return {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_sign_in_at: user.last_sign_in_at
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Erro ao obter usuário atual:', error);
      return null;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();

      if (error) {
        console.error('❌ Erro ao obter sessão atual:', error);
        return null;
      }

      if (session && session.user) {
        return {
          user: {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at,
            updated_at: session.user.updated_at,
            last_sign_in_at: session.user.last_sign_in_at
          },
          access_token: session.access_token,
          refresh_token: session.refresh_token
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Erro ao obter sessão atual:', error);
      return null;
    }
  }
}

// Instância singleton
export const authService = new AuthService();
