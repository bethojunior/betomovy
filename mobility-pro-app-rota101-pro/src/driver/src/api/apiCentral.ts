import axios from 'axios';
import {buildApp} from '../../../constantBuild/config';
import {Platform} from 'react-native';
import Constants from 'expo-constants';

export const apiCentral = axios.create({
  baseURL: buildApp().HOST_API_CENTRAL,
  timeout: 55000,
});
apiCentral.defaults.headers.common.platform =
  Platform.OS === 'ios' ? 'ios' : 'android';
  apiCentral.defaults.headers.common.version = Constants.expoConfig.version;
