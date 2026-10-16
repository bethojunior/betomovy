import styled from 'styled-components/native';

export const SuccessContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 6px;
`;

export const SuccessTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

export const SuccessSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
`;
