import axios from 'axios';
import {buildApp} from '../../constantBuild/config';
import apiMainDriver from '../../driver/src/api/apiMain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
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
});
apiMain.defaults.headers.common.platform =
  Platform.OS === 'ios' ? 'ios' : 'android';
apiMain.defaults.headers.common.version = Constants.manifest.version;

export default apiMain;
