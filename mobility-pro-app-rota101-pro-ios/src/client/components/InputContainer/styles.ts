import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

export const Container = styled.View``;

interface LabelProps {
  color?: string;
}

export const Label = styled.Text<LabelProps>`
  font-size: ${RFValue(13)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme, color}) => (color ? color : theme.colors.primary)};
  margin-top: 10px;

  ${Platform.OS === 'ios' &&
  css`
    margin-bottom: 7px;
  `}
`;
