class TripRealtime {
    constructor() {
        this.realtime = null;
        this.typeModified = "modified";
        this.typeRemoved = "removed";
        this.typeAdded = "added";
        this.enableSocket = this.isRealtimeSocketEnabled();

        if (this.enableSocket) {
            const tripRealtimeSocket = new TripRealtimeSocket();
            this.realtime = tripRealtimeSocket;
            console.log("Using Trip Realtime Socket");
        } else {
            const tripRealtimeFirebase = new TripRealtimeFirebase();
            this.realtime = tripRealtimeFirebase;
            console.log("Using Trip Realtime Firebase");
        }
    }

    isRealtimeSocketEnabled() {
        const config = Session.get("configGeneral");
        const setting = config?.find((item) => item?.key === "enable_realtime_socket");
        return setting?.value === "1";
    }

    unsubscribe(id) {
        return this.realtime.unsubscribe(id);
    }

    searchTrip(driverId, callback) {
        return this.realtime.searchTrip(driverId, callback);
    }

    getTrip(tripReference, callback) {
        return this.realtime.getTrip(tripReference, callback);
    }

    getTripPreAccepted(tripReference, callback) {
        return this.realtime.getTripPreAccepted(tripReference, callback);
    }

    getKnobTrip(driverId, callback) {
        return this.realtime.getKnobTrip(driverId, callback);
    }

    getTripScheduled(cityId, tripTypeId, callback) {
        return this.realtime.getTripScheduled(cityId, tripTypeId, callback);
    }

    getTripOffer(cityId, tripTypeId, callback) {
        return this.realtime.getTripOffer(cityId, tripTypeId, callback);
    }

    getTripScheduledAccepted(driverId, callback) {
        return this.realtime.getTripScheduledAccepted(driverId, callback);
    }

    getTripScheduledAcceptedReady(driverId, callback) {
        return this.realtime.getTripScheduledAcceptedReady(driverId, callback);
    }

    checkTripPreAcceptedByDriver(driverId, callback) {
        return this.realtime.checkTripPreAcceptedByDriver(driverId, callback);
    }

    checkTripAccepted(driverId, callback) {
        return this.realtime.checkTripAccepted(driverId, callback);
    }
}

var tripRealtime;
try {
    tripRealtime = new TripRealtime();
} catch (e) {
    console.error('TripRealtime init failed', e);
    tripRealtime = null;
}
