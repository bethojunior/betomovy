import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

import { FavoritesService } from './services';
import { useAuth } from '../../../context/auth';
import { customToast } from '../../../utils/FlashMessage';
import { translate } from '../../locales';
import { FavoriteDrivers } from '~/interfaces/favorite';

interface IFavoriteContext {
  favorites: FavoriteDrivers[];
  setFavorites: Dispatch<SetStateAction<FavoriteDrivers[]>>;
  removeFavorites: (idFavorite: string) => Promise<any>;
  addFavorites: (idCustomer?: string | null, idDriver?: number | null) => Promise<any>;
  findPerCodeDriver: (codeDriver: string) => Promise<any>;
  getFavorites: (idCustomer?: string) => Promise<void>;
  driver: any;
  handleDialogAdd: () => void;
}

const FavoriteContext = createContext<IFavoriteContext>({} as IFavoriteContext);

export const FavoriteProvider = ({ children }: any) => {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<FavoriteDrivers[]>([]);
  const [driver, setDriver] = useState<any>({});

  const getFavorites = useCallback(
    async (idCustomer?: string) => {
      const userId = idCustomer || user.idCustomer;

      try {
        const response = await FavoritesService.getFavorites(userId);
        setFavorites(response.data.data);
      } catch (error) {
        console.log(error);
      }
    },
    [user.idCustomer],
  );

  const handleDialogAdd = () => {
    setDriver({});
  };

  const addFavorites = useCallback(
    async (idCustomer = null, idDriver = null) => {
      const userId = idCustomer || user.idCustomer;
      const driverId = idDriver || driver.idDriver;

      try {
        const response = await FavoritesService.postFavorite(userId, driverId);
        if (!response.data.status) {
          return customToast(response.data.message || translate('favorites.text_error_add'), 'warning');
        }
        getFavorites(idCustomer);
        setDriver({});
        return customToast(translate('favorites.toast_alert_sucess'), 'success');
      } catch (error) {
        return customToast(translate('favorites.text_error_add'), 'danger');
      }
    },
    [getFavorites, user?.idCustomer, driver?.idDriver],
  );

  const findPerCodeDriver = useCallback(async (codeDriver: string) => {
    const replace = codeDriver.replace(/[^0-9]/g, '');

    const payload = {
      stdObject: [
        {
          driverId: replace,
        },
      ],
    };

    try {
      const response = await FavoritesService.findCodeDriver(payload);
      if (!response.data.status) {
        setDriver({});
        return customToast(translate('favorites.toast_alert_warning'), 'warning');
      }
      setDriver(response.data.data);
      return response.data.data;
    } catch (error) {
      return customToast(translate('favorites.toast_alert_warning'), 'warning');
    }
  }, []);

  const removeFavorites = useCallback(
    async (idFavorite: string) => {
      try {
        const response = await FavoritesService.deleteFavorite(idFavorite);
        if (!response.data.status) {
          return customToast(translate('favorites.text_error_delete'), 'danger');
        }
        getFavorites(user.idCustomer);
        return customToast(translate('favorites.toast_sucess_remove'), 'success');
      } catch (error) {
        return customToast(translate('favorites.text_error_delete'), 'danger');
      }
    },
    [getFavorites, user?.idCustomer],
  );

  const value = {
    favorites,
    setFavorites,
    getFavorites,
    findPerCodeDriver,
    addFavorites,
    driver,
    handleDialogAdd,
    removeFavorites,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  return context;
};
