import { useCallback, useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import { useUserDriver } from '../../context/userDriver';
import { useTripProvider } from '../../context/Trip';
import { useAuth } from '../../../../context/auth';
import { mountSong } from '../../utils/mountSong';
import scheduledSoundMp3 from '../../assets/songs/scheduledTrip.mp3';
import useTripRealtime from '../../hooks/tripRealtime';
import { TripCallback } from '../../interfaces/tripRealtime';
import { InteractionManager } from 'react-native';
import { useDriverStatus } from '../../hooks/useDriverStatus';
import { matchesDriverPool, matchesScheduleDateFilter } from '../../utils/scheduleFilter';

export const TripRealtimeScheduleCall = () => {
  const { tripRealtime } = useTripRealtime();
  const { userDriverFind } = useUserDriver();
  const { isOnline } = useDriverStatus();
  const { cityConfig } = useAuth();

  const unsubscribesRef = useRef<Map<string, string>>(new Map());
  const isPlayingScheduledAlertRef = useRef(false);

  const {
    stateTrip,
    addOrUpdateList,
    removeFromList,
    incrementTripSummaryItem,
    decrementTripSummaryItem
  } = useTripProvider((context) => context);

  const listScheduleRef = useRef(stateTrip.listSchedule);
  listScheduleRef.current = stateTrip.listSchedule;

  const scheduleFilterRef = useRef(stateTrip.scheduleFilter);
  scheduleFilterRef.current = stateTrip.scheduleFilter;

  const hasScheduledTrip = (tripReference: string) => {
    return listScheduleRef.current.some(item => item.tripReference === tripReference);
  };

  const cityId = useMemo(() => {
    return cityConfig?.cityId || userDriverFind?.cityId;
  }, [cityConfig?.cityId, userDriverFind?.cityId]);

  const playScheduledTripAlert = useCallback(async () => {
    if (!isOnline || isPlayingScheduledAlertRef.current) return;

    try {
      isPlayingScheduledAlertRef.current = true;

      const sound = await mountSong(scheduledSoundMp3, true, 'soundCallAlertSchedule');

      sound?.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          isPlayingScheduledAlertRef.current = false;
          sound.unloadAsync();
        }
      });

      await InteractionManager.runAfterInteractions(async () => await sound?.playAsync());
    } catch (error) {
      isPlayingScheduledAlertRef.current = false;
      console.log('Erro ao executar: soundCallAlertSchedule', error);
    }
  }, [isOnline]);

  const debouncedPlayScheduledTripAlert = useMemo(
    () => debounce(playScheduledTripAlert, 800),
    [playScheduledTripAlert]
  );

  useEffect(() => {
    return () => {
      debouncedPlayScheduledTripAlert.cancel();
    };
  }, [debouncedPlayScheduledTripAlert]);

  const onTripScheduled: TripCallback = async ({ data: _trip, type }) => {
    if (type === 'removed') {
      if (hasScheduledTrip(_trip.tripReference)) {
        decrementTripSummaryItem('totalScheduledAvailable', 1);
      }

      removeFromList("listSchedule", _trip);
    }

    if (type === 'added') {
      if (!matchesDriverPool(_trip, userDriverFind?.idDriver)) return;

      if (!hasScheduledTrip(_trip.tripReference)) {
        incrementTripSummaryItem('totalScheduledAvailable', 1);
      }

      if (matchesScheduleDateFilter(_trip, scheduleFilterRef.current)) {
        addOrUpdateList("listSchedule", _trip);
      }

      debouncedPlayScheduledTripAlert();
    }

    if (type === 'modified') {
      const isVisible =
        matchesDriverPool(_trip, userDriverFind?.idDriver) &&
        matchesScheduleDateFilter(_trip, scheduleFilterRef.current);

      if (isVisible) {
        addOrUpdateList("listSchedule", _trip);
      } else {
        removeFromList("listSchedule", _trip);
      }
    }
  }

  useEffect(() => {
    if (userDriverFind.tripTypes == null) return;

    if (isOnline) {
      userDriverFind.tripTypes.forEach(({ tripTypeId }) => {
        if (!unsubscribesRef.current.has(tripTypeId)) {
          const unsubscribe = tripRealtime.getTripScheduled(cityId, tripTypeId, onTripScheduled);

          unsubscribesRef.current.set(tripTypeId, unsubscribe);
        }
      });
    }

    return () => {
      unsubscribesRef.current.forEach((unsub) => {
        tripRealtime.unsubscribe(unsub);
      });
      unsubscribesRef.current.clear();
    };
  }, [userDriverFind.tripTypes, isOnline, cityId]);

  return null;
};
