import { STATUS_SCHEDULED } from '../constants/trip';
import { Trip } from '../../../interfaces/trip';

export function compareTripScheduleOrder(a: Trip, b: Trip): number {
  const aScheduled = a?.status === STATUS_SCHEDULED;
  const bScheduled = b?.status === STATUS_SCHEDULED;

  if (aScheduled !== bScheduled) {
    return aScheduled ? -1 : 1;
  }

  if (aScheduled) {
    return new Date(a?.schedule?.schedule).getTime() - new Date(b?.schedule?.schedule).getTime();
  }

  return new Date(b?.date as unknown as string).getTime() - new Date(a?.date as unknown as string).getTime();
}

export function sortTripsBySchedule(trips: Trip[]): Trip[] {
  return [...trips].sort(compareTripScheduleOrder);
}
