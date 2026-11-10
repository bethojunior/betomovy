import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Modal, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import IconGoogle from '../../assets/images/google.svg';
import IconFacebook from '../../assets/images/facebook.svg';
import IconApple from '../../assets/images/apple-logo.svg';
import logoMovyWhite from '../../../../assets/logo_movy_white_text.png';
import loginBg from '../../../../assets/login-bg.png';

import Preload from '../../components/Preload';
import { translate } from '../../locales';
import { AppsId } from '../../../context/ConfigGlobal/constants';
import getAppColors from '../../../utils/GetAppColors';
import {
  BackgroundContainer,
  DarkOverlay,
  ScrollContainer,
  ContentWrapper,
  LogoContainer,
  LogoImage,
  TaglineText,
  ProfileGridContainer,
  ProfileGridItem,
  ProfileIconBadge,
  ProfileGridTitle,
  ProfileGridSubtitle,
  GlassLoginCard,
  CardHeaderRow,
  CardHeaderPill,
  CardHeaderPillText,
  InputGroup,
  ModernInputLabel,
  ModernInputBox,
  ModernTextInput,
  InputErrorText,
  CardActionsRow,
  ForgotPasswordBtn,
  ForgotPasswordText,
  BiometryRow,
  BiometryText,
  PrimaryLoginButton,
  PrimaryLoginButtonText,
  RegisterPillButton,
  RegisterPillTextNormal,
  RegisterPillTextHighlight,
  SocialDividerRow,
  SocialDividerLine,
  SocialDividerText,
  SocialButtonsRow,
  SocialIconButton,
  TermsContainer,
  TermsLinkText,
  PartnerBackBtn,
  PartnerBackBtnText,
  ModalBackdrop,
  ModalCard,
  ModalTitle,
  ModalSubtitle,
  ModalChoiceCard,
  ModalChoiceIconBox,
  ModalChoiceContent,
  ModalChoiceTitle,
  ModalChoiceDescription,
  ModalCloseButton,
  ModalCloseButtonText,
} from './styles';

