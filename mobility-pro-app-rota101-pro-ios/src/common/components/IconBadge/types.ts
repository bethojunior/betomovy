import { ReactNode } from 'react';
import { StatusVariant } from '../../theme/statusVariantColors';

export interface IconBadgeProps {
  /** Recebe a cor já resolvida pro variant — evita cada chamador escolher cor manualmente. */
  icon: (color: string) => ReactNode;
  variant?: StatusVariant;
  size?: number;
  shape?: 'circle' | 'square';
  /** Sobrescreve o fundo tonal padrão — usado quando o emblema já fica sobre um fundo colorido (ex.: InfoBanner). */
  background?: string;
  /** Sobrescreve a cor padrão do ícone (preto) — ex.: StatusPending usa a cor primária do app. */
  color?: string;
}
