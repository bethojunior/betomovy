import {useTripProvider} from '../context/Trip';

export const useGetTripAccepted = () => {
  const {stateTrip, calculateAndDisplayRoute} = useTripProvider();
  const {tripAccepted} = stateTrip;

  return {tripAccepted, calculateAndDisplayRoute};
};
