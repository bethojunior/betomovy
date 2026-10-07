import {isArray} from 'lodash';
import {storage} from './config';
import {TypeProps} from './types';

export const useStorageSync = () => {
  const setItem = (key: string, val: any, type?: TypeProps) => {
    if (!key || !val) return false;
    return setWhatType(key, val, type || 'string');
  };

  const getItem = (key: string, type: TypeProps) => {
    if (!key) return false;
    const storageItem = getWhatType(key, type);
    if (storageItem) {
      return storageItem;
    }
    return false;
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

  const getWhatType = (key: string, type: TypeProps) => {
    switch (type) {
      case 'string':
        return storage.getString(key);
      case 'number':
        return storage.getNumber(key);
      case 'boolean':
        return storage.getBoolean(key);
      case 'json':
        const value = storage.getString(key);
        if (value) {
          return JSON.parse(value);
        }
        return false;
      default:
        return false;
    }
  };

  const setWhatType = (key: string, value: any, type: TypeProps) => {
    switch (type) {
      case 'json':
        return storage.set(key, JSON.stringify(value));
      default:
        return storage.set(key, value);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    removeGroup,
    removeAll,
  };
};
