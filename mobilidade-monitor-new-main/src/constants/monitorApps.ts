export const MONITOR_DRIVER = 2;
export const MONITOR_CLIENT = 4;
export const MONITOR_DELIVERY = 6;
export const MONITOR_MOBILITY = 7;

/** Apps que não exibem publicidade no momento — ocultar do seletor de anúncios */
export const UNSUPPORTED_ADVERTISING_APP_IDS = [MONITOR_MOBILITY];

export const filterSupportedAdvertisingApps = <T extends { idApp: number }>(apps: T[]): T[] =>
  apps.filter((app) => !UNSUPPORTED_ADVERTISING_APP_IDS.includes(app.idApp));
