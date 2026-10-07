import apiMain from '../../api/apiMain';

export const FavoritesService = {
  getFavorites: (idCustomer: string) => {
    return apiMain.post('FavoriteDriver/list', {
      customerId: idCustomer,
    });
  },
  postFavorite: (idCustomer: string, idDriver: string) => {
    console.log('idCustomer', idCustomer, 'idDriver', idDriver);
    return apiMain.post('FavoriteDriver/Insert', {
      customerId: idCustomer,
      driverId: idDriver,
    });
  },
  findCodeDriver: (stdObject: any) => {
    return apiMain.post('Driver/Find', stdObject);
  },
  deleteFavorite: (idFavorite: string) => {
    return apiMain.post('FavoriteDriver/Delete', {
      idFavorite,
    });
  },
};
