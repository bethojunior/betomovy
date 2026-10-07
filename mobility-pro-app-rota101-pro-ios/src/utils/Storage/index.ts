import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorage = () => {
  const setItem = (key: string, val: any, toString = true) => {
    if (!key || !val) return false;
    AsyncStorage.setItem(key, toString ? JSON.stringify(val) : val);
    return true;
  };

  const getItem = async (key: string, toString = true) => {
    if (!key) return false;
    const storageItem = await AsyncStorage.getItem(key);
    if (storageItem) {
      return toString ? JSON.parse(storageItem) : storageItem;
    }
    return false;
  };

  return {
    setItem,
    getItem,
  };
};
