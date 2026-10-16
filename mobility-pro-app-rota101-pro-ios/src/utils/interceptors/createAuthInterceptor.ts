import {AxiosInstance} from 'axios';
import {loadSession} from '../Storage/sessionStorage';

export function createAuthInterceptor(
  api: AxiosInstance,
  handleSessionExpired: () => void,
): number {
  return api.interceptors.response.use(
    response => response,
    async error => {
      if (!error?.response && error?.message === 'Network Error') {
        error.message =
          'Sem conexão com a internet. Verifique sua rede e tente novamente.';
        return Promise.reject(error);
      }

      if (error?.code === 'ECONNABORTED') {
        error.message = 'A conexão demorou demais para responder. Tente novamente.';
        return Promise.reject(error);
      }

      const status = error?.response?.status;
      const skipSessionCheck = error?.config?.metadata?.skipSessionCheck;

      if (status !== 401 || skipSessionCheck) {
        return Promise.reject(error);
      }

      try {
        const session = await loadSession();
        if (session?.token) handleSessionExpired?.();
      } catch (e) {
        console.error('Failed to load session from storage', e);
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );
}
