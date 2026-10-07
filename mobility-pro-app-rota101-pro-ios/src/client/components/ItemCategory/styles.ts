import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 17px;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.secondary};
  justify-content: space-between;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  width: 75%;
`;

export const Logo = styled.Image`
  width: ${RFValue(60)}px;
  height: ${RFValue(55)}px;
  border-radius: 5px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  margin-top: 1px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  margin-left: ${RFValue(10)}px;
  text-transform: capitalize;
`;
