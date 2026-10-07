import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { translate } from '~/client/locales';
import { serviceTaximeter } from './services';
import { TaximeterContextProps } from './types';
import { LocationObject } from 'expo-location';
import { Trip } from '~/interfaces/trip';
import { storage } from '~/common/services/mmkv/storage';
import { diffMinutes } from '../../utils/FormatDate';
import MapService from '~/client/services/mapService';
import { calculateDistanceFromLatLonInMeters } from '~/client/utils/position';
import { customToast } from '~/utils/FlashMessage';

const TaximeterContext = createContext({} as TaximeterContextProps);

export const TaximeterProvider = ({ children }: any) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isPaused, setPaused] = useState(false);

  const intervalTime = useRef<NodeJS.Timeout | null>(null);

  const getCoords = (location: LocationObject) => ({
    lat: location?.coords?.latitude,
    lng: location?.coords?.longitude,
  });

  const getPrices = async (tripTypeId: string, location: LocationObject) => {
    try {
      const { lat, lng } = getCoords(location);

      const response = await serviceTaximeter.findByTripType({ lat, lng }, tripTypeId);

      if (!response.status) {
        throw new Error(translate('taximeter.text_fetch_prices_error'));
      }

      return response.data;
    } catch (error) {
      customToast(translate('taximeter.text_fetch_prices_error'), 'error');
    }
  };

  const start = async (
    tripTypeId: string,
    priceId: string,
    multiplierDynamic: string,
    location: LocationObject,
  ) => {
    try {
      const { lat, lng } = getCoords(location);

      const response = await serviceTaximeter.startTrip(
        tripTypeId,
        lat,
        lng,
        priceId,
        multiplierDynamic || null,
      );

      if (!response.status) {
        throw new Error(response?.errors?.message);
      }

      storage.setItem('fare', response.data.fare, 'json');
      storage.setItem('priceTaximeter', response.data.price, "number");
      storage.setItem('lastKmTaximeter', 0, 'number');
      storage.setItem('currentTimeTaximeter', 0, "number");
      storage.setItem('taximeterIsPause', false, 'boolean');
      storage.setItem('startTaximetro', new Date().toISOString());

      setTrip(response.data);
      setPaused(false);

      return response.data;
    } catch (error) {
      customToast(error?.message || translate('toast.text_start_trip_error'), 'error');
    }
  };

  const stop = async (distance: number, price: number) => {
    if (!trip?.tripReference) {
      customToast(translate('taximeter.text_invalid_trip'), 'error');
      return null;
    }

    try {
      const response = await serviceTaximeter.stopTrip(
        distance || 0,
        String(trip.estimatedTripTime || 0),
        price,
        trip.tripReference,
      );

      if (!response.status) {
        throw new Error(translate('taximeter.text_stop_trip_error'));
      }

      return response.data;
    } catch (error) {
      customToast(translate('taximeter.text_stop_trip_error'), 'error');
    }
  };

  const updateMetrics = async (distance: number, estimatedTime: number, price: number) => {
    if (!trip?.tripReference) return;

    try {
      const response = await serviceTaximeter.updateDistanceAndEstimatedTime(
        trip?.tripReference,
        distance || 0,
        estimatedTime || 0,
        price,
      );

      if (!response.status) {
        throw new Error();
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar métricas', error);
    }
  };

  const updateRouteDistance = (latitude: number, longitude: number): number => {
    const encoded = storage.getItem('routeTraveledTaximeter', 'string');

    const newPoint = { latitude, longitude };

    let currentKm = storage.getItem('lastKmTaximeter', 'number') || 0;

    if (!encoded) {
      storage.setItem('routeTraveledTaximeter', MapService.encondePolyline([newPoint]));

      currentKm = Number(trip?.distance || 0);

      storage.setItem('lastKmTaximeter', currentKm, 'number');
    } else {
      const route: any = MapService.decodePolyline(encoded) || [];
      const lastPoint = route[route.length - 1];

      if (lastPoint) {
        const d = calculateDistanceFromLatLonInMeters(lastPoint, newPoint);

        if (Number.isFinite(d) && d >= 1) {
          route.push(newPoint);

          storage.setItem('routeTraveledTaximeter', MapService.encondePolyline(route));

          currentKm += d / 1000;

          storage.setItem('lastKmTaximeter', currentKm, 'number');
        }
      }
    }

    setTrip((prev) => ({ ...prev, distance: String(currentKm) }));

    return currentKm;
  }

  const clearStorage = () => {
    storage.removeGroup([
      'startTaximetro',
      'currentTimeTaximeter',
      'priceTaximeter',
      'taximeterIsPause',
      'fare',
      'routeTraveledTaximeter',
      'lastKmTaximeter',
    ]);
  };

  const updatePrice = (price: number) => {
    if (!price) return;

    storage.setItem('priceTaximeter', price, 'number');

    setTrip((prev) => ({ ...prev, price: String(price) }));
  };

  const clearTrip = () => {
    clearStorage();

    setTrip(null);
  };

  const getElapsedTime = () => {
    const accumulated = storage.getItem('currentTimeTaximeter', 'number') || 0;
    const startTaximetro = storage.getItem('startTaximetro', 'string');

    const minutes = diffMinutes(startTaximetro);

    return accumulated + minutes;
  };

  const updateEstimatedTime = () => {
    const totalMinutes = getElapsedTime();

    setTrip((prev) => ({ ...prev, estimatedTripTime: String(totalMinutes) }));
  };

  const pause = () => {
    const accumulated = storage.getItem('currentTimeTaximeter', 'number') || 0;
    const startTaximetro = storage.getItem('startTaximetro', 'string');

    const minutes = diffMinutes(startTaximetro);

    storage.setItem('currentTimeTaximeter', accumulated + minutes, 'number');
    storage.setItem('taximeterIsPause', true, 'boolean');
    storage.removeItem('startTaximetro');
    storage.removeItem('routeTraveledTaximeter');

    setPaused(true);
  }

  const resume = () => {
    storage.setItem('taximeterIsPause', false, 'boolean');
    storage.setItem('startTaximetro', new Date().toISOString());

    setPaused(false);
  };

  const restoreTrip = (trip: Trip) => {
    if (!trip) return;

    const cachedPrice = storage.getItem('priceTaximeter', 'number');
    const cachedKm = storage.getItem('lastKmTaximeter', 'number');
    const cachedTime = storage.getItem('currentTimeTaximeter', 'number');

    const finalPrice = Math.max(Number(trip.price || 0), cachedPrice);
    const finalKm = Math.max(Number(trip.distance || 0), cachedKm);
    const finalTime = Math.max(Number(trip.estimatedTripTime || 0), cachedTime);

    const updatedTrip = {
      ...trip,
      price: finalPrice.toString(),
      distance: finalKm.toString(),
      estimatedTripTime: finalTime.toString(),
    };

    setTrip(updatedTrip);

    storage.setItem('fare', trip.fare, 'json');
    storage.setItem('priceTaximeter', finalPrice, 'number');
    storage.setItem('lastKmTaximeter', finalKm, 'number');
    storage.setItem('currentTimeTaximeter', finalTime, 'number');
    storage.setItem('taximeterIsPause', false, 'boolean');
    storage.setItem('startTaximetro', new Date().toISOString());

    setPaused(false);
  };

  useEffect(() => {
    return () => pause();
  }, []);

  useEffect(() => {
    clearInterval(intervalTime.current);

    if (!isPaused) {
      intervalTime.current = setInterval(() => {
        updateEstimatedTime();
      }, 5000);
    };

    return () => clearInterval(intervalTime.current);
  }, [isPaused]);

  const value = {
    trip,
    isPaused,
    restoreTrip,
    updatePrice,
    clearTrip,
    start,
    stop,
    updateMetrics,
    updateRouteDistance,
    getPrices,
    clearStorage,
    pause,
    resume,
  };

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
