import styled from 'styled-components/native';

type TextButtonProps = {
  hide?: boolean;
  cancel?: boolean;
};

export const Content = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
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
  overflow: hidden;
`;

export const ContentButton = styled.View<TextButtonProps>`
  display: ${({hide}) => (hide ? 'none' : 'flex')};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  border-top-width: ${({hide}) => (hide ? 'none' : '0.5px')};
  border-top-color: ${({theme}) => theme.colors.border};
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
  color: ${({theme, cancel}) =>
    cancel ? theme.colors.red : theme.colors.primary};
  font-family: ${({theme}) => theme.fonts.bold};
  text-align: center;
`;

export const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;
