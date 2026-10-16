import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {USE_DARK_PRIMARY_VARIANT} from '../../../constantBuild/config';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
  padding: 15px;
  align-items: center;
  position: absolute;
  justify-content: flex-start;
  background-color: ${({theme}) => theme.colors.background_global};
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 700px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  width: 100%;
`;

export const Header = styled.View`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

export const HeaderText = styled.Text`
  color: #000;
  font-size: ${RFValue(18)}px;
  font-family: MavenPro_500Medium;
  text-align: center;
  width: 100%;
`;

export const TextQrCode = styled.Text`
  color: #000;
  font-size: ${RFValue(15)}px;
  font-family: MavenPro_500Medium;
  width: 90%;
  margin-right: 5%;
`;

export const CodeContainer = styled.TouchableOpacity`
  margin-bottom: 12px;
  padding: 15px;
  width: 70%;
  align-items: center;
  flex-direction: row;
  border: 0.5px solid #000;
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
  border: 1px solid
    ${({theme}) =>
      USE_DARK_PRIMARY_VARIANT ? theme.colors.black : theme.colors.primary};
  width: 70%;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${RFValue(16)}px;
  font-family: MavenPro_500Medium;
  width: 100%;
  text-align: center;
`;

export const ButtonIcon = styled.TouchableOpacity`
  margin-right: 10px;
  align-self: center;
  flex-direction: row;
  position: absolute;
  left: 0;
`;

export const TextInstructions = styled.Text`
  font-size: ${RFValue(12)}px;
  color: #000;
  text-align: flex-start;
  font-weight: 600;
`;
