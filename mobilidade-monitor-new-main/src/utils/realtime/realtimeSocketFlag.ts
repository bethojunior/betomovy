import Session from '../Session';

export function isRealtimeSocketEnabled(): boolean {
  const keysApp = Session.getLocal('keysApp') || [];

  const config = keysApp
    .find((key: any) => key.type === 'SOCKET')
    ?.config?.find((item: any) => item.key === 'enable_realtime_socket');

  return config?.value === '1';
}
