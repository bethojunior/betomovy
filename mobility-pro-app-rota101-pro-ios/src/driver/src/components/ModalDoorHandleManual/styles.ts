import {MotiView} from 'moti';
import {TextInputMask} from 'react-native-masked-text';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
// Platform.OS === 'ios' ? MotiSafeAreaView : MotiView
export const Container = styled(MotiView)`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: ${({theme}) => theme.spacing.medium}px
    ${({theme}) => theme.spacing.large}px;
`;

export const BackPage = styled.TouchableOpacity`
  flex-direction: row;
`;

export const ScrollViewAddress = styled.View`
  /* margin-top: ${({theme}) => theme.spacing.medium}px; */
  padding: ${({theme}) => theme.spacing.small}px;
  flex: 1;
`;

export const ContentInput = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const InputAddress = styled.TextInput`
  padding: ${({theme}) => theme.spacing.medium}px;
  width: 100%;

  border: 0.5px solid ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const ContainerPrice = styled.View`
  align-items: center;
  justify-content: center;
  height: 12%;
`;

export const InputMask = styled(TextInputMask)`
  border: 1px solid ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.secondary};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  padding: 3px;
  width: 35%;
  height: 80%;
  text-align: center;
  font-size: 20px;
`;

export const ButtonConfirm = styled(Button)`
  border: 0.5px solid ${({theme}) => theme.colors.primary};
  margin-top: ${({theme}) => theme.spacing.xslarge}px;
  margin-bottom: ${RFValue(100)}px;
`;

export const ButtonEdit = styled.TouchableOpacity`
  border: 0.5px solid ${({theme}) => theme.colors.primary};
  border-radius: 5px;
  padding: 2px;
  margin-left: 5px;
`;

export const TextConfirm = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;

export const PickerContainer = styled.View`
  border: 0.5px solid ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;
