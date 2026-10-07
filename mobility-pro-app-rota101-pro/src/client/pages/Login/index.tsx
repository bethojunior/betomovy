import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { TextInputMask } from 'react-native-masked-text';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { InteractionManager, Modal, Text } from 'react-native';
import IconGoogle from '../../assets/images/google.svg';
import IconFacebook from '../../assets/images/facebook.svg';
import IconApple from '../../assets/images/apple-logo.svg';
import logo from '../../../../assets/logo.png';
import { translate } from '../../locales';
import { SwalAlert } from '../../components/SwalAlert';
import {
  ButtonRedefinePassword,
  ButtonRedefinePasswordText,
  BtnBackAppPartners,
  ButtonRegister,
  ButtonRegisterText,
  ButtonRegisterTextGrif,
  Container,
  ContainerBiometry,
  ContentActions,
  ContentButton,
  ContentImage,
  ContentOrSocial,
  ContentRegister,
  ContentSocial,
  ContentTermsOfUse,
  Logo,
  OrSocialText,
  OrSocialTrace,
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
import { buildApp, isBeta, USE_DARK_PRIMARY_VARIANT } from '../../../constantBuild/config';
import { ModalAlert } from '../../../common/ModalAlert';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';
import { SupportTextComponent } from '../../../components/SupportText';
import { getAutoLoginCredentials } from '../../../common/services/ia/loginAutoFill';
import { Button } from '../../components/Button';
import apiMain from '../../api/apiMain';
import Constants from 'expo-constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import theme from '~/client/styles/theme';
import { useConfigAppPartner } from '../../../context/ConfigAppPartner/useConfigAppPartner';

interface FormData extends TextInputMask {
  email: string;
  password: string;
}

export default function Login() {
  const { verifyDelivery, init } = useModules();
  const { betaEnd } = useNetwork();
  const appVersion = Constants.expoConfig?.version || '';
  const {
    deviceToken,
    signIn,
    loginDriver,
    setSocialLogin,
    setDriverSelected,
    driverSelected,
    generalSettings,
    authenticateLogin,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalForgotPassword, setModalForgotPassword] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [modalFacebook, setModalFacebook] = useState(false);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [idNewLogin, setIdNewLogin] = useState('');
  const [showAlertBeta, setShowAlertBeta] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalAlertIa, setModalAlertIa] = useState(false);
  const { getStoragePictureSpecific } = useStoragePictures();
  const { APP_PARTNER, IS_APP_DEMO } = buildApp();
  const { appPartnerSelected } = useConfigAppPartner();
  const isFocused = useIsFocused();

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
    setDriverSelected(!driverSelected);
    AsyncStorage.setItem('driver-box', String(!driverSelected));
  };

  const loadingIsDriverSelected = async () => {
    const driver = await AsyncStorage.getItem('driver-box');
    if (driver === 'true') {
      setDriverSelected(true);
    }
  };

  const handleAuth = useCallback(
    async (form: FormData) => {
      try {
        if (betaEnd && isBeta) {
          setShowAlertBeta(true);
          return;
        }

        setLoading(true);
        try {
          const { email, password } = form;

          await authenticateLogin({
            email,
            password,
            keyAppPartner: appPartnerSelected?.key ?? undefined,
          });
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [betaEnd, isBeta, authenticateLogin, translate, appPartnerSelected],
  );

  const handleSignUp = useCallback(() => {
    navigation.navigate('Register');
  }, []);

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

  const getConfigValue = (key: string): string => {
    if (generalSettings) {
      const config = generalSettings?.find(item => item.key === key);
      return config?.value || '';
    }
    return '';
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


  const verifyLoginOnAppPassenger = async () => {
    const credentials = await getAutoLoginCredentials();

    if (credentials) {
      setValue('email', credentials.email);
      setValue('password', credentials.password);

      setModalAlertIa(true);
    } else {
      setModalAlertIa(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      verifyLoginOnAppPassenger();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

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
    // url geredata pelo grok
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

  const loginColor = useMemo(() => {
    const useSecondary = USE_DARK_PRIMARY_VARIANT === true;

    return useSecondary
      ? loginTheme.colors.secondary
      : loginTheme.colors.primary;
  }, [loginTheme.colors.primary, loginTheme.colors.secondary]);

  useEffect(() => {
    handleResetFieldsInputs()
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
      {init !== 'Speedmob' && (
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
          <Container>
            <If condition={APP_PARTNER}>
              <BtnBackAppPartners onPress={handleRedirectSelectAppPartner}>
                <AntDesign
                  name="arrow-left"
                  size={24}
                  color={theme.colors.primary}
                />
                <TextBackAppPartners>
                  {translate("login.text_button_redirect_app_partner")}
                </TextBackAppPartners>
              </BtnBackAppPartners>
            </If>

            <If condition={verifyDelivery}>
              <BackPage onPress={() => navigation.goBack()} text={''} />
            </If>
            <ContentImage>
              <Logo
                source={
                  getStoragePictureSpecific('logo') && !IS_APP_DEMO
                    ? { uri: getStoragePictureSpecific('logo') }
                    : logo
                }
                resizeMode="contain"
              />
            </ContentImage>

            <InputContainer
              color={loginColor}
              label={translate('login.label_email')}
            >
              <Input
                name="email"
                color={loginColor}
                control={control}
                error={errors.email && (errors.email.message as string)}
                placeholder={translate('login.text_placeholder_email')}
                keyboardType="email-address"
                icon
                autoComplete="email"
              />
            </InputContainer>

            <InputContainer
              color={loginColor}
              label={translate('login.label_password')}
            >
              <InputPassword
                name="password"
                color={loginColor}
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
                  titleSize="small"
                  colorText={loginColor}
                  title={getConfigValue('text_checkbox_select_app') || translate('register.im_partner')}
                  checked={driverSelected}
                  onCheck={isDriver}
                />
              </If>

              <ButtonRedefinePassword
                activeOpacity={0.8}
                onPress={handleRecoveryPassword}
              >
                <ButtonRedefinePasswordText numberOfLines={1} color={loginColor}>
                  {translate('recoveryPassword.title')}
                </ButtonRedefinePasswordText>
              </ButtonRedefinePassword>
            </ContentActions>
            <If condition={enabled && !driverSelected}>
              <ContentActions>
                <ContainerBiometry>
                  <ContentActions>
                    <TextEdit color={loginColor}>
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
                title={translate('login.text_login')}
                onPress={handleSubmit(handleAuth)}
                loading={loading}
              />
            </ContentButton>

            <ButtonRegister
              activeOpacity={0.5}
              onPress={() => handleSignUp()}
            >
              <ContentRegister>
                <ButtonRegisterText>
                  {translate('login.not_account')}
                </ButtonRegisterText>
                <ButtonRegisterTextGrif color={loginTheme.colors.primary}>
                  {translate('login.text_register')}
                </ButtonRegisterTextGrif>
              </ContentRegister>
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
                <If condition={verifyIsActive('enable_apple_login')}>
                  <Accessory onPress={() => { }}>
                    <IconApple height={RFValue(31)} width={RFValue(31)} />
                  </Accessory>
                </If>
              </ContentSocial>
            </If>

            <SupportTextComponent />

            <ContentTermsOfUse>
              <TermsOfUseButton
                onPress={() => navigation.navigate('TermsOfUse')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <TermsOfUseText>
                  {translate('myProfile.text_terms_of_use')}
                </TermsOfUseText>
              </TermsOfUseButton>
            </ContentTermsOfUse>

            <Text style={{ textAlign: 'center', color: loginTheme.colors.primary, fontSize: 12, marginTop: 10 }}>
              {translate('commom.version')}: {appVersion}
            </Text>
          </Container>
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

      <ModalAlert
        handleSubmissModal={() => setModalAlertIa(false)}
        title={translate('login.welcome_back_title')}
        body={translate('login.welcome_back_description')}
        visibleModal={modalAlertIa}
        height={'auto'}
      />

      {init === 'Speedmob' && <LoginSpeedmob />}
    </>
  );
}
