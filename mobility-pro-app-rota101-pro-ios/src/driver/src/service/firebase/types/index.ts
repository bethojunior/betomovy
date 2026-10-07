import {DocumentData} from 'firebase/firestore';

export type CallbackFirebase = (data: DocumentData, type: string) => void;
