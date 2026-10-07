import io from 'socket.io-client';
import {buildApp} from '../../../constantBuild/config';
import Logger from '../../../utils/Logger';
import reactotron from 'reactotron-react-native';

type EventCallback<T = any> = (data: T) => void;

interface QueuedEvent {
  event: string;
  data: any;
}

export default class SocketConnection {
  private static instance: SocketConnection = null;

  static getInstance(): SocketConnection {
    if (!SocketConnection.instance) {
      SocketConnection.instance = new SocketConnection();
    }
    return SocketConnection.instance;
  }

  private readonly logger = new Logger(SocketConnection.name);
  private readonly url = buildApp().HOST_SOCKET;
  private readonly reconnectionAttempts = 5;
  private readonly reconnectionDelay = 5000;

  private socket: SocketIOClient.Socket | null = null;
  private listeners = new Map<string, Set<Function>>();
  private eventQueue: QueuedEvent[] = [];

  private constructor() {}

  connect(query?: Record<string, any>) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(this.url, {
      query,
      reconnection: true,
      reconnectionAttempts: this.reconnectionAttempts,
      reconnectionDelay: this.reconnectionDelay,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      upgrade: true,
      rememberUpgrade: true,
      forceNew: false,
    });

    this.registerCoreEvents();
    return this.socket;
  }

  disconnect() {
    if (this.socket && this.socket?.connected) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.eventQueue = [];
    }
  }

  on<T = any>(event: string, callback: EventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventSet = this.listeners.get(event)!;
    if (!eventSet.has(callback)) {
      reactotron.log(`✅ Evento "${event}" registrado com sucesso.`);

      eventSet.add(callback);
      this.socket?.on(event, callback);
    }
  }

  off(event: string, callback?: Function) {
    reactotron.log(`❌ Evento "${event}" removido com sucesso.`);

    if (!callback) {
      this.listeners.delete(event);
      this.socket?.off(event);
    } else {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      this.eventQueue.push({event, data});
    }
  }

  onConnect(callback: () => void) {
    this.socket.on('connect', callback);
  }

  getUrl(): string {
    if (!this.url) {
      this.logger.log(`❌ URL do Socket não definida. Defina a URL.`);
    }
    return this.url;
  }

  getSocket(): SocketIOClient.Socket {
    if (!this.socket || !this.socket?.connected) {
      this.logger.log(`❌ Socket não conectado. Realize o connect.`);
    }
    return this.socket;
  }

  private flushEventQueue() {
    while (this.eventQueue.length > 0) {
      const {event, data} = this.eventQueue.shift()!;
      this.socket?.emit(event, data);
    }
    this.logger.log(`⚡ ${this.eventQueue.length} eventos restaurados após reconexão.`);
  }

  private restoreListeners() {
    for (const [event, callbacks] of this.listeners.entries()) {
      for (const cb of callbacks) {
        this.socket?.on(event, cb);
      }
    }
    this.logger.log(`🦻 ${this.listeners.size} ouvintes restaurados após reconexão.`);
  }

  private registerCoreEvents() {
    this.socket.on('connect', () => {
      this.logger.log('🔗 Conectado ao socket: ', this.socket.id);

      this.flushEventQueue();
      this.restoreListeners();
    });

    this.socket.on('disconnect', () => {
      this.logger.log('🔴 Desconectado do socket:', this.socket.id);
    });

    this.socket.on('connect_error', (err: any) => {
      this.logger.log('❌ Erro de conexão do socket: ' + err);
    });
  }
}
