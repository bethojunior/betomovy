import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsyncStorageByTime = async (key: string, value: any) => {
  const now = new Date();
  const data = {
    value,
    time: now.getTime(),
  };
  return await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const useAsyncStorageByTime = async (key: string, hour: number) => {
  const data = await AsyncStorage.getItem(key);
  if (data) {
    const parsedData = JSON.parse(data);
    const now = new Date();
    if (parsedData.time > now.getTime() - hour * 60 * 60 * 1000) {
      return parsedData.value;
    } else {
      await AsyncStorage.removeItem(key);
      return null;
    }
  } else {
    return null;
  }
};
