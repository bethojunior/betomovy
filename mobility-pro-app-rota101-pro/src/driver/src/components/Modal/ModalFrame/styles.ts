import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

type TextButtonProps = {
  cancel?: boolean;
};

type ContentButtonProps = {
  align?: 'center' | 'space-between';
};

export const TextBold = styled.Text`
  font-size: 22px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
`;

export const Content = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_black_light};
  align-items: center;
  justify-content: center;
`;

export const ContentScroll = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },
})``;

export const ModalContent = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  width: 90%;
  max-width: 400px;
  align-self: center;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.2;
  shadow-radius: 12px;
  elevation: 10;
  overflow: hidden;
`;

export const ContentButton = styled.View<ContentButtonProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${({align}) => align ?? 'space-between'};
  padding-top: ${RFValue(8)}px;
  padding-bottom: ${RFValue(10)}px;

  border-top-width: 0.5px;
  border-top-color: ${({theme}) => theme.colors.border};
`;

export const Button = styled.TouchableOpacity`
  padding-top: ${RFValue(6)}px;
  padding-bottom: ${RFValue(6)}px;
  width: 40%;
  height: ${RFValue(38)}px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const TextButton = styled.Text<TextButtonProps>`
  color: ${({theme, cancel}) =>
    cancel ? theme.colors.red : theme.colors.primary};
  font-family: MavenPro_500Medium;
  font-size: ${({theme}) => theme.fontSizes.large}px;
  text-align: center;
`;

export const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;
