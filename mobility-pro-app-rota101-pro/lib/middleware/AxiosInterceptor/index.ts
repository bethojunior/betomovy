import { AxiosInstance } from 'axios';
import { pulse } from '../../pulse';


declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

export const applyPulseInterceptors = (axiosInstance: AxiosInstance, name = 'axios') => {
  // Interceptor de performance - início da requisição
  axiosInstance.interceptors.request.use((config) => {
    config.metadata = { startTime: Date.now() };
    return config;
  });

  // Interceptor de resposta
  axiosInstance.interceptors.response.use(
    (response) => {
      const duration = Date.now() - (response.config.metadata?.startTime || 0);

      // Comentado: envio de logs de requisição lenta para api-pulse
      // if (duration > 1500) {
      //   pulse.send('warn', `Requisição lenta: ${response.config.url} demorou ${duration}ms`, 'axios-performance');
      // }

      return response;
    },
    (error) => {
      const message = error.message || 'Erro desconhecido';
      const status = error.response?.status;
      const url = error.config?.url;
      const method = error.config?.method;
      const duration = Date.now() - (error.config?.metadata?.startTime || 0);

      // Loga erro
      pulse.send(
        'error',
        `HTTP ${status || '??'} - ${method?.toUpperCase()} ${url} - ${message}`,
        name
      );

      // Comentado: envio de logs de lentidão para api-pulse
      // if (duration > 1500) {
      //   pulse.send('warn', `Erro e lentidão: ${url} levou ${duration}ms`, 'axios-performance');
      // }

      return Promise.reject(error);
    }
  );
};
