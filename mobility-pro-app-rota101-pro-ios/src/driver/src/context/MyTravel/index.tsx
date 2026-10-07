import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import {useUserDriver} from '../userDriver';
import {TravelService} from './service';
import {MyTravelContextProps, MyTripProps} from './types';
const MyTravelContext = createContext({} as MyTravelContextProps);
export const MyTravelProvider = ({children}: any) => {
  const {userDriverFind} = useUserDriver();
  const [trips, setTrips] = useState<MyTripProps[]>([]);

  const getTrips = useCallback(
    async (status = null, page = 1, date = null, setDataPage) => {
      try {
        const response = await TravelService.getTravels(
          Number(userDriverFind.idDriver),
          status,
          page,
          date,
        );
        if (!response.status) {
          console.log(response);
          return customToast(response.message, 'danger');
        }
        setTrips(response.data.trips);
        setDataPage(response.data.paginate);
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    [userDriverFind],
  );

  const getTrip = useCallback(async (tripReference: string) => {
    try {
      const response = await TravelService.getTrip(tripReference);
      if (!response.status) {
        console.log(response);
        return customToast(response.message, 'danger');
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const reportTrip = useCallback(
    async (tripReference: string, message: string) => {
      try {
        const response = await TravelService.reportTrip(tripReference, message);
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const value = useMemo(() => {
    return {getTrips, getTrip, trips, setTrips, reportTrip};
  }, [getTrips, getTrip, trips, setTrips, reportTrip]);
  return (
    <MyTravelContext.Provider value={value}>
      {children}
    </MyTravelContext.Provider>
  );
};
export const useMyTravels = () => {
  const context = useContext(MyTravelContext);
  return context;
};
