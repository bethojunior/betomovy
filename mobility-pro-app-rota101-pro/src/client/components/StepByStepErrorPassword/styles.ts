import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ContainerModal = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  position: relative;
`;

export const ContainerAlert = styled.View`
  flex-direction: column;
  margin-bottom: 20px;
  align-items: center;
`;

export const TextAlert = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xslarge}px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;
export const TextButton = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xslarge}px;
  color: ${({theme}) => theme.colors.primaryText};
  font-family: MavenPro_400Regular;
`;

export const TextSeccondary = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const ButtonAdvance = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const InputDynamic = styled.TextInput`
  border: 1px solid ${({theme}) => theme.colors.secondary};
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 10px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
`;

export const ContainerInput = styled.View`
  width: 100%;
  margin-top: ${RFValue(20)}px;
`;
