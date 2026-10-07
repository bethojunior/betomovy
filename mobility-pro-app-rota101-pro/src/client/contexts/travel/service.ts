import {useCallback} from 'react';
import apiMain from '../../api/apiMain';

export const TravelService = () => {
  const getTravels = useCallback(
    async (status: boolean | string, page: number, user: number) => {
      const response = await apiMain.post('Customer/GetTrips', {
        customerId: user,
        status,
        page,
      });

      return response.data;
    },
    [apiMain],
  );

  return {
    getTravels,
  };
};
