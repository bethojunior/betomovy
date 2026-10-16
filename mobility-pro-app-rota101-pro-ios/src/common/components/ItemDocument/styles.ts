import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity<{ isLast: boolean }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  border-bottom-width: ${({ isLast, theme }) => (isLast ? 0 : theme.borderWidth.small)}px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const ContentDoc = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const Doc = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Description = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;
