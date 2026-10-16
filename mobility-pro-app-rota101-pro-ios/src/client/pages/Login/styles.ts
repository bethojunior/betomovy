import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface LoginColor {
  color?: string;
}

export const BackgroundImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 16, 32, 0.65);
`;

export const Container = styled.ScrollView.attrs(props => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: RFValue(28),
  },
  keyboardShouldPersistTaps: 'always',
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
  background-color: transparent;
`;

export const Content = styled.View`
  padding-left: ${({ theme }) => theme.spacing.xxxlarge}px;
  padding-right: ${({ theme }) => theme.spacing.xxxlarge}px;
`;

export const ContentImage = styled.View`
  align-items: center;
`;

export const Logo = styled.Image`
  height: ${RFValue(115)}px;
  width: ${RFValue(115)}px;
  margin-bottom: ${RFValue(20)}px;
  border-radius: ${RFValue(16)}px;
`;

export const LoginCard = styled.View`
  background-color: rgba(255, 255, 255, 0.96);
  border-radius: ${RFValue(22)}px;
  padding: ${RFValue(22)}px ${RFValue(18)}px ${RFValue(18)}px ${RFValue(18)}px;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.3;
  shadow-radius: 16px;
  elevation: 8;
  margin-bottom: ${RFValue(12)}px;
`;

export const Form = styled.View``;

export const ContentButton = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const ButtonRedefinePassword = styled.TouchableOpacity``;

export const ButtonRedefinePasswordText = styled.Text<{ color?: string }>`
  font-size: ${RFValue(11)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme, color }) => (color ? color : theme.colors.primary)};
  max-width: ${RFValue(120)}px;
  text-align: right;
`;

export const ContentActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${RFValue(6)}px;
`;

export const ContainerBiometry = styled.View`
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;

export const ContentOrSocial = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(22)}px;
`;

export const OrSocialTrace = styled.View`
  flex: 1;
  max-width: ${RFValue(70)}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.4);
`;

export const OrSocialText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: #ffffff;
  text-align: center;
  padding-horizontal: ${RFValue(10)}px;
`;

export const ContentSocial = styled.View`
  margin-top: ${RFValue(14)}px;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonRegister = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${RFValue(10)}px;
  padding-vertical: ${RFValue(8)}px;
  padding-horizontal: ${RFValue(16)}px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: ${RFValue(9999)}px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.3);
  align-self: center;
`;

export const ContentRegister = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ButtonRegisterText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(13)}px;
  color: #ffffff;
`;

export const ButtonRegisterTextGrif = styled.Text<LoginColor>`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(13)}px;
  color: #ff3388;
  text-decoration-line: underline;
  margin-left: ${RFValue(5)}px;
`;

export const ContentTermsOfUse = styled.View`
  margin-top: ${RFValue(14)}px;
  flex-direction: row;
  justify-content: center;
`;

export const TermsOfUseButton = styled.TouchableOpacity``;

export const TermsOfUseText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: rgba(255, 255, 255, 0.85);
  margin-left: ${RFValue(5)}px;
  text-decoration-line: underline;
`;

export const BtnBackAppPartners = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  align-self: flex-start;
  margin-left: ${({ theme }) => theme.spacing.xxxlarge}px;
  margin-bottom: 12px;
`;

export const TextBackAppPartners = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
`;
