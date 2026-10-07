import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

import firebaseConfig from "../../../../firebaseConfig.json";

export const app = initializeApp(firebaseConfig);



const db = getFirestore(app);

export default db;
