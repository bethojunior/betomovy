import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

let socketInstance: AppSocket | null = null;
let socketInstanceKey: string | null = null;

export default class AppSocket {
  private socket: Socket;
  
  constructor(options: Partial<ManagerOptions & SocketOptions>) {
    const transport = options.transports?.[0] || 'polling';
    
    const socketOptions = {
      ...options,
      transports: [transport] as string[],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    };
    
    this.socket = io(import.meta.env.HOST_SOCKET || "", socketOptions);
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    this.socket.on(eventName, callback);
  }

  emit(eventName: string, object: {}) {
    this.socket.emit(eventName, object);
  }

  off(eventName: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket.off(eventName, callback);
    } else {
      this.socket.off(eventName);
    }
  }

  disconnect() {
    this.socket.disconnect();
  }

  getTransport() {
    return this.socket.io.engine.transport.name;
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket.connected;
  }

  static getInstance(
    options: Partial<ManagerOptions & SocketOptions>,
    forceNew: boolean = false
  ): AppSocket {
    const cityId = (options.query as any)?.cityId;
    const transport = options.transports?.[0] || 'polling';
    const key = `${cityId}-${transport}`;

    if (!forceNew && socketInstance && socketInstanceKey === key && socketInstance.isConnected()) {
      return socketInstance;
    }

    socketInstance = new AppSocket(options);
    socketInstanceKey = key;
    return socketInstance;
  }

  static clearInstance() {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      socketInstanceKey = null;
    }
  }
}
