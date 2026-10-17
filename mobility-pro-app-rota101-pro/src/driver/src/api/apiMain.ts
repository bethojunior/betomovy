import axios from 'axios';
import {buildApp} from '../../../constantBuild/config';
import {Platform} from 'react-native';
import Constants from 'expo-constants';
import {applyPulseInterceptors} from '../../../../lib/middleware/AxiosInterceptor';
import {loadSession} from '../../../utils/Storage/sessionStorage';

let source = axios.CancelToken.source();

export const abortRequests = () => {
  source.cancel();
  source = axios.CancelToken.source();
};

const apiMainDriver = axios.create({
  baseURL: buildApp().HOST_API_APP,
  timeout: 55000,
});

apiMainDriver.interceptors.request.use(async config => {
  config.cancelToken = source.token;

  const session = await loadSession();
  let user: { idUser?: number } | null = null;
  if (session?.user) {
    try {
      user = JSON.parse(session.user);
    } catch {
      user = null;
    }
  }

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

applyPulseInterceptors(apiMainDriver, 'api-main-driver');

export default apiMainDriver;
