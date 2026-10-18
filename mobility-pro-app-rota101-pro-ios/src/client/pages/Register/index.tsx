import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loadWebView) {
      timer = setTimeout(() => {
        setLoadWebView(false);
      }, 3500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loadWebView]);

  useEffect(() => {
    setLoadWebView(true);
    const timer = setTimeout(() => {
      setLoadWebView(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [driverSelected]);

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
      return `${buildApp().HOST_SITE}${siteUrl}?name_app=${appPartnerSelected.key}&app=1`;
    }
    return `${buildApp().HOST_SITE}${siteUrl}?app=1`;
  };

  const handleRedirectLogin = () => {
    navigation.goBack();
  };

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
          domStorageEnabled={true}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={false}
          injectedJavaScriptBeforeContentLoaded={injectJSDriver}
          injectedJavaScript={injectJSDriver}
          onLoadStart={() => setLoadWebView(true)}
          onLoadEnd={() => setLoadWebView(false)}
          onLoad={() => setLoadWebView(false)}
          onError={() => setLoadWebView(false)}
          onHttpError={() => setLoadWebView(false)}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress >= 0.85) {
              setLoadWebView(false);
            }
          }}
          onMessage={async ({ nativeEvent }) => {
            try {
              const parsedData = JSON.parse(nativeEvent.data);
              if (parsedData?.type === 'PAGE_LOADED' || parsedData?.type === 'LOADED') {
                setLoadWebView(false);
                return;
              }
              if (parsedData?.type === 'DEBUG_LOG') {
                return;
              }
              if (parsedData === "redirect-login") {
                handleRedirectLogin();
                return;
              }
              if (parsedData === "redirect-login-new-site") {
                Alert.alert(
                  translate('login.text_redirect_title'),
                  translate('login.text_redirect_description'),
                  [{ text: "Ok", onPress: handleRedirectLogin }]
                );
                return;
              }
            } catch (e) {}

            if (nativeEvent.data === 'registrationCompletedGoToLogin') {
              await handleAuth();
            } else {
              try {
                const data = JSON.parse(nativeEvent.data);
                if (data?.field) {
                  setUserRegistered(old => ({
                    ...old,
                    [data.field]: data.value,
                  }));
                  setDriverSelected(true);
                }
              } catch (e) {}
            }
          }}
        />

        {loadWebView && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 50,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              zIndex: 99,
            }}
          >
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </View>
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
          domStorageEnabled={true}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={false}
          injectedJavaScriptBeforeContentLoaded={injectJSClient}
          injectedJavaScript={injectJSClient}
          onLoadStart={() => setLoadWebView(true)}
          onLoadEnd={() => setLoadWebView(false)}
          onLoad={() => setLoadWebView(false)}
          onError={() => setLoadWebView(false)}
          onHttpError={() => setLoadWebView(false)}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress >= 0.85) {
              setLoadWebView(false);
            }
          }}
          onMessage={async ({ nativeEvent }) => {
            try {
              const parsedData = JSON.parse(nativeEvent.data);
              if (parsedData?.type === 'PAGE_LOADED' || parsedData?.type === 'LOADED') {
                setLoadWebView(false);
                return;
              }
              if (parsedData?.type === 'DEBUG_LOG') {
                return;
              }
              if (parsedData === "redirect-login") {
                handleRedirectLogin();
                return;
              }
              if (parsedData === "redirect-login-new-site") {
                Alert.alert(
                  translate('login.text_redirect_title'),
                  translate('login.text_redirect_description'),
                  [{ text: "Ok", onPress: handleRedirectLogin }]
                );
                return;
              }
            } catch (e) {}

            if (nativeEvent.data === 'registrationCompletedGoToLogin') {
              await handleAuth();
            } else {
              try {
                const data = JSON.parse(nativeEvent.data);
                if (data?.field) {
                  setUserRegistered(old => ({
                    ...old,
                    [data.field]: data.value,
                  }));
                }
              } catch (e) {}
            }
          }}
        />

        {loadWebView && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 50,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              zIndex: 99,
            }}
          >
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </View>
        )}
      </If>
      <Preload visible={loading} />
    </Container>
  );
}
