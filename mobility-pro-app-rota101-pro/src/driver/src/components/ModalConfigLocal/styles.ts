import { ScrollView } from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ModalComponent = styled.Modal`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Container = styled(ScrollView)`
  padding: 10px 20px;
  flex: 1;
`;

export const ContainerHeader = styled.View`
  width: 100%;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ContainerInput = styled.View`
  width: 100%;
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
`;

export const TextLocal = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const Input = styled.TextInput`
  height: 50px;
  flex: 1;
  margin-top: 10px;
  margin-left: 10px;
  padding: 0 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.primary};
`;

export const ContainerButton = styled.TouchableOpacity`
  width: 100%;
  margin-top: 20px;
  align-items: center;

  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 5px;
  padding: 10px;
`;
