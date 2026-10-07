import {View, ActivityIndicator} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRoutes} from './app.routes';
import AuthRoutes from './auth.routes';
import GuestRoutes from './guest.routes';
import {Fingerprint} from '../components/Fingerprint';
import theme from '../styles/theme';
import {useAuth} from '../../context/auth';
import {useModules} from '../contexts/modules';
import DriverSearch from '../components/DriverSearch';
import {useEffect} from 'react';

const {Navigator, Screen} = createStackNavigator();

const ClientRoutes = () => {
  const {signed, isGuest, loading, requestFingerprint} = useAuth();
  const {init} = useModules();

  if (requestFingerprint) {
    return (
      <>
        <Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Screen name="Fingerprint" component={Fingerprint} />
        </Navigator>
      </>
    );
  }

  if (loading && init === '') {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isGuest) return <GuestRoutes />;

  return requestFingerprint ? (
    <Fingerprint />
  ) : signed && init !== '' ? (
    <AppRoutes />
  ) : (
    <AuthRoutes />
  );
};

export default ClientRoutes;
