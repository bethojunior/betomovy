import {onSnapshot} from 'firebase/firestore';

type OnNext = (snapshot: any) => void;
type OnError = (error: any) => void;

export default function safeOnSnapshot(
  query: any,
  onNext?: OnNext,
  onError?: OnError,
) {
  return onSnapshot(
    query,
    (snapshot) => {
      if (!snapshot) return;
      if (typeof snapshot.docChanges !== 'function') return;

      onNext?.(snapshot);
    },
    (error) => {
      console.warn('[Firestore] listener error', error);
      onError?.(error);
    },
  );
}
