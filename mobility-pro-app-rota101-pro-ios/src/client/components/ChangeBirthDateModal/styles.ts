import styled from 'styled-components/native';
import { TextInputMask } from 'react-native-masked-text';

export const Content = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_black_light};
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  width: 90%;
  align-self: center;
`;

export const Input = styled(TextInputMask)`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.secondary};
  color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
`;

export const ContentButton = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Button = styled.TouchableOpacity`
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 40%;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const TextError = styled.Text`
  color: red;
  margin-bottom: 5px;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.primary};
`;
