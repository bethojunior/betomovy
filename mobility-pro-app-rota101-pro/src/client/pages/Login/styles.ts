import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface LoginColor {
  color?: string;
}

export const Container = styled.ScrollView.attrs(props => ({
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: 'always',
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: props.theme.spacing.xxlarge,
    paddingBottom: props.theme.spacing.xsslarge,
    paddingHorizontal: props.theme.spacing.xxlarge,
  },
}))`
  background: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
`;

export const ContentImage = styled.View`
  align-items: center;
`;

export const Logo = styled.Image`
  height: ${RFValue(120)}px;
  width: ${RFValue(120)}px;
  margin-bottom: ${RFValue(26)}px;
  border-radius: ${RFValue(4)}px;
`;

export const Form = styled.View``;

export const ContentButton = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const ButtonRedefinePassword = styled.TouchableOpacity``;

export const ButtonRedefinePasswordText = styled.Text<{color?: string}>`
  font-size: ${({theme}) => theme.fontSizes.smalls + 1}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme, color}) => (color ? color : theme.colors.primary)};
  text-align: center;
`;

export const ContentActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  gap: ${RFValue(16)}px;
  margin-top: ${RFValue(4)}px;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerBiometry = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContentOrSocial = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${RFValue(24)}px;
`;

export const OrSocialTrace = styled.View`
  flex: 1;
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
  margin-top: ${RFValue(24)}px;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonRegister = styled.TouchableOpacity`
  align-self: center;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${RFValue(26)}px;
  padding: 0 ${RFValue(12)}px;
`;

export const ContentRegister = styled.View`
  gap: ${RFValue(4)}px;
  align-items: center;
`;

export const ButtonRegisterText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: #000;
`;

export const ButtonRegisterTextGrif = styled.Text<LoginColor>`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme, color}) => (color ? color : theme.colors.primary)};
  text-decoration-line: underline;
  margin-left: ${RFValue(5)}px;
`;

export const ContentTermsOfUse = styled.View`
  margin-top: ${RFValue(24)}px;
  flex-direction: row;
  justify-content: center;
`;

export const TermsOfUseButton = styled.TouchableOpacity``;

export const TermsOfUseText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.button_terms_of_use};
  text-decoration-line: underline;
`;

export const BtnBackAppPartners = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-bottom: 30px;
`;

export const TextBackAppPartners = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primary};
`;
