import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "..";
import { MESSAGES_CHAT_TRIP_PATH } from "../../../constants/firebase";

class ChatCollection {
  constructor() {
    this.query = null;
  }

  static getCurrentMessages(tripReference, callback) {
    this.query = query(
      collection(db, MESSAGES_CHAT_TRIP_PATH),
      where("tripReference", "==", tripReference),
      orderBy("date")
    );

    onSnapshot(this.query, (snapshot) => {
      callback(
        snapshot.docChanges().map((change) => {
          return {
            messageData: change.doc.data(),
            id: change.doc.id,
            type: change.type,
          };
        })
      );
    });
  }

  static getLastMessageUnread(tripReference, callback) {
    this.query = query(
      collection(db, MESSAGES_CHAT_TRIP_PATH),
      where("tripReference", "==", tripReference),
      orderBy("date")
    );

    onSnapshot(this.query, (snapshot) => {
      snapshot.docChanges().map((change) => {
        if (change.type === "added") {
          const item = change.doc.data();

          if (!item.viewed) {
            callback({ item, id: change.doc.id });
          }
        }
      });
    });
  }

  static setViewMessage(id) {
    updateDoc(doc(db, MESSAGES_CHAT_TRIP_PATH, id), {viewed: true});
  }
}

export default ChatCollection;