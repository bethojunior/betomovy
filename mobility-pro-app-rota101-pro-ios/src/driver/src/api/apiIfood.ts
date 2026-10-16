import axios from 'axios';
import {buildApp} from '../../../constantBuild/config';
import {Platform} from 'react-native';
import Constants from 'expo-constants';

export const apiIfood = axios.create({
  baseURL: buildApp().HOST_API_IFOOD,
  timeout: 15000,
});
apiIfood.defaults.headers.common.platform =
  Platform.OS === 'ios' ? 'ios' : 'android';
  apiIfood.defaults.headers.common.version = Constants.expoConfig.version;
