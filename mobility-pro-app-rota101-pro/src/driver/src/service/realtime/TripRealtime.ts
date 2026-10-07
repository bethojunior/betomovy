import SocketTrip from '../socket/collection/TripCollection';
import FirebaseTrip from '../firebase/collection/TripCollection';
import {ITripRealtime} from '../../interfaces/tripRealtime';
import {isRealtimeSocketEnabled} from '../../../../utils/realtime/realtimeSocketFlag';

export default class TripRealtime {
  private static instance: ITripRealtime;

  private constructor() {}

  public static getInstance(): ITripRealtime {
    if (!TripRealtime.instance) {
      const useSocket = isRealtimeSocketEnabled();

      if (useSocket) {
        TripRealtime.instance = new SocketTrip();
      } else {
        TripRealtime.instance = new FirebaseTrip();
      }
    }

    return TripRealtime.instance;
  }
}
