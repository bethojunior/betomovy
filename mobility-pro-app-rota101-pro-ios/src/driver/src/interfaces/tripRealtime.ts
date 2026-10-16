import { Trip } from "../../../interfaces/trip";

export type TripCallbackData = {data: Trip; type: string};
export type TripCallback = (payload: TripCallbackData) => void;

export interface ITripRealtime {
  getTripScheduledAccepted(driverId: string, callback: TripCallback): string;
  getTripOffer(cityId: string, tripTypeId: string, callback: TripCallback): string;
  getTripScheduled(cityId: string, tripTypeId?: string, callback?: TripCallback): string;
  getTripScheduledAcceptedReady(driverId: string, callback?: TripCallback): string;
  getTrip(tripReference: string, callback: TripCallback): string;
  searchTripInProgress(driverId: string, callback?: TripCallback): string;
  searchTrip(driverId: string, callback?: TripCallback): string;
  checkTripAccepted(driverId: string, callback: TripCallback): string;
  unsubscribe(id: string): void;
  disconnect(): void;
}
