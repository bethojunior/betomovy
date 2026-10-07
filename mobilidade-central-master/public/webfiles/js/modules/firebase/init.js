const firebaseConfig = {
    firebaseApp: null
};

function initConfigFirebase() {
    const {firebase_cloud_firestore_key} = Session.getLocal("cityConfig");

    if (firebase_cloud_firestore_key == null)
        throw "Sem configuração de firebase";


    if (firebase_cloud_firestore_key.projectId == null)
        throw "Sem configuração de firebase";

    firebaseConfig.firebaseApp = firebase.initializeApp(firebase_cloud_firestore_key);
}

function getDBFirestore() {
    try {
        if (firebaseConfig.firebaseApp != null)
            return firebaseConfig.firebaseApp.firestore();

        initConfigFirebase();

        return firebaseConfig.firebaseApp.firestore();
    } catch (e) {
        throw e;
    }
}