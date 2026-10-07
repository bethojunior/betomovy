class TripRealtime {
    constructor() {
        this.reference = null;
        this.unsubscribe = null;
        this.collection = "trips";
        this.typeModified = "modified";
        this.typeRemoved = "removed";
        this.typeAdded = "added";

        this.connection = false;
    }


    close() {
        this.connection = false;

        if (this.unsubscribe)
            this.unsubscribe();
    }

    getTrip(tripReference,callback){
        this.dbFirestore = getDBFirestore();

        this.reference = this.dbFirestore.collection(this.collection)
            .where("tripReference", "==", tripReference).limit(1);

        this.unsubscribe = this.reference.onSnapshot(snapshot => {
            snapshot.docChanges().map(change => {
                callback(change.doc.data(),change.type)
            });

        });
    }

    checkTripAccepted(userId, callback) {
        this.dbFirestore = getDBFirestore();

        this.reference = this.dbFirestore.collection(this.collection)
            .where("userId", "==", userId)
            .where("status", "==", STATUS_ACCEPTED).limit(1);

        this.unsubscribe = this.reference.onSnapshot(snapshot => {
            callback(snapshot.docChanges().map(change => {
                return {data: change.doc.data(), type: change.type};
            }));

        });
    }
}