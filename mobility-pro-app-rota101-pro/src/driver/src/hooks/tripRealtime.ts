import {useMemo} from 'react';
import TripRealtime from '../service/realtime/TripRealtime';
import {useAuth} from '../../../context/auth';
import Helper from '../../../client/utils/Helper';

export default function useTripRealtime() {
  const {generalSettings} = useAuth();
  const useSocket = Helper.generalSettingsActive(
    generalSettings,
    'enable_realtime_socket',
  );
  const tripRealtime = useMemo(
    () => TripRealtime.configure(!!useSocket),
    [useSocket],
  );
  return {tripRealtime};
}
