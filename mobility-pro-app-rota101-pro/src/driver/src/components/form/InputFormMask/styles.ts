import {TextInputMask} from 'react-native-masked-text';
import styled from 'styled-components/native';

export const Input = styled(TextInputMask).attrs(({theme}) => ({
  placeholderTextColor: theme.colors.input_placeholder,
}))`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
`;

export const Error = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.toast.attention};
  font-size: ${({theme}) => theme.fontSizes.small}px;
`;
