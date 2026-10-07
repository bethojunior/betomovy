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
  flex-direction: row;
  align-items: center;
  padding-left: ${({theme}) => theme.spacing.large}px;
  width: 100%;
  border-bottom-width: ${({theme}) => theme.borderWidth.medium}px;
  border-bottom-color: ${({theme, color}) =>
    color ? color : theme.colors.primary};
  margin-bottom: 8px;
  padding-bottom: 3px;

  ${Platform.OS === 'ios' &&
  css`
    padding-bottom: 5px;
  `}
`;

export const Content = styled(TextInput).attrs(({theme}) => ({
  placeholderTextColor: theme.colors.input_placeholder,
}))<InputProps>`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme, color}) => (color ? color : theme.colors.primary)};
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  margin-left: ${({icon}) => (icon ? RFValue(7) : RFValue(1))}px;
  width: 85%;
  text-decoration: none;
`;

export const Error = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.toast.attention};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;
