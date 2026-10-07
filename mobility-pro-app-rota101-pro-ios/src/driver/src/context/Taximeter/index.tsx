import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {Toast} from 'toastify-react-native';
import {serviceTaximeter} from './services';
import {TaximeterContextProps} from './types';
import {TripInfo} from '../Trip/types';
import {LocationObject} from 'expo-location';

const TaximeterContext = createContext({} as TaximeterContextProps);
export const TaximeterProvider = ({children}: any) => {
  const [tripTaximeter, setTripTaximeter] = useState<TripInfo>({} as TripInfo);

  const getPricesByTripType = useCallback(
    async (tripTypeId: string, location: LocationObject) => {
      const response = await serviceTaximeter.findByTripType(
        {lat: location?.coords?.latitude, lng: location?.coords?.longitude},
        tripTypeId,
      );

      if (!response.status) {
        return;
      }

      // eslint-disable-next-line consistent-return
      return response.data;
    },
    [serviceTaximeter],
  );

  const startTripTaximeter = useCallback(
    async (
      tripTypeId: string,
      setTrip = null,
      priceId: string,
      multiplierDynamic: string,
      location: LocationObject,
    ) => {
      const response = await serviceTaximeter.startTrip(
        tripTypeId,
        location?.coords?.latitude,
        location?.coords?.longitude,
        priceId,
        multiplierDynamic || null,
      );
      if (!response.status) {
        Toast.error(response?.errors?.message);
        return;
      }

      setTripTaximeter(response.data);
      // eslint-disable-next-line consistent-return
      return response.data;
    },
    [serviceTaximeter, setTripTaximeter],
  );

  const stopTripTaximeter = useCallback(
    async (distance, price, tripTaximeter) => {
      const response = await serviceTaximeter.stopTrip(
        distance || 0, // distance,
        String(tripTaximeter?.estimatedTripTime || 0), // estimatedTripTime,
        price,
        tripTaximeter?.tripReference,
      );
      if (!response?.status) {
        Toast.error('Erro ao parar corrida');
        return;
      }

      // eslint-disable-next-line consistent-return
      return response.data;
    },
    [serviceTaximeter, tripTaximeter],
  );

  const value = useMemo(() => {
    return {
      getPricesByTripType,
      startTripTaximeter,
      stopTripTaximeter,
      setTripTaximeter,
      tripTaximeter,
    };
  }, [
    getPricesByTripType,
    startTripTaximeter,
    stopTripTaximeter,
    setTripTaximeter,
    tripTaximeter,
  ]);
  return (
    <TaximeterContext.Provider value={value}>
      {children}
    </TaximeterContext.Provider>
  );
};
export const useTaximeter = () => {
  const context = useContext(TaximeterContext);
  return context;
};
