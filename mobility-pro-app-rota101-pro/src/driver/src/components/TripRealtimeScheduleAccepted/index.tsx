import { useEffect, useRef } from 'react';
import { useUserDriver } from '../../context/userDriver';
import { useTripProvider } from '../../context/Trip';
import useTripRealtime from '../../hooks/tripRealtime';
import { TripCallback } from '../../interfaces/tripRealtime';
import { useDriverStatus } from '../../hooks/useDriverStatus';
import { matchesScheduleDateFilter } from '../../utils/scheduleFilter';

export const TripRealtimeScheduleAccepted = () => {
  const { tripRealtime } = useTripRealtime();
  const { userDriverFind } = useUserDriver();
  const { isOnline } = useDriverStatus();
  const unsubscribeRef = useRef<string | null>(null);

  const {
    stateTrip,
    addOrUpdateList,
    removeFromList,
    incrementTripSummaryItem,
    decrementTripSummaryItem
  } = useTripProvider((context) => context);

  const driverId = userDriverFind.idDriver;

  const listScheduleAcceptedRef = useRef(stateTrip.listScheduleAccepted);
  listScheduleAcceptedRef.current = stateTrip.listScheduleAccepted;

  const scheduleAcceptedFilterRef = useRef(stateTrip.scheduleAcceptedFilter);
  scheduleAcceptedFilterRef.current = stateTrip.scheduleAcceptedFilter;

  const hasScheduledAcceptedTrip = (tripReference: string) => {
    return listScheduleAcceptedRef.current.some(item => item.tripReference === tripReference);
  };

  const onTripScheduledAccepted: TripCallback = ({ data: _trip, type }) => {
    if (type === 'removed') {
      if (hasScheduledAcceptedTrip(_trip.tripReference)) {
        decrementTripSummaryItem('totalScheduledAccepted', 1);
      }
      removeFromList("listScheduleAccepted", _trip);
    }

    if (type === 'added') {
      if (!hasScheduledAcceptedTrip(_trip.tripReference)) {
        incrementTripSummaryItem('totalScheduledAccepted', 1);
      }
      if (matchesScheduleDateFilter(_trip, scheduleAcceptedFilterRef.current)) {
        addOrUpdateList("listScheduleAccepted", _trip);
      }
    }

    if (type === 'modified') {
      if (matchesScheduleDateFilter(_trip, scheduleAcceptedFilterRef.current)) {
        addOrUpdateList("listScheduleAccepted", _trip);
      } else {
        removeFromList("listScheduleAccepted", _trip);
      }
    }
  };

  useEffect(() => {
    if (userDriverFind.tripTypes == null) return;

    if (isOnline) {
      unsubscribeRef.current = tripRealtime.getTripScheduledAccepted(
        userDriverFind.idDriver,
        onTripScheduledAccepted,
      );
    }

    return () => {
      if (unsubscribeRef.current) tripRealtime.unsubscribe(unsubscribeRef.current);
      unsubscribeRef.current = null;
    };
  }, [userDriverFind.tripTypes, userDriverFind.idDriver, isOnline]);

  return null;
};
