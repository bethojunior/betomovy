import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

interface ButtonProps {
  selected: boolean;
}

export const Container = styled.View`
  padding-left: ${({theme}) => theme.spacing.xslarge}px;
  padding-right: ${({theme}) => theme.spacing.xslarge}px;
  margin-top: ${RFValue(1)}px;
  margin-bottom: ${RFValue(16)}px;
`;

export const ButtonView = styled.TouchableOpacity<ButtonProps>`
  flex-direction: row;
  align-items: center;
  padding-top: ${({theme}) => theme.spacing.large}px;
  padding-bottom: ${({theme}) => theme.spacing.large}px;
  padding-left: ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  border: ${RFValue(0.5)}px;
  border-color: ${({theme}) => theme.colors.primary};

  ${({selected}) =>
    selected &&
    css`
      background: ${({theme}) => shade(0.2, theme.colors.primary)};
    `}
`;

export const Text = styled.Text<ButtonProps>`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({selected, theme}) =>
    selected ? theme.colors.white : theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.medium};
  margin-left: ${RFValue(10)}px;
`;
