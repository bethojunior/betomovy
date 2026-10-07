class TripRouteRepository {
    constructor() {
        this.reference = null;
        this.unsubscribe = null;
        this.collection = "tripRoute";
        this.typeModified = "modified";
        this.typeRemoved = "removed";
        this.typeAdded = "added";

        this.connection = false;
    }


    insertRoute(tripReference,data){
        this.dbFirestore = getDBFirestore();
        this.reference = this.dbFirestore.collection(this.collection)
            .doc(tripReference).set({tripReference,...data});
    }

    updateDataLocation(tripReference,data){
        this.dbFirestore = getDBFirestore();
        this.reference = this.dbFirestore.collection(this.collection)
            .doc(tripReference).update(data);
    }
}