import {lighten, shade} from 'polished';
import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

type TypeMessage = {
  type: boolean;
  color: string;
};

export const ContainerModal = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: ${Platform.OS === 'ios' ? '20px 0' : '0'};
`;

export const HeaderModal = styled.View`
  padding: 0 20px;
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const ContainerDetails = styled.View`
  padding: ${({theme}) => theme.spacing.large}px 0;
  flex-direction: row;
  align-items: center;
`;

export const Image = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;

  margin-right: ${({theme}) => theme.spacing.large}px;
`;

export const TextHeader = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(16)}px;
`;

export const ContainerChat = styled.View`
  flex: 1;
  margin-top: 20px;
  padding: 15px;
  width: 100%;
  height: ${RFValue(100)}%;
  border-radius: 50px;
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
`;

export const ContentSwitch = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;
export const ContentChat = styled.ScrollView`
  flex: 1;
`;
export const ContainerInput = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
`;

export const Input = styled.TextInput.attrs(({theme}) => ({
  placeholderTextColor: lighten(0.05, theme.colors.secondary),
}))`
  width: 75%;
  padding: 12px;
  max-height: 120px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.background_global};
  margin-right: 10px;
  font-size: ${RFValue(16)}px;
  color: ${({theme}) => theme.colors.black};
`;
export const ButtonSend = styled.TouchableOpacity`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(40)}px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const ButtonMic = styled.Pressable`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  margin: 5px;
  border-radius: ${RFValue(40)}px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const TypeMessage = styled.Text`
  margin-bottom: 2px;
  font-size: 12px;
  font-weight: bold;
`;

export const Message = styled.Text`
  margin-bottom: 0;
`;

export const MessageContent = styled.View<TypeMessage>`
  width: 55%;
  height: auto;

  border-radius: 10px;
  padding: 5px;
  background-color: ${({type, theme}) =>
    type ? theme.colors.background_white_light : theme.colors.yellowLight};
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: 10px;
  margin-left: ${({type}) => (type ? 'auto' : '0px')};
`;

export const ContainerAudio = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
