import firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyASmf56zL9uFTQM2qEFrP5_29yOy9Lz1wc",
    authDomain: "return-teste.firebaseapp.com",
    databaseURL: "https://return-teste.firebaseio.com",
    projectId: "return-teste",
    storageBucket: "return-teste.appspot.com",
    messagingSenderId: "1096805025785",
    appId: "1:1096805025785:web:f166ded4edc29c66851f28"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


export const requestFirebaseNotificationPermission = () =>
    new Promise((resolve, reject) => {
        messaging
            .requestPermission()
            .then(() => messaging.getToken())
            .then((firebaseToken) => {
                resolve(firebaseToken);
            })
            .catch((err) => {
                reject(err);
            });
    });


export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });
