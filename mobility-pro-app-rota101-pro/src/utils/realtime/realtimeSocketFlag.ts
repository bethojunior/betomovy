import { getItemPublic } from '../../common/services/mmkv/storage';

let cachedRealtimeSocketStatus: boolean | null = null;

export function isRealtimeSocketEnabled(): boolean {
  const generalSettings = getItemPublic('generalSettings');
  const settingsParsed = JSON.parse(generalSettings || '[]');
  const enableRealtime = settingsParsed?.find(
    ({ key }: { key: string }) => key === 'enable_realtime_socket',
  );
  cachedRealtimeSocketStatus = Boolean(Number(enableRealtime?.value || 0));
  return cachedRealtimeSocketStatus;
}

// Opcional: função para atualizar manualmente o cache, se necessário
export function refreshRealtimeSocketStatus() {
  cachedRealtimeSocketStatus = isRealtimeSocketEnabled();
}
