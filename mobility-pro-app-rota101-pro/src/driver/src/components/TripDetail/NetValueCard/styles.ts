import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Card = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(10)}px;
  background-color: ${({ theme }) => theme.colors.background_greenLight};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const IconWrapper = styled.View`
  width: ${RFValue(36)}px;
  height: ${RFValue(36)}px;
  border-radius: ${RFValue(18)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const TextBlock = styled.View`
  flex: 1;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Caption = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-top: ${RFValue(2)}px;
`;

export const Value = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.border_green};
`;
