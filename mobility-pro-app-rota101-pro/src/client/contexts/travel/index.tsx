import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import reactotron from 'reactotron-react-native';
import { useAuth } from '../../../context/auth';
import { customToast } from '../../../utils/FlashMessage';
import { translate } from '../../locales';

import { TravelService } from './service';
import { TravelContextData, TravelContextProps, TravelProps } from './types';

const TravelContext = createContext<TravelContextData>({} as TravelContextData);
export const TravelProvider = ({ children }: TravelContextProps) => {
  const { user } = useAuth();
  const service = TravelService();
  const [travels, setTravels] = useState<TravelProps[]>([]);

  const getTravel = useCallback(
    async (status: boolean | string | null, page: number, setDataPage: any) => {
      try {
        const customerId =
          user?.idCustomer || (user as any)?.customerId || user?.idUser;

        if (!customerId) {
          setTravels([]);
          return;
        }

        // true/"all" => sem filtro de status (API lista searching, andamento e finalizadas)
        const statusFilter =
          status === true || status === 'true' || status === 'all' || status === null
            ? null
            : status;

        const response = await service.getTravels(
          statusFilter,
          page,
          Number(customerId),
        );

        if (!response.status) {
          reactotron.log?.('GetTravel', response.message);
          return customToast(response.message, 'danger');
        }

        const trips = Array.isArray(response?.data?.trips)
          ? response.data.trips
          : [];

        setDataPage(response.data?.paginate || {});
        setTravels(trips);

        reactotron.log?.('TravelPagination', trips);

        return response;
      } catch (error) {
        reactotron.log?.('GetTravel', error);
        return customToast(translate('toast.text_fetch_trips_error'), 'danger');
      }
    },
    [service, user?.idCustomer, user?.idUser],
  );

  const value = useMemo(
    () => ({
      getTravel,
      travels,
      setTravels,
    }),
    [getTravel, travels, setTravels],
  );

  return (
    <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('User context error');
  }
  return context;
};

export default TravelProvider;
