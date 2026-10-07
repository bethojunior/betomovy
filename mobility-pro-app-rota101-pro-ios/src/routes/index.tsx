import ClientRoutes from '../client/routes';
import {useAuth} from '../context/auth';
import DriverRoutes from '../driver/src/routes';

const Routes = () => {
  const {tokenDriver, isDriver} = useAuth();

  return tokenDriver && isDriver ? <DriverRoutes /> : <ClientRoutes />;
};

export default Routes;