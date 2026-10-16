import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

type TextButtonProps = {
  hide?: boolean;
};

export const Content = styled.KeyboardAvoidingView`
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
  padding: 20px;
`;

export const ContentButton = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Button = styled.TouchableOpacity`
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const TextButton = styled.Text<TextButtonProps>`
  color: ${({hide, theme}) => (hide ? 'transparent' : theme.colors.secondary)};
`;

export const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

export const TextBold = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: ${RFValue(15)}px;
`;
