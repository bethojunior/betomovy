import {
  ITripRealtime,
  TripCallback,
  TripCallbackData,
} from '../../../interfaces/tripRealtime';
import {SocketConnection} from '../../../../common/services/socket';
import {TRIP_EVENTS} from '../events/tripEvents';

interface TripSubscriptionEntry {
  eventName: string;
  listener: TripCallback;
  cleanupEventName?: string;
  cleanupListener?: TripCallback;
}

export default class TripCollection implements ITripRealtime {
  private socket = SocketConnection.getInstance();
  private subs = new Map<string, TripSubscriptionEntry>();

  checkTripAccepted(userId: string, status: string, callback: TripCallback): string {
    const eventName = TRIP_EVENTS.TRIP_ACCEPTED;
    const id = `${eventName}:${callback}`;

    this.subs.set(id, {eventName, listener: callback});
    this.socket?.on(eventName, callback);
    return id;
  }

  checkTripAcceptedScheduled(userId: string, status, callback: TripCallback): string {
    const eventName = TRIP_EVENTS.TRIP_SCHEDULED_ACCEPTED;
    const id = `${eventName}:${callback}`;

    this.subs.set(id, {eventName, listener: callback});
    this.socket?.on(eventName, callback);
    return id;
  }

  checkTripAcceptedReadyScheduled(userId: string, callback: TripCallback): string {
    const eventName = TRIP_EVENTS.TRIP_SCHEDULED_ACCEPTED_READY;
    const id = `${eventName}:${callback}`;

    this.subs.set(id, {eventName, listener: callback});
    this.socket?.on(eventName, callback);
    return id;
  }

  getTrip(tripReference: string, callback: TripCallback): string {
    const eventUpdate = TRIP_EVENTS.TRIP_UPDATED;
    const eventAccepted = TRIP_EVENTS.TRIP_ACCEPTED;
    const eventCanceled = TRIP_EVENTS.TRIP_CANCELED;

    const id = `${eventUpdate}:${tripReference}:${callback}`;

    if (!this.subs.has(id)) {
      const handleAccepted = (payload: TripCallbackData) => {
        if (!payload?.data || (payload.data.tripReference && payload.data.tripReference !== tripReference)) {
          return;
        }
        callback(payload);
      };

      const handleCanceled = (payload: TripCallbackData) => {
        if (!payload?.data || (payload.data.tripReference && payload.data.tripReference !== tripReference)) {
          return;
        }
        this.socket?.off(eventUpdate, callback);
        this.socket?.off(eventAccepted, handleAccepted);
        this.socket?.off(eventCanceled, handleCanceled);
        this.subs.delete(id);
      };

      this.subs.set(id, {
        eventName: eventUpdate,
        listener: callback,
        cleanupEventName: eventCanceled,
        cleanupListener: handleCanceled,
      });

      this.socket?.on(eventUpdate, callback);
      this.socket?.on(eventAccepted, handleAccepted);
      this.socket?.on(eventCanceled, handleCanceled);
    }

    return id;
  }

  unsubscribe(id: string): void {
    if (this.subs.has(id)) {
      const entry = this.subs.get(id);

      this.socket?.off(entry.eventName, entry.listener);

      if (entry?.cleanupEventName && entry?.cleanupListener) {
        this.socket?.off(entry.cleanupEventName, entry.cleanupListener);
      }

      this.subs.delete(id);
    }
  }

  disconnect(): void {
    if (this.socket) return;

    this.subs.forEach((entry) => {
      this.socket?.off(entry.eventName, entry.listener);

      if (entry?.cleanupEventName && entry?.cleanupListener) {
        this.socket?.off(entry.cleanupEventName, entry.cleanupListener);
      }
    });

    this.subs.clear();
    this.socket?.disconnect();
  }
}
