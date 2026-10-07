import { AppState, DeviceEventEmitter } from 'react-native';
import { useUserDriver } from '../../context/userDriver';
import { useAuth } from '../../../../context/auth';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
  STATUS_FINISHED,
  STATUS_CANCELED,
} from '../../constants/trip';
import { useTripProvider } from '../../context/Trip';
import { useEffect, useMemo, useRef } from 'react';
import { searchNativeFetch } from '../../context/Trip/directionRoute';
import { useRouteTraveled } from '../../context/RouteTraveled';
import { useCommunication } from '../../hooks/useComunnication';
import { setRouteTraveled } from './taximeter';
import { setRouteTraveledRecalcule } from './trip';
import { getDistanceFromLatLonInMeters } from '../../../../client/utils/position';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { storage } from '../../../../common/services/mmkv/storage';
import { hasObjectValue } from '~/utils/object';
import { useDriverStatus } from '../../hooks/useDriverStatus';

const keyOpen = `has_open_trip`;

export const OnListenerLocationComponent = () => {
  const { userDriver, cityConfig } = useAuth();
  const { userDriverFind } = useUserDriver();
  const { metersRound, minutesTraveled } = useRouteTraveled();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const tripAcceptedRef = useRef(tripAccepted);
  const { openApp } = useBubbleButton();
  const { setItem, getItem, removeItem } = storage;

  const { watchDriverLocation, stopListenerLocation } = useCommunication();

  const { isInTrip } = useDriverStatus();

  const hasTripAccepted = useMemo(() => hasObjectValue(tripAccepted), [tripAccepted]);

  const switchCaseSearchNativeOnFetch = (
    status,
    origin,
    destination,
    waypoints,
    dir = 'latitude',
  ) => {
    if (!status) {
      console.warn('switchCaseSearchNativeOnFetch: status is undefined');
      return;
    }

    switch (status) {
      case STATUS_ACCEPTED:
        return origin?.[dir];
      case STATUS_BOARDING:
        return origin?.[dir];
      case STATUS_IN_PROGRESS:
        return !!waypoints && waypoints.length > 0 ? waypoints[0][dir] : destination?.[dir];
      case STATUS_FINISHED:
      case STATUS_CANCELED:
        return undefined;
      default:
        return destination?.[dir];
    }
  };

  const getKmRouteTraveled = () => {
    const km = metersRound / 1000;
    return km.toFixed(2) || 0;
  };

  const getMinutesRouteTraveled = () => {
    return minutesTraveled || 0;
  };

  const openAppWithMeters = (metersDiffToOpen = 100, { lat, lng }) => {
    try {
      const hasOpenAppData = getItem(keyOpen, 'string');
      if (hasOpenAppData) {
        return;
      }
      const latitude = switchCaseSearchNativeOnFetch(
        tripAccepted.status,
        tripAcceptedRef?.current?.origin,
        tripAcceptedRef?.current?.destination,
        tripAcceptedRef?.current?.tripWayPoints,
        'latitude',
      );
      const longitude = switchCaseSearchNativeOnFetch(
        tripAccepted.status,
        tripAcceptedRef?.current?.origin,
        tripAcceptedRef?.current?.destination,
        tripAcceptedRef?.current?.tripWayPoints,
        'longitude',
      );

      const meters = getDistanceFromLatLonInMeters(lat, lng, latitude, longitude);
      if (meters <= metersDiffToOpen && AppState.currentState !== 'active') {
        setItem(keyOpen, 'true', 'string');
        openApp();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      tripAccepted?.status !== undefined &&
      tripAcceptedRef?.current?.status !== undefined &&
      tripAccepted?.status !== tripAcceptedRef?.current?.status
    ) {
      removeItem(keyOpen);
    }

    tripAcceptedRef.current = tripAccepted;
  }, [tripAccepted]);

  useEffect(() => {
    if (hasTripAccepted) {
      watchDriverLocation(userDriverFind, {
        onlineSend: 2,
        offlineSend: 2,
        metersOffline: 5,
        metersOnline: 5,
      });
    } else {
      watchDriverLocation(userDriverFind, {
        onlineSend: 10,
        offlineSend: 60,
        metersOffline: 50,
        metersOnline: 10,
      });
    }

    return () => {
      stopListenerLocation();
    };
  }, [userDriverFind, hasTripAccepted, isInTrip]);

  const trackingTrip = (state) => {
    if (!state) {
      console.warn('trackingTrip: tripData is undefined');
      return;
    }

    if (!hasObjectValue(tripAcceptedRef.current)) {
      return;
    }

    const waypoints = tripAcceptedRef.current?.tripWayPoints?.filter((waypoint) => {
      return waypoint?.confirmed === '0';
    });

    const destinationLatitude = switchCaseSearchNativeOnFetch(
      tripAcceptedRef.current?.status,
      tripAcceptedRef.current?.origin,
      tripAcceptedRef.current?.destination,
      waypoints,
    );
    const destinationLongitude = switchCaseSearchNativeOnFetch(
      tripAcceptedRef.current?.status,
      tripAcceptedRef.current?.origin,
      tripAcceptedRef.current?.destination,
      waypoints,
      'longitude',
    );

    if (typeof destinationLatitude !== 'number' || typeof destinationLongitude !== 'number') {
      console.warn('trackingTrip: destination coordinates are undefined');
      return;
    }

    openAppWithMeters(100, { lat: state?.latitude, lng: state?.longitude });
    const headers = {
      userid: userDriver?.idUser,
      token: userDriver?.api_token,
    };
    setRouteTraveledRecalcule({
      latitude: state?.latitude,
      longitude: state?.longitude,
    });
    searchNativeFetch(
      `${state?.latitude},${state?.longitude}`, // Minha latitude e longitude de onde estou no momento
      `${destinationLatitude},${destinationLongitude}`,
      null,
      headers,
      {
        tripAccepted: tripAcceptedRef?.current,
        cityConfig,
        getKmRouteTraveled,
        getMinutesRouteTraveled,
        userDriverFind,
        lat: state?.latitude,
        lng: state?.longitude,
      },
    );
  };

  const trackValueTaximetro = ({ lat, lng }) => {
    setRouteTraveled({
      latitude: lat,
      longitude: lng,
    });
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'onListenerLocation',
      (state: any) => {
        if (!state || typeof state !== 'object') {
          console.log('Evento inválido ignorado:', state);
          return;
        }

        if (typeof state.latitude !== 'number' || typeof state.longitude !== 'number') {
          console.log('Coordenadas inválidas:', state);
          return;
        }

        if (AppState.currentState !== 'background') {
          return;
        }

        if (tripAcceptedRef.current?.tripCallType === 'CHAMADA TAXÍMETRO') {
          return trackValueTaximetro({
            lat: state.latitude,
            lng: state.longitude,
          });
        }

        trackingTrip(state);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
};
