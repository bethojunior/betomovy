class TripRealtimeFirebase {
    subs = new Map();

    constructor() {
        this.reference = null;
        this.collection = "trips";
        this.typeKnobTrip = "2";

        this.init();
    }

    init() {
        this.reference = getDBFirestore();
    }

    unsubscribe(id) {
        if (this.subs.has(id)) {
            this.subs.get(id)();
            this.subs.delete(id);
        }
    }

    searchTrip(driverId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("callingDriver", "array-contains", driverId)
            .where("driver", "==", null)
            .limit(1);

        const id = `${driverId}:${callback}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback({ data: change.doc.data(), type: change.type });
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTrip(tripReference, callback) {
        const query = this.reference.collection(this.collection).where("tripReference", "==", tripReference).limit(1);

        const id = `${tripReference}:${callback}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback({ data: change.doc.data(), type: change.type });
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTripPreAccepted(tripReference, callback) {
        const query = this.reference.collection(this.collection).where("tripReference", "==", tripReference).limit(1);

        const id = `${tripReference}:${callback}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback({ data: change.doc.data(), type: change.type });
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getKnobTrip(driverId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("tripCallTypeId", "==", this.typeKnobTrip)
            .where("status", "==", STATUS_BOARDING_TRIP)
            .where("driverId", "==", driverId)
            .limit(1);

        const id = `${driverId}:${callback}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback({ data: change.doc.data(), type: change.type });
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTripScheduled(cityId, tripTypeId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("cityId", "==", cityId)
            .where("driverId", "==", null)
            .where("tripTypeId", "==", tripTypeId)
            .where("status", "==", STATUS_SCHEDULED)
            .orderBy("date", "desc");

        const id = `${cityId}:${tripTypeId}:${callback}`;

        let initialLoad = true;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (initialLoad && change.type === "added") {
                    return;
                }
                callback({ data: change.doc.data(), type: change.type });
            });

            initialLoad = false;
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTripOffer(cityId, tripTypeId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("cityId", "==", cityId)
            .where("driverId", "==", null)
            .where("tripTypeId", "==", tripTypeId)
            .where("status", "==", STATUS_GET_BID_BY_DRIVERS)
            .orderBy("date", "desc");

        const id = `${cityId}:${tripTypeId}:${callback}`;

        let initialLoad = true;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (initialLoad && change.type === "added") {
                    return;
                }
                callback({ data: change.doc.data(), type: change.type });
            });

            initialLoad = false;
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTripScheduledAccepted(driverId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("driverId", "==", driverId)
            .where("status", "==", STATUS_SCHEDULED)
            .orderBy("date", "desc");

        const id = `${driverId}:${callback}`;

        let initialLoad = true;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (initialLoad && change.type === "added") {
                    return;
                }
                callback({ data: change.doc.data(), type: change.type });
            });

            initialLoad = false;
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTripScheduledAcceptedReady(driverId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("driverId", "==", driverId)
            .where("status", "==", STATUS_ACCEPTED)
            .limit(1);

        const id = `${driverId}:${callback}:${STATUS_ACCEPTED}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                if (data.schedule) {
                    callback({ data: change.doc.data(), type: change.type });
                }
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    checkTripPreAcceptedByDriver(driverId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("driverId", "==", driverId)
            .where("status", "==", STATUS_PRE_ACCEPTED)
            .orderBy("date", "desc");

        const id = `${driverId}:${callback}:${STATUS_PRE_ACCEPTED}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback({ data: change.doc.data(), type: change.type });
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    checkTripAccepted(driverId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("driverId", "==", driverId)
            .where("status", "==", STATUS_ACCEPTED)
            .limit(1);

        const id = `${driverId}:${callback}:${STATUS_ACCEPTED}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback({ data: change.doc.data(), type: change.type });
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTripScheduledAcceptedReady(driverId, callback) {
        const query = this.reference
            .collection(this.collection)
            .where("driverId", "==", driverId)
            .where("status", "==", STATUS_ACCEPTED)
            .where("schedule", ">=", "")
            .limit(1);

        const id = `${driverId}:${callback}:${STATUS_SCHEDULED}:${STATUS_ACCEPTED}`;

        const unsubscribe = query.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                callback({ data: change.doc.data(), type: change.type });
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }
}
