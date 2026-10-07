import ClientRoutes from '../client/routes';
import { useAuth } from '../context/auth';
import DriverRoutes from '../driver/src/routes';
import useSplashScreenInitialization from '../hooks/useSplashScreenInitialization';
import Preload from '../components/Preload';

const Routes = () => {
  const { tokenDriver, isDriver } = useAuth();
  const isSplashReady = useSplashScreenInitialization();

  if (!isSplashReady) {
    return <Preload transparent={false} type="brand" visible />;
  }

  return tokenDriver && isDriver ? <DriverRoutes /> : <ClientRoutes />;
};

export default Routes;
