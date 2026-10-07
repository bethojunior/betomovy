class SocketConnection {
    constructor() {
        this.url = SOCKET_IO_HOST || "";
        this.reconnectionAttempts = 5;
        this.reconnectionDelay = 5000;
        this.socket = null;
        this.listeners = new Map();
        this.eventQueue = [];
        this.context = "www/webfiles/js/service/SocketConnection";
    }

    connect(query) {
        if (this.socket && this.socket.connected) return this;

        const driverId = Session.getValueInSession("user", "idDriver");
        const name = Session.getValueInSession("user", "nickname");

        this.socket = io(this.url, {
            query: query || { driverId, name, app: NAME_PROJECT },
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
            if (this.socket.connected) {
                callback();
            }
        }
    }

    flushEventQueue() {
        while (this.eventQueue.length > 0) {
            const { event, data } = this.eventQueue.shift();
            if (this.socket) {
                this.socket.emit(event, data);
            }
        }
        console.log(`⚡ ${this.eventQueue.length} eventos restaurados após reconexão.`);
    }

    restoreListeners() {
        for (const [event, callbacks] of this.listeners.entries()) {
            for (const cb of callbacks) {
                if (this.socket) {
                    this.socket.on(event, cb);
                }
            }
        }
        console.log(`🦻 ${this.listeners.size} ouvintes restaurados após reconexão.`);
    }

    registerCoreEvents() {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("🔗 Conectado ao socket:", this.socket.id);
            PreloadRequest.success("Conectado!");

            this.flushEventQueue();
            this.restoreListeners();
        });

        this.socket.on("disconnect", async () => {
            console.log("🔴 Desconectado do socket:", this.socket.id);
            PreloadRequest.progress("Estabelecendo conexão...");

            const appName = await getUnifiedAppName();
            const pulse = new Pulse(`${appName}_${PULSE_APP}`, PULSE_GROUPID_SOCKET_REAL_TIME);

            pulse.send("Socket de conexão foi desconectado", this.context, "warn");
        });

        this.socket.on("connect_error", (err) => {
            console.error("❌ Erro de conexão do socket:", err);
            PreloadRequest.info("Sem conexão.");
        });
    }
}

const socketConnection = new SocketConnection().connect();
