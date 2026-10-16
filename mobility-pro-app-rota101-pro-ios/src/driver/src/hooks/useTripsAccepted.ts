import {useEffect, useRef} from 'react';
import {useTripProvider} from '../context/Trip';
import {useUserDriver} from '../context/userDriver';
import {STATUS_SCHEDULED} from '../constants/trip';
import {TripService} from '../context/Trip/service';
import {usePaginatedList} from '../../../hooks/usePaginatedList';
import {Trip} from '../../../interfaces/trip';

export function useTripsAccepted(dateStart?: string | null, dateEnd?: string | null) {
  const {dispatchTrip, stateTrip} = useTripProvider(context => context);
  const {userDriverFind} = useUserDriver();

  const fetcher = (page: number) => {
    return TripService().getTripsAccepted(page, {
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
      trips: stateTrip.listScheduleAccepted,
      paginate: stateTrip.listScheduleAcceptedPaginate,
    },
    ({paginate, trips}) => {
      dispatchTrip({type: 'update',field: 'listScheduleAcceptedPaginate', arg: paginate});
      dispatchTrip({type: 'update', field: 'listScheduleAccepted', arg: trips});
    },
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    dispatchTrip({
      type: 'update',
      field: 'scheduleAcceptedFilter',
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
    data: stateTrip.listScheduleAccepted,
  };
}
