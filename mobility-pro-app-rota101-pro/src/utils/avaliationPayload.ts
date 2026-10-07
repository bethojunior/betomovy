import {
  AvaliationMap,
  AvaliationPayload,
  BlacklistAddress,
  RiskAreaAddress,
} from '~/interfaces/avaliation';

type TripAvaliationData = {
  tripReference: string;
  origin: { address: string; latitude: number; longitude: number };
  destination: { name: string; latitude: number; longitude: number };
};

export function buildAvaliationPayload(
  map: AvaliationMap,
  trip: TripAvaliationData,
  userId: string | number,
  rating: number,
): AvaliationPayload {
  const blacklistAddresses: BlacklistAddress[] = [];

  if (map.selectedOrigin === 2) {
    blacklistAddresses.push({
      address: trip.origin.address,
      latitude: trip.origin.latitude,
      longitude: trip.origin.longitude,
    });
  }

  if (map.selectedDestination === 2) {
    blacklistAddresses.push({
      address: trip.destination.name,
      latitude: trip.destination.latitude,
      longitude: trip.destination.longitude,
    });
  }

  const riskAreas: RiskAreaAddress[] = [];

  if (map.securityOrigin === 2) {
    riskAreas.push({
      address: trip.origin.address,
      latitude: trip.origin.latitude,
      longitude: trip.origin.longitude,
      tripReference: trip.tripReference,
      userId,
    });
  }

  if (map.securityDestination === 2) {
    riskAreas.push({
      address: trip.destination.name,
      latitude: trip.destination.latitude,
      longitude: trip.destination.longitude,
      tripReference: trip.tripReference,
      userId,
    });
  }

  return { tripReference: trip.tripReference, rating, blacklistAddresses, riskAreas };
}
