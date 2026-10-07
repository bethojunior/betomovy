import { pulse } from '../../pulse';

export const monitorPerformance = async <T>(
  label: string,
  fn: () => Promise<T> | T,
  thresholdMs = 1000 
): Promise<T> => {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  if (duration > thresholdMs) {
    pulse.send(
      'warn',
      `Lentidão detectada: ${label} demorou ${duration}ms`,
      'performance'
    );
  }

  return result;
};