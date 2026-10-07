import SocketIOClient from "socket.io-client";

export default class AppSocket {
    constructor() {
        const socketURL = document.getElementById("header-host_websocket").value;

        this.socket = SocketIOClient(socketURL, {
            transport: ["websocket"]
        });
    }

    onEvent(name, callback) {
        this.socket.on(name, callback);
    }

    close() {
        this.socket.close();
    }
}
