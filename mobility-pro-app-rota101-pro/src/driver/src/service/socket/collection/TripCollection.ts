import {
  ITripRealtime,
  TripCallback,
  TripCallbackData,
} from '../../../interfaces/tripRealtime';
import IdGenerator from '../../../../../utils/IdGenerator';
import {SocketConnection} from '../../../../../common/services/socket';
import {TRIP_EVENTS} from '../events/tripEvents';

interface TripSubscriptionEntry {
  eventName: string;
  listener: TripCallback;
  cleanupEventName?: string;
  cleanupListener?: TripCallback;
}

class TripCollection implements ITripRealtime {
  private socket = SocketConnection.getInstance();
  private subs = new Map<string, TripSubscriptionEntry>();

  getTripScheduledAccepted(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();
    const eventName = TRIP_EVENTS.TRIP_SCHEDULED_ACCEPTED;

    this.subs.set(id, {eventName, listener: callback});
    this.socket?.on(eventName, callback);
    return id;
  }

  getTripOffer(cityId: string, tripTypeId: string, callback: TripCallback): string {
    const eventName = TRIP_EVENTS.TRIP_OFFER_AVAILABLE;
    const id = `${eventName}:${callback}`;

    this.socket?.emit(TRIP_EVENTS.JOIN_ROOM, {cityId, callType: tripTypeId});

    if (!this.subs.has(id)) {
      this.subs.set(id, {eventName, listener: callback});
      this.socket?.on(eventName, callback);
    }

    return id;
  }

  getTripScheduled(cityId: string, tripTypeId: string, callback: TripCallback): string {
    const eventName = TRIP_EVENTS.TRIP_SCHEDULED_AVAILABLE;
    const id = `${eventName}:${callback}`;

    this.socket?.emit(TRIP_EVENTS.JOIN_ROOM, {cityId, callType: tripTypeId});

    if (!this.subs.has(id)) {
      this.subs.set(id, {eventName, listener: callback});
      this.socket?.on(eventName, callback);
    }

    return id;
  }

  searchTripInProgress(driverId: string, callback: TripCallback): string {
    const eventName = TRIP_EVENTS.TRIP_UPDATED_STATUS;
    const id = `${eventName}:${callback}`;

    if (!this.subs.has(id)) {
      this.subs.set(id, {eventName, listener: callback});
      this.socket?.on(eventName, callback);
    }

    return id;
  }

  getTripScheduledAcceptedReady(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();
    const eventName = TRIP_EVENTS.TRIP_SCHEDULED_ACCEPTED_READY;

    this.subs.set(id, {eventName, listener: callback});
    this.socket?.on(eventName, callback);
    return id;
  }

  searchTrip(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();
    const eventName = TRIP_EVENTS.TRIP_AVAILABLE;

    if (driverId) {
      this.socket?.emit(TRIP_EVENTS.JOIN_ROOM, { driverId });
    }

    this.subs.set(id, {eventName, listener: callback});
    this.socket?.on(eventName, callback);
    return id;
  }

  checkTripAccepted(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();
    const eventName = TRIP_EVENTS.TRIP_ACCEPTED;

    this.subs.set(id, {eventName, listener: callback});
    this.socket?.on(eventName, callback);
    return id;
  }

  getTrip(tripReference: string, callback: TripCallback): string {
    const eventUpdate = TRIP_EVENTS.TRIP_UPDATED;
    const id = `${eventUpdate}:${tripReference}:${callback}`;

    if (!this.subs.has(id)) {
      this.subs.set(id, { eventName: eventUpdate, listener: callback});
      this.socket?.on(eventUpdate, callback);
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

    this.subs.forEach(entry => {
      this.socket?.off(entry.eventName, entry.listener);

      if (entry?.cleanupEventName && entry?.cleanupListener) {
        this.socket?.off(entry.cleanupEventName, entry.cleanupListener);
      }
    });

    this.subs.clear();
    this.socket?.disconnect();
  }
}

export default TripCollection;
