import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import api from '../api';

interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let dbPromise: Promise<Firestore> | null = null;

function fetchFirebaseConfig(): Promise<FirebaseWebConfig> {
  return api
    .get<{ status: boolean; response: string }>('/config/firebase_cloud_firestore_key')
    .then((response) => JSON.parse(response.data.response));
}

export function getFirestoreDb(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = fetchFirebaseConfig()
      .then((firebaseConfig) => {
        if (!firebaseConfig?.projectId) {
          throw new Error('Sem configuração de firebase');
        }

        return getFirestore(initializeApp(firebaseConfig));
      })
      .catch((error) => {
        dbPromise = null;
        throw error;
      });
  }

  return dbPromise;
}
