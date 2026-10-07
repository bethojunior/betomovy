import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, Text, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { onThemeReady } from '../src/hooks/useAppTheme';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components/native';
import { CustomFlashMessage } from '../src/components/CustomFlashMessage';

// Providers e componentes
import { ModulesProvider } from '../src/client/contexts/modules';
import themeClient from '../src/client/styles/theme';
import { ConfigGlobalProvider } from '../src/context/ConfigGlobal';
import { ConfigAppPartnerProvider } from '../src/context/ConfigAppPartner';
import { AuthProvider } from '../src/context/auth';
import Routes from '../src/routes';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { IfoodModalProvider } from '../src/driver/contexts/IfoodModal';
import { TermsProvider } from '../src/context/terms';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { SocketProvider } from './context/SocketIO';
import { PermissionsProvider } from './utils/permissions/PermissionsProvider';
import { PermissionModal } from './utils/permissions/PermissionModal';
import { translate } from './client/locales';

SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  require('../config/reactotron');

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'new NativeEventEmitter()',
    'SafeAreaView has been deprecated',
  ]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flash: {
    zIndex: 9999, elevation: 9999
  }
});

export default function App() {
  const [safeAreaBgColor, setSafeAreaBgColor] = useState(themeClient.colors.background_global);

  useEffect(() => {
    return onThemeReady(() => setSafeAreaBgColor(themeClient.colors.background_global));
  }, []);

  (Text as any).defaultProps = {
    ...(Text as any).defaultProps,
    allowFontScaling: false,
  };

  (TextInput as any).defaultProps = {
    ...(TextInput as any).defaultProps,
    allowFontScaling: false,
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider theme={themeClient}>
        <SafeAreaView style={[styles.container, { backgroundColor: safeAreaBgColor }]}>
          <Provider>
            <FlashMessage MessageComponent={CustomFlashMessage} position="top" style={styles.flash} floating />
            <StatusBar style="dark" backgroundColor="#000" translucent={false} />
            <ConfigGlobalProvider>
              <NavigationContainer>
                <AuthProvider>
                  <SocketProvider>
                    <ModulesProvider>
                      <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.container}
                      >
                        <PermissionsProvider>
                          <IfoodModalProvider>
                            <TermsProvider>
                              <ConfigAppPartnerProvider>
                                <Routes />
                              </ConfigAppPartnerProvider>
                            </TermsProvider>
                          </IfoodModalProvider>
                          <PermissionModal translate={translate} />
                        </PermissionsProvider>
                      </KeyboardAvoidingView>
                    </ModulesProvider>
                  </SocketProvider>
                </AuthProvider>
              </NavigationContainer>
            </ConfigGlobalProvider>
          </Provider>
        </SafeAreaView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
