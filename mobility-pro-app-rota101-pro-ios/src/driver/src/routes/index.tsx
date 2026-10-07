import {AppProvider} from '../context';
import {AppRoutes} from './app.routes';

const DriverRoutes = () => {
  return (
    <>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </>
  );
};

export default DriverRoutes;
