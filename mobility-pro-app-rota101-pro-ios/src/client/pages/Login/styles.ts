import { Dimensions, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

export const BackgroundContainer = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #070b14;
`;

export const DarkOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(6, 10, 20, 0.88);
`;

export const ScrollContainer = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: RFValue(24),
  },
  keyboardShouldPersistTaps: 'always',
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
`;

export const ContentWrapper = styled.View`
  padding-horizontal: ${RFValue(20)}px;
  width: 100%;
`;

export const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: ${RFValue(18)}px;
`;

export const LogoImage = styled.Image`
  height: ${RFValue(68)}px;
  width: ${RFValue(220)}px;
`;

export const TaglineText = styled.Text`
  font-size: ${RFValue(12)}px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.8px;
  margin-top: 4px;
`;

/* ===== GRID DE SELEÇÃO DE PERFIL (PASSAGEIRO / MOTORISTA) ===== */
export const ProfileGridContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${RFValue(16)}px;
  width: 100%;
`;

export const ProfileGridItem = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  background-color: ${({ active }) =>
    active ? 'rgba(205, 35, 121, 0.16)' : 'rgba(255, 255, 255, 0.04)'};
  border-width: ${({ active }) => (active ? '2px' : '1px')};
  border-color: ${({ active }) =>
    active ? '#CD2379' : 'rgba(255, 255, 255, 0.18)'};
  border-radius: ${RFValue(16)}px;
  padding-vertical: ${RFValue(14)}px;
  padding-horizontal: ${RFValue(8)}px;
  align-items: center;
  justify-content: center;
  margin-horizontal: 5px;
`;

export const ProfileIconBadge = styled.View<{ active: boolean }>`
  width: ${RFValue(42)}px;
  height: ${RFValue(42)}px;
  border-radius: ${RFValue(21)}px;
  background-color: ${({ active }) =>
    active ? '#CD2379' : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;

export const ProfileGridTitle = styled.Text<{ active: boolean }>`
  font-size: ${RFValue(12.5)}px;
  font-weight: bold;
  color: ${({ active }) => (active ? '#ffffff' : 'rgba(255, 255, 255, 0.70)')};
  letter-spacing: 0.6px;
  text-align: center;
`;

export const ProfileGridSubtitle = styled.Text<{ active: boolean }>`
  font-size: ${RFValue(10)}px;
  color: ${({ active }) => (active ? '#ff80ab' : 'rgba(255, 255, 255, 0.45)')};
  margin-top: 2px;
  text-align: center;
`;

/* ===== CARD PRINCIPAL DE LOGIN (GLASSMORPHISM ESCURO) ===== */
export const GlassLoginCard = styled.View`
  background-color: rgba(13, 19, 34, 0.88);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.10);
  border-radius: ${RFValue(22)}px;
  padding: ${RFValue(22)}px ${RFValue(18)}px;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.45;
  shadow-radius: 20px;
  elevation: 10;
  margin-bottom: ${RFValue(14)}px;
`;

export const CardHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${RFValue(16)}px;
`;

export const CardHeaderPill = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(205, 35, 121, 0.22);
  border-radius: 20px;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-width: 1px;
  border-color: rgba(205, 35, 121, 0.5);
`;

export const CardHeaderPillText = styled.Text`
  font-size: ${RFValue(11)}px;
  font-weight: 600;
  color: #ff80ab;
  margin-left: 6px;
  letter-spacing: 0.3px;
`;

/* ===== INPUTS MODERNOS ESCUROS ===== */
export const InputGroup = styled.View`
  margin-bottom: ${RFValue(14)}px;
`;

export const ModernInputLabel = styled.Text`
  font-size: ${RFValue(12)}px;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 6px;
`;

export const ModernInputBox = styled.View<{ hasError?: boolean; isFocused?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-width: 1.5px;
  border-color: ${({ hasError, isFocused }) =>
    hasError
      ? '#ef4444'
      : isFocused
      ? '#CD2379'
      : 'rgba(255, 255, 255, 0.12)'};
  border-radius: ${RFValue(12)}px;
  padding-horizontal: 12px;
  height: ${RFValue(48)}px;
`;

export const ModernTextInput = styled.TextInput`
  flex: 1;
  font-size: ${RFValue(14)}px;
  color: #ffffff;
  padding-left: 8px;
  padding-right: 8px;
`;

export const InputErrorText = styled.Text`
  font-size: ${RFValue(10)}px;
  color: #ef4444;
  margin-top: 4px;
`;

/* ===== AÇÕES (ESQUECEU SENHA, BIOMETRIA) ===== */
export const CardActionsRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${RFValue(4)}px;
  margin-bottom: ${RFValue(18)}px;
`;

export const ForgotPasswordBtn = styled.TouchableOpacity`
  padding-vertical: 4px;
`;

export const ForgotPasswordText = styled.Text`
  font-size: ${RFValue(11)}px;
  font-weight: 600;
  color: #ff80ab;
`;

export const BiometryRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 8px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.08);
  margin-bottom: ${RFValue(12)}px;
`;

export const BiometryText = styled.Text`
  font-size: ${RFValue(12)}px;
  color: #cbd5e1;
`;

