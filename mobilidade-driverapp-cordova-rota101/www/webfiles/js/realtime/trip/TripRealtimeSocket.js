class TripRealtimeSocket {
    subs = new Map();

    constructor(connection = null) {
        this.connection = connection;
        this.init();
    }

    init() {
        if (!this.connection) {
            this.connection = socketConnection;
        }

        const driverId = Session.getValueInSession("user", "idDriver");
        if (!driverId) return;

        this.connection.onConnect(() => {
            this.connection.emit(TripEvent.JOIN_ROOM, { driverId });
        });
    }

    unsubscribe(id) {
        if (this.subs.has(id)) {
            const entry = this.subs.get(id);
            this.connection.off(entry.eventName, entry.listener);
            this.subs.delete(id);
        }
    }

    getTrip(tripReference, callback) {
        const event = TripEvent.TRIP_UPDATED;
        const id = `${event}:${tripReference}:${callback}`;

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName: event, listener: callback });
            this.connection.on(event, callback);
        }

        return id;
    }

    searchTrip(driverId, callback) {
        const event = TripEvent.TRIP_AVAILABLE;
        const id = `${event}:${driverId}:${callback}`;

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName: event, listener: callback });
            this.connection.on(event, callback);
        }

        return id;
    }

    // TODO: Talves seja necessario criar um novo evento na api node v1. (Analisar)
    getTripPreAccepted(tripReference, callback) {
        const event = TripEvent.TRIP_UPDATED;
        const id = `${event}:${tripReference}:${callback}:${STATUS_PRE_ACCEPTED}`;

        const handleCallback = (trip) => {
            if (tripReference === trip?.data?.tripReference) {
                return callback(trip);
            }
        };

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName: event, listener: handleCallback });
            this.connection.on(event, handleCallback);
        }

        return id;
    }

    // TODO: Talves seja necessario criar um novo evento na api node v1. (Analisar)
    getKnobTrip(driverId, callback) {
        const event = TripEvent.TRIP_UPDATED;
        const id = `${event}:${driverId}:${callback}:${STATUS_BOARDING_TRIP}`;

        const tripUpdate = (trip) => {
            if (trip?.data?.tripCallTypeId === "2" && trip?.data?.status === STATUS_BOARDING_TRIP) {
                return callback(trip);
            }
        };

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName: event, listener: tripUpdate });
            this.connection.on(event, tripUpdate);
        }

        return id;
    }

    getTripScheduled(cityId, tripTypeId, callback) {
        const eventName = TripEvent.TRIP_SCHEDULED_AVAILABLE;
        const id = `${eventName}:${tripTypeId}:${cityId}`;

        this.connection.emit(TripEvent.JOIN_ROOM, {
            cityId,
            callType: tripTypeId,
        });

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName, listener: callback });
            this.connection.on(eventName, callback);
        }

        return id;
    }

    getTripOffer(cityId, tripTypeId, callback) {
        const eventName = TripEvent.TRIP_OFFER_AVAILABLE;
        const id = `${eventName}:${tripTypeId}:${cityId}`;

        this.connection.emit(TripEvent.JOIN_ROOM, {
            cityId,
            callType: tripTypeId,
        });

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName, listener: callback });
            this.connection.on(eventName, callback);
        }

        return id;
    }

    getTripScheduledAccepted(driverId, callback) {
        const eventName = TripEvent.TRIP_SCHEDULED_ACCEPTED;
        const id = `${eventName}:${driverId}:${callback}`;

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName, listener: callback });
            this.connection.on(eventName, callback);
        }

        return id;
    }

    getTripScheduledAcceptedReady(driverId, callback) {
        const eventName = TripEvent.TRIP_SCHEDULED_ACCEPTED_READY;
        const id = `${eventName}:${driverId}:${callback}`;

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName, listener: callback });
            this.connection.on(eventName, callback);
        }

        return id;
    }

    // TODO: Talves seja necessario criar um novo evento na api node v1. (Analisar)
    checkTripPreAcceptedByDriver(driverId, callback) {
        const eventName = TripEvent.TRIP_UPDATED;
        const id = `${eventName}:${driverId}:${callback}:${STATUS_PRE_ACCEPTED}`;

        const handleCallback = (trip) => {
            if (trip?.data?.status === STATUS_PRE_ACCEPTED) {
                return callback(trip);
            }
        };

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName, listener: handleCallback });
            this.connection.on(eventName, handleCallback);
        }

        return id;
    }

    checkTripAccepted(driverId, callback) {
        const eventName = TripEvent.TRIP_ACCEPTED;
        const id = `${eventName}:${driverId}:${callback}:${STATUS_ACCEPTED}`;

        const handleCallback = (trip) => {
            if (trip?.data?.status === STATUS_ACCEPTED) {
                return callback(trip);
            }
        };

        if (!this.subs.has(id)) {
            this.subs.set(id, { eventName, listener: handleCallback });
            this.connection.on(eventName, handleCallback);
        }

        return id;
    }
}
