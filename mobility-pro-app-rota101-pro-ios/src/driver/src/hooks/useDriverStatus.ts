import {useMemo} from 'react';
import {useUserDriver} from '../context/userDriver';

export function useDriverStatus() {
  const {userDriverFind} = useUserDriver();

  const isOffline = useMemo(
    () => userDriverFind.status === 'desligado',
    [userDriverFind.status],
  );

  /**
   * @deprecated Use `isInTrip` instead.
   */
  const isBusy = useMemo(
    () => userDriverFind.status === 'corrida',
    [userDriverFind.status],
  );

  const isInTrip = useMemo(
    () => userDriverFind.status === 'corrida',
    [userDriverFind.status],
  );

  const isOnline = useMemo(
    () => userDriverFind.status === 'disponivel',
    [userDriverFind.status],
  );

  return {isOnline, isOffline, isBusy, isInTrip};
}
