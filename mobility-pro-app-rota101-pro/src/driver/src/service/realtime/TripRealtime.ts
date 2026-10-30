import SocketTrip from '../socket/collection/TripCollection';
import FirebaseTrip from '../firebase/collection/TripCollection';
import {ITripRealtime} from '../../interfaces/tripRealtime';
import {isRealtimeSocketEnabled} from '../../../../utils/realtime/realtimeSocketFlag';

export default class TripRealtime {
  private static instance: ITripRealtime;
  private static useSocket: boolean | null = null;

  private constructor() {}

  public static configure(useSocket: boolean): ITripRealtime {
    if (TripRealtime.instance && TripRealtime.useSocket === useSocket) {
      return TripRealtime.instance;
    }

    try {
      TripRealtime.instance?.disconnect();
    } catch (error) {
      console.warn('[TripRealtime] falha ao trocar o canal:', error);
    }

    TripRealtime.useSocket = useSocket;
    TripRealtime.instance = useSocket ? new SocketTrip() : new FirebaseTrip();
    return TripRealtime.instance;
  }

  public static getInstance(): ITripRealtime {
    if (!TripRealtime.instance) {
      return TripRealtime.configure(isRealtimeSocketEnabled());
    }

    return TripRealtime.instance;
  }
}
