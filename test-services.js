// Teste simples dos serviços admin
import { AuthService } from './src/admin/services/auth.service';
import { LoadingService } from './src/admin/services/loading.service';
import { NotificationService } from './src/admin/services/notification.service';
import { StateService } from './src/admin/services/state.service';
import { apiService } from './src/admin/services/api.service';

console.log('🧪 Testando serviços admin...');

try {
  const authService = new AuthService();
  const loadingService = new LoadingService();
  const notificationService = new NotificationService();
  const stateService = new StateService();

  console.log('✅ Serviços inicializados com sucesso');
  console.log('🔗 API Service disponível:', typeof apiService);
} catch (error) {
  console.error('❌ Erro ao inicializar serviços:', error);
}
