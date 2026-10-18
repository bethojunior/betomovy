import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MOVY_THEME } from './src/theme/colors';
import { LoginScreen } from './src/screens/passenger/LoginScreen';
import { RegisterScreen } from './src/screens/passenger/RegisterScreen';
import { HomeScreen } from './src/screens/passenger/HomeScreen';
import { TripActiveScreen } from './src/screens/passenger/TripActiveScreen';
import { TripChatModal } from './src/screens/passenger/TripChatModal';
import { TripReceiptModal } from './src/screens/passenger/TripReceiptModal';
import { EmergencySosModal } from './src/screens/passenger/EmergencySosModal';
import { CouponsScreen } from './src/screens/passenger/CouponsScreen';
import { ScheduledTripsScreen } from './src/screens/passenger/ScheduledTripsScreen';
import { DriverCockpitScreen } from './src/screens/driver/DriverCockpitScreen';
import { DriverDocumentsScreen } from './src/screens/driver/DriverDocumentsScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>({
    id: 1,
    name: 'Alexandre User',
    email: 'user@movymob.com',
  });
  const [currentScreen, setCurrentScreen] = useState<
    'login' | 'register' | 'home' | 'trip_active' | 'coupons' | 'schedules' | 'driver_docs'
  >('home');
  const [appMode, setAppMode] = useState<'passenger' | 'driver'>('passenger');

  // Modais de Viagem Ativa
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const [activeTrip, setActiveTrip] = useState<any>({
    id: 'TRIP-MIA-9842',
    driverName: 'Carlos Mendez',
    vehicle: 'Toyota Camry 2024 (Silver) • Plate 7XYZ89',
    fare: 24.50,
    pin_code: '4821',
    status: 'driver_en_route',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MOVY_THEME.colors.background} />

      {/* Barra de Navegação Rápida Superior */}
      {currentUser && (
        <View style={styles.topNavigation}>
          <View style={styles.modeSwitchBar}>
            <TouchableOpacity
              style={[styles.modeTab, appMode === 'passenger' && styles.modeTabActive]}
              onPress={() => {
                setAppMode('passenger');
                setCurrentScreen('home');
              }}
            >
              <Text style={[styles.modeTabText, appMode === 'passenger' && styles.modeTabTextActive]}>
                PASSENGER
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, appMode === 'driver' && styles.modeTabActive]}
              onPress={() => {
                setAppMode('driver');
                setCurrentScreen('home');
              }}
            >
              <Text style={[styles.modeTabText, appMode === 'driver' && styles.modeTabTextActive]}>
                DRIVER COCKPIT
              </Text>
            </TouchableOpacity>
          </View>

          {/* Atalhos Rápidos da Barra de Ferramentas */}
          <View style={styles.shortcutsBar}>
            {appMode === 'passenger' ? (
              <>
                <TouchableOpacity
                  style={[styles.shortcutBtn, currentScreen === 'home' && styles.shortcutBtnActive]}
                  onPress={() => setCurrentScreen('home')}
                >
                  <Text style={styles.shortcutText}>🗺️ Map</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.shortcutBtn, currentScreen === 'trip_active' && styles.shortcutBtnActive]}
                  onPress={() => setCurrentScreen('trip_active')}
                >
                  <Text style={styles.shortcutText}>🚘 Live Trip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.shortcutBtn, currentScreen === 'coupons' && styles.shortcutBtnActive]}
                  onPress={() => setCurrentScreen('coupons')}
                >
                  <Text style={styles.shortcutText}>🎟️ Coupons</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.shortcutBtn, currentScreen === 'schedules' && styles.shortcutBtnActive]}
                  onPress={() => setCurrentScreen('schedules')}
                >
                  <Text style={styles.shortcutText}>📅 Reserve</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.shortcutBtn, currentScreen === 'home' && styles.shortcutBtnActive]}
                  onPress={() => setCurrentScreen('home')}
                >
                  <Text style={styles.shortcutText}>⚡ Cockpit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.shortcutBtn, currentScreen === 'driver_docs' && styles.shortcutBtnActive]}
                  onPress={() => setCurrentScreen('driver_docs')}
                >
                  <Text style={styles.shortcutText}>📄 Documents</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}

      {/* Roteamento das Telas */}
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
        currentScreen === 'coupons' ? (
          <CouponsScreen onBack={() => setCurrentScreen('home')} />
        ) : currentScreen === 'schedules' ? (
          <ScheduledTripsScreen onBack={() => setCurrentScreen('home')} />
        ) : currentScreen === 'trip_active' ? (
          <TripActiveScreen
            trip={activeTrip}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenSos={() => setIsSosOpen(true)}
            onTripCompleted={(receipt) => setReceiptData(receipt)}
            onCancelTrip={() => setCurrentScreen('home')}
          />
        ) : (
          <HomeScreen />
        )
      ) : currentScreen === 'driver_docs' ? (
        <DriverDocumentsScreen onBack={() => setCurrentScreen('home')} />
      ) : (
        <DriverCockpitScreen />
      )}

      {/* Modais Globais de Viagem */}
      <TripChatModal
        visible={isChatOpen}
        tripId={activeTrip.id}
        driverName={activeTrip.driverName}
        onClose={() => setIsChatOpen(false)}
      />

      <EmergencySosModal
        visible={isSosOpen}
        tripId={activeTrip.id}
        onClose={() => setIsSosOpen(false)}
      />

      <TripReceiptModal
        visible={!!receiptData}
        receipt={receiptData}
        onClose={() => {
          setReceiptData(null);
          setCurrentScreen('home');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
  },
  topNavigation: {
    backgroundColor: MOVY_THEME.colors.surface,
    borderBottomWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  modeSwitchBar: {
    flexDirection: 'row',
    padding: 6,
    gap: 6,
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
  shortcutsBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom: 6,
    gap: 6,
  },
  shortcutBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#070A1A',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  shortcutBtnActive: {
    borderColor: MOVY_THEME.colors.brandCyan,
    backgroundColor: '#0A132C',
  },
  shortcutText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
});
