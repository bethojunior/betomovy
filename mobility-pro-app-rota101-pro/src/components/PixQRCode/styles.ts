import styled, { css } from 'styled-components/native';

interface QRContainerProps {
  showBorder?: boolean;
}

export const QRContainer = styled.View<QRContainerProps>`
  align-self: center;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  ${({ showBorder }) =>
    showBorder &&
    css`
      padding: 20px;
      border-radius: 12px;
      border-width: 1px;
      border-color: ${({ theme }) => theme.colors.grayBright};
    `}
`;
