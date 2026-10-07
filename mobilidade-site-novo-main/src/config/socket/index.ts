// @ts-nocheck
import SocketIOClient from "socket.io-client";

export default class AppSocket {
  constructor(url: string, options?: any = null) {
    this.socket = SocketIOClient(url, options);
  }

  onEvent(name, callback) {
    this.socket.on(name, callback);
  }

  onOff(name, callback) {
    this.socket.off(name, callback);
  }

  close() {
    this.socket.close();
  }

  onEmit(name, object) {
    this.socket.emit(name, object);
  }
}
