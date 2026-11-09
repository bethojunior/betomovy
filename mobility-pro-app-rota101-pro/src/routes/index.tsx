import ClientRoutes from '../client/routes';
import { useAuth } from '../context/auth';
import DriverRoutes from '../driver/src/routes';
import useSplashScreenInitialization from '../hooks/useSplashScreenInitialization';

const Routes = () => {
  const { tokenDriver, isDriver } = useAuth();
  const isSplashReady = useSplashScreenInitialization();

  if (!isSplashReady) {
    return null;
  }

  return tokenDriver && isDriver ? <DriverRoutes /> : <ClientRoutes />;
};

export default Routes;
