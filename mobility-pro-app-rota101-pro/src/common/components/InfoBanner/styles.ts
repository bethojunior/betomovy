import styled from 'styled-components/native';
import { StatusVariant, backgroundByVariant, textColorByVariant } from '../../theme/statusVariantColors';

export const Container = styled.View<{ variant: StatusVariant }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  background-color: ${({ theme, variant }) => backgroundByVariant(theme, variant)};
`;

export const TextGroup = styled.View`
  flex: 1;
`;

export const Title = styled.Text<{ variant: StatusVariant }>`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme, variant }) => textColorByVariant(theme, variant)};
`;

export const Description = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;
