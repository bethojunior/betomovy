import { useEffect } from 'react';
import { useAuth } from '../../../../context/auth';
import { useUserDriver } from '../../context/userDriver';
import { useTripProvider } from '../../context/Trip';

export const BlockDriver = () => {
  const { setNewActionFb, newActionFb } = useAuth();
  const { getDriverFind } = useUserDriver();
  // const {stateTrip} = useTripProvider();
  // const {tripAccepted} = stateTrip;
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );

  const hasTrip = () => {
    if (tripAccepted && Object.keys(tripAccepted).length !== 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (newActionFb.length > 0 && newActionFb === 'Bloqueio' && !hasTrip()) {
      getDriverFind();
    }

    return () => {
      setNewActionFb('');
    };
  }, [newActionFb]);

  return <></>;
};
