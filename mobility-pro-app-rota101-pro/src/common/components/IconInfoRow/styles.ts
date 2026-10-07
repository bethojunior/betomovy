import styled from 'styled-components/native';
import { StatusVariant, textColorByVariant } from '../../theme/statusVariantColors';

export const Row = styled.View<{ showDivider: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding-vertical: ${({ theme }) => theme.spacing.medium}px;
  border-bottom-width: ${({ showDivider, theme }) => (showDivider ? theme.borderWidth.small : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const TextGroup = styled.View`
  flex: 1;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const Value = styled.Text<{ variant?: StatusVariant }>`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme, variant }) => (variant ? textColorByVariant(theme, variant) : theme.colors.secondary)};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;
