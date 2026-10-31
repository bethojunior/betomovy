import { pulse } from '../../pulse';

/**
 * No iOS, o handler padrão do RN aborta o processo (SIGABRT) em erros fatais JS.
 * Aqui registramos o erro e NÃO re-lançamos fatals, para o app não fechar sozinho.
 */
export const setupGlobalErrorHandling = () => {
  const ErrorUtils = (global as any).ErrorUtils;

  if (ErrorUtils?.setGlobalHandler) {
    const defaultHandler = ErrorUtils.getGlobalHandler?.();

    ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
      const message = `[${isFatal ? 'FATAL' : 'NON-FATAL'}] ${
        error?.message || 'Erro desconhecido'
      }`;

      try {
        pulse.send('error', message, 'global-error');
      } catch {}

      console.error('[GlobalErrorHandler]', message, error);

      // Só repassa erros não-fatais — fatal no iOS fecha o app via ExceptionsManager
      if (!isFatal && typeof defaultHandler === 'function') {
        try {
          defaultHandler(error, isFatal);
        } catch {}
      }
    });
  }

  if (typeof globalThis?.addEventListener === 'function') {
    globalThis.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      try {
        pulse.send(
          'error',
          `Unhandled Promise: ${event.reason}`,
          'unhandled-rejection',
        );
      } catch {}
      console.error('Unhandled Promise:', event.reason);
      // Evita propagação que pode virar fatal no Hermes/iOS
      try {
        event.preventDefault?.();
      } catch {}
    });
  }
};
