import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getFirestoreDb } from '../../firebase';
import { ITripRealtime, TripCallback } from '../interfaces/tripRealtime';

const TRIPS_PATH = 'trips';

export default class TripRealtimeFirestore implements ITripRealtime {
  private subs = new Map<string, () => void>();

  getActiveTrips(cityId: string, callback: TripCallback): string {
    const id = `activeTrips:${cityId}:${Date.now()}:${Math.random()}`;
    let isFirstSnapshot = true;
    let canceled = false;

    this.subs.set(id, () => {
      canceled = true;
    });

    getFirestoreDb()
      .then((db) => {
        if (canceled) return;

        const mountedQuery = query(collection(db, TRIPS_PATH), where('cityId', '==', cityId));

        const unsubscribe = onSnapshot(mountedQuery, (snapshot) => {
          if (isFirstSnapshot) {
            isFirstSnapshot = false;
            return;
          }

          snapshot.docChanges().forEach((change) => {
            callback({ data: change.doc.data(), type: change.type });
          });
        });

        if (canceled) {
          unsubscribe();
          return;
        }

        this.subs.set(id, unsubscribe);
      })
      .catch((error) => {
        console.error('Erro ao iniciar realtime de viagens ativas (Firestore):', error);
      });

    return id;
  }

  unsubscribe(id: string): void {
    const unsub = this.subs.get(id);
    if (unsub) {
      unsub();
      this.subs.delete(id);
    }
  }
}
