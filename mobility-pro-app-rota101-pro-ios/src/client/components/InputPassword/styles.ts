import {Platform, TextInput} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

interface InputProps {
  icon?: boolean;
  color?: string;
}

interface ContainerProps {
  color?: string;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${({theme}) => theme.borderWidth.medium}px;
  border-bottom-color: ${({theme, color}) =>
    color ? color : theme.colors.primary};
  padding-bottom: 3px;

  ${Platform.OS === 'ios' &&
  css`
    padding-bottom: 5px;
  `}
`;

export const Content = styled(TextInput).attrs(({theme}) => ({
  placeholderTextColor: theme.colors.input_placeholder,
}))<InputProps>`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme, color}) => (color ? color : theme.colors.primary)};
  flex: 1;
  font-family: ${({theme}) => theme.fonts.regular};
  text-decoration: none;
  margin-left: ${({icon}) => (icon ? RFValue(7) : RFValue(1))}px;
`;

export const TouchShowPassword = styled.TouchableOpacity<InputProps>`
  margin-left: ${({icon}) => (icon ? RFValue(15) : RFValue(45))}px;
`;

export const Error = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.toast.attention};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;
