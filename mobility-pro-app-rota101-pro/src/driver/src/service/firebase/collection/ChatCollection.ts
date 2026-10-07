import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '~/common/services/firebase/config';

import {MESSAGES_CHAT_TRIP_PATH} from '../../../constants/firebase';

class ChatCollection {
  getCurrentMessages(tripReference, callback) {
    const mountedQuery = query(
      collection(db, MESSAGES_CHAT_TRIP_PATH),
      where('tripReference', '==', tripReference),
      orderBy('date'),
    );

    return onSnapshot(mountedQuery, snapshot => {
      callback(
        snapshot.docChanges().map(change => {
          return {
            messageData: change.doc.data(),
            id: change.doc.id,
            type: change.type,
          };
        }),
      );
    });
  }

  getLastMessageUnread(tripReference, callback) {
    const mounterQuery = query(
      collection(db, MESSAGES_CHAT_TRIP_PATH),
      where('tripReference', '==', tripReference),
      orderBy('date'),
    );

    return onSnapshot(mounterQuery, snapshot => {
      snapshot.docChanges().map(change => {
        if (change.type === 'added') {
          const item = change.doc.data();

          if (!item.viewed) {
            callback({item, id: change.doc.id});
          }
        }
      });
    });
  }

  setViewMessage(id) {
    updateDoc(doc(db, MESSAGES_CHAT_TRIP_PATH, id), {viewed: true});
  }
}

export default ChatCollection;
