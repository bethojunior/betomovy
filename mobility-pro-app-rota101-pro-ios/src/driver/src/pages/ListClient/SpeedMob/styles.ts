import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';

export const Container = styled.View``;

export const Header = styled.View<{backgroundColor: string}>`
  width: 100%;
  height: 100px;
  background-color: ${props => props.backgroundColor};
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
`;

export const TitleHeader = styled.Text<{colorText: string}>`
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.colorText};
`;

export const ButtonBack = styled.TouchableOpacity``;

export const Body = styled.View`
  height: 100%;
  border-width: 1px;
`;

export const ContainerQntClients = styled.View`
  align-items: center;
  margin: 15px 0;
`;

export const ContentQntClients = styled.View<{backgroundColor: string}>`
  background-color: ${props => props.backgroundColor};
  text-align: center;
  padding: ${RFValue(45)}px ${RFValue(40)}px;
  border-radius: 360px;
  elevation: 10;
`;

export const TextQntClients = styled.Text<{colorText: string}>`
  font-size: 50px;
  text-align: center;
  font-weight: bold;
  color: ${props => props.colorText};
`;

export const TextClients = styled.Text<{colorText: string}>`
  font-size: 25px;
  text-align: center;
  color: ${props => props.colorText};
`;

export const ContentList = styled(SafeAreaView)`
  margin-top: 10px;
  height: 300px;
  background-color: ${({theme}) => theme.colors.background_white};
  border-width: 1px;
`;
