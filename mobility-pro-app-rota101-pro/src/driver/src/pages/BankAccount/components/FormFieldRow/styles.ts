import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ReadRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${RFValue(4)}px 0;
`;

export const ReadLabelRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  padding-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const ReadLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const ReadValue = styled.Text`
  flex: 1;
  text-align: right;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const EditField = styled.View`
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const EditLabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const EditLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const IconBadge = styled.View`
  width: ${RFValue(22)}px;
  height: ${RFValue(22)}px;
  border-radius: ${RFValue(11)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Row2Up = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const HalfField = styled.View`
  flex: 1;
`;

interface InputProps {
  hasError?: boolean;
}

export const Input = styled.TextInput.attrs(({ theme }) => ({
  underlineColorAndroid: 'transparent',
  placeholderTextColor: theme.colors.placeholder,
}))<InputProps>`
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme, hasError }) => (hasError ? theme.colors.red : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding-vertical: ${({ theme }) => theme.spacing.small}px;
  padding-horizontal: ${({ theme }) => theme.spacing.medium}px;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const FieldErrorText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.red};
`;
