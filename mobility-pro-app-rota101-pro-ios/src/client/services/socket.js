import SocketIOClient from 'socket.io-client';
import { buildApp } from '../../constantBuild/config';

export default class AppSocket {
  constructor(url = null, options = null) {
    this.socket = SocketIOClient(url || buildApp().HOST_SOCKET, options);
  }

  onEvent(name, callback) {
    this.socket.on(name, callback);
  }

  close() {
    this.socket.close();
  }

  onEmit(name, object) {
    this.socket.emit(name, object);
  }
}
