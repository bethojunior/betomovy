import { pulse } from '../../pulse';

type LogType = 'error' | 'warn' | 'info' | 'log';

const originalConsole: Partial<Record<LogType, (...args: any[]) => void>> = {};

function safeStringify(value: any) {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    return '[Unserializable Object]';
  }
}

function interceptConsoleMethod(type: LogType) {
  if (!originalConsole[type]) {
    originalConsole[type] = console[type];
  }

  console[type] = (...args: any[]) => {
    try {
      const message = args.map(arg => safeStringify(arg)).join(' ');
      if (typeof pulse?.send === 'function') {
        pulse.send(type === 'log' ? 'info' : type, message, 'Console');
      }
    } catch (e) {
      originalConsole[type]?.('Erro ao enviar log para Pulse:', e);
    }

    originalConsole[type]?.(...args);
  };
}

export function setupConsoleInterceptor() {
  interceptConsoleMethod('log');
  interceptConsoleMethod('info');
  interceptConsoleMethod('warn');
  interceptConsoleMethod('error');
}
