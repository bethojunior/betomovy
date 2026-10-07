import {useMemo} from 'react';
import {useTripProvider} from '../context/Trip';
import {useUserDriver} from '../context/userDriver';
import {useAuth} from '../../../context/auth';
import {STATUS_GET_BID_BY_DRIVERS} from '../constants/trip';
import {TripService} from '../context/Trip/service';
import {usePaginatedList} from '../../../hooks/usePaginatedList';
import {Trip} from '../../../interfaces/trip';

export function useTripsOffer() {
  const {dispatchTrip, stateTrip} = useTripProvider(context => context);
  const {userDriverFind} = useUserDriver();
  const {cityConfig} = useAuth();


  const cityId = useMemo(
    () => cityConfig?.cityId || userDriverFind?.cityId,
    [cityConfig.cityId, userDriverFind.cityId],
  );

  const tripTypes = useMemo(
    () => userDriverFind?.tripTypes?.map(tt => tt.tripTypeId) || [],
    [userDriverFind?.tripTypes],
  );

  const fetcher = (page: number) => {
    return TripService().getTripsAvailable(page, {
      tripTypeIds: tripTypes,
      cityId,
      status: STATUS_GET_BID_BY_DRIVERS,
      driverId: userDriverFind?.idDriver,
      tripWithoutRefusal: true,
    });
  };

  const query = usePaginatedList<Trip, 'trips'>(
    fetcher,
    'trips',
    {
      trips: stateTrip.tripsOffer,
      paginate: stateTrip.tripsOfferPaginate,
    },
    ({paginate, trips}) => {
      dispatchTrip({type: 'update',field: 'tripsOfferPaginate', arg: paginate});
      dispatchTrip({type: 'update', field: 'tripsOffer', arg: trips});
    },
  );

  const update = (trips: Trip[]) => {
    dispatchTrip({type: 'update', field: 'tripsOffer', arg: trips});
  }

  return {
    ...query,
    update,
    data: stateTrip.tripsOffer,
  };
}
