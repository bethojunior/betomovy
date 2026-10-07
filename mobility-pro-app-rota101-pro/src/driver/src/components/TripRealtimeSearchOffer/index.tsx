import { useCallback, useEffect, useMemo } from 'react';
import { useUserDriver } from '../../context/userDriver';
import { useAuth } from '../../../../context/auth';
import { mountSong } from '../../utils/mountSong';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { useNavigation } from '@react-navigation/native';
import { useTripProvider } from '../../context/Trip';
import offerSoundMp3 from '../../assets/songs/scheduledTrip.mp3';
import useTripRealtime from '../../hooks/tripRealtime';
import { InteractionManager } from 'react-native';
import { shouldOpenAppForOfferTrip } from '../../service/rules/trip/shouldOpenAppForOfferTrip';
import { useDriverStatus } from '../../hooks/useDriverStatus';
import { TripCallback } from '../../interfaces/tripRealtime';

export const TripRealtimeSearchOffer = () => {
  const { tripRealtime } = useTripRealtime();
  const { userDriverFind } = useUserDriver();
  const { isOnline } = useDriverStatus();
  const { cityConfig } = useAuth();
  const { openApp } = useBubbleButton();
  const { navigate } = useNavigation<any>();

  const {
    stateTrip,
    addOrUpdateList,
    removeFromList,
    incrementTripSummaryItem,
    decrementTripSummaryItem,
  } = useTripProvider((context) => context);

  const tripsOffer = stateTrip.tripsOffer;

  const cityId = useMemo(() => {
    return cityConfig?.cityId || userDriverFind?.cityId;
  }, [cityConfig?.cityId, userDriverFind?.cityId]);

  const playOfferTripAlert = useCallback(async () => {
    if (isOnline) {
      try {
        const sound = await mountSong(offerSoundMp3, true, 'soundCallTripInDriver');
        await InteractionManager.runAfterInteractions(async () => await sound?.playAsync());
      } catch (error) {
        console.log('Erro ao executar: soundCallTripInDriver', error);
      }
    }
  }, [isOnline]);

  const hasItemTripBid = (tripReference: string) => {
    return tripsOffer.some(item => item.tripReference === tripReference);
  }

  const onTripOffer: TripCallback = async ({ data: _trip, type }) => {
    const driverId = userDriverFind?.idDriver;

    if (type === 'added' || type === 'modified') {
      if (!hasItemTripBid(_trip.tripReference)) {
        incrementTripSummaryItem('totalOfferTrips', 1);
      }

      if (shouldOpenAppForOfferTrip(_trip, tripsOffer, driverId)) {
        openApp();

        await playOfferTripAlert();
        addOrUpdateList("tripsOffer", _trip);
        navigate('tripsOffer');
      } else {
        addOrUpdateList("tripsOffer", _trip);
      }
    }

    if (type === 'removed') {
      decrementTripSummaryItem('totalOfferTrips', 1);
      removeFromList("tripsOffer", _trip);
    }
  };

  useEffect(() => {
    if (userDriverFind.tripTypes == null) return;

    let unsubscribes = [];

    if (isOnline) {
      userDriverFind.tripTypes.forEach(({ tripTypeId }) => {
        const unsubscribe = tripRealtime.getTripOffer(cityId, tripTypeId, onTripOffer);
        unsubscribes.push(unsubscribe);
      });
    }

    return () => {
      unsubscribes.forEach((unsub) => tripRealtime.unsubscribe(unsub));
      unsubscribes = [];
    };
  }, [userDriverFind.tripTypes, isOnline, cityId]);

  return null;
};
