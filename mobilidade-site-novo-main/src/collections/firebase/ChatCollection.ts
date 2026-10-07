import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";

class ChatCollection {
  getCurrentMessages(tripReference: string, callback: any) {
    if (db) {
      const mountedQuery = query(
        collection(db, "messagesChatTrip"),
        where("tripReference", "==", tripReference),
        orderBy("date")
      );

      const unsub = onSnapshot(mountedQuery, (querySnapshot) => {
        querySnapshot.docChanges().forEach((doc) => {
          callback(doc.type, doc.doc.data());
        });
      });

      return () => {
        unsub();
      };
    }
  }

  getLastMessageUnread(tripReference: string, callback: any) {
    if (db) {
      const mounterQuery = db
        ?.collection("messagesChatTrip")
        .where("tripReference", "==", tripReference)
        .orderBy("date");

      return mounterQuery.onSnapshot((snapshot: any) => {
        snapshot.docChanges().map((change: any) => {
          if (change.type === "added") {
            const item = change.doc.data();

            if (!item.viewed) {
              callback({ item, id: change.doc.id });
            }
          }
        });
      });
    }
  }

  setViewMessage(id: number) {
    if (db) {
      db?.collection("messagesChatTrip").doc(id).update({ viewed: true });
    }
  }
}

export default ChatCollection;
