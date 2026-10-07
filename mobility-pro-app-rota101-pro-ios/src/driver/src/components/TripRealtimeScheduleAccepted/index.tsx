import {useEffect, useMemo, useState} from 'react';
import {useUserDriver} from '../../context/userDriver';
import {TripRealtime} from '../../service/realtime/TripRealtime';
import {useTripProvider} from '../../context/Trip';

export const TripRealtimeScheduleAccepted = () => {
  const {userDriverFind} = useUserDriver();
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const {stateTrip, dispatchTrip} = useTripProvider();
  const {listScheduleAccepted, trip} = stateTrip;

  const [tripsScheduleAcceptedLocal, setTripsScheduleAcceptedLocal] =
    useState<any>([...listScheduleAccepted]);

  const tripScheduledAccepted = () => {
    tripRealtime.getTripScheduledAccepted(
      userDriverFind.idDriver,
      (trip, type) => {
        if (type === 'added' || type === 'modified') {
          setTripsScheduleAcceptedLocal(prev => [...prev, trip]);
        }
        if (type === 'removed') {
          setTripsScheduleAcceptedLocal(prev =>
            prev.filter(
              (item: {tripReference: string}) =>
                item.tripReference !== trip.tripReference,
            ),
          );
        }
        return '';
      },
    );
  };

  useEffect(() => {
    if (Object.keys(trip).length === 0) {
      if (userDriverFind.tripTypes == null) return;

      tripScheduledAccepted();
    }
  }, []);

  useEffect(() => {
    // Atualizar o estado listScheduleAccepted no dispatchTrip sempre que tripsScheduleAcceptedLocal for atualizado
    dispatchTrip({
      type: 'update',
      field: 'listScheduleAccepted',
      arg: tripsScheduleAcceptedLocal,
    });
  }, [tripsScheduleAcceptedLocal]);

  return null;
};
