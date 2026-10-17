import axios from 'axios';
import {buildApp} from '../../constantBuild/config';
import apiMainDriver from '../../driver/src/api/apiMain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import {Platform} from 'react-native';
import {applyPulseInterceptors} from '../../../lib/middleware/AxiosInterceptor';
import {loadSession} from '../../utils/Storage/sessionStorage';

let source = axios.CancelToken.source();

export const abortRequests = () => {
  source.cancel();
  source = axios.CancelToken.source();
};

export const getApiMain = async () => {
  try {
    const response = await AsyncStorage.getItem('@speedmob:franchiseHosts');

    if (response) {
      const responseWithoutQuots = response.replace(/["]/g, '');

      apiMain.defaults.baseURL = responseWithoutQuots;
      apiMainDriver.defaults.baseURL = responseWithoutQuots;
    }
  } catch (error) {
    console.log(error);
  }
};

const apiMain = axios.create({
  baseURL: buildApp().HOST_API_APP,
  timeout: 55000,
});

apiMain.interceptors.request.use(async config => {
  config.cancelToken = source.token;

  const session = await loadSession();
  const user = session.user ? JSON.parse(session.user) : null;

  config.headers.platform = Platform.OS === 'ios' ? 'ios' : 'android';
  config.headers.version =
    Constants?.expoConfig?.version ||
    Constants?.nativeAppVersion ||
    '8.1';

  if (session?.token && user?.idUser) {
    config.headers.token = session.token;
    config.headers.userid = user.idUser;
  }

  return config;
});

applyPulseInterceptors(apiMain, 'api-main');

export default apiMain;
