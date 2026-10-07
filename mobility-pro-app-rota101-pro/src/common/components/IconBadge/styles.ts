import styled from 'styled-components/native';
import { StatusVariant } from '../../theme/statusVariantColors';

/** Decisão de produto: ícone sempre preto e sem fundo tonal — variant/background só afetam a cor do valor associado (ex.: IconInfoRow), não o emblema em si. */
export const Badge = styled.View<{ variant: StatusVariant; size: number; shape: 'circle' | 'square'; background?: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  align-items: center;
  justify-content: center;
`;
