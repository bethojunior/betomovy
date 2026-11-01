import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { TextInputMask } from 'react-native-masked-text';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { Modal } from 'react-native';
import IconGoogle from '../../assets/images/google.svg';
import IconFacebook from '../../assets/images/facebook.svg';
import IconApple from '../../assets/images/apple-logo.svg';
import logo from '../../../../assets/logo-on-dark.png';
import Preload from '../../components/Preload';
import { translate } from '../../locales';
import { SwalAlert } from '../../components/SwalAlert';
import { AppsId } from '../../../context/ConfigGlobal/constants';
import getAppColors from '../../../utils/GetAppColors';
import {
  BackgroundImage,
  ButtonRedefinePassword,
  ButtonRedefinePasswordText,
  BtnBackAppPartners,
  ButtonRegister,
  ButtonRegisterText,
  ButtonRegisterTextGrif,
  Container,
  ContainerBiometry,
  Content,
  ContentActions,
  ContentButton,
  ContentImage,
  ContentOrSocial,
  ContentSocial,
  ContentTermsOfUse,
  LoginCard,
  Logo,
  OrSocialText,
  OrSocialTrace,
  Overlay,
  TextBackAppPartners,
  TermsOfUseButton,
  TermsOfUseText,
} from './styles';
import { Input } from '../../components/Input';
import { schema } from './schema';
import { InputPassword } from '../../components/InputPassword';
import { InputContainer } from '../../components/InputContainer';
import { Accessory } from '../../components/Accessory';
import { customToast } from '../../../utils/FlashMessage';
import { If } from '../../components/If';
import TermsOfUseModal from '../../components/TermsOfUseModal';
import { useAuth } from '../../../context/auth';
import { useModules } from '../../contexts/modules';
import { BackPage } from '../../components/BackPage';
import loginTheme from '../../styles/loginTheme';
import { CheckBox } from '../../components/CheckBox';
import { Fingerprint } from '../../components/Fingerprint';
import { Switch } from '../../components/Switch';
import { TextEdit } from '../../components/TextEdit';
import { LoginFacebookModal } from '../../components/LoginFacebookModal';
import { getDeviceId } from '../../../driver/src/utils/device';
import { ModalSwitch } from '../../../driver/src/components/ModalSwitch';
import LoginSpeedmob from './SpeedMob';
import { useNetwork } from '../../../context/ConfigGlobal';
import { buildApp, isBeta } from '../../../constantBuild/config';
import { Button } from '../../components/Button';
import apiMain from '../../api/apiMain';
import AntDesign from '@expo/vector-icons/AntDesign';
import theme from '../../styles/theme';
import { useConfigAppPartner } from '../../../context/ConfigAppPartner/useConfigAppPartner';

