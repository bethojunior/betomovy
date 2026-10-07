import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerProps{
  backgroundColor: string;
}

interface TextTypeAppProps {
  colorText: string;
  width?: string;
}

export const Container = styled.View<ContainerProps>`
  flex: 1;
  background: ${(props) => props.backgroundColor ? props.backgroundColor : ({theme}) => theme.colors.background_global};
  justify-content: center;
`;

export const Content = styled.View`
  width: 100%;
  padding-left: ${({theme}) => theme.spacing.xxxlarge}px;
  padding-right: ${({theme}) => theme.spacing.xxxlarge}px;
`;

export const ContentImage = styled.View`
  align-items: center;
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'stretch',
})`
  height: ${RFValue(130)}px;
  width: ${RFValue(130)}px;
  margin-bottom: ${RFValue(26)}px;
`;

export const Form = styled.View``;

export const ContentButton = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const ButtonRedefinePassword = styled.TouchableOpacity`
  padding: 0 20px;
`;

export const ButtonRedefinePasswordText = styled.Text`
  font-size: 12px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.primary};
  max-width: ${RFValue(100)}px;
  text-align: center;
  width: 100%;
`;

export const ContentActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerBiometry = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ButtonRegister = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${RFValue(15)}px;
`;

export const ButtonRegisterText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: #000;
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

export const TextTypeApp = styled.Text<TextTypeAppProps>`
  font-size: 18px;
  text-align: right;
  width: 100%;
  font-weight: bold;
  color: ${props => props.colorText};
  margin-bottom: 120px;
`