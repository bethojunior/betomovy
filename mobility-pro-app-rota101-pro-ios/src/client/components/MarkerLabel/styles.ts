import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const ContainerCard = styled.View`
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
  border-radius: 2px;
  flex-direction: row;
  width: 80%;
  max-width: 333px;
  justify-content: space-between;

  elevation: 15;
  border-width: 0.2px;

  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

export const ContainerMinutes = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: 22%;
  padding: 0px 3px;
  align-items: center;
  justify-content: center;
  elevation: 5;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;

  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

export const AddressContainer = styled.View`
  width: 75%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

export const TextMinuts = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  margin: -2.5px;
`;

export const TextCard = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(11)}px;
  font-family: MavenPro_400Regular;
  margin: 5px;
  width: 80%;
`;

export const ArrrowIcon = styled(MaterialIcons)`
  font-size: 20px;
  position: absolute;
  right: 5px;
`;
