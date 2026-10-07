const firebaseConfig = {
    firebaseApp: null
};

function initConfigFirebase() {
    const {firebase_config} = Session.get("cityConfig");

    if (firebase_config == null)
        throw "Sem configuração de firebase";


    if (firebase_config.projectId == null)
        throw "Sem configuração de firebase";

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
