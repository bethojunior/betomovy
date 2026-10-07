import {MMKV} from 'react-native-mmkv';
import {isArray} from 'lodash';
import {TypeProps, TypeMap} from './types';

const storage = new MMKV();

export const getItemPublic = (key: string) => {
  if (!key) return null;
  const storageItem = storage?.getString(key);
  if (storageItem) {
    return storageItem;
  }
  return null;
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
  if (!key) false;
  return storage.delete(key);
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
  return storage.clearAll();
};

const getWhatType = <T extends TypeProps>(key: string, type: T): TypeMap[T] => {
  try {
    const handlers = {
      string: () => storage.getString(key) ?? null,
      number: () => storage.getNumber(key) ?? null,
      boolean: () => storage.getBoolean(key) ?? null,
      json: () => {
        const value = storage.getString(key);
        return value ? JSON.parse(value) : null;
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

  storage.set(key, parsedValue);
};

const storageSync = {setItem, getItem, removeItem, removeGroup, removeAll};

export {storageSync as storage};
export default storageSync;
