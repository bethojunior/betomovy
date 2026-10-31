import {useCallback} from 'react';
import apiMain from '../../api/apiMain';

export const TravelService = () => {
  const getTravels = useCallback(
    async (status: boolean | string | null, page: number, user: number) => {
      const payload: Record<string, unknown> = {
        customerId: user,
        page,
      };

      // Só envia status quando há filtro específico (scheduled/canceled/finished)
      if (status !== null && status !== undefined && status !== true && status !== 'true') {
        payload.status = status;
      }

      const response = await apiMain.post('Customer/GetTrips', payload);

      return response.data;
    },
    [apiMain],
  );

  return {
    getTravels,
  };
};
