import styled from 'styled-components/native';

type TextButtonProps = {
  hide?: boolean;
  cancel?: boolean;
};

export const TextBold = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
`;

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

  border-top-width: 0.5px;
  border-top-color: ${({theme}) => theme.colors.border};
`;

export const Button = styled.TouchableOpacity<TextButtonProps>`
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 40%;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const TextButton = styled.Text<TextButtonProps>`
  color: ${({hide, theme, cancel}) =>
    hide ? 'transparent' : cancel ? theme.colors.red : theme.colors.primary};
  font-family: MavenPro_500Medium;
  font-size: ${({theme}) => theme.fontSizes.large}px;
  text-align: center;
`;

export const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;
