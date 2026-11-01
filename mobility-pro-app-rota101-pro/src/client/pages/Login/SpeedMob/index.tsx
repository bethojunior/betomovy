import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons/';
import { RFValue } from 'react-native-responsive-fontsize';
import { Modal, View, Keyboard } from 'react-native';
import IconGoogle from '../../../assets/images/google.svg';
import IconFacebook from '../../../assets/images/facebook.svg';
import IconApple from '../../../assets/images/apple-logo.svg';
import apiMain from '../../../api/apiMain';
import logo from '../../../../../assets/logo-on-dark.png';
import Preload from '../../../components/Preload';
import { translate } from '../../../locales';
import {
  ButtonRedefinePassword,
  ButtonRedefinePasswordText,
  ButtonRegister,
  ButtonRegisterText,
  Container,
  ContainerBiometry,
  Content,
  ContentActions,
  ContentButton,
  ContentImage,
  ContentTermsOfUse,
  Logo,
  TermsOfUseButton,
  TermsOfUseText,
  TextTypeApp,
} from './styles';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { schema } from '../schema';
import { InputPassword } from '../../../components/InputPassword';
import { InputContainer } from '../../../components/InputContainer';
import { Accessory } from '../../../components/Accessory';
import { customToast } from '../../../../utils/FlashMessage';
import { If } from '../../../components/If';
import { useAuth } from '../../../../context/auth';
import { useModules } from '../../../contexts/modules';
import { BackPage } from '../../../components/BackPage';
import themeClient from '../../../styles/theme';
import themeDriver from '../../../../driver/src/styles/theme';
import { CheckBox } from '../../../components/CheckBox';
import { OfferFingerprint } from '../../../components/OfferFingerprint';
import { Fingerprint } from '../../../components/Fingerprint';
import { Switch } from '../../../components/Switch';
import { TextEdit } from '../../../components/TextEdit';
import { LoginFacebookModal } from '../../../components/LoginFacebookModal';
import { getDeviceId } from '../../../../driver/src/utils/device';
import apiMainDriver from '../../../../driver/src/api/apiMain';

import { useConfigAppContextSpeedmob } from '../../../../context/ConfigAppSpeedmob';

import { getApiMain } from '../../../api/apiMain.js';
import { SupportTextComponent } from '../../../../components/SupportText';

import * as Location from 'expo-location';

interface DatasAppProps {
  app_type_id: number;
  name: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  logo: string;
}

interface FormData extends TextInputMask {
  email: string;
  password: string;
}

let updateColors = false;

