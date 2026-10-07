import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Content = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_black_light};
  align-items: center;
  justify-content: center;
  padding: 0 10px;
`;

export const ModalContent = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  padding: 20px;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(19)}px;
  font-family: MavenPro_500Medium;
  margin: 10px 0 20px 0;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  align-self: flex-end;
  height: 100%;
`;

export const Info = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_400Regular;
  text-align: justify;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
  align-self: center;
  border-radius: 5px;
  margin-top: 20px;
`;

export const TextButton = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_500Medium;
`;
