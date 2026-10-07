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
    async (status: boolean | string, page: number, setDataPage: any) => {
      try {
        const response = await service.getTravels(
          status,
          page,
          // @ts-ignore
          user.idCustomer,
        );

        if (!response.status) {
          reactotron.log?.('GetTravel', response.message);
          return customToast(response.message, 'danger');
        }

        setDataPage(response.data.paginate);
        setTravels(response.data.trips);

        reactotron.log?.('TravelPagination', response.data.trips);

        return response;
      } catch (error) {
        reactotron.log?.('GetTravel', error);
        return customToast(translate('toast.text_fetch_trips_error'), 'danger');
      }
    },
    [service],
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
