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
        const db = getDBFirestore();
        if (!db) return id;

        let docUnsubscribe = null;
        let queryUnsubscribe = null;

        // 1. Escuta direta pontual ao documento trips/{tripReference} (Instantânea < 100ms via WebSocket Firestore)
        try {
            const docRef = db.collection(this.collection).doc(tripReference);
            docUnsubscribe = docRef.onSnapshot((docSnapshot) => {
                if (docSnapshot && docSnapshot.exists) {
                    const data = docSnapshot.data();
                    if (data) {
                        callback(data, "modified");
                    }
                }
            }, (error) => {
                console.warn("[Firestore] Doc listener warning:", error);
            });
        } catch (e) {
            console.warn("[Firestore] Error attaching doc listener:", e);
        }

        // 2. Escuta secundária de redundância via query
        try {
            const queryRef = db.collection(this.collection).where("tripReference", "==", tripReference).limit(1);
            queryUnsubscribe = queryRef.onSnapshot((snapshot) => {
                if (snapshot && !snapshot.empty) {
                    snapshot.docChanges().forEach((change) => {
                        const data = change.doc.data();
                        if (data) {
                            callback(data, change.type);
                        }
                    });
                }
            }, (error) => {
                console.warn("[Firestore] Query listener warning:", error);
            });
        } catch (e) {
            console.warn("[Firestore] Error attaching query listener:", e);
        }

        const compositeUnsubscribe = () => {
            if (typeof docUnsubscribe === "function") {
                try { docUnsubscribe(); } catch (e) {}
            }
            if (typeof queryUnsubscribe === "function") {
                try { queryUnsubscribe(); } catch (e) {}
            }
        };

        this.subs.set(id, compositeUnsubscribe);
        return id;
    }
}

const tripRealtimeFirebase = new TripRealtimeFirebase();
