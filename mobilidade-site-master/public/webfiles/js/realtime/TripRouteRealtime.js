class TripRouteRealtime {
    constructor() {
        this.reference = null;
        this.unsubscribe = null;
        this.collection = "tripRoute";
        this.typeModified = "modified";
        this.typeRemoved = "removed";
        this.typeAdded = "added";

        this.connection = false;
    }

    getPositionDriver(tripReference,callback){
        this.dbFirestore = getDBFirestore();

        this.reference = this.dbFirestore.collection(this.collection)
            .where("tripReference", "==", tripReference).limit(1);

        this.unsubscribe = this.reference.onSnapshot(snapshot => {
            snapshot.docChanges().map(change => {
                callback(change.doc.data(),change.type)
            });

        });
    }

    close() {
        this.connection = false;

        if (this.unsubscribe)
            this.unsubscribe();
    }
}