import { isRealtimeSocketEnabled } from '../../utils/realtime/realtimeSocketFlag';
import TripRealtimeFirestore from './firebase/TripRealtimeFirestore';
import TripRealtimeSocket from './socket/TripRealtimeSocket';
import { ITripRealtime } from './interfaces/tripRealtime';

export default class TripRealtime {
  private static instance: ITripRealtime;

  private constructor() {}

  static getInstance(): ITripRealtime {
    if (!TripRealtime.instance) {
      TripRealtime.instance = isRealtimeSocketEnabled()
        ? new TripRealtimeSocket()
        : new TripRealtimeFirestore();
    }

    return TripRealtime.instance;
  }
}
