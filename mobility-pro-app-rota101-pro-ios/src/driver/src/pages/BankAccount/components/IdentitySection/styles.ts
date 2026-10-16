import { TextInputMask } from 'react-native-masked-text';
import styled from 'styled-components/native';

export const DropdownWrapper = styled.View`
  z-index: 1;
`;

export const DateInput = styled(TextInputMask).attrs(({ theme }) => ({
  underlineColorAndroid: 'transparent',
  placeholderTextColor: theme.colors.placeholder,
}))`
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding-vertical: ${({ theme }) => theme.spacing.small}px;
  padding-horizontal: ${({ theme }) => theme.spacing.medium}px;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
`;
