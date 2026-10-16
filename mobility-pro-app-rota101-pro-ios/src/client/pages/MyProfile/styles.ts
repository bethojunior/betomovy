import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ScrollContent = styled.ScrollView.attrs<{keyboardHeight?: number}>(
  ({theme, keyboardHeight = 0}) => ({
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      padding: theme.spacing.large,
      paddingBottom: theme.spacing.large + keyboardHeight,
      gap: theme.spacing.large,
    },
  }),
)``;

export const Card = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  padding: ${({theme}) => theme.spacing.large}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border_white_light};
`;

export const AvatarRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ButtonPhoto = styled.TouchableOpacity``;

/** Usado por FaceDetector (fluxo de reconhecimento facial) — não remover. */
export const CameraButton = styled.TouchableOpacity`
  background-color: white;
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
`;

export const AvatarWrapper = styled.View`
  position: relative;
`;

export const CameraBadge = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${RFValue(24)}px;
  height: ${RFValue(24)}px;
  border-radius: ${RFValue(12)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-width: ${RFValue(1.5)}px;
  border-color: ${({theme}) => theme.colors.white};
`;

export const UserInfo = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: ${({theme}) => theme.spacing.large}px;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const UserName = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const UserDocument = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text_gray};
`;

export const ContainerItem = styled.View`
  margin-top: ${({theme}) => theme.spacing.small}px;
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
`;

export const RequiredText = styled.Text`
  color: ${({theme}) => theme.colors.red};
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.medium};
`;

export const StatusText = styled.Text<{status: string}>`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({status, theme}) =>
    status === '1'
      ? theme.colors.on
      : status === '2'
      ? theme.colors.primary
      : status === '3'
      ? theme.colors.red
      : theme.colors.primary};
`;

export const DangerRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const DangerTextGroup = styled.View`
  flex: 1;
`;

export const DangerTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.red};
`;

export const DangerSubtitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text_gray};
  margin-top: ${RFValue(2)}px;
`;

export const SupportRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const SupportTextGroup = styled.View`
  flex: 1;
`;

export const SupportText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text_gray};
  line-height: ${RFValue(18)}px;
`;

export const SupportLinkText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.blue};
`;

export const ContentTerms = styled.View`
  align-items: center;
  padding-bottom: ${({theme}) => theme.spacing.xlarge}px;
`;

export const ButtonTerms = styled.TouchableOpacity``;

export const ButtonTextTerms = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text_gray};
  text-decoration: underline;
`;
