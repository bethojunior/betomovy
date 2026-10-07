class ChatRealtime {
    constructor() {
        this.reference = null;
        this.unsubscribe = null;
    }

    getCurrentMessages(tripReference, callback) {
        this.reference = getDBFirestore().collection("messagesChatTrip")
            .where("tripReference", "==", tripReference).orderBy("date");

        this.unsubscribe = this.reference.onSnapshot(snapshot => {

            snapshot.docChanges().map(change => {
                if (change.type === "added")
                    callback(change.doc.data(),change.doc.id)
            });

        });
    }

    getLastMessageUnread(tripReference, callback) {
        this.reference = getDBFirestore().collection("messagesChatTrip")
            .where("tripReference", "==", tripReference).orderBy("date");

        this.unsubscribe = this.reference.onSnapshot(snapshot => {

            snapshot.docChanges().map(change => {
                if (change.type === "added") {
                    const item = change.doc.data();

                    if (!item.viewed) {
                        callback(item,change.doc.id);
                    }
                }
            });
        });
    }

    setViewMessage(id){
        getDBFirestore().collection("messagesChatTrip").doc(id).set({viewed: true}, {merge: true});
    }

    close() {
        if (this.unsubscribe)
            this.unsubscribe();
    }
}