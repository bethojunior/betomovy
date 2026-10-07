import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketChat from '../socket/collection/ChatCollection';
import FirebaseChat from '../firebase/collection/ChatCollection';

export class ChatRealtime {
  realtime;

  async newRealtime() {
    if(!this.realtime) {
      const generalSettings = await AsyncStorage.getItem('generalSettings');
    const enableRealtime = JSON.parse(generalSettings).find(
      item => item.key === 'enable_realtime_socket',
    );
    this.realtime = Number(enableRealtime?.value)
      ? new SocketChat()
      : new FirebaseChat();
    }

    return this.realtime;
  }

  getCurrentMessages(tripReference, callback) {
    this.newRealtime().then(realtime => {
      realtime.getCurrentMessages(tripReference, callback);
    });
  }

  getLastMessageUnread(tripReference, callback) {
    this.newRealtime().then(realtime => {
      realtime.getLastMessageUnread(tripReference, callback);
    });
  }

  setViewMessage(id, tripReference) {
    this.newRealtime().then(realtime => {
      realtime.setViewMessage(id, tripReference);
    });
  }
}
