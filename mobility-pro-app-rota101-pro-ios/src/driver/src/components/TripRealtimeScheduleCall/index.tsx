import {useEffect, useMemo, useState} from 'react';
import {TripRealtime} from '../../service/realtime/TripRealtime';
import {useUserDriver} from '../../context/userDriver';
import {useTripProvider} from '../../context/Trip';
import {useAuth} from '../../../../context/auth';
import {mountSong} from '../../utils/mountSong';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TripRealtimeScheduleCall = () => {
  const {userDriverFind} = useUserDriver();
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const {stateTrip, dispatchTrip} = useTripProvider();
  const {listSchedule, trip} = stateTrip;
  const {cityConfig} = useAuth();
  const [tripsScheduleLocal, setTripsScheduleLocal] = useState<any>([
    ...listSchedule,
  ]);

  const handleAddOrUpdate = async trip => {
    setTripsScheduleLocal(prev => [...prev, trip]);

    if (userDriverFind.status !== 'desligado') {
      const sound = await mountSong(
        require('../../assets/songs/scheduledTrip.mp3'),
      );
      await sound?.playAsync();
    }
  };

  const tripSchedule = async item => {
    const generalSettings =
      JSON.parse(await AsyncStorage.getItem('generalSettings')) || [];
    const enableRealtime =
      generalSettings?.find(
        setting => setting?.key === 'enable_realtime_socket',
      )?.value || 0;

    tripRealtime.getTripScheduled(
      cityConfig?.cityId || userDriverFind?.cityId,
      item.tripTypeId,
      async (trip, type) => {
        if (
          !Number(enableRealtime) &&
          (type === 'added' || type === 'modified')
        ) {
          await handleAddOrUpdate(trip);
        }
        if (
          type === 'removed' ||
          (type === 'modified' && Number(enableRealtime) && trip.driver)
        ) {
          return setTripsScheduleLocal(prev =>
            prev.filter(
              ({tripReference}) => tripReference !== trip.tripReference,
            ),
          );
        }
        if (
          (Number(enableRealtime) && type === 'added') ||
          (Number(enableRealtime) && type === 'modified' && !trip.driver)
        ) {
          await handleAddOrUpdate(trip);
        }
      },
    );
  };

  useEffect(() => {
    if (Object.keys(trip).length === 0) {
      if (userDriverFind.tripTypes == null) return;
      userDriverFind.tripTypes.map(item => {
        tripSchedule(item);
      });
    }
  }, []);

  useEffect(() => {
    // Atualizar o estado listSchedule no dispatchTrip sempre que tripsScheduleLocal for atualizado
    dispatchTrip({
      type: 'update',
      field: 'listSchedule',
      arg: tripsScheduleLocal,
    });
  }, [tripsScheduleLocal]);

  return null;
};
