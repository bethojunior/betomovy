import AppSocket from '../../socket';
import Session from '../../../utils/Session';
import { ITripRealtime, TripCallback } from '../interfaces/tripRealtime';

const EVENT_TRIP_UPDATED_LIST = 'trip-updated-list';

export default class TripRealtimeSocket implements ITripRealtime {
  private socket: AppSocket;
  private subs = new Map<string, { eventName: string; listener: (...args: any[]) => void }>();

  constructor() {
    const cityId = Session.getLocal('citySelected')?.cityId;

    this.socket = AppSocket.getInstance({
      query: { cityId },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.socket.emit('join-room', { cityId });
    });
  }

  getActiveTrips(cityId: string, callback: TripCallback): string {
    const id = `${EVENT_TRIP_UPDATED_LIST}:${cityId}:${Date.now()}:${Math.random()}`;

    const listener = (payload: any) => {
      const payloads = Array.isArray(payload) ? payload : [payload];
      payloads.forEach((item) => {
        callback({ data: item?.data ?? item, type: item?.type });
      });
    };

    this.socket.on(EVENT_TRIP_UPDATED_LIST, listener);
    this.subs.set(id, { eventName: EVENT_TRIP_UPDATED_LIST, listener });
    return id;
  }

  unsubscribe(id: string): void {
    const entry = this.subs.get(id);
    if (entry) {
      this.socket.off(entry.eventName, entry.listener);
      this.subs.delete(id);
    }
  }
}