/* ===== BOTÃO PRINCIPAL DE LOGIN ===== */
export const PrimaryLoginButton = styled.TouchableOpacity`
  background-color: #CD2379;
  border-radius: ${RFValue(14)}px;
  height: ${RFValue(50)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  shadow-color: #CD2379;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.45;
  shadow-radius: 12px;
  elevation: 6;
`;

export const PrimaryLoginButtonText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 0.8px;
`;

/* ===== BOTÃO DE CADASTRE-SE ===== */
export const RegisterPillButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  padding-vertical: ${RFValue(12)}px;
  padding-horizontal: ${RFValue(20)}px;
  align-self: center;
  width: 100%;
  margin-top: ${RFValue(4)}px;
`;

export const RegisterPillTextNormal = styled.Text`
  font-size: ${RFValue(13)}px;
  color: #e2e8f0;
`;

export const RegisterPillTextHighlight = styled.Text`
  font-size: ${RFValue(13)}px;
  font-weight: bold;
  color: #ff4081;
  margin-left: 6px;
  text-decoration-line: underline;
`;

/* ===== LOGIN SOCIAL E TERMOS ===== */
export const SocialDividerRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(14)}px;
`;

export const SocialDividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.15);
`;

export const SocialDividerText = styled.Text`
  font-size: ${RFValue(11)}px;
  color: rgba(255, 255, 255, 0.55);
  padding-horizontal: 12px;
`;

export const SocialButtonsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 16px;
`;

export const SocialIconButton = styled.TouchableOpacity`
  width: ${RFValue(46)}px;
  height: ${RFValue(46)}px;
  border-radius: ${RFValue(23)}px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.15);
  align-items: center;
  justify-content: center;
`;

export const TermsContainer = styled.View`
  margin-top: ${RFValue(16)}px;
  align-items: center;
`;

export const TermsLinkText = styled.Text`
  font-size: ${RFValue(11)}px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration-line: underline;
`;

export const PartnerBackBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 14px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  align-self: flex-start;
  margin-bottom: 12px;
`;

export const PartnerBackBtnText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 8px;
`;

/* ===== MODAL DE CADASTRO (ESCOLHA PASSAGEIRO / MOTORISTA) ===== */
export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(3, 6, 14, 0.88);
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
`;

export const ModalCard = styled.View`
  background-color: #0c1220;
  border-width: 1.5px;
  border-color: #CD2379;
  border-radius: ${RFValue(22)}px;
  padding: ${RFValue(22)}px;
  width: 100%;
  max-width: 420px;
  shadow-color: #CD2379;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.45;
  shadow-radius: 20px;
  elevation: 12;
`;

export const ModalTitle = styled.Text`
  font-size: ${RFValue(17)}px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 6px;
`;

export const ModalSubtitle = styled.Text`
  font-size: ${RFValue(12)}px;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  margin-bottom: ${RFValue(20)}px;
`;

export const ModalChoiceCard = styled.TouchableOpacity<{ color?: string; bgColor?: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ bgColor }) => (bgColor ? bgColor : 'rgba(205, 35, 121, 0.16)')};
  border-width: 1.5px;
  border-color: ${({ color }) => (color ? color : '#CD2379')};
  border-radius: ${RFValue(16)}px;
  padding: ${RFValue(14)}px;
  margin-bottom: ${RFValue(12)}px;
`;

export const ModalChoiceIconBox = styled.View<{ color?: string }>`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  border-radius: ${RFValue(24)}px;
  background-color: ${({ color }) => (color ? color : '#CD2379')};
  align-items: center;
  justify-content: center;
  margin-right: 14px;
`;

export const ModalChoiceContent = styled.View`
  flex: 1;
`;

export const ModalChoiceTitle = styled.Text`
  font-size: ${RFValue(15)}px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 3px;
`;

export const ModalChoiceDescription = styled.Text`
  font-size: ${RFValue(11)}px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 16px;
`;

export const ModalCloseButton = styled.TouchableOpacity`
  margin-top: ${RFValue(8)}px;
  padding-vertical: 10px;
  align-items: center;
`;

export const ModalCloseButtonText = styled.Text`
  font-size: ${RFValue(12)}px;
  color: rgba(255, 255, 255, 0.55);
`;

/* Retrocompatibilidade com exportações antigas se importadas */
export const BackgroundImage = BackgroundContainer;
export const Overlay = DarkOverlay;
export const Container = ScrollContainer;
export const Content = ContentWrapper;
export const ContentImage = LogoContainer;
export const Logo = LogoImage;
export const LoginCard = GlassLoginCard;
export const ButtonRegister = RegisterPillButton;
export const ButtonRegisterText = RegisterPillTextNormal;
export const ButtonRegisterTextGrif = RegisterPillTextHighlight;
export const ContentButton = styled.View``;
export const ContentActions = CardActionsRow;
export const ButtonRedefinePassword = ForgotPasswordBtn;
export const ButtonRedefinePasswordText = ForgotPasswordText;
export const ContainerBiometry = styled.View``;
export const ContentTermsOfUse = TermsContainer;
export const TermsOfUseButton = styled.TouchableOpacity``;
export const TermsOfUseText = TermsLinkText;
export const ContentOrSocial = SocialDividerRow;
export const OrSocialTrace = SocialDividerLine;
export const OrSocialText = SocialDividerText;
export const ContentSocial = SocialButtonsRow;
export const BtnBackAppPartners = PartnerBackBtn;
export const TextBackAppPartners = PartnerBackBtnText;
