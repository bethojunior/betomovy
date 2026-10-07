import { Trip } from "../../../../../interfaces/trip";

export function shouldOpenAppForOfferTrip(trip: Trip, previousTrips: Trip[], driverId?: string) {
  const previousTrip = previousTrips.find(t => t.tripReference === trip.tripReference);
  const previousBid = previousTrip?.tripBids?.find(b => b.driverId === driverId);
  const currentBid = trip.tripBids?.find(b => b.driverId === driverId);
  const hasAnyBid = (trip.tripBids?.length ?? 0) > 0;

  return (
    !hasAnyBid ||
    (previousBid && currentBid && previousBid.price !== currentBid.price)
  );
}
