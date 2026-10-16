/**
 * Design tokens for Zafira Validation Result Modal.
 * Keeps UI/UX consistent and responsive.
 */

export const ZAFIRA_COLORS = {
  background: '#16202c',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.85)',
  textSubtle: 'rgba(255, 255, 255, 0.55)',
  border: 'rgba(255, 255, 255, 0.2)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  surface: 'rgba(255, 255, 255, 0.06)',
  iconSurface: 'rgba(255, 255, 255, 0.08)',
  success: '#51cf66',
  successSurface: 'rgba(81, 207, 102, 0.15)',
  error: '#ff6b6b',
  errorSurface: 'rgba(255, 107, 107, 0.15)',
} as const;

/** Base spacing scale (px) - scaled by layout */
export const SPACING_BASE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Base width for scale (iPhone ~375) */
export const BASE_WIDTH = 375;

/** Modal size as fraction of screen (minHeight fits content; lower = less empty space at bottom) */
export const MODAL_SIZE = {
  widthPercent: 0.92,
  maxHeightPercent: 0.93,
  minHeightPercent: 0.3,
} as const;

export const ZAFIRA_VALIDATION_USER_MESSAGE_LITERALS: readonly string[] = [
  'Algum dado está incorreto. Verifique e tente novamente.',
  'Some data is incorrect. Please check and try again.',
  'Algun dato es incorrecto. Verifique e intente de nuevo.',
  'Une donnée est incorrecte. Vérifiez et réessayez.',
];

/** Mensagens que devem cair no erro genérico de match (Guardian / dados incorretos). */
export const ZAFIRA_GENERIC_VALIDATION_ERROR_KEYS: readonly string[] = [
  'doorHandle.validation_error',
];

const normalizeMessage = (message: string): string =>
  message
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export const isZafiraValidationUserMessageLiteral = (message: string): boolean => {
  const trimmed = message.trim();
  if (ZAFIRA_GENERIC_VALIDATION_ERROR_KEYS.some((key) => key === trimmed)) {
    return true;
  }
  const normalizedMessage = normalizeMessage(trimmed);
  return ZAFIRA_VALIDATION_USER_MESSAGE_LITERALS.some(
    (literal) => literal === trimmed || normalizeMessage(literal) === normalizedMessage,
  );
};

export const resolveZafiraValidationErrorMessage = (
  message: string | null | undefined,
  fallbackKey = 'doorHandle.validation_error',
): string => {
  const normalized = (message ?? '').trim();
  if (!normalized) {
    return fallbackKey;
  }
  if (/Internal Server Error|Server error|500|502|503|validar-dados|resulted in/i.test(normalized)) {
    return fallbackKey;
  }
  return normalized;
};
