import { TripProps } from "../contexts/Trip/types";

export type TripCallbackData = {data: TripProps; type: string};
export type TripCallback = (payload: TripCallbackData) => void;

export interface ITripRealtime {
  checkTripAcceptedScheduled(userId: string, status?: string, callback?: TripCallback): string;
  checkTripAcceptedReadyScheduled(userId: string, callback: TripCallback): string;
  checkTripAccepted(userId: string, status?: string, callback?: TripCallback): string;
  getTrip(tripReference: string, callback: TripCallback): string;
  unsubscribe(key: string): void;
  disconnect(): void;
}
