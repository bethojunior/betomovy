// @ts-nocheck

import {createContext, useCallback, useContext, useMemo, useState} from 'react';

import {FavoritesService} from './services';
import {useAuth} from '../../../context/auth';
import {customToast} from '../../../utils/FlashMessage';
import {translate} from '../../locales';

interface IFavoriteContext {
  favorites: any;
  setFavorites: any;
  removeFavorites: any;
  addFavorites: any;
  findPerCodeDriver: any;
  getFavorites: any;
}

const FavoriteContext = createContext<IFavoriteContext>({} as IFavoriteContext);

export const FavoriteProvider = ({children}: any) => {
  const {user} = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [driver, setDriver] = useState({});

  const getFavorites = useCallback(async () => {
    try {
      const response = await FavoritesService.getFavorites(user.idCustomer);
      setFavorites(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const handleDialogAdd = () => {
    setDriver({});
  };

  const addFavorites = useCallback(
    async (idCustomer = null, idDriver = null) => {
      try {
        const response = await FavoritesService.postFavorite(
          user.idCustomer,
          idDriver || driver.idDriver,
        );
        if (!response.data.status) {
          return customToast(
            translate('favorites.text_invalid_code'),
            'warning',
          );
        }
        getFavorites(idCustomer);
        setDriver({});
        return customToast(
          translate('favorites.toast_alert_sucess'),
          'success',
        );
      } catch (error) {
        return console.log(error);
      }
    },
    [getFavorites, user, driver],
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
    // MA02272P
    try {
      const response = await FavoritesService.findCodeDriver(payload);
      if (!response.data.status) {
        setDriver({});
        return customToast(
          translate('favorites.toast_alert_warning'),
          'warning',
        );
      }
      setDriver(response.data.data);
      return response.data.data;
    } catch (error) {
      return customToast(translate('favorites.toast_alert_warning'), 'warning');
    }
  }, []);

  const removeFavorites = useCallback(
    async idFavorite => {
      try {
        const response = await FavoritesService.deleteFavorite(idFavorite);
        if (!response.data.status) {
          return customToast(
            translate('favorites.text_error_delete'),
            'danger',
          );
        }
        getFavorites(user.idCustomer);
        return customToast(
          translate('favorites.toast_sucess_remove'),
          'success',
        );
      } catch (error) {
        return customToast(translate('favorites.text_error_delete'), 'danger');
      }
    },
    [getFavorites, user],
  );

  const value = useMemo(
    () => ({
      favorites,
      setFavorites,
      getFavorites,
      findPerCodeDriver,
      addFavorites,
      driver,
      handleDialogAdd,
      removeFavorites,
    }),
    [
      favorites,
      setFavorites,
      getFavorites,
      findPerCodeDriver,
      addFavorites,
      driver,
      handleDialogAdd,
      removeFavorites,
    ],
  );

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};
export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  return context;
};
