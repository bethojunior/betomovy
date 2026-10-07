import {collection, limit, onSnapshot, query, where} from 'firebase/firestore';
import db from '..';
import {TRIPS_PATH} from '../../../constants/firebase';
import { STATUS_BOARDING } from '../../../constants/trip';

class TripCollection {
  constructor() {
    this.query = null;
  }

   getTrip(tripReference, callback) {
    this.query = query(
      collection(db, TRIPS_PATH),
      where('tripReference', '==', tripReference),
      limit(1),
    );

    onSnapshot(this.query, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback(change.doc.data(), change.type);
      });
    });
  }

  checkTripAccepted(userId, status = 'accepted', callback) {
    this.query = query(
      collection(db, TRIPS_PATH),
      where('userId', '==', userId),
      where('status', 'in', [STATUS_BOARDING, status]),
      limit(1),
    );

    onSnapshot(this.query, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback(change.doc.data(), change.type);
      });
    });
  }

  checkTripAcceptedScheduled(userId, status = 'scheduled', callback) {
    if(!userId) return;
    this.query = query(
      collection(db, TRIPS_PATH),
      where('userId', '==', userId),
      where('status', '==', status),
      limit(1),
    );

    onSnapshot(this.query, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback(change.doc.data(), change.type);
      });
    });
  }
}

export default TripCollection;
