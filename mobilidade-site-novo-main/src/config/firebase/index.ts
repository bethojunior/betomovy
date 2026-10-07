import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

export let firebaseConfig: FirestoreProps | undefined = undefined;

export let db: any;

export const InitFirebaseConfig = (config: FirestoreProps | undefined) => {
  if (config) {
    const app = initializeApp(config);
    db = getFirestore(app);
  }
};
