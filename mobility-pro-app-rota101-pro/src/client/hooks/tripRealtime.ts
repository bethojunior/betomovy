import {useMemo} from 'react';
import TripRealtime from '../services/realtime/TripRealtime';
import {TripProps} from '../contexts/Trip/types';

export default function useTripRealtime() {
  const tripRealtime = useMemo(() => TripRealtime.getInstance(), []);
  return {tripRealtime};
}
