import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
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
  const driverWebviewRef = useRef<WebView>(null);
  const clientWebviewRef = useRef<WebView>(null);
  const [reloadSeed, setReloadSeed] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loadWebView) {
      timer = setTimeout(() => {
        setLoadWebView(false);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loadWebView]);

  useEffect(() => {
    setLoadWebView(true);
    const timer = setTimeout(() => {
      setLoadWebView(false);
    }, 800);
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
    const siteUrl = isDriver ? 'motorista' : 'passageiro';
    let base = (buildApp().HOST_SITE || 'https://movymob.com/').trim();
    if (!base.endsWith('/')) {
      base += '/';
    }
    if (base.includes('704apps.com.br') || base.includes('704app.com.br')) {
      base = 'https://movymob.com/';
    }

    if (appPartnerSelected && appPartnerSelected.key) {
      return `${base}${siteUrl}?name_app=${encodeURIComponent(appPartnerSelected.key)}&app=1`;
    }
    return `${base}${siteUrl}?app=1`;
  };

  const handleRedirectLogin = () => {
    navigation.goBack();
  };

  const renderWebViewError = (isDriver: boolean) => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
        backgroundColor: '#f8fafc',
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#1e293b',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Erro ao carregar cadastro
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#64748b',
          textAlign: 'center',
          marginBottom: 20,
          lineHeight: 20,
        }}
      >
        Não foi possível conectar ao servidor de cadastro. Verifique sua conexão e tente novamente.
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setLoadWebView(true);
          setReloadSeed(prev => prev + 1);
          if (isDriver) {
            driverWebviewRef.current?.reload();
          } else {
            clientWebviewRef.current?.reload();
          }
        }}
        style={{
          backgroundColor: theme.colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
          Tentar novamente
        </Text>
      </TouchableOpacity>
    </View>
  );

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
          ref={driverWebviewRef}
          key={`driver-${reloadSeed}`}
          source={{
            uri: urlToRegister(true),
          }}
          style={{ flex: 1 }}
          containerStyle={{ flex: 1 }}
          originWhitelist={['*']}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={false}
          injectedJavaScript={injectJSDriver}
          renderError={() => renderWebViewError(true)}
          onLoadStart={() => setLoadWebView(true)}
          onLoadEnd={() => setLoadWebView(false)}
          onLoad={() => setLoadWebView(false)}
          onError={() => setLoadWebView(false)}
          onHttpError={() => setLoadWebView(false)}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress >= 0.3) {
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
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
          ref={clientWebviewRef}
          key={`client-${reloadSeed}`}
          source={{
            uri: urlToRegister(false),
          }}
          style={{ flex: 1 }}
          containerStyle={{ flex: 1 }}
          originWhitelist={['*']}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={false}
          injectedJavaScript={injectJSClient}
          renderError={() => renderWebViewError(false)}
          onLoadStart={() => setLoadWebView(true)}
          onLoadEnd={() => setLoadWebView(false)}
          onLoad={() => setLoadWebView(false)}
          onError={() => setLoadWebView(false)}
          onHttpError={() => setLoadWebView(false)}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress >= 0.3) {
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
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
