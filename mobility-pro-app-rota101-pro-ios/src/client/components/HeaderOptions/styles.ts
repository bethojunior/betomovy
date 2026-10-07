import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

interface ButtonProps {
  active?: boolean;
}

interface ButtonPropsList {
  active?: boolean;
  onlyButton?: boolean;
}

export const Container = styled.View`
  width: 100%;
  height: ${RFValue(45)}px;
  flex-direction: row;
`;

export const ButtonOptionList = styled.TouchableOpacity<ButtonPropsList>`
  width: ${({onlyButton}) => (onlyButton ? '100%' : '50%')};
  align-items: center;
  justify-content: center;

  ${({active}) =>
    active === false &&
    css`
      border-bottom-width: 2px;
      border-bottom-color: ${({theme}) => theme.colors.primary};
    `};
`;

export const TextButtonList = styled.Text<ButtonProps>`
  font-size: ${RFValue(16)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme, active}) =>
    active === false ? theme.colors.primary : theme.colors.secondary};
`;

export const ButtonOptionMap = styled.TouchableOpacity<ButtonProps>`
  width: 50%;
  align-items: center;
  justify-content: center;

  ${({active}) =>
    active === true &&
    css`
      border-bottom-width: 2px;
      border-bottom-color: ${({theme}) => theme.colors.primary};
    `};
`;

export const TextButtonMap = styled.Text<ButtonProps>`
  font-size: ${RFValue(16)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme, active}) =>
    active === true ? theme.colors.primary : theme.colors.secondary};
`;
