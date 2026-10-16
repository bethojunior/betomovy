import {useSyncExternalStore} from 'react';

type Listener = () => void;

class Store<T> {
  private state: T;
  private listeners: Set<Listener>;

  constructor(initialState: T) {
    this.state = initialState;
    this.listeners = new Set();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.state;
  }

  setState(newState: T) {
    this.state = newState;
    this.listeners.forEach(listener => listener());
  }
}

export function createUseStore<T>(initialState: T) {
  const store = new Store(initialState);

  function useStore() {
    return useSyncExternalStore(
      store.subscribe.bind(store),
      store.getSnapshot.bind(store),
    );
  }

  return [useStore, store.setState.bind(store)] as const;
}
