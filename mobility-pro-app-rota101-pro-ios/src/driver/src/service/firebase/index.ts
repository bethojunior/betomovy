import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

import firebaseConfig from '../../../../../firebaseConfig.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;