import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '~/common/services/firebase/config';

import {TRIPS_PATH} from '../../../constants/firebase';
import {STATUS_ACCEPTED, STATUS_BOARDING} from '../../../constants/trip';
import {ITripRealtime, TripCallback} from '../../../interfaces/tripRealtime';
import IdGenerator from '../../../../utils/IdGenerator';

class TripCollection implements ITripRealtime {
  private unsubscribes: Map<string, () => void> = new Map();
  private query: any;

  constructor() {
    this.query = null;
  }

  getTrip(tripReference: string, callback: TripCallback): string {
    const id = `getTrip:${IdGenerator.basic()}`;

    this.query = query(
      collection(db, TRIPS_PATH),
      where('tripReference', '==', tripReference),
      limit(1),
    );

    const unsubscribe = onSnapshot(this.query, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback({data: change.doc.data(), type: change.type});
      });
    });

    this.unsubscribes.set(id, unsubscribe);

    return id;
  }

  checkTripAccepted(
    userId: string,
    status = 'accepted',
    callback: TripCallback,
  ): string {
    const id = `checkTripAccepted:${IdGenerator.basic()}`;

    this.query = query(
      collection(db, TRIPS_PATH),
      where('userId', '==', userId),
      where('status', 'in', [STATUS_BOARDING, status]),
      limit(1),
    );

    const unsubscribe = onSnapshot(this.query, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback({data: change.doc.data(), type: change.type});
      });
    });

    this.unsubscribes.set(id, unsubscribe);

    return id;
  }

  checkTripAcceptedScheduled(
    userId: string,
    status = 'scheduled',
    callback: TripCallback,
  ): string {
    if (!userId) return;

    const id = `checkTripAcceptedScheduled:${IdGenerator.basic()}`;

    this.query = query(
      collection(db, TRIPS_PATH),
      where('userId', '==', userId),
      where('status', '==', status),
      limit(1),
    );

    const unsubscribe = onSnapshot(this.query, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback({data: change.doc.data(), type: change.type});
      });
    });

    this.unsubscribes.set(id, unsubscribe);

    return id;
  }

  checkTripAcceptedReadyScheduled(
    userId: string,
    callback: TripCallback,
  ): string {
    const id = `checkTripAcceptedReadyScheduled:${IdGenerator.basic()}`;

    this.query = query(
      collection(db, TRIPS_PATH),
      where('userId', '==', userId),
      where('status', '==', STATUS_ACCEPTED),
      limit(1),
    );

    const unsubscribe = onSnapshot(this.query, snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();

        if (data?.schedule !== null) {
          callback({data, type: change.type});
        }
      });
    });

    this.unsubscribes.set(id, unsubscribe);

    return id;
  }

  unsubscribe(id: string): void {
    if (this.unsubscribes.has(id)) {
      this.unsubscribes.get(id)!();
      this.unsubscribes.delete(id);
    }
  }

  disconnect(): void {
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.unsubscribes.clear();
  }
}

export default TripCollection;
