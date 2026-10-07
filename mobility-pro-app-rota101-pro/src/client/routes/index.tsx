import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../context/auth';
import { Fingerprint } from '../components/Fingerprint';
import { AppRoutes } from './app.routes';
import AuthRoutes from './auth.routes';
import GuestRoutes from './guest.routes';
import Preload from '../components/Preload';
import { useClientRoutes } from '../../hooks/useClientRoutes';

const { Navigator, Screen } = createStackNavigator();

const ClientRoutes = () => {
  const { requestFingerprint } = useAuth();
  const { isGuest, isUserSigned, isLoadingResources, initialAppRoute } =
    useClientRoutes();

  if (isLoadingResources) {
    return <Preload transparent={false} type="brand" visible />;
  }

  if (requestFingerprint) {
    return (
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Fingerprint" component={Fingerprint} />
      </Navigator>
    );
  }

  if (requestFingerprint) {
    return <Fingerprint />;
  }

  if (isGuest) {
    return <GuestRoutes />;
  }

  if (isUserSigned) {
    return <AppRoutes initialRoute={initialAppRoute} />;
  } else {
    return <AuthRoutes />;
  }
};

export default ClientRoutes;
