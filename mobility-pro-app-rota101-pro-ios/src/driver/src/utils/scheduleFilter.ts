import { Trip } from '../../../interfaces/trip';

export interface ScheduleDateFilter {
  dateStart: string | null;
  dateEnd: string | null;
}

export function matchesScheduleDateFilter(trip: Trip, filter: ScheduleDateFilter): boolean {
  if (!filter?.dateStart || !filter?.dateEnd) return true;

  const scheduleDate = trip?.schedule?.schedule?.slice(0, 10);
  if (!scheduleDate) return true;

  return scheduleDate >= filter.dateStart && scheduleDate <= filter.dateEnd;
}

export function matchesDriverPool(trip: Trip, driverId: string | number | null | undefined): boolean {
  if (!trip?.favoriteDrivers) return true;

  const allowedDriverIds = trip.favoriteDrivers.split(',').map((id) => id.trim()).filter(Boolean);
  if (allowedDriverIds.length === 0) return true;

  return allowedDriverIds.includes(String(driverId));
}
