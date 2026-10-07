import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Card = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background_white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const Column = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(8)}px;
`;

export const Divider = styled.View`
  width: 1px;
  height: ${RFValue(28)}px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const IconWrapper = styled.View`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(15)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const TextBlock = styled.View``;

export const Value = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Caption = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.grayLight};
`;
