import { darken, rgba } from 'polished';

export type StatusVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

/** Cor de fundo tonal por variant — reaproveitada por StatusBadge, IconBadge, InfoBanner. */
export const backgroundByVariant = (theme: any, variant: StatusVariant) => {
  switch (variant) {
    case 'primary':
      // tom da cor principal, não cinza — mesmo truque tonal do HelpMethodModal (rgba 0.12)
      return rgba(theme.colors.primary, 0.12);
    case 'success':
      return theme.colors.background_greenLight;
    case 'error':
      return theme.colors.redLight;
    case 'warning':
      // theme.colors.primary é dinâmico (vem de config por cidade/app) — um amarelo fixo nunca combina
      // com o laranja/vermelho/azul real do branding. Deriva da própria cor primária pra sempre casar.
      return rgba(darken(0.1, theme.colors.primary), 0.16);
    default:
      return theme.colors.background_white_light;
  }
};

/** Cor de texto/ícone por variant. */
export const textColorByVariant = (theme: any, variant: StatusVariant) => {
  switch (variant) {
    case 'primary':
      return theme.colors.primary;
    case 'success':
      return theme.colors.border_green;
    case 'error':
      return theme.colors.red;
    case 'warning':
      return darken(0.15, theme.colors.primary);
    default:
      return theme.colors.text_gray;
  }
};
