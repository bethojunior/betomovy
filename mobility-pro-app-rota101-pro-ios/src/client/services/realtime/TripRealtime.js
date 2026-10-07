import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketTrip from '../socket/collection/TripCollection';
import FirebaseTrip from '../firebase/collection/TripCollection';

export class TripRealtime {
  realtime;

  async newRealtime() {
    if (!this.realtime) {
      const generalSettings = await AsyncStorage.getItem('generalSettings');
      const enableRealtime = JSON.parse(generalSettings).find(
        item => item.key === 'enable_realtime_socket',
      );
      this.realtime = Number(enableRealtime?.value)
        ? new SocketTrip()
        : new FirebaseTrip();
    }
    return this.realtime;
  }

  checkTripAcceptedScheduled(userId, status, callback) {
    this.newRealtime().then(realtime => {
      realtime.checkTripAcceptedScheduled(userId, status, callback);
    });
  }

  checkTripAccepted(userId, status, callback) {
    this.newRealtime().then(realtime => {
      realtime.checkTripAccepted(userId, status, callback);
    });
  }

  getTrip(tripReference, callback) {
    this.newRealtime().then(realtime => {
      realtime.getTrip(tripReference, callback);
    });
  }
}
