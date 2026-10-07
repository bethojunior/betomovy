import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 15px 15px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 0.3px;
  border-bottom-color: ${({theme}) => theme.colors.secondary};
  background: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Avatar = styled.Image.attrs({
  resizeMode: 'stretch',
})`
  background: ${({theme}) => theme.colors.white};
  height: ${RFValue(50)}px;
  width: ${RFValue(50)}px;
  border-radius: ${RFValue(50)}px;
`;

export const Name = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  margin-left: ${RFValue(10)}px;
  flex: 1;
`;
