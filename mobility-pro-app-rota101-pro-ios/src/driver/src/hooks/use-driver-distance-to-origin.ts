import { useMemo } from 'react';
import { Trip } from '../../../interfaces/trip';
import { getDistanceFromLatLonInMeters } from '~/client/utils/position';
import { useLocalProvider } from '../context/local';

interface UseDriverDistanceToOriginResult {
  distanceKm: string | null;
}

export function useDriverDistanceToOrigin(trip: Trip): UseDriverDistanceToOriginResult {
  const { location } = useLocalProvider();
  const distanceKm = useMemo((): string | null => {
    const driverLatitude = Number(location?.coords?.latitude);
    const driverLongitude = Number(location?.coords?.longitude);
    const originLatitude = Number(trip?.origin?.latitude);
    const originLongitude = Number(trip?.origin?.longitude);
    const hasValidCoordinates = [
      driverLatitude,
      driverLongitude,
      originLatitude,
      originLongitude,
    ].every((coordinate: number) => Number.isFinite(coordinate));
    if (!hasValidCoordinates) return null;
    const distanceInMeters = getDistanceFromLatLonInMeters(
      driverLatitude,
      driverLongitude,
      originLatitude,
      originLongitude,
    );
    return (distanceInMeters / 1000).toFixed(1);
  }, [
    location?.coords?.latitude,
    location?.coords?.longitude,
    trip?.origin?.latitude,
    trip?.origin?.longitude,
  ]);
  return { distanceKm };
}
