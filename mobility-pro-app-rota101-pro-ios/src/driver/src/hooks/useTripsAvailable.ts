import {useEffect, useMemo, useRef} from 'react';
import {useTripProvider} from '../context/Trip';
import {useUserDriver} from '../context/userDriver';
import {useAuth} from '../../../context/auth';
import {STATUS_SCHEDULED} from '../constants/trip';
import {TripService} from '../context/Trip/service';
import {usePaginatedList} from '../../../hooks/usePaginatedList';
import {Trip} from '../../../interfaces/trip';

export function useTripsAvailable(dateStart?: string | null, dateEnd?: string | null) {
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
      driverId: userDriverFind?.idDriver,
      status: STATUS_SCHEDULED,
      dateStart: dateStart || undefined,
      dateEnd: dateEnd || undefined,
    });
  };

  const query = usePaginatedList<Trip, 'trips'>(
    fetcher,
    'trips',
    {
      trips: stateTrip.listSchedule,
      paginate: stateTrip.listSchedulePaginate,
    },
    ({paginate, trips}) => {
      dispatchTrip({type: 'update',field: 'listSchedulePaginate', arg: paginate});
      dispatchTrip({type: 'update', field: 'listSchedule', arg: trips});
    },
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    dispatchTrip({
      type: 'update',
      field: 'scheduleFilter',
      arg: {dateStart: dateStart ?? null, dateEnd: dateEnd ?? null},
    });

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    query.refresh();
  }, [dateStart, dateEnd]);

  return {
    ...query,
    data: stateTrip.listSchedule,
  };
}
