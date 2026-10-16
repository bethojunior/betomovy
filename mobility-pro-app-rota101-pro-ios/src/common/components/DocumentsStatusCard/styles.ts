import styled from 'styled-components/native';
import { cardShadow } from '../../theme/cardShadow';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  ${cardShadow}
`;

export const DocumentsRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const DocumentsTextGroup = styled.View`
  flex: 1;
`;

export const DocumentsLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const DocumentsPendingText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.red};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;