interface FormData extends TextInputMask {
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
  const [enabled, setEnabled] = useState(false);
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
    reset: handleResetFieldsInputs,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema(translate)),
  });

  const isDriver = () => {
    const nextDriverState = !driverSelected;
    AsyncStorage.setItem('driver-box', String(nextDriverState));
    setDriverSelected(nextDriverState);
    if (nextDriverState) {
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

  const handleSignUp = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleRecoveryPassword = useCallback(() => {
    setModalForgotPassword(true);
  }, []);

  const getBiometryEnabled = async () => {
    const biometry = await AsyncStorage.getItem('biometry_enabled');
    if (biometry) {
      return setEnabled(true);
    }
    return setEnabled(false);
  };

  const handleBiometry = async () => {
    const biometrySwitch = await AsyncStorage.getItem('biometry_switch');
    if (biometrySwitch) {
      return setSwitchEnabled(true);
    }
    return setSwitchEnabled(false);
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

  const loginOnBiometry = async () => {
    if (isBeta && betaEnd) {
      setShowAlertBeta(true);
      return;
    }
    const account = await AsyncStorage.getItem('account');
    if (account) {
      const user = JSON.parse(account);
      // @ts-ignore
      signIn(user);
    }
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
    const dataId: any = await createId();
    const browser = await WebBrowser.openAuthSessionAsync(
      `https://login-social.prod.704apps.com.br?id=${dataId.id}&deviceToken=${dataId.deviceToken}`,
      null,
      {
        toolbarColor: loginTheme.colors.primary,
      },
    );

    if (browser.type === 'cancel' || browser.type === 'dismiss') {
      const response: any = await getIdApi(dataId.id);
      if (!response.status) {
        return customToast(response?.message, 'danger');
      }
      if (!response?.data) {
        return customToast(translate('toast.text_request_canceled'), 'danger');
      }
      const deviceId = await getDeviceId();
      const payloadParse = JSON.parse(response?.data?.content);
      setSocialLogin({
        email: payloadParse?.email,
        name: payloadParse?.name,
        deviceToken: deviceId,
        nickname: payloadParse?.nickname,
        phone: payloadParse?.phone || '',
      });
    }
  };

  const handlePressButtonGoogle = async () => {
    const dataId: any = await createId();
    const browser = await WebBrowser.openAuthSessionAsync(
      `https://login-social.prod.704apps.com.br/google?id=${dataId.id}&deviceToken=${dataId.deviceToken}`,
      null,
      {
        toolbarColor: loginTheme.colors.primary,
      },
    );

    if (browser.type === 'cancel' || browser.type === 'dismiss') {
      setLoading(true);
      const response: any = await getIdApi(dataId.id);
      if (!response.status) {
        setLoading(false);

        return customToast(response?.message, 'danger');
      }
      if (!response?.data?.content) {
        setLoading(false);

        return customToast(translate('toast.text_request_canceled'), 'danger');
      }
      const deviceId = await getDeviceId();
      const payloadParse = JSON.parse(response?.data?.content);
      setLoading(false);
      setSocialLogin({
        email: payloadParse?.email,
        name: payloadParse?.name,
        deviceToken: deviceId,
        nickname: payloadParse?.nickname,
        phone: payloadParse?.phone || '',
      });
    }
  };

  useEffect(() => {
    handleResetFieldsInputs();
  }, [appPartnerSelected]);

  useEffect(() => {
    loadingIsDriverSelected();
    verifyLastLogin();
  }, []);

  useEffect(() => {
    getBiometryEnabled();
    handleBiometry();
  }, [enabled, switchEnabled]);

  return (
    <>
      {init !== 'Speedmob' && init !== 'SpeedMob' && (
        <>
          <Modal visible={switchEnabled} transparent>
            <Fingerprint
              setEnabledBiometry={setEnabled}
              setEnabled={setSwitchEnabled}
              onPress={loginOnBiometry}
            />
          </Modal>

          <SwalAlert
            title={translate('trip.title_change_route')}
            description={translate('configPage.beta_version_body')}
            visible={showAlertBeta}
            setVisible={setShowAlertBeta}
          />
          <BackgroundImage>
            <Overlay />
            <Container>
              <If condition={APP_PARTNER}>
                <BtnBackAppPartners onPress={handleRedirectSelectAppPartner}>
                  <AntDesign
                    name="arrow-left"
                    size={24}
                    color="#ffffff"
                  />
                  <TextBackAppPartners>
                    {translate('login.text_button_redirect_app_partner')}
                  </TextBackAppPartners>
                </BtnBackAppPartners>
              </If>

              <If condition={verifyDelivery}>
                <BackPage onPress={() => navigation.goBack()} text={''} />
              </If>

              <Content>
                <ContentImage>
                  <Logo
                    source={
                      loginTheme.images.logo
                        ? { uri: loginTheme.images.logo }
                        : logo
                    }
                    resizeMode="contain"
                  />
                </ContentImage>

                <LoginCard>
                  <InputContainer
                    color={loginTheme.colors.primary}
                    label={translate('login.label_email')}
                  >
                    <Input
                      name="email"
                      color={loginTheme.colors.primary}
                      control={control}
                      error={errors.email && (errors.email.message as string)}
                      placeholder={translate('login.text_placeholder_email')}
                      keyboardType="email-address"
                      icon
                      autoComplete="email"
                    />
                  </InputContainer>

                  <InputContainer
                    color={loginTheme.colors.primary}
                    label={translate('login.label_password')}
                  >
                    <InputPassword
                      name="password"
                      color={loginTheme.colors.primary}
                      control={control}
                      placeholder={translate('login.text_placeholder_password')}
                      error={errors.password && (errors.password.message as string)}
                      icon
                      onSubmitEditing={handleSubmit(handleAuth)}
                    />
                  </InputContainer>

                  <ContentActions>
                    <If condition={!verifyIsActive('enable_im_partner')}>
                      <CheckBox
                        colorText={loginTheme.colors.primary}
                        title={translate('register.im_partner')}
                        checked={driverSelected}
                        onCheck={isDriver}
                      />
                    </If>

                    <ButtonRedefinePassword
                      activeOpacity={0.8}
                      onPress={handleRecoveryPassword}
                    >
                      <ButtonRedefinePasswordText color={loginTheme.colors.primary}>
                        {translate('recoveryPassword.title')}
                      </ButtonRedefinePasswordText>
                    </ButtonRedefinePassword>
                  </ContentActions>

                  <If condition={enabled && !driverSelected}>
                    <ContentActions>
                      <ContainerBiometry>
                        <ContentActions>
                          <TextEdit color={loginTheme.colors.primary}>
                            {translate('myProfile.biometry')}
                          </TextEdit>
                          <Switch
                            enabled={switchEnabled}
                            value={switchEnabled}
                            onValueChange={async check => {
                              if (check) {
                                await AsyncStorage.setItem(
                                  'biometry_switch',
                                  String(switchEnabled),
                                );
                              }

                              setSwitchEnabled(!switchEnabled);
                            }}
                          />
                        </ContentActions>
                      </ContainerBiometry>
                    </ContentActions>
                  </If>

                  <ContentButton>
                    <Button
                      colorText={loginTheme.colors.primaryText}
                      color={loginTheme.colors.primary}
                      title={translate('login.text_login')}
                      onPress={handleSubmit(handleAuth)}
                    />
                  </ContentButton>
                </LoginCard>

                <ButtonRegister
                  activeOpacity={0.7}
                  onPress={() => handleSignUp()}
                >
                  <ButtonRegisterText>
                    {translate('login.not_account')}
                  </ButtonRegisterText>
                  <ButtonRegisterTextGrif color="#ff2d75">
                    {translate('login.text_register')}
                  </ButtonRegisterTextGrif>
                </ButtonRegister>

                <If
                  condition={
                    verifyIsActive('enable_google_login') ||
                    verifyIsActive('enable_facebook_login') ||
                    verifyIsActive('enable_apple_login')
                  }
                >
                  <ContentOrSocial>
                    <OrSocialTrace />
                    <OrSocialText>
                      {''} {translate('login.init_ssesion_social')} {''}
                    </OrSocialText>
                    <OrSocialTrace />
                  </ContentOrSocial>

                  <ContentSocial>
                    <If condition={verifyIsActive('enable_google_login')}>
                      <Accessory onPress={() => handlePressButtonGoogle()}>
                        <IconGoogle height={RFValue(31)} width={RFValue(31)} />
                      </Accessory>
                    </If>
                    <If condition={verifyIsActive('enable_facebook_login')}>
                      <Accessory onPress={() => handlePressButtonFacebook()}>
                        <IconFacebook height={RFValue(31)} width={RFValue(31)} />
                      </Accessory>
                    </If>
                    <If condition={false && verifyIsActive('enable_apple_login')}>
                      <Accessory onPress={() => { }}>
                        <IconApple height={RFValue(31)} width={RFValue(31)} />
                      </Accessory>
                    </If>
                  </ContentSocial>
                </If>

                <ContentTermsOfUse>
                  <TermsOfUseButton
                    activeOpacity={0.7}
                    onPress={() => setModalTerms(true)}
                  >
                    <TermsOfUseText>
                      {translate('myProfile.text_terms_of_use')}
                    </TermsOfUseText>
                  </TermsOfUseButton>
                </ContentTermsOfUse>
              </Content>

              <Preload visible={loading} />
            </Container>
          </BackgroundImage>

          <TermsOfUseModal
            visible={modalTerms}
            colorText={loginTheme.colors.primary}
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
        </>
      )}

      {(init === 'Speedmob' || init === 'SpeedMob') && <LoginSpeedmob />}
    </>
  );
}
