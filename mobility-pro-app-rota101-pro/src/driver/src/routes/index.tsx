import { AppProvider } from '../context';
import { AppRoutes } from './app.routes';
import { AppsId } from '../../../context/ConfigGlobal/constants';
import useAppTheme from '../../../hooks/useAppTheme';
import Preload from '../../../client/components/Preload';

const DriverRoutes = () => {
  const { loading: loadingTheme } = useAppTheme(AppsId.DRIVER);

  if (loadingTheme) {
    return <Preload transparent={false} type='brand' visible />;
  }

  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default DriverRoutes;