export default function LoginSpeedmob() {
  const { verifyDelivery, modulesActives, init } = useModules();
  const {
    deviceToken,
    signIn,
    loginDriver,
    offerBiometry,
    setSocialLogin,
    setDriverSelected,
    driverSelected,
    generalSettings,
  } = useAuth();

  const [datasAppConfig, setDatasAppConfig] = useState<DatasAppProps>();
  const [datasAllApp, setDatasAllApp] = useState<DatasAppProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [dataNewLogin, setDataNewLogin] = useState({});
  const [idNewLogin, setIdNewLogin] = useState('');
  const [appType, setAppType] = useState<'driver' | 'client'>('client');

  const { setDatasApp } = useConfigAppContextSpeedmob();

  const [lastLogin, setLastLogin] = useState({
    email: '',
    password: '',
  });

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleChangeApp = async () => {
    setLoading(true);
    try {
      if (appType === 'client') {
        await AsyncStorage.setItem('@speedmob:TypeApp', JSON.stringify('driver'));
        setAppType('driver');
        setDriverSelected(true);
      } else {
        await AsyncStorage.setItem('@speedmob:TypeApp', JSON.stringify('client'));
        setAppType('client');
        setDriverSelected(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

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

  const useLoginEndPoint = async (email, password) => {
    const { data } = await apiMain.post('Customer/login', {
      email,
      password,
      deviceToken,
      generateToken: false,
    });

    return data;
  };

  const handleAuth = useCallback(
    async (form: FormData) => {
      setLoading(true);
      try {
        const { email, password } = form;

        if (appType === 'driver') {
          updateColors = true;
          await loginDriver(email, password);
          return;
        }

        updateColors = false;
        const data = await useLoginEndPoint(email, password);
        if (!data.status) {
          customToast(data.message, 'danger');
        } else {
          // @ts-ignore
          signIn(data.data);
          await AsyncStorage.setItem(
            'lastLogin',
            JSON.stringify({
              email,
              password,
            }),
          );
          await AsyncStorage.setItem('account', JSON.stringify(data.data));
        }
      } finally {
        setLoading(false);
      }
    },
    [signIn, loginDriver, deviceToken, driverSelected],
  );

  const handleSignUp = useCallback(() => {
    navigation.navigate('Register');
  }, []);

  const handleRecoveryPassword = useCallback(() => {
    navigation.navigate('RecoveryPasswordSpeedMob');
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
      // @ts-ignore
      setValue('email', user.email);
      setValue('password', user.password);
    }
  };

  useEffect(() => {
    loadingIsDriverSelected();
    verifyLastLogin();
  }, []);

  useEffect(() => {
    getBiometryEnabled();
    handleBiometry();
  }, [enabled, switchEnabled]);

  const verifyIsActive = (key: string) => {
    if (generalSettings) {
      const isActive = generalSettings?.find(item => item.key === key);
      return isActive?.value === '1';
    }
  };

  const loginOnBiometry = async () => {
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

  const setCurrentAppConfig = async (data) => {
    await AsyncStorage.setItem("@speedmob:CurrentAppConfig", JSON.stringify(data));
  }

  useEffect(() => {
    const getTypeApp = async () => {
      try {
        const responseTypeApp = await AsyncStorage.getItem('@speedmob:TypeApp');
        if (responseTypeApp) {
          setAppType(JSON.parse(responseTypeApp));
        }
      } catch (error) {
        console.log(error);
      }
    }

    getTypeApp();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const getConfigApp = async () => {
      try {
        const response = await AsyncStorage.getItem('@speedmob:franchiseApp');
        setDatasAllApp(JSON.parse(response));
      } catch (error) {
        console.log(error);
      }
    }

    getConfigApp();
  }, [appType]);

  useEffect(() => {
    if (datasAllApp && datasAllApp.length > 0) {
      if (appType === 'driver') {
        const dataDriver = datasAllApp.find((data) => data?.app_type_id === 2);
        themeDriver.images.logo = dataDriver?.logo;
        themeDriver.colors.primary = dataDriver?.primary_color;
        themeDriver.colors.background_global = dataDriver?.secondary_color;

        themeClient.images.logo = dataDriver?.logo;
        themeClient.colors.primary = dataDriver?.primary_color;
        themeClient.colors.background_global = dataDriver?.secondary_color;
        setDatasAppConfig(dataDriver);
      } else {
        const dataClient = datasAllApp?.find((data) => data?.app_type_id === 1);
        themeClient.images.logo = dataClient?.logo;
        themeClient.colors.primary = dataClient?.primary_color;
        themeClient.colors.background_global = dataClient?.secondary_color;

        themeDriver.images.logo = dataClient?.logo;
        themeDriver.colors.primary = dataClient?.primary_color;
        themeDriver.colors.background_global = dataClient?.secondary_color;
        setDatasAppConfig(dataClient);
      }
    }
  }, [appType, datasAllApp]);

  useEffect(() => {
    if (datasAppConfig) {
      setCurrentAppConfig(datasAppConfig);
      setDatasApp(datasAppConfig);
    }
  }, [datasAppConfig]);

  useEffect(() => {
    setDriverSelected(false);
    getApiMain();
  }, [])

  useEffect(() => {
    if (appType === 'driver') {
      setDriverSelected(true);
    } else {
      setDriverSelected(false);
    }
  }, [appType])

  return (
    <>
      <Modal visible={switchEnabled} transparent>
        <Fingerprint
          setEnabledBiometry={setEnabled}
          setEnabled={setSwitchEnabled}
          onPress={loginOnBiometry}
        />
      </Modal>
      <Container backgroundColor={themeClient.colors.background_global}>
        <Content>
          <TextTypeApp
            colorText={themeClient.colors.primary}
            onPress={handleChangeApp}
          >
            {appType === 'client' ? translate('login.text_account_type_driver') : translate('login.text_account_type_passenger')}
            <Ionicons name="arrow-forward" size={18} weigth="bold" />
          </TextTypeApp>
          <ContentImage>
            <Logo source={{ uri: themeClient.images.logo }} />
          </ContentImage>

          <InputContainer>
            <Input
              name="email"
              control={control}
              error={errors.email && errors.email.message}
              placeholder={translate('login.text_placeholder_email')}
              keyboardType="email-address"
              icon
            />
          </InputContainer>

          <InputContainer>
            <InputPassword
              name="password"
              control={control}
              placeholder={translate('login.text_placeholder_password')}
              error={errors.password && errors.password.message}
              icon
              onSubmitEditing={handleSubmit(handleAuth)}
            />
          </InputContainer>

          <ContentActions>
            <ButtonRedefinePassword
              activeOpacity={0.8}
              onPress={() => handleRecoveryPassword()}
            >
              <ButtonRedefinePasswordText>
                {translate('recoveryPassword.title')}
              </ButtonRedefinePasswordText>
            </ButtonRedefinePassword>
          </ContentActions>
          <If condition={enabled}>
            <ContentActions>
              <ContainerBiometry>
                <ContentActions>
                  <TextEdit color={themeClient.colors.primary}>
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
            />
          </ContentButton>

          <ContentButton>
            <Button
              title={translate('login.text_register')}
              onPress={handleSignUp}
            />
          </ContentButton>

          <SupportTextComponent />

          <ContentTermsOfUse>
            <TermsOfUseButton
              activeOpacity={0.7}
              onPress={() => navigation.navigate('TermsOfUse', { colorText: themeClient.colors.primary })}
            >
              <TermsOfUseText>
                {translate('myProfile.text_terms_of_use')}
              </TermsOfUseText>
            </TermsOfUseButton>
          </ContentTermsOfUse>
        </Content>
        <Preload visible={loading} />
      </Container>
    </>
  );
}
