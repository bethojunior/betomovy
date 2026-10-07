class TripRealtime {
    constructor() {
        this.typeModified = "modified";
        this.typeRemoved = "removed";
        this.typeAdded = "added";

        if (Session.get("enable_realtime_socket")) {
            this.realtime = tripRealtimeSocket;
            // console.log("Using Trip Realtime Socket");
        } else {
            this.realtime = tripRealtimeFirebase;
            // console.log("Using Trip Realtime Firebase");
        }
    }

    unsubscribe(id) {
        return this.realtime.unsubscribe(id);
    }

    getTrips(idCentral, callback) {
        return this.realtime.getTrips(idCentral, callback);
    }

    getTrip(tripReference, callback) {
        return this.realtime.getTrip(tripReference, callback);
    }
}

const tripRealtime = new TripRealtime();
