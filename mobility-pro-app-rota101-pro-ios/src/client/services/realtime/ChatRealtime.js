import FirebaseChat from '../firebase/collection/ChatCollection';

export class ChatRealtime {
  realtime = new FirebaseChat();

  getCurrentMessages(tripReference, callback) {
    return this.realtime.getCurrentMessages(tripReference, callback);
  }

  getLastMessageUnread(tripReference, callback) {
    return this.realtime.getLastMessageUnread(tripReference, callback);
  }

  setViewMessage(id, tripReference) {
    this.realtime.setViewMessage(id, tripReference);
  }
}
