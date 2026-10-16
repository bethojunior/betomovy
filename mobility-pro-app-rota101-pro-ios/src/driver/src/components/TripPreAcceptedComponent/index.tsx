import { useEffect, useRef } from 'react';
import { useTripProvider } from '../../context/Trip';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { useUserDriver } from '../../context/userDriver';
import { customToast } from '../../../../utils/FlashMessage';
import { translate } from '../../../../client/locales';
import useTripRealtime from '../../hooks/tripRealtime';
import { TripCallback } from '../../interfaces/tripRealtime';
import { useAuth } from '../../../../context/auth';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { emitDriverLocation } from '~/utils/driverLocationEmmit';
import { useSong } from '../../hooks/song';

export const TripPreAcceptedComponent = () => {
  const { tripRealtime } = useTripRealtime();

  const { clearDataPreAcceptedTrip, verifyExistTrip, stateTrip } =
    useTripProvider((context) => context);

  const { tripAccepted, tripPreAccepted } = stateTrip;

  const { itsNetwork } = useNetwork();
  const { openApp } = useBubbleButton();
  const { getDriverFind, userDriverFind } = useUserDriver();
  const { cityConfig } = useAuth();

  const { playSong } = useSong();

  const unsubscribeRef = useRef<string | null>(null);
  const tripAcceptedRef = useRef<string>(tripAccepted.tripReference);
  const tripPreAcceptedRef = useRef<string>(tripPreAccepted.tripReference);

  useEffect(() => {
    tripAcceptedRef.current = tripAccepted?.tripReference;
  }, [tripAccepted]);

  useEffect(() => {
    tripPreAcceptedRef.current = tripPreAccepted?.tripReference;
  }, [tripPreAccepted]);

  const verify = async (tripReference: string, isPreAccepted = false) => {
    if (!itsNetwork) {
      return;
    }
    const response = await verifyExistTrip(tripReference);

    if (response && response.status === 'canceled') {
      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      if (tripReference) {
        emitTripStatusChange(tripReference, 'removed', configCityId);
      }

      const currentLocation =
        userDriverFind?.latitude && userDriverFind?.longitude
          ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
          : undefined;
      emitDriverLocation(userDriverFind, currentLocation, cityConfig);

      await openApp();

      getDriverFind();

      const cancelMessages: Record<string, string> = {
        customer: 'finishTrip.text_trip_pre_accepted_cancelled_by_true',
        admin: 'finishTrip.text_trip_pre_accepted_cancelled_by_false',
      };

      const messageKey = cancelMessages[response.canceledBy || 'admin'];

      if (
        isPreAccepted &&
        tripPreAcceptedRef.current !== undefined &&
        tripAcceptedRef.current !== tripPreAcceptedRef.current
      ) {
        clearDataPreAcceptedTrip();

        if (['admin', 'customer'].includes(response.canceledBy)) {
          playSong('cancel');
          customToast(translate(messageKey), 'warning');
        }
      }
    }
  };

  const clearRealtimeEvent = () => {
    if (unsubscribeRef.current) {
        tripRealtime.unsubscribe(unsubscribeRef.current);
        unsubscribeRef.current = null;
      }
  };

  const onTripUpdate: TripCallback = ({ data: _trip, type }) => {
    if (type === 'removed') {

      verify(_trip.tripReference, true);

      clearRealtimeEvent();
    }
  };

  useEffect(() => {
    if (!tripPreAccepted.tripReference) {
      return;
    }

    unsubscribeRef.current = tripRealtime.getTrip(
      tripPreAccepted.tripReference,
      onTripUpdate,
    );

    return () => {
      clearRealtimeEvent();
    };
  }, [tripPreAccepted?.tripReference, tripPreAccepted?.status]);

  return null;
};
