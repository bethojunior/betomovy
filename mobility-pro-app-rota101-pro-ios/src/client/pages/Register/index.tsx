import {useCallback, useState} from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import WebView from 'react-native-webview';
import {HeaderOptions} from '../../components/HeaderOptions';
import {If} from '../../components/If';
import {NavRegister} from '../../components/NavRegister';
import theme from '../../styles/theme';
import {Container} from './styles';
import {translate} from '../../locales';
import {buildApp} from '../../../constantBuild/config';
import {useAuth} from '../../../context/auth';
import Preload from '../../components/Preload';

// Injetando no site do cliente, para remover preload e esconder botão de escolher app e adicionar evento de click no botão ok
const injectJSClient = `
  const idPreload = document.getElementById('preload-general');
  idPreload.style.display = 'none';

  const chooseApp = document.getElementById('chooseApp');
  if (chooseApp) {
    chooseApp.style.visibility = "hidden";
  }
  document.getElementById('email').addEventListener('change', function(event) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ field: 'email', value: event.target.value }));
  });
  document.getElementById('password').addEventListener('change', function(event) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ field: 'password', value: event.target.value }));
  });

  function addEventListenerToOkButton() {
    const verifyIconSuccess = document.querySelector('.swal-icon--success');
    const okButton = document.querySelector('.swal-button--confirm');
    if (okButton && verifyIconSuccess) {
      okButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.ReactNativeWebView.postMessage('registrationCompletedGoToLogin');
      });
    } else {
      setTimeout(addEventListenerToOkButton, 500);
    }
  }

  addEventListenerToOkButton();
`;

// Injetando no site do motorista, para remover preload
const injectJSDriver = `
  const idPreload = document.querySelector('ul:before').css('display', 'none');
`;

export function Register() {
  const {authenticateLogin, setDriverSelected, driverSelected} = useAuth();
  const [loadWebView, setLoadWebView] = useState(false);
  const [userRegistered, setUserRegistered] = useState({
    email: null,
    password: null,
  });
  const [loading, setLoading] = useState(false);

  const handleAuth = useCallback(async () => {
    try {
      setLoading(true);
      await authenticateLogin(userRegistered);
    } catch (error) {
      console.error('Erro durante a autenticação:', error);
    } finally {
      setLoading(false);
    }
  }, [authenticateLogin, userRegistered]);

  return (
    <Container>
      <HeaderOptions
        onPress={() => setDriverSelected(!driverSelected)}
        active={driverSelected}
        optionOne={translate('register.client')}
        optionTwo={translate('register.partner')}
      />

      <If condition={driverSelected === true}>
        <NavRegister />
        <WebView
          source={{
            uri: `${buildApp().HOST_SITE}driver/signup`,
          }}
          injectedJavaScript={injectJSDriver}
          onLoadProgress={({nativeEvent}) => {
            if (nativeEvent.progress !== 1 && loadWebView === false) {
              setLoadWebView(true);
            } else if (nativeEvent.progress === 1) {
              setLoadWebView(false);
            }
          }}
          onMessage={async ({nativeEvent}) => {
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
            uri: `${buildApp().HOST_SITE}cliente/preregister`,
          }}
          injectedJavaScript={injectJSClient}
          onLoadProgress={({nativeEvent}) => {
            if (nativeEvent.progress !== 1 && loadWebView === false) {
              setLoadWebView(true);
            } else if (nativeEvent.progress === 1) {
              setLoadWebView(false);
            }
          }}
          onMessage={async ({nativeEvent}) => {
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

        {/* <DataUserSignUp
          route={{
            params: {
              numberPhone: '',
            },
          }}
        /> */}
      </If>
      <Preload visible={loading} />
    </Container>
  );
}
