import {MMKV} from 'react-native-mmkv';
import {isArray} from 'lodash';
import {TypeProps, TypeMap} from './types';

/** Fallback em memória se MMKV falhar no boot iOS (evita crash na abertura). */
const memoryStore = new Map<string, string | number | boolean>();

function createSafeStorage(): MMKV | null {
  try {
    return new MMKV();
  } catch (error) {
    console.warn('[MMKV] Falha ao iniciar, usando fallback em memória:', error);
    return null;
  }
}

const storage = createSafeStorage();

export const getItemPublic = (key: string) => {
  if (!key) return null;
  try {
    if (storage) {
      return storage.getString(key) ?? null;
    }
    const mem = memoryStore.get(key);
    return typeof mem === 'string' ? mem : mem != null ? String(mem) : null;
  } catch {
    return null;
  }
};

const setItem = (key: string, val: any, type?: TypeProps): void => {
  if (!key || val == null) return;
  setWhatType(key, val, type || 'string');
};

const getItem = <T extends TypeProps>(key: string, type: T): TypeMap[T] => {
  if (!key) return null;
  return getWhatType(key, type);
};

const removeItem = (key: string) => {
  if (!key) return false;
  try {
    if (storage) {
      storage.delete(key);
    } else {
      memoryStore.delete(key);
    }
    return true;
  } catch {
    return false;
  }
};

const removeGroup = (group: string[]) => {
  if (isArray(group) && group.length > 0) {
    group.map(item => {
      removeItem(item);
    });
    return true;
  }
  return false;
};

const removeAll = () => {
  try {
    if (storage) {
      storage.clearAll();
    } else {
      memoryStore.clear();
    }
    return true;
  } catch {
    return false;
  }
};

const getWhatType = <T extends TypeProps>(key: string, type: T): TypeMap[T] => {
  try {
    const handlers = {
      string: () => {
        if (storage) return storage.getString(key) ?? null;
        const v = memoryStore.get(key);
        return typeof v === 'string' ? v : v != null ? String(v) : null;
      },
      number: () => {
        if (storage) return storage.getNumber(key) ?? null;
        const v = memoryStore.get(key);
        return typeof v === 'number' ? v : v != null ? Number(v) : null;
      },
      boolean: () => {
        if (storage) return storage.getBoolean(key) ?? null;
        const v = memoryStore.get(key);
        return typeof v === 'boolean' ? v : v === 'true' || v === true;
      },
      json: () => {
        const value = storage
          ? storage.getString(key)
          : (memoryStore.get(key) as string | undefined);
        return value ? JSON.parse(String(value)) : null;
      },
    };

    return handlers[type]?.() ?? null;
  } catch {
    return null;
  }
};

const setWhatType = (key: string, value: any, type: TypeProps): void => {
  const parsedValue =
    {
      json: () => JSON.stringify(value),
      string: () => String(value),
      number: () => (value != null ? Number(value) : null),
      boolean: () => value === 'true' || value === true,
    }[type]?.() ?? value;

  try {
    if (storage) {
      storage.set(key, parsedValue as any);
    } else if (parsedValue != null) {
      memoryStore.set(key, parsedValue as any);
    }
  } catch (error) {
    console.warn('[MMKV] set falhou, usando memória:', error);
    if (parsedValue != null) {
      memoryStore.set(key, parsedValue as any);
    }
  }
};

const storageSync = {setItem, getItem, removeItem, removeGroup, removeAll};

export {storageSync as storage};
export default storageSync;
