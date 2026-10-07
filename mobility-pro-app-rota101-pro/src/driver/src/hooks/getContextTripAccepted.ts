import {useTripProvider} from '../context/Trip';

export const useGetTripAccepted = () => {
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const calculateAndDisplayRoute: any = useTripProvider(
    (context: any) => context.calculateAndDisplayRoute,
  );

  return {tripAccepted, calculateAndDisplayRoute};
};
