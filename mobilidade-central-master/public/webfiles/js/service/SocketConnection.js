class SocketConnection {
    constructor() {
        if (SocketConnection.instance) {
            return SocketConnection.instance;
        }

        this.url = environment.hosts.hostSocketApi;
        this.reconnectionAttempts = 5;
        this.reconnectionDelay = 5000;

        this.socket = null;
        this.listeners = new Map();
        this.eventQueue = [];

        SocketConnection.instance = this;
    }

    connect(query) {
        if (this.socket && this.socket.connected) return this;

        const userId = parseInt(Session.getValueInSession("user", "idUser"));
        const name = Session.getValueInSession("user", "name");

        this.socket = io(this.url, {
            query: query || { userId, name, type: "central" },
            reconnection: true,
            reconnectionAttempts: this.reconnectionAttempts,
            reconnectionDelay: this.reconnectionDelay,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            transports: ["websocket", "polling"], // websocket primeiro, polling como fallback
            upgrade: true,
            rememberUpgrade: true,
            forceNew: false,
        });

        this.registerCoreEvents();
        return this;
    }

    disconnect() {
        if (this.socket && this.socket.connected) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
            this.eventQueue = [];
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        const eventSet = this.listeners.get(event);
        if (!eventSet.has(callback)) {
            console.log(`✅ Evento "${event}" registrado com sucesso.`);

            eventSet.add(callback);
            if (this.socket) {
                this.socket.on(event, callback);
            }
        }
    }

    off(event, callback) {
        console.log(`❌ Evento "${event}" removido.`);

        if (!callback) {
            this.listeners.delete(event);
            if (this.socket) this.socket.off(event);
        } else {
            const set = this.listeners.get(event);
            if (set) set.delete(callback);
            if (this.socket) this.socket.off(event, callback);
        }
    }

    emit(event, data) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(event, data);
        } else {
            this.eventQueue.push({ event, data });
        }
    }

    onConnect(callback) {
        if (this.socket) {
            this.socket.on("connect", callback);
        }
    }

    flushEventQueue() {
        while (this.eventQueue.length > 0) {
            const { event, data } = this.eventQueue.shift();
            if (this.socket) {
                this.socket.emit(event, data);
            }
        }
        console.log(
            `⚡ ${this.eventQueue.length} eventos restaurados após reconexão.`
        );
    }

    restoreListeners() {
        for (const [event, callbacks] of this.listeners.entries()) {
            for (const cb of callbacks) {
                if (this.socket) {
                    this.socket.on(event, cb);
                }
            }
        }
        console.log(
            `🦻 ${this.listeners.size} ouvintes restaurados após reconexão.`
        );
    }

    registerCoreEvents() {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("🔗 Conectado ao socket:", this.socket.id);

            this.flushEventQueue();
            this.restoreListeners();
        });

        this.socket.on("disconnect", () => {
            console.log("🔴 Desconectado do socket:", this.socket.id);
        });

        this.socket.on("connect_error", (err) => {
            console.error("❌ Erro de conexão do socket:", err);
        });
    }
}

const socketConnection = new SocketConnection().connect();
