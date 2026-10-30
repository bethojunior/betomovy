import { PayloadType, TripEventsType } from './trip-events-type.enum';

export type Payload<T = any> = { data: T; type: PayloadType };

export class RealtimeEventsHelper {
  static extractCallingDriverIds(trip: any): string[] {
    if (!trip) return [];

    const raw = trip.callingDriver;
    let ids: unknown[] = [];

    if (Array.isArray(raw)) {
      ids = raw;
    } else if (typeof raw === 'string') {
      ids = raw.split(',');
    } else if (typeof raw === 'number') {
      ids = [raw];
    }

    return ids
      .map((id) => String(id ?? '').trim())
      .filter((id) => id.length > 0 && id !== 'null' && id !== 'undefined');
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
