class TripRealtimeFirebase {
    subs = new Map();

    constructor() {
        this.reference = null;
        this.collection = "trips";
    }

    unsubscribe(id) {
        if (this.subs.has(id)) {
            this.subs.get(id)();
            this.subs.delete(id);
        }
    }

    getTrips(idCentral, callback) {
        const id = `${idCentral}:${callback}`;
        let isFirstSnapshot = true;

        this.reference = getDBFirestore()
            .collection(this.collection)
            .where("centralId", "==", idCentral);

        const unsubscribe = this.reference.onSnapshot((snapshot) => {
            if (isFirstSnapshot) {
                isFirstSnapshot = false;
                return;
            }

            callback(
                snapshot.docChanges().map((change) => {
                    return { data: change.doc.data(), type: change.type };
                })
            );
        });

        this.subs.set(id, unsubscribe);
        return id;
    }

    getTrip(tripReference, callback) {
        const id = `${tripReference}:${callback}`;

        this.reference = getDBFirestore()
            .collection(this.collection)
            .where("tripReference", "==", tripReference)
            .limit(1);

        const unsubscribe = this.reference.onSnapshot((snapshot) => {
            snapshot.docChanges().map((change) => {
                callback(change.doc.data(), change.type);
            });
        });

        this.subs.set(id, unsubscribe);
        return id;
    }
}

const tripRealtimeFirebase = new TripRealtimeFirebase();
