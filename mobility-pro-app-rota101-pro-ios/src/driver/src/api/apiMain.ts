import axios from 'axios';
import {buildApp} from '../../../constantBuild/config';
import {Platform} from 'react-native';
import Constants from 'expo-constants';

const apiMainDriver = axios.create({
  baseURL: buildApp().HOST_API_APP,
  timeout: 40000,
});
apiMainDriver.defaults.headers.common.platform =
  Platform.OS === 'ios' ? 'ios' : 'android';
apiMainDriver.defaults.headers.common.version = Constants.manifest.version;

export default apiMainDriver;
