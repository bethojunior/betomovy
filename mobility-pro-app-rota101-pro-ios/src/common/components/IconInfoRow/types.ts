import { ReactNode } from 'react';
import { StatusVariant } from '../../theme/statusVariantColors';

export interface IconInfoRowProps {
  icon: (color: string) => ReactNode;
  label: string;
  value: string;
  variant?: StatusVariant;
  /** Sobrescreve a cor padrão do ícone (preto). */
  color?: string;
  /** Colore o valor também (não só o ícone) — usado quando o próprio valor é um status, ex.: "Status atual". */
  valueVariant?: StatusVariant;
  showDivider?: boolean;
}
