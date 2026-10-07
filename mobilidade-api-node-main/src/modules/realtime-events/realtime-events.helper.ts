import { PayloadType, TripEventsType } from './trip-events-type.enum';

export type Payload<T = any> = { data: T; type: PayloadType };

export class RealtimeEventsHelper {
  static extractCallingDriverIds(trip: any): string[] {
    if (Array.isArray(trip.callingDriver)) {
      return trip.callingDriver;
    } else if (typeof trip.callingDriver === 'string') {
      return trip.callingDriver.split(',').filter(Boolean);
    }
    return [];
  }

  static mapEventToPayloadType(event: string): PayloadType {
    const events: Record<TripEventsType, PayloadType> = {
      'trip-created': 'added',
      'trip-updated': 'modified',
      'trip-deleted': 'removed',
    };

    return events[event] || 'modified';
  }

  static isTripSchedule(trip: any): boolean {
    return !!trip?.schedule;
  }
}
