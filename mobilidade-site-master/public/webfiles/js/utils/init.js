const firebaseConfig = {
    firebaseApp: null
};

function initConfigFirebase(firebase_config) {
    firebaseConfig.firebaseApp = firebase.initializeApp(firebase_config);
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