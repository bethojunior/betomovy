import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { HeaderOptions } from '../../components/HeaderOptions';
import { If } from '../../components/If';
import { NavRegister } from '../../components/NavRegister';
import theme from '../../styles/theme';
import { Container } from './styles';
import { translate } from '../../locales';
import { buildApp } from '../../../constantBuild/config';
import { useAuth } from '../../../context/auth';
import Preload from '../../components/Preload';
import { injectDynamic } from './webViewInject';
import { useNavigation } from '@react-navigation/native';
import { useConfigAppPartner } from '../../../context/ConfigAppPartner/useConfigAppPartner';

const injectJSClient = injectDynamic('.passenger-title');

const injectJSDriver = injectDynamic('.driver-title');

export function Register() {
  const { authenticateLogin, setDriverSelected, driverSelected, generalSettings } = useAuth();
  const [loadWebView, setLoadWebView] = useState(false);
  const [userRegistered, setUserRegistered] = useState({
    email: null,
    password: null,
  });

  const [loading, setLoading] = useState(false);
  const { appPartnerSelected } = useConfigAppPartner();

  const navigation = useNavigation();

  const handleAuth = useCallback(async () => {
    try {
      setLoading(true);
      await authenticateLogin({
        email: userRegistered.email,
        password: userRegistered.password,
        setModal: () => { }
      });
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }, [authenticateLogin, userRegistered]);

  const urlToRegister = (isDriver: boolean) => {
    let siteUrl = isDriver ? 'motorista' : 'passageiro';

    if (appPartnerSelected) {
      return `${buildApp().HOST_SITE}${siteUrl}?name_app=${appPartnerSelected.key}`
    }
    return `${buildApp().HOST_SITE}${siteUrl}`;
  };


  const handleRedirectLogin = () => {
    navigation.goBack();
  }

  return (
    <Container>
      <HeaderOptions
        onPress={() => setDriverSelected(!driverSelected)}
        active={driverSelected}
        optionOne={translate('register.client')}
        optionTwo={generalSettings.find(
          item => item?.key === 'text_name_driver_custom',
        )?.value || translate('register.partner')}
      />

      <If condition={driverSelected === true}>
        <NavRegister />
        <WebView
          source={{
            uri: urlToRegister(true),
          }}
          injectedJavaScript={injectJSDriver}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress !== 1 && loadWebView === false) {
              setLoadWebView(true);
            } else if (nativeEvent.progress === 1) {
              setLoadWebView(false);
            }
          }}
          onMessage={async ({ nativeEvent }) => {
            try {
              const parsedData = JSON.parse(nativeEvent.data);
              if (parsedData.type === 'DEBUG_LOG') {
                return;
              }
            } catch (e) {

            }

            if (JSON.parse(nativeEvent.data) === "redirect-login") {
              handleRedirectLogin();
              return;
            }

            if (JSON.parse(nativeEvent.data) === "redirect-login-new-site") {
              Alert.alert(
                translate('login.text_redirect_title'),
                translate('login.text_redirect_description'),
                [{ text: "Ok", onPress: handleRedirectLogin }]
              );
              return;
            }

            if (nativeEvent.data === 'registrationCompletedGoToLogin') {
              await handleAuth();
            } else {
              const data = JSON.parse(nativeEvent.data);
              setUserRegistered(old => ({
                ...old,
                [data.field]: data.value,
              }));
              setDriverSelected(true);
            }
          }}
        />

        {loadWebView && (
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
            style={{
              position: 'absolute',
              left: Platform.OS === 'android' ? 160 : 190,
              top: 400,
            }}
          />
        )}
      </If>

      <If condition={driverSelected === false}>
        <NavRegister
          icon={
            <FontAwesome
              name="drivers-license-o"
              size={24}
              color={theme.colors.primary}
            />
          }
        />
        <WebView
          source={{
            uri: urlToRegister(false),
          }}
          injectedJavaScript={injectJSClient}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress !== 1 && loadWebView === false) {
              setLoadWebView(true);
            } else if (nativeEvent.progress === 1) {
              setLoadWebView(false);
            }
          }}
          onMessage={async ({ nativeEvent }) => {
            try {
              const parsedData = JSON.parse(nativeEvent.data);
              if (parsedData.type === 'DEBUG_LOG') {
                return;
              }
            } catch (e) {

            }

            if (JSON.parse(nativeEvent.data) === "redirect-login") {
              handleRedirectLogin();
              return;
            }

            if (JSON.parse(nativeEvent.data) === "redirect-login-new-site") {
              Alert.alert(
                translate('login.text_redirect_title'),
                translate('login.text_redirect_description'),
                [{ text: "Ok", onPress: handleRedirectLogin }]
              );
              return;
            }

            if (nativeEvent.data === 'registrationCompletedGoToLogin') {
              await handleAuth();
            } else {
              const data = JSON.parse(nativeEvent.data);
              setUserRegistered(old => ({
                ...old,
                [data.field]: data.value,
              }));
            }
          }}
        />

        {loadWebView && (
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
            style={{
              position: 'absolute',
              left: Platform.OS === 'android' ? 160 : 190,
              top: 400,
            }}
          />
        )}


      </If>
      <Preload visible={loading} />
    </Container>
  );
}
