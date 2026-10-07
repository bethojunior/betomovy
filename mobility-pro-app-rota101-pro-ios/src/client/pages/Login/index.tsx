import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import {TextInputMask} from 'react-native-masked-text';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFValue} from 'react-native-responsive-fontsize';
import {Modal} from 'react-native';
import IconGoogle from '../../assets/images/google.svg';
import IconFacebook from '../../assets/images/facebook.svg';
import IconApple from '../../assets/images/apple-logo.svg';
import apiMain from '../../api/apiMain';
import logo from '../../../../assets/logo.png';
import Preload from '../../components/Preload';
import {translate} from '../../locales';
import {SwalAlert} from '../../components/SwalAlert';
import {AppsId} from '../../../context/ConfigGlobal/constants';
import getAppColors from '../../../utils/GetAppColors';
import {
  ButtonRedefinePassword,
  ButtonRedefinePasswordText,
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
  Logo,
  OrSocialText,
  OrSocialTrace,
  TermsOfUseButton,
  TermsOfUseText,
} from './styles';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {schema} from './schema';
import {InputPassword} from '../../components/InputPassword';
import {InputContainer} from '../../components/InputContainer';
import {Accessory} from '../../components/Accessory';
import {customToast} from '../../../utils/FlashMessage';
import {If} from '../../components/If';
import TermsOfUseModal from '../../components/TermsOfUseModal';
import {useAuth} from '../../../context/auth';
import {useModules} from '../../contexts/modules';
import {BackPage} from '../../components/BackPage';
import loginTheme from '../../styles/loginTheme';
import {CheckBox} from '../../components/CheckBox';
import {Fingerprint} from '../../components/Fingerprint';
import {Switch} from '../../components/Switch';
import {TextEdit} from '../../components/TextEdit';
import {LoginFacebookModal} from '../../components/LoginFacebookModal';
import {getDeviceId} from '../../../driver/src/utils/device';
import {ModalSwitch} from '../../../driver/src/components/ModalSwitch';
import LoginSpeedmob from './SpeedMob';
import {useNetwork} from '../../../context/ConfigGlobal';
import {isBeta} from '../../../constantBuild/config';

interface FormData extends TextInputMask {
  email: string;
  password: string;
}

export default function Login({route}: any) {
  const {verifyDelivery, init} = useModules();
  const {betaEnd} = useNetwork();
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
  const [modalTerms, setModalTerms] = useState(false);
  const [idNewLogin, setIdNewLogin] = useState('');
  const [showAlertBeta, setShowAlertBeta] = useState(false);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<any>({
    resolver: yupResolver(schema(translate)),
  });

  const isDriver = () => {
    AsyncStorage.setItem('driver-box', String(!driverSelected));
    setDriverSelected(!driverSelected);
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
        const {email, password} = form;

        await authenticateLogin({
          email,
          password,
        }).finally(() => {
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [signIn, loginDriver, deviceToken],
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

  // useEffect(() => {
  //   loginOnBiometry();
  // }, []);

  const createId = async () => {
    if (idNewLogin) {
      return {
        id: idNewLogin,
        deviceToken: await getDeviceId(),
      };
    }
    const {data} = await apiMain.post('Customer/newSocialLogin');
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
    const {data} = await apiMain.get(`Customer/getSocialLogin?id=${id}`);
    if (!data.status) {
      return customToast(data?.message, 'danger');
    }

    return data;
  };

  const handlePressButtonFacebook = async () => {
    const dataId: any = await createId();
    const browser = await WebBrowser.openAuthSessionAsync(
      `https://10.0.0.18:3000/?id=${dataId.id}&deviceToken=${dataId.deviceToken}`,
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
        return customToast('Sua Solicitação foi cancelada', 'danger');
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
      `https://fce4-2804-248-fbc7-b600-de3f-4da7-a703-c37c.sa.ngrok.io/google?id=${dataId.id}&deviceToken=${dataId.deviceToken}`,
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

        return customToast('Sua Solicitação foi cancelada', 'danger');
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
    getAppColors(Number(AppsId['CLIENTE FINAL']));
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
            <If condition={verifyDelivery}>
              <BackPage onPress={() => navigation.goBack()} text={''} />
            </If>
            <Content>
              <ContentImage>
                <Logo
                  source={
                    loginTheme.images.logo
                      ? {uri: loginTheme.images.logo}
                      : logo
                  }
                  resizeMode="contain"
                />
              </ContentImage>

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

              <If condition>
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
                </If>

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
                    <Accessory onPress={() => {}}>
                      <IconApple height={RFValue(31)} width={RFValue(31)} />
                    </Accessory>
                  </If>
                </ContentSocial>
              </If>

              <ButtonRegister
                activeOpacity={0.5}
                onPress={() => handleSignUp()}
              >
                <ButtonRegisterText>
                  {translate('login.not_account')}
                </ButtonRegisterText>
                <ButtonRegisterTextGrif color={loginTheme.colors.primary}>
                  {translate('login.text_register')}
                </ButtonRegisterTextGrif>
              </ButtonRegister>

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
      {init === 'Speedmob' && <LoginSpeedmob />}
    </>
  );
}
