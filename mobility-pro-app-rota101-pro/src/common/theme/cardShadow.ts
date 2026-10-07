import { css } from 'styled-components/native';

/** Sombra padrão de card, mesma receita do TripSummaryCard (a referência de acabamento do app). */
export const cardShadow = css`
  shadow-color: ${({ theme }) => theme.colors.secondary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  elevation: 3;
`;
