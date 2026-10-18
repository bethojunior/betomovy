import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MOVY_THEME } from './src/theme/colors';
import { LoginScreen } from './src/screens/passenger/LoginScreen';
import { RegisterScreen } from './src/screens/passenger/RegisterScreen';
import { HomeScreen } from './src/screens/passenger/HomeScreen';
import { DriverCockpitScreen } from './src/screens/driver/DriverCockpitScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'home'>('login');
  const [appMode, setAppMode] = useState<'passenger' | 'driver'>('passenger');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MOVY_THEME.colors.background} />

      {/* Seletor Rápido de Modo de Aplicativo (Passageiro / Motorista) no Topo */}
      {currentUser && (
        <View style={styles.modeSwitchBar}>
          <TouchableOpacity
            style={[styles.modeTab, appMode === 'passenger' && styles.modeTabActive]}
            onPress={() => setAppMode('passenger')}
          >
            <Text style={[styles.modeTabText, appMode === 'passenger' && styles.modeTabTextActive]}>
              PASSENGER
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, appMode === 'driver' && styles.modeTabActive]}
            onPress={() => setAppMode('driver')}
          >
            <Text style={[styles.modeTabText, appMode === 'driver' && styles.modeTabTextActive]}>
              DRIVER COCKPIT
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Roteamento das Telas Principais */}
      {!currentUser ? (
        currentScreen === 'login' ? (
          <LoginScreen
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setCurrentScreen('home');
            }}
            onNavigateToRegister={() => setCurrentScreen('register')}
          />
        ) : (
          <RegisterScreen
            onRegisterSuccess={(user) => {
              setCurrentUser(user);
              setCurrentScreen('home');
            }}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        )
      ) : appMode === 'passenger' ? (
        <HomeScreen />
      ) : (
        <DriverCockpitScreen />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
  },
  modeSwitchBar: {
    flexDirection: 'row',
    backgroundColor: MOVY_THEME.colors.surface,
    padding: 6,
    borderBottomWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: MOVY_THEME.borderRadius.sm,
  },
  modeTabActive: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
  },
  modeTabText: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modeTabTextActive: {
    color: '#FFF',
  },
});
