class ChatRepository {
    constructor() {
        this.reference = null;
        this.unsubscribe = null;
        this.isConnect = false;

        this.collection = "messagesChatTrip";
        this.typeModified = "modified";
        this.typeRemoved = "removed";
        this.typeAdded = "added";

    }

    getCurrentMessages(tripReference, callback) {
        this.dbFirestore = getDBFirestore();
        this.isConnect = true;
        this.reference = this.dbFirestore.collection(this.collection)
            .where("tripReference", "==", tripReference).orderBy("date");

        this.unsubscribe = this.reference.onSnapshot(snapshot => {

            callback(snapshot.docChanges().map(change => {
                return {item: change.doc.data(), id: change.doc.id, type: change.type}
            }));

        });
    }

    getLastMessageUnread(tripReference, callback) {
        this.dbFirestore = getDBFirestore();
        this.isConnect = true;
        this.reference = this.dbFirestore.collection(this.collection)
            .where("tripReference", "==", tripReference).orderBy("date");

        this.unsubscribe = this.reference.onSnapshot(snapshot => {

            snapshot.docChanges().map(change => {
                if (change.type === this.typeAdded) {
                    const item = change.doc.data();

                    if (!item.viewed) {
                        callback(item, change.doc.id);
                    }
                }
            });
        });
    }

    setViewMessage(id) {
        this.dbFirestore = getDBFirestore();
        this.isConnect = true;
        this.dbFirestore.collection(this.collection).doc(id).update({viewed: true});

    }

    close() {
        this.isConnect = false;
        if (this.unsubscribe)
            this.unsubscribe();
    }

    getCurrentMessagesRider(tripReference, customerUserId, callback) {
        this.dbFirestore = getDBFirestore();
        this.reference = this.dbFirestore.collection("messagesChatTrip")
            .where("tripReference", "==", tripReference)
            .where("customerUserId", "==", parseInt(customerUserId))
            .orderBy("date");

        this.unsubscribe = this.reference.onSnapshot(snapshot => {

            callback(snapshot.docChanges().map(change => {
                return {item: change.doc.data(), type: change.type};
            }));

        });
    }


    getAllMessagesRider(customerUserId, callback) {
        this.dbFirestore = getDBFirestore();
        this.reference = this.dbFirestore.collection("messagesChatTrip")
            .where("customerUserId", "==", parseInt(customerUserId));

        this.unsubscribe = this.reference.onSnapshot(snapshot => {
            callback(snapshot.docChanges().filter(change => {
                const data = change.doc.data();
                return data.viewed == null;
            }).map(change => {
                const data = change.doc.data();
                return {item: data, type: change.type};
            }));

        });
    }
}