import { schema } from './schema';
import { customToast } from '../../../utils/FlashMessage';
import { If } from '../../components/If';
import TermsOfUseModal from '../../components/TermsOfUseModal';
import { useAuth } from '../../../context/auth';
import { useModules } from '../../contexts/modules';
import { Switch } from '../../components/Switch';
import { LoginFacebookModal } from '../../components/LoginFacebookModal';
import { getDeviceId } from '../../../driver/src/utils/device';
import { ModalSwitch } from '../../../driver/src/components/ModalSwitch';
import LoginSpeedmob from './SpeedMob';
import { useNetwork } from '../../../context/ConfigGlobal';
import { buildApp, isBeta } from '../../../constantBuild/config';
import apiMain from '../../api/apiMain';
import { useConfigAppPartner } from '../../../context/ConfigAppPartner/useConfigAppPartner';

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { verifyDelivery, init } = useModules();
  const { betaEnd } = useNetwork();
  const {
    signIn,
    loginDriver,
    setSocialLogin,
    setDriverSelected,
    driverSelected,
    generalSettings,
    authenticateLogin,
    loading,
    setLoading,
  } = useAuth();

  const [modalForgotPassword, setModalForgotPassword] = useState(false);
  const [modalChoiceRegister, setModalChoiceRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [enabledBiometry, setEnabledBiometry] = useState(false);
  const [modalFacebook, setModalFacebook] = useState(false);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [modalTerms, setModalTerms] = useState(false);
  const [idNewLogin, setIdNewLogin] = useState('');
  const [showAlertBeta, setShowAlertBeta] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const { APP_PARTNER } = buildApp();
  const { appPartnerSelected } = useConfigAppPartner();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema(translate)),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Alterna o perfil entre passageiro (false) e motorista (true)
  const selectProfile = (driverMode: boolean) => {
    AsyncStorage.setItem('driver-box', String(driverMode));
    setDriverSelected(driverMode);
    if (driverMode) {
      getAppColors(Number(AppsId.DRIVER));
    } else {
      getAppColors(Number(AppsId['CLIENTE FINAL']));
    }
  };

  const loadingIsDriverSelected = async () => {
    const driver = await AsyncStorage.getItem('driver-box');
    if (driver === 'true') {
      setDriverSelected(true);
      getAppColors(Number(AppsId.DRIVER));
    } else {
      setDriverSelected(false);
      getAppColors(Number(AppsId['CLIENTE FINAL']));
    }
  };

  const handleAuth = useCallback(
    async (form: FormData) => {
      try {
        if (betaEnd && isBeta) {
          setShowAlertBeta(true);
          return;
        }

        const { email, password } = form;

        await authenticateLogin({
          email,
          password,
          keyAppPartner: appPartnerSelected?.key ?? undefined,
        });
      } catch (error: any) {
        console.error('Erro ao realizar login:', error);
        customToast(
          error?.response?.data?.message || error?.message || 'Erro ao realizar login.',
          'danger',
        );
      }
    },
    [betaEnd, isBeta, authenticateLogin, appPartnerSelected],
  );

  const handleOpenRegisterModal = () => {
    setModalChoiceRegister(true);
  };

  const handleSelectRegisterChoice = (isDriverChoice: boolean) => {
    selectProfile(isDriverChoice);
    setModalChoiceRegister(false);
    navigation.navigate('Register', { isDriver: isDriverChoice });
  };

  const handleRecoveryPassword = useCallback(() => {
    setModalForgotPassword(true);
  }, []);

  const getBiometryEnabled = async () => {
    const biometry = await AsyncStorage.getItem('biometry_enabled');
    setEnabledBiometry(!!biometry);
  };

  const handleBiometry = async () => {
    const biometrySwitch = await AsyncStorage.getItem('biometry_switch');
    setSwitchEnabled(!!biometrySwitch);
  };

  const verifyLastLogin = async () => {
    const account = await AsyncStorage.getItem('lastLogin');
    if (account) {
      const user = JSON.parse(account);
      setValue('email', user.email);
      setValue('password', user.password);
    }
  };

  const verifyIsActive = (key: string): boolean => {
    if (generalSettings) {
      const isActive = generalSettings?.find(item => item.key === key);
      return isActive?.value === '1';
    }
    return false;
  };

  const handleRedirectSelectAppPartner = () => {
    navigation.navigate('SelectAppPartners', { replace: true });
  };

  const createId = async () => {
    if (idNewLogin) {
      return {
        id: idNewLogin,
        deviceToken: await getDeviceId(),
      };
    }
    const { data } = await apiMain.post('Customer/newSocialLogin');
    if (!data.status) {
      return customToast(data?.message, 'danger');
    }
    setIdNewLogin(data?.data);
    return {
      id: data?.data,
      deviceToken: await getDeviceId(),
    };
  };

  const getIdApi = async (id: string) => {
    const { data } = await apiMain.get(`Customer/getSocialLogin?id=${id}`);
    if (!data.status) {
      return customToast(data?.message, 'danger');
    }
    return data;
  };

  const handlePressButtonFacebook = async () => {
    try {
      const dataId: any = await createId();
      const browser = await WebBrowser.openAuthSessionAsync(
        `https://api.movymob.com/login-social?id=${dataId.id}&deviceToken=${dataId.deviceToken}`,
      );
      if (browser.type === 'dismiss') {
        const dataUser = await getIdApi(dataId.id);
        if (dataUser?.status) {
          const { user } = dataUser.data;
          setSocialLogin(user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePressButtonGoogle = async () => {
    try {
      const dataId: any = await createId();
      const browser = await WebBrowser.openAuthSessionAsync(
        `https://api.movymob.com/login-social/google?id=${dataId.id}&deviceToken=${dataId.deviceToken}`,
      );
      if (browser.type === 'dismiss') {
        const dataUser = await getIdApi(dataId.id);
        if (dataUser?.status) {
          const { user } = dataUser.data;
          setSocialLogin(user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    verifyLastLogin();
    loadingIsDriverSelected();
    getBiometryEnabled();
    handleBiometry();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {init !== 'Speedmob' && init !== 'SpeedMob' && (
        <BackgroundContainer source={loginBg} resizeMode="cover">
          <DarkOverlay />

          <ScrollContainer>
            <ContentWrapper>
              {/* Botão Voltar para seleção de Parceiros quando aplicável */}
              <If condition={!!APP_PARTNER}>
                <PartnerBackBtn onPress={handleRedirectSelectAppPartner}>
                  <AntDesign name="arrowleft" size={18} color="#ffffff" />
                  <PartnerBackBtnText>
                    {translate('login.text_button_redirect_app_partner')}
                  </PartnerBackBtnText>
                </PartnerBackBtn>
              </If>

              {/* Logo MOVY em Destaque */}
              <LogoContainer>
                <LogoImage source={logoMovyWhite} resizeMode="contain" />
                <TaglineText>{translate('login.tagline') || 'Smart urban mobility'}</TaglineText>
              </LogoContainer>

              {/* ===== GRIDS COM AS CORES ROSA COM FUNDO TRANSPARENTE ===== */}
              <ProfileGridContainer>
                {/* GRID PASSAGEIRO */}
                <ProfileGridItem
                  active={!driverSelected}
                  activeOpacity={0.8}
                  onPress={() => selectProfile(false)}
                >
                  <ProfileIconBadge active={!driverSelected}>
                    <FontAwesome5
                      name="user"
                      size={RFValue(18)}
                      color={!driverSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'}
                    />
                  </ProfileIconBadge>
                  <ProfileGridTitle active={!driverSelected}>
                    {translate('login.profile_rider') || 'RIDER'}
                  </ProfileGridTitle>
                  <ProfileGridSubtitle active={!driverSelected}>
                    {translate('login.profile_rider_subtitle') || 'I want to ride'}
                  </ProfileGridSubtitle>
                </ProfileGridItem>

                {/* GRID MOTORISTA */}
                <ProfileGridItem
                  active={driverSelected}
                  activeOpacity={0.8}
                  onPress={() => selectProfile(true)}
                >
                  <ProfileIconBadge active={driverSelected}>
                    <MaterialCommunityIcons
                      name="steering"
                      size={RFValue(20)}
                      color={driverSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'}
                    />
                  </ProfileIconBadge>
                  <ProfileGridTitle active={driverSelected}>
                    {translate('login.profile_driver') || 'DRIVER'}
                  </ProfileGridTitle>
                  <ProfileGridSubtitle active={driverSelected}>
                    {translate('login.profile_driver_subtitle') || 'I want to drive'}
                  </ProfileGridSubtitle>
                </ProfileGridItem>
              </ProfileGridContainer>

              {/* ===== CARD DE LOGIN GLASSMORPHISM ESCURO ===== */}
              <GlassLoginCard>
                <CardHeaderRow>
                  <CardHeaderPill>
                    <Feather
                      name={driverSelected ? 'navigation' : 'user'}
                      size={13}
                      color="#ff80ab"
                    />
                    <CardHeaderPillText>
                      {driverSelected ? (translate('login.driver_access') || 'Driver Access') : (translate('login.rider_access') || 'Rider Access')}
                    </CardHeaderPillText>
                  </CardHeaderPill>
                </CardHeaderRow>

                {/* Input de E-mail */}
                <InputGroup>
                  <ModernInputLabel>{translate('login.label_email')}</ModernInputLabel>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <ModernInputBox
                        hasError={!!errors.email}
                        isFocused={emailFocused}
                      >
                        <Feather
                          name="mail"
                          size={18}
                          color={emailFocused ? '#CD2379' : 'rgba(255, 255, 255, 0.55)'}
                        />
                        <ModernTextInput
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                          placeholder={translate('login.text_placeholder_email')}
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          autoComplete="email"
                        />
                      </ModernInputBox>
                    )}
                  />
                  {errors.email && (
                    <InputErrorText>{errors.email.message as string}</InputErrorText>
                  )}
                </InputGroup>

                {/* Input de Senha */}
                <InputGroup>
                  <ModernInputLabel>{translate('login.label_password')}</ModernInputLabel>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <ModernInputBox
                        hasError={!!errors.password}
                        isFocused={passwordFocused}
                      >
                        <Feather
                          name="lock"
                          size={18}
                          color={passwordFocused ? '#CD2379' : 'rgba(255, 255, 255, 0.55)'}
                        />
                        <ModernTextInput
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                          placeholder={translate('login.text_placeholder_password')}
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          onSubmitEditing={handleSubmit(handleAuth)}
                        />
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => setShowPassword(!showPassword)}
                          style={{ padding: 4 }}
                        >
                          <Feather
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={18}
                            color="rgba(255, 255, 255, 0.65)"
                          />
                        </TouchableOpacity>
                      </ModernInputBox>
                    )}
                  />
                  {errors.password && (
                    <InputErrorText>{errors.password.message as string}</InputErrorText>
                  )}
                </InputGroup>

                {/* Esqueceu a Senha */}
                <CardActionsRow>
                  <ForgotPasswordBtn
                    activeOpacity={0.8}
                    onPress={handleRecoveryPassword}
                  >
                    <ForgotPasswordText>
                      {translate('recoveryPassword.title')}
                    </ForgotPasswordText>
                  </ForgotPasswordBtn>
                </CardActionsRow>

                {/* Biometria (se disponível) */}
                <If condition={enabledBiometry && !driverSelected}>
                  <BiometryRow>
                    <BiometryText>{translate('myProfile.biometry')}</BiometryText>
                    <Switch
                      enabled={switchEnabled}
                      value={switchEnabled}
                      onValueChange={async check => {
                        if (check) {
                          await AsyncStorage.setItem('biometry_switch', String(switchEnabled));
                        }
                        setSwitchEnabled(!switchEnabled);
                      }}
                    />
                  </BiometryRow>
                </If>

                {/* Botão de Entrar */}
                <PrimaryLoginButton
                  activeOpacity={0.85}
                  onPress={handleSubmit(handleAuth)}
                >
                  <PrimaryLoginButtonText>
                    {driverSelected
                      ? (translate('login.btn_enter_driver') || 'SIGN IN AS DRIVER')
                      : (translate('login.btn_enter_passenger') || 'SIGN IN AS RIDER')}
                  </PrimaryLoginButtonText>
                </PrimaryLoginButton>
              </GlassLoginCard>

              {/* Botão Cadastre-se com Grid de escolha */}
              <RegisterPillButton
                activeOpacity={0.8}
                onPress={handleOpenRegisterModal}
              >
                <RegisterPillTextNormal>
                  {translate('login.not_account')}
                </RegisterPillTextNormal>
                <RegisterPillTextHighlight>
                  {translate('login.text_register')}
                </RegisterPillTextHighlight>
              </RegisterPillButton>

              {/* Social Login */}
              <If
                condition={
                  verifyIsActive('enable_google_login') ||
                  verifyIsActive('enable_facebook_login')
                }
              >
                <SocialDividerRow>
                  <SocialDividerLine />
                  <SocialDividerText>
                    {translate('login.init_ssesion_social')}
                  </SocialDividerText>
                  <SocialDividerLine />
                </SocialDividerRow>

                <SocialButtonsRow>
                  <If condition={verifyIsActive('enable_google_login')}>
                    <SocialIconButton activeOpacity={0.8} onPress={handlePressButtonGoogle}>
                      <IconGoogle height={RFValue(24)} width={RFValue(24)} />
                    </SocialIconButton>
                  </If>
                  <If condition={verifyIsActive('enable_facebook_login')}>
                    <SocialIconButton activeOpacity={0.8} onPress={handlePressButtonFacebook}>
                      <IconFacebook height={RFValue(24)} width={RFValue(24)} />
                    </SocialIconButton>
                  </If>
                </SocialButtonsRow>
              </If>

              {/* Termos de Uso */}
              <TermsContainer>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setModalTerms(true)}>
                  <TermsLinkText>
                    {translate('myProfile.text_terms_of_use')}
                  </TermsLinkText>
                </TouchableOpacity>
              </TermsContainer>
            </ContentWrapper>

            <Preload visible={loading} />
          </ScrollContainer>

          {/* ===== MODAL DE ESCOLHA DE CADASTRO (PASSAGEIRO OU MOTORISTA) ===== */}
          <Modal
            visible={modalChoiceRegister}
            transparent
            animationType="fade"
            onRequestClose={() => setModalChoiceRegister(false)}
          >
            <ModalBackdrop>
              <ModalCard>
                <ModalTitle>
                  {translate('login.modal_choice_title') || 'How would you like to sign up?'}
                </ModalTitle>
                <ModalSubtitle>
                  {translate('login.modal_choice_subtitle') || 'Choose your profile to start registration on Movy'}
                </ModalSubtitle>

                {/* Opção Passageiro */}
                <ModalChoiceCard
                  activeOpacity={0.8}
                  onPress={() => handleSelectRegisterChoice(false)}
                >
                  <ModalChoiceIconBox>
                    <FontAwesome5 name="user" size={RFValue(20)} color="#ffffff" />
                  </ModalChoiceIconBox>
                  <ModalChoiceContent>
                    <ModalChoiceTitle>
                      {translate('login.modal_choice_rider_title') || 'I am a rider'}
                    </ModalChoiceTitle>
                    <ModalChoiceDescription>
                      {translate('login.modal_choice_rider_desc') || 'Ride with comfort, safety, and savings anywhere.'}
                    </ModalChoiceDescription>
                  </ModalChoiceContent>
                  <Feather name="chevron-right" size={22} color="#CD2379" />
                </ModalChoiceCard>

                {/* Opção Motorista */}
                <ModalChoiceCard
                  activeOpacity={0.8}
                  onPress={() => handleSelectRegisterChoice(true)}
                >
                  <ModalChoiceIconBox color="#00F0FF">
                    <MaterialCommunityIcons name="car" size={RFValue(24)} color="#070b14" />
                  </ModalChoiceIconBox>
                  <ModalChoiceContent>
                    <ModalChoiceTitle>
                      {translate('login.modal_choice_driver_title') || 'I am a driver'}
                    </ModalChoiceTitle>
                    <ModalChoiceDescription>
                      {translate('login.modal_choice_driver_desc') || 'Drive on your schedule, be your own boss, and boost your earnings.'}
                    </ModalChoiceDescription>
                  </ModalChoiceContent>
                  <Feather name="chevron-right" size={22} color="#00F0FF" />
                </ModalChoiceCard>

                <ModalCloseButton
                  activeOpacity={0.7}
                  onPress={() => setModalChoiceRegister(false)}
                >
                  <ModalCloseButtonText>
                    {translate('home.text_cancel') || 'Cancel'}
                  </ModalCloseButtonText>
                </ModalCloseButton>
              </ModalCard>
            </ModalBackdrop>
          </Modal>

          {/* Modais de Termos e Recuperação de Senha */}
          <TermsOfUseModal
            visible={modalTerms}
            colorText="#ffffff"
            setVisible={setModalTerms}
          />

          <LoginFacebookModal
            visible={modalFacebook}
            closeModal={() => setModalFacebook(false)}
          />

          <If condition={modalForgotPassword}>
            <ModalSwitch
              modalEdit={modalForgotPassword}
              setModalEdit={setModalForgotPassword}
              textButtons={{
                button1: translate('register.client'),
                button2: translate('register.partner'),
              }}
              title={translate('recoveryPassword.title')}
              subtitle={translate('recoveryPassword.subtitle')}
              onClickButton1={() => {
                setModalForgotPassword(false);
                navigation.navigate('RecoveryPassword');
              }}
              onClickButton2={() => {
                setModalForgotPassword(false);
                navigation.navigate('RecoveryPassword', {
                  isDriver: true,
                });
              }}
            />
          </If>
        </BackgroundContainer>
      )}

      {(init === 'Speedmob' || init === 'SpeedMob') && <LoginSpeedmob />}
    </>
  );
}
