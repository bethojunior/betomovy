import io from 'socket.io-client';
import {SocketConnection} from '../../common/services/socket';
import Logger from '../../utils/Logger';
import Helper from '../utils/Helper';

function isMatchUrl(currentUrl, compareUrl) {
  return (
    Helper.normalizeSocketUrl(currentUrl) ===
    Helper.normalizeSocketUrl(compareUrl)
  );
}

export default class AppSocket {
  logger = new Logger(AppSocket.name);

  constructor(url = null, options = {}) {
    this.url = url;
    this.options = options;
    this.socket = this.getOrCreateSocket(url, options);
  }

  getOrCreateSocket(url, options) {
    const connection = SocketConnection.getInstance();

    if (connection && isMatchUrl(connection.getUrl(), url)) {
      this.log(`Reaproveitando conexão para ${url}`);
      return connection.getSocket();
    }

    this.log(`Criando nova conexão para ${url}`);
    return io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
      ...options,
    });
  }

  onEvent(name, callback) {
    this.socket?.on(name, callback);
  }

  onOff(eventName) {
    this.socket?.off(eventName);
  }

  close() {
    this.socket?.close();
  }

  on(handle) {
    this.socket?.on('connect', handle);
  }

  onEmit(name, object, callback = () => {}) {
    this.socket?.emit(name, object, callback);
  }
}
