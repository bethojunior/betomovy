import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  background-color: ${({theme}) => theme.colors.white};
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 ${({theme}) => theme.spacing.xxlarge}px;
`;

export const Text = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const ContainerLogoCentral = styled.View`
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: center;
  width: 100%;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
`;

export const ContainerBackPage = styled.View``;

export const Logo = styled.Image`
  width: ${RFValue(75)}px;
  height: ${RFValue(75)}px;
  margin: 10px 0;
`;
