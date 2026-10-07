import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import db from '..';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_GET_BID_BY_DRIVERS,
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
} from '../../../constants/trip';
import {CallbackFirebase} from '../types';
import {TRIPS_PATH} from '../../../constants/firebase';

class TripCollection {
  createQuery = constraints => {
    return query(collection(db, TRIPS_PATH), ...constraints);
  };

  getTripScheduledAccepted = (driverId: string, callback: CallbackFirebase) => {
    const q = this.createQuery([
      where('driverId', '==', driverId),
      where('status', '==', STATUS_SCHEDULED),
      orderBy('date', 'desc'),
    ]);

    return this.subscribeToQuery(q, callback);
  };

  getTripOffer = (cityId, tripTypeId, callback) => {
    const q = this.createQuery([
      where('cityId', '==', cityId),
      where('driverId', '==', null),
      where('tripTypeId', '==', tripTypeId),
      where('status', '==', STATUS_GET_BID_BY_DRIVERS),
      orderBy('date', 'desc'),
    ]);

    this.subscribeToQuery(q, callback);
  };

  getTripScheduled = (
    cityId: string,
    tripTypeId: string,
    callback: CallbackFirebase,
  ) => {
    const q = this.createQuery([
      where('cityId', '==', cityId),
      where('driverId', '==', null),
      where('tripTypeId', '==', tripTypeId),
      where('status', '==', STATUS_SCHEDULED),
      orderBy('date', 'desc'),
    ]);

    this.subscribeToQuery(q, callback);
  };

  searchTripByStatus = (
    driverId: string,
    status = STATUS_ACCEPTED,
    callback: CallbackFirebase,
  ) => {
    const q = this.createQuery([
      where('driverId', '==', driverId),
      where('status', 'in', [STATUS_ACCEPTED, status, STATUS_IN_PROGRESS]),
      orderBy('date', 'desc'),
    ]);

    return this.subscribeToQuery(q, callback);
  };

  searchTripByStatusAll = (driverId: string, callback: CallbackFirebase) => {
    const q = this.createQuery([
      where('driverId', '==', driverId),
      where('status', 'in', [
        STATUS_ACCEPTED,
        STATUS_BOARDING,
        STATUS_IN_PROGRESS,
      ]),
      orderBy('date', 'desc'),
    ]);

    return this.subscribeToQuery(q, callback);
  };

  searchTripByStatusScheduled = (
    driverId: string,
    status = STATUS_ACCEPTED,
    callback: CallbackFirebase,
  ) => {
    const q = this.createQuery([
      where('driverId', '==', driverId),
      where('status', 'in', [status, STATUS_SCHEDULED]),
      orderBy('date', 'desc'),
    ]);

    this.subscribeToQuery(q, callback);
  };

  searchTrip = (driverId: string, callback: CallbackFirebase) => {
    const q = this.createQuery([
      where('callingDriver', 'array-contains', driverId),
      where('driver', '==', null),
      limit(1),
    ]);

    this.subscribeToQuery(q, callback);
  };

  checkTripAccepted = (driverId, callback) => {
    const q = this.createQuery([
      where('driverId', '==', driverId),
      where('status', '==', STATUS_ACCEPTED),
      limit(1),
    ]);

    this.subscribeToQuery(q, callback);
  };

  getTrip = (tripReference, callback) => {
    const q = this.createQuery([
      where('tripReference', '==', tripReference),
      limit(1),
    ]);

    this.subscribeToQuery(q, callback);
  };

  subscribeToQuery = (query, callback) => {
    return onSnapshot(
      query,
      (snapshot: QuerySnapshot) => {
        snapshot?.docChanges()?.forEach(change => {
          callback(change?.doc?.data(), change?.type);
        });
      },
      error => {
        console.error('Firestore subscription error:', error);
        // Handle error appropriately
      },
    );
  };
}

export default TripCollection;
