import { db } from "../../config/firebase";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";

const nameCollection = "trips";

export const getTrips = async (tripReference: string, callback: any) => {
  if (db) {
    const refCollection = collection(db, nameCollection);
    const querySnapshot = query(
      refCollection,
      where("tripReference", "==", tripReference),
      limit(1)
    );

    const unsub = onSnapshot(querySnapshot, (querySnapshot) => {
      querySnapshot.docChanges().forEach((doc) => {
        callback(doc.type, doc.doc.data());
      });
    });

    return () => {
      unsub();
    };
  }
};

export const checkTripAccepted = async (
  userId: number,
  callback: any,
  status = "accepted"
) => {
  if (db) {
    const refCollection = collection(db, nameCollection);
    const querySnapshot = query(
      refCollection,
      where("userId", "==", userId),
      where("status", "==", status),
      limit(1)
    );

    const unsub = onSnapshot(querySnapshot, (querySnapshot) => {
      querySnapshot.docChanges().forEach((doc) => {
        callback(doc.type, doc.doc.data());
      });
    });

    return () => {
      unsub();
    };
  }
};
