class ChatRepository {
    constructor() {
        this.reference = null;
        this.unsubscribe = null;

        this.typeAdded = "added";
    }

    getCurrentMessages(tripReference, callback) {
        this.dbFirestore = getDBFirestore();
        this.reference = this.dbFirestore.collection("messagesChatTrip")
            .where("tripReference", "==", tripReference).orderBy("date");

        this.unsubscribe = this.reference.onSnapshot(snapshot => {

            callback(snapshot.docChanges().map(change => {
                return {item: change.doc.data(), type: change.type};
            }));

        });
    }

    getLastMessageUnread(tripReference, callback) {
        this.dbFirestore = getDBFirestore();
        this.reference = this.dbFirestore.collection("messagesChatTrip")
            .where("tripReference", "==", tripReference).orderBy("date");

        this.unsubscribe = this.reference.onSnapshot(snapshot => {

            snapshot.docChanges().map(change => {
                if (change.type === "added") {
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
        this.dbFirestore.collection("messagesChatTrip").doc(id).update({viewed: true});

    }

    close() {
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

}

const chatTripWaitRepository = new ChatRepository();
