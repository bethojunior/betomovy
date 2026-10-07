import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getHost = async () => {
    const response = await AsyncStorage.getItem('@speedmob:hosts');
    return JSON.parse(response);
}

const api = axios.create({
    baseURL:  String(getHost()),
});

export const transFormApi = async (url: string) => {
    api.defaults.baseURL = url
}

export default api;