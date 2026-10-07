import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketTrip from '../socket/collection/TripCollection';
import FirebaseTrip from '../firebase/collection/TripCollection';
import {STATUS_ACCEPTED} from '../../constants/trip';
import {CallbackFirebase} from '../firebase/types';

export class TripRealtime {
  private realtime: FirebaseTrip | SocketTrip;

  private async newRealtime(): Promise<FirebaseTrip | SocketTrip> {
    if(!this.realtime) {
      const generalSettings = await AsyncStorage.getItem('generalSettings');
    const enableRealtime = JSON.parse(generalSettings)?.find(
      item => item?.key === 'enable_realtime_socket',
    );
    this.realtime = Number(enableRealtime?.value)
      ? new SocketTrip()
      : new FirebaseTrip();
    }

    return this.realtime;
  }

  getTripScheduledAccepted(driverId: string, callback: CallbackFirebase) {
    this.newRealtime().then(realtime => {
      realtime.getTripScheduledAccepted(driverId, callback);
    });
  }

  getTripOffer(cityId, tripTypeId, callback) {
    this.newRealtime().then(realtime => {
      realtime.getTripOffer(cityId, tripTypeId, callback);
    });
  }

  getTripScheduled(
    cityId: string,
    tripTypeId: string = null,
    callback: CallbackFirebase = null,
  ) {
    this.newRealtime().then(realtime => {
      realtime.getTripScheduled(cityId, tripTypeId, callback);
    });
  }

  searchTripByStatus(
    driverId: string,
    status = STATUS_ACCEPTED,
    callback: CallbackFirebase,
  ) {
    this.newRealtime().then(realtime => {
      realtime.searchTripByStatus(driverId, status, callback);
    });
  }

  searchTripByStatusAll(driverId: string, callback: CallbackFirebase) {
    this.newRealtime().then(realtime => {
      realtime.searchTripByStatusAll(driverId, callback);
    });
  }

  searchTripByStatusScheduled(
    driverId: string,
    status = STATUS_ACCEPTED,
    callback: CallbackFirebase,
  ) {
    this.newRealtime().then(realtime => {
      realtime.searchTripByStatusScheduled(driverId, status, callback);
    });
  }

  searchTrip(driverId: string, callback: any = null) {
    this.newRealtime().then(realtime => {
      realtime.searchTrip(driverId, callback);
    });
  }

  checkTripAccepted(driverId, callback) {
    this.newRealtime().then(realtime => {
      realtime.checkTripAccepted(driverId, callback);
    });
  }

  getTrip(tripReference, callback) {
    this.newRealtime().then(realtime => {
      realtime.getTrip(tripReference, callback);
    });
  }
}
