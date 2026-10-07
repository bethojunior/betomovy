import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

interface cellProps {
  focus: boolean;
  color?: string;
}

export const Container = styled.View``;

export const Cell = styled.Text<cellProps>`
  width: ${RFValue(38)}px;
  height: ${RFValue(38)}px;
  line-height: ${RFValue(36)}px;
  font-size: ${({theme}) => theme.fontSizes.xxlarge}px;
  border-width: ${({theme}) => theme.borderWidth.medium}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  border-color: ${(props) => props.color ? props.color : ({theme}) => theme.colors.primary};
  text-align: center;
  margin-right: ${RFValue(10)}px;
  margin-left: ${RFValue(10)}px;
  color: ${({theme}) => theme.colors.secondary};

  ${({focus, theme}) =>
    focus &&
    css`
      border-color: ${theme.colors.secondary};
      color: ${theme.colors.primary};
    `}
`;
