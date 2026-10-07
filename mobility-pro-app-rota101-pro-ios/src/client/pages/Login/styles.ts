import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface LoginColor {
  color?: string;
}

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
  justify-content: center;
`;

export const Content = styled.View`
  padding-left: ${({theme}) => theme.spacing.xxxlarge}px;
  padding-right: ${({theme}) => theme.spacing.xxxlarge}px;
`;

export const ContentImage = styled.View`
  align-items: center;
`;

export const Logo = styled.Image`
  height: ${RFValue(130)}px;
  width: ${RFValue(130)}px;
  margin-bottom: ${RFValue(26)}px;
`;

export const Form = styled.View``;

export const ContentButton = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const ButtonRedefinePassword = styled.TouchableOpacity``;

export const ButtonRedefinePasswordText = styled.Text`
  font-size: ${RFValue(10)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme, color}) => (color ? color : theme.colors.primary)};
  max-width: ${RFValue(100)}px;
  text-align: center;
`;

export const ContentActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerBiometry = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContentOrSocial = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(30)}px;
`;

export const OrSocialTrace = styled.View`
  width: ${RFValue(60)}px;
  border-bottom-width: ${({theme}) => theme.borderWidth.medium}px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
`;

export const OrSocialText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.primary};
  text-align: center;
`;

export const ContentSocial = styled.View`
  margin-top: ${RFValue(15)}px;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonRegister = styled.TouchableOpacity`
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${RFValue(15)}px;
`;

export const ButtonRegisterText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: #000;
`;

export const ButtonRegisterTextGrif = styled.Text<LoginColor>`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme, color}) => (color ? color : theme.colors.primary)};
  text-decoration-line: underline;
  margin-left: ${RFValue(5)}px;
`;

export const ContentTermsOfUse = styled.View`
  margin-top: ${RFValue(12)}px;
  flex-direction: row;
  justify-content: center;
`;

export const TermsOfUseButton = styled.TouchableOpacity``;

export const TermsOfUseText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.button_terms_of_use};
  margin-left: ${RFValue(5)}px;
`;
