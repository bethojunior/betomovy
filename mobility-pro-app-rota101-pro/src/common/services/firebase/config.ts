import {initializeApp, getApps, getApp} from 'firebase/app';
import {initializeFirestore, memoryLocalCache} from 'firebase/firestore'; // Importe estes
import firebaseConfig from '../../../../firebaseConfig.json';

// Inicializa o app
const app = getApps()?.length ? getApp() : initializeApp(firebaseConfig);

// Inicializa o firestore com detecção automática (prioriza WebSockets ultrarrápido <1s, fallback automático somente se bloqueado)
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  experimentalAutoDetectLongPolling: true,
});
