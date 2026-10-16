import {calculateDistance} from '../../utils/geolocation';

// Formata em km/m no padrão pt-BR (ex: "3,2 km", "850 m").
export function formatDistanceLabel(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }

  return `${distanceInKm.toFixed(1).replace('.', ',')} km`;
}

export function formatDistanceFromCurrentPosition(
  currentLatitude: number,
  currentLongitude: number,
  targetLatitude: number,
  targetLongitude: number,
): string {
  const distanceInKm = calculateDistance(
    currentLatitude,
    currentLongitude,
    targetLatitude,
    targetLongitude,
  );

  return formatDistanceLabel(distanceInKm);
}
