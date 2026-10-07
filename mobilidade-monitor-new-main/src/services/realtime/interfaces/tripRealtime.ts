export type TripCallbackData<T = any> = { data: T; type: string };
export type TripCallback<T = any> = (payload: TripCallbackData<T>) => void;

export interface ITripRealtime {
  getActiveTrips(cityId: string, callback: TripCallback): string;
  unsubscribe(id: string): void;
}
