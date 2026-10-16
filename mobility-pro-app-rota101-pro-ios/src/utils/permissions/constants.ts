/**
 * Permissões obrigatórias: localização em primeiro plano.
 * Localização em segundo plano não entra aqui — é tratada numa tela dedicada
 * e obrigatória pro motorista (src/driver/src/pages/BackgroundLocationPermission),
 * que já bloqueia o usuário até ele aceitar.
 */
export const REQUIRED_PERMISSIONS = ['foreground'] as const;

/** Permissões opcionais: o app funciona sem elas; úteis para câmera, áudio, notificações. */
export const OPTIONAL_PERMISSIONS = ['camera', 'audio', 'notifications'] as const;

export const ALL_PERMISSIONS = [...REQUIRED_PERMISSIONS, ...OPTIONAL_PERMISSIONS];

export const MODAL_SUCCESS_DISPLAY_TIME_MS = 1500;

export const BACKGROUND_CHECK_DELAY_MS = 300;

export const STORAGE_KEYS = {
  FIRST_RUN: '@Permissions:firstRun',
  INIT_COUNT: '@Permissions:initCount',
} as const;
