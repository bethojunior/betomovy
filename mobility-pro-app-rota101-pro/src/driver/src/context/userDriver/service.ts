import {useCallback} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';

const TIMEOUT_SHORT = 10000;

export const UserDriverService = () => {
  const getDriverFind = useCallback(
    async (driverId: string) => {
      const {data} = await apiMain.post(
        'Driver/Find',
        {
          stdObject: [
            {
              driverId,
            },
          ],
        },
        { timeout: TIMEOUT_SHORT },
      );

      if (!data.status) {
        return customToast(data.message, 'danger');
      }

      return data.data;
    },
    [apiMain],
  );

  const toogleDriverStatus = useCallback(
    async (
      driverId: string,
      status: string,
      latitude: string,
      longitude: string,
      cityId = null,
    ) => {
      const date = new Date();
      const {data} = await apiMain.post('Driver/ToggleStatus', {
        stdObject: [
          {
            driverId,
            status,
            location: {
              latitude,
              longitude,
              date: date.toISOString(),
            },
            cityId: cityId,
          },
        ],
      });
      if (!data.data) {
        throw new Error(data.message || 'Não foi possível alterar seu status');
      }
      return data.data.status;
    },
    [apiMain],
  );

  const getWeeklyEarnings = useCallback(
    async (driverId: string) => {
      const {data} = await apiMain.post('Driver/WeeklyEarnings', {
        driverId,
      });

      if (!data.status) {
        return customToast(data.message, 'danger');
      }

      return data.data;
    },
    [apiMain],
  );

  const EditProfileImage = useCallback(
    async (id: string, uri: string, type: string, filename: string) => {
      const formData = new FormData();

      formData.append('driverId', id);
      formData.append('photo', {
        uri,
        type,
        name: filename,
      });

      const {data} = await apiMain.post('Driver/EditProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!data.status) {
        return customToast(data.message, 'danger');
      }

      return data.message;
    },
    [apiMain],
  );

  const findPendencies = async (driverId: number) => {
    const {data} = await apiMain.post('Driver/FindWithPendencies', {
      stdObject: [
        {
          driverId,
        },
      ],
    });

    if (!data.status) {
      customToast(data.message, 'danger');

      return false;
    }

    return data;
  };

  const listClientFavorites = async (driverId: number, page: number) => {
    const {data} = await apiMain.post('FavoriteDriver/listCustomers', {
      driverId,
      page,
    });

    if (!data.status) {
      return data.message;
    }

    return data.data;
  };

  const getLinkMenu = async () => {
    const {data} = await apiMain.get('menuApp/findByType?type=1');

    if (!data.status) {
      const dataDefault = {
        description: 'google',
        link: 'https://www.google.com/',
        id: '',
      };

      return dataDefault;
    }

    return data.message;
  };

  const addAds = async (menuId: number) => {
    const {data} = await apiMain.post('menuApp/addAds', {
      stdObject: [
        {
          menuId,
        },
      ],
    });

    if (!data.status) {
      return false;
    }

    return true;
  };

  const getIndicator = useCallback(
    async (page: string) => {
      const {data} = await apiMain.get(
        `userindication/getIndicated?page=${page}`,
      );

      if (!data.status) {
        return data.message;
      }

      return data.data;
    },
    [apiMain],
  );
  const deleteFavorite = async (idFavorite: string) => {
    const {data} = await apiMain.post('FavoriteDriver/delete', {
      idFavorite,
    });

    if (!data.status) {
      customToast(data.message, 'danger');

      return;
    }

    customToast(data.message, 'success');
  };

  return {
    getDriverFind,
    toogleDriverStatus,
    getWeeklyEarnings,
    EditProfileImage,
    findPendencies,
    listClientFavorites,
    getLinkMenu,
    addAds,
    getIndicator,
    deleteFavorite,
  };
};
