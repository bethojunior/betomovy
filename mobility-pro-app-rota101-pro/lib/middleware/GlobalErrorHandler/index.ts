
import { pulse } from '../../pulse';


export const setupGlobalErrorHandling = () => {
   const ErrorUtils = (global as any).ErrorUtils;
  
  if (ErrorUtils) {
    const defaultHandler = ErrorUtils.getGlobalHandler?.();

    ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
      const message = `[${isFatal ? 'FATAL' : 'NON-FATAL'}] ${error?.message || 'Erro desconhecido'}`;
      pulse.send('error', message, 'global-error');

      console.error(error);

      if (defaultHandler) {
        defaultHandler(error, isFatal);
      }
    });
  }

  if (typeof globalThis?.addEventListener === 'function') {
    globalThis.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      pulse.send('error', `Unhandled Promise: ${event.reason}`, 'unhandled-rejection');
      console.error('Unhandled Promise:', event.reason);
    });
  }
};
