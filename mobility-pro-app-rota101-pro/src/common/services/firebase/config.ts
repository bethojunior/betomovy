import {initializeApp, getApps, getApp} from 'firebase/app';
import {initializeFirestore, memoryLocalCache} from 'firebase/firestore'; // Importe estes
import firebaseConfig from '../../../../firebaseConfig.json';

// Inicializa o app
const app = getApps()?.length ? getApp() : initializeApp(firebaseConfig);

// Inicializa o firestore
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  experimentalForceLongPolling: true,
});
