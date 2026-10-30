import {
  collection,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_GET_BID_BY_DRIVERS,
  STATUS_IN_PROGRESS,
  STATUS_PRE_ACCEPTED,
  STATUS_SCHEDULED,
} from '../../../constants/trip';

import {TRIPS_PATH} from '../../../constants/firebase';
import {ITripRealtime, TripCallback} from '../../../interfaces/tripRealtime';
import IdGenerator from '../../../../../utils/IdGenerator';
import {Trip} from '../../../../../interfaces/trip';
import safeOnSnapshot from '~/utils/firestore/safeOnSnapshot';
import { db } from '~/common/services/firebase/config';

class TripCollection implements ITripRealtime {
  private unsubscribes: Map<string, () => void> = new Map();

  getTripScheduledAccepted(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();

    const mountedQuery = query(
      collection(db, 'trips'),
      where('driverId', '==', driverId),
      where('status', '==', STATUS_SCHEDULED),
      orderBy('date', 'desc'),
    );

    let initialLoad = true;

    const unsubscribe = safeOnSnapshot(mountedQuery, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (initialLoad && change.type === "added") {
          return;
        }
        callback({data: change.doc.data() as Trip, type: change.type});
      });

      initialLoad = false;
    });

    this.unsubscribes.set(id, unsubscribe);
    return id;
  }

  getTripOffer(
    cityId: string,
    tripTypeId: string,
    callback: TripCallback,
  ): string {
    const id = IdGenerator.basic();

    const mountedQuery = query(
      collection(db, 'trips'),
      where('cityId', '==', cityId),
      where('driverId', '==', null),
      where('tripTypeId', '==', tripTypeId),
      where('status', '==', STATUS_GET_BID_BY_DRIVERS),
      orderBy('date', 'desc'),
    );

    const unsubscribe = safeOnSnapshot(mountedQuery, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback({data: change.doc.data() as Trip, type: change.type});
      });
    });

    this.unsubscribes.set(id, unsubscribe);
    return id;
  }

  getTripScheduled(
    cityId: string,
    tripTypeId: string,
    callback: TripCallback,
  ): string {
    const id = IdGenerator.basic();

    const mountedQuery = query(
      collection(db, 'trips'),
      where('cityId', '==', cityId),
      where('driverId', '==', null),
      where('tripTypeId', '==', tripTypeId),
      where('status', '==', STATUS_SCHEDULED),
      orderBy('date', 'desc'),
    );

    let initialLoad = true;

    const unsubscribe = safeOnSnapshot(mountedQuery, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (initialLoad && change.type === "added") {
          return;
        }
        callback({data: change.doc.data() as Trip, type: change.type});
      });

      initialLoad = false;
    });

    this.unsubscribes.set(id, unsubscribe);
    return id;
  }

  searchTripInProgress(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();

    const mountedQuery = query(
      collection(db, 'trips'),
      where('driverId', '==', driverId),
      where('status', 'in', [
        STATUS_BOARDING,
        STATUS_ACCEPTED,
        STATUS_IN_PROGRESS,
        STATUS_PRE_ACCEPTED,
      ]),
      orderBy('date', 'desc'),
    );

    let initialLoad = true;

    const unsubscribe = safeOnSnapshot(mountedQuery, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (initialLoad && change.type === "added") {
          return;
        }
        callback({data: change.doc.data() as Trip, type: change.type});
      });

      initialLoad = false;
    });

    this.unsubscribes.set(id, unsubscribe);
    return id;
  }

  getTripScheduledAcceptedReady(driverId: string, callback?: TripCallback): string {
    const id = IdGenerator.basic();

    const mountedQuery = query(
      collection(db, 'trips'),
      where('driverId', '==', driverId),
      where("status", "==", STATUS_ACCEPTED),
      // where("schedule", "!=", null),
      limit(1),
    );

    const unsubscribe = safeOnSnapshot(mountedQuery, snapshot => {
      snapshot.docChanges().forEach(change => {
        const data: Trip = change.doc.data();

        if (data?.schedule !== null) {
          callback({data, type: change.type});
        }
      });
    });

    this.unsubscribes.set(id, unsubscribe);
    return id;
  }

  searchTrip(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();
    const driverKey = String(driverId);
    const numericId = Number(driverKey);
    const ids: Array<string | number> = [driverKey];
    if (driverKey !== '' && !Number.isNaN(numericId)) {
      ids.push(numericId);
    }

    const stops = ids.map(candidate => {
      const mountedQuery = query(
        collection(db, 'trips'),
        where('callingDriver', 'array-contains', candidate),
        limit(1),
      );

      return safeOnSnapshot(mountedQuery, snapshot => {
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data() as Trip;
          const assigned = (data as any)?.driverId || (data as any)?.driver;
          const status = (data as any)?.status;
          const searchable =
            change.type === 'removed' ||
            (!assigned &&
              (!status || status === 'searching' || status === 'searching_favorite'));
          if (!searchable) return;
          callback({data, type: change.type});
        });
      });
    });

    this.unsubscribes.set(id, () => {
      stops.forEach(stop => stop());
    });
    return id;
  }

  checkTripAccepted(driverId: string, callback: TripCallback): string {
    const id = IdGenerator.basic();

    const mountedQuery = query(
      collection(db, 'trips'),
      where('driverId', '==', driverId),
      where('status', '==', STATUS_ACCEPTED),
      limit(1),
    );

    const unsubscribe = safeOnSnapshot(mountedQuery, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback({data: change.doc.data() as Trip, type: change.type});
      });
    });

    this.unsubscribes.set(id, unsubscribe);
    return id;
  }

  getTrip(tripReference: string, callback: TripCallback): string {
    const id = IdGenerator.basic();

    const mountedQuery = query(
      collection(db, TRIPS_PATH),
      where('tripReference', '==', tripReference),
      limit(1),
    );

    const unsubscribe = safeOnSnapshot(mountedQuery, snapshot => {
      snapshot.docChanges().forEach(change => {
        callback({data: change.doc.data() as Trip, type: change.type});
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
    this.unsubscribes.forEach(unsub => unsub());
    this.unsubscribes.clear();
  }
}

export default TripCollection;
