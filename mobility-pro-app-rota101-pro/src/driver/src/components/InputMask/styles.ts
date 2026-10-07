import {Platform} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import styled, {css} from 'styled-components/native';

export const Container = styled(TextInputMask).attrs(({theme}) => ({
  placeholderTextColor: theme.colors.input_placeholder,
}))`
  padding-left: ${({theme}) => theme.spacing.large}px;
  width: 100%;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  border-bottom-width: ${({theme}) => theme.borderWidth.medium}px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  margin-bottom: 8px;
  font-family: ${({theme}) => theme.fonts.regular};
  text-decoration: none;

  ${Platform.OS === 'ios' &&
  css`
    padding-bottom: 5px;
  `}
`;

export const Error = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.toast.attention};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;
