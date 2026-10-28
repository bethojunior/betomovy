import axios from 'axios';
import Constants from 'expo-constants';
import {buildApp} from '../../constantBuild/config';
import {applyPulseInterceptors} from '../../../lib/middleware/AxiosInterceptor';
import {loadSession} from '../../utils/Storage/sessionStorage';
import {Platform} from 'react-native';

let source = axios.CancelToken.source();

export const abortRequests = () => {
  source.cancel();
  source = axios.CancelToken.source();
};

const apiDelivery = axios.create({
  baseURL: buildApp().HOST_API_DELIVERY,
  timeout: 10000,
});

apiDelivery.interceptors.request.use(async config => {
  config.cancelToken = source.token;

  const session = await loadSession();
  const user = session.user ? JSON.parse(session.user) : null;

  config.headers.platform = Platform.OS === 'ios' ? 'ios' : 'android';
  config.headers.version = Constants.expoConfig.version;

  if (session?.token && user?.idUser) {
    config.headers.token = session.token;
    config.headers.userid = user.idUser;
  }

  return config;
});

applyPulseInterceptors(apiDelivery, 'api-delivery');

export default apiDelivery;
