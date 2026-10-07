import styled from 'styled-components/native';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.large}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;
