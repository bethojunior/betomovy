import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

export const Container = styled.View``;

export const Label = styled.Text`
  font-size: ${RFValue(13)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primary};
  margin-top: 10px;

  ${Platform.OS === 'ios' &&
  css`
    margin-bottom: 7px;
  `}
`;
