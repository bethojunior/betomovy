import {useMemo} from 'react';
import TripRealtime from '../service/realtime/TripRealtime';

export default function useTripRealtime() {
  const tripRealtime = useMemo(() => TripRealtime.getInstance(), []);
  return {tripRealtime};
}
