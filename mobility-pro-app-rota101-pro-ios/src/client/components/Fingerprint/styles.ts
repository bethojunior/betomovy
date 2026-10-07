import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Title = styled.Text`
  font-size: ${RFValue(22)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primary};
  text-align: center;
  margin-top: ${getStatusBarHeight() + RFValue(38)}px;
  margin-bottom: ${RFPercentage(7)}px;
`;

export const PhotoIcon = styled.View`
  align-items: center;
`;

export const Description = styled.Text`
  font-size: ${RFValue(17)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.primary};
  text-align: center;
  margin-top: ${RFValue(38)}px;
`;

export const Buttons = styled.View`
  margin-top: ${RFValue(33)}px;
  padding-left: 29px;
  padding-right: 29px;
`;

export const ButtonRecused = styled.TouchableOpacity`
  width: 100%;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 7px;
  align-items: center;
  margin-top: 10px;
  height: ${RFValue(58)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({theme}) => theme.colors.primary};
  margin-top: 20px;
`;

export const TextButton = styled.Text`
  font-size: ${RFValue(20)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primaryText};
  font-family: ${({theme}) => theme.fonts.bold};
`;

export const ButtonSignIn = styled(ButtonRecused)`
  background-color: ${({theme}) => theme.colors.primary};
`;

export const TextButtonSignIn = styled(TextButton)`
  color: ${({theme}) => theme.colors.primaryText};
`;
