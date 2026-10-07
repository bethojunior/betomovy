import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 15px;
  align-items: center;
  position: relative;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.background_global};
  border-top-width: 0.2px;
  border-top-color: ${({theme}) => theme.colors.primary};
`;

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

export const HeaderText = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${RFValue(18)}px;
  font-family: MavenPro_500Medium;
`;

export const TextQrCode = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${RFValue(15)}px;
  font-family: MavenPro_500Medium;
  width: 90%;
  margin-right: 5%;
`;

export const CodeContainer = styled.TouchableOpacity`
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 15px;
  width: 100%;
  align-items: center;
  flex-direction: row;
  border: 0.5px solid ${({theme}) => theme.colors.primary};
  border-radius: 10px;
`;

export const ContainerMargin = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

export const Button = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 5px;
  border: 1px solid ${({theme}) => theme.colors.primary};
  width: 45%;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${RFValue(16)}px;
  font-family: MavenPro_500Medium;
`;

export const ButtonIcon = styled.TouchableOpacity`
  margin-right: 10px;
  align-self: center;
  flex-direction: row;
`;
