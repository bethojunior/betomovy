class TripRealtimeSocket {
    subs = new Map();
    events = {
        TRIP_UPDATED_LIST: "trip-updated-list",
        TRIP_UPDATED: "trip-updated",
    };

    constructor(connection) {
        this.connection = connection || socketConnection;
        this.joinRoom();
    }

    joinRoom() {
        const userId = parseInt(Session.getValueInSession("user", "idUser"));
        if (!userId) return;

        this.connection.onConnect(() => {
            this.connection.emit("join-room", { userId });
        });
    }

    unsubscribe(id) {
        if (this.subs.has(id)) {
            const entry = this.subs.get(id);
            this.connection.off(entry.eventName, entry.listener);
            this.subs.delete(id);
        }
    }

    getTrips(idCentral, callback) {
        const event = this.events.TRIP_UPDATED_LIST;
        const id = `${event}:${idCentral}:${callback}`;

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName: event, listener: callback });
            this.connection.on(event, callback);
        }

        return id;
    }

    getTrip(tripReference, callback) {
        const event = this.events.TRIP_UPDATED;
        const tripUpdate = (trip) => {
            if (trip?.data?.tripReference !== tripReference) return;
            callback(trip.data, trip.type);
        };
        const id = `${event}:${tripReference}:${Date.now()}:${Math.random()}`;

        this.subs.set(id, { eventName: event, listener: tripUpdate });
        this.connection.on(event, tripUpdate);

        return id;
    }
}

const tripRealtimeSocket = new TripRealtimeSocket();
