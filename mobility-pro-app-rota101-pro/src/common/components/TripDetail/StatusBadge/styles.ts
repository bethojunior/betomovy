import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { StatusBadgeVariant } from './types';
import { backgroundByVariant, textColorByVariant } from '../../../theme/statusVariantColors';

export { textColorByVariant };

export const Badge = styled.View<{ variant: StatusBadgeVariant }>`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: ${RFValue(4)}px;
  padding: ${RFValue(4)}px ${RFValue(10)}px;
  border-radius: ${({ theme }) => theme.borderRadius.xxlarge}px;
  background-color: ${({ theme, variant }) => backgroundByVariant(theme, variant)};
`;

export const BadgeText = styled.Text<{ variant: StatusBadgeVariant }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 600;
  color: ${({ theme, variant }) => textColorByVariant(theme, variant)};
`;
