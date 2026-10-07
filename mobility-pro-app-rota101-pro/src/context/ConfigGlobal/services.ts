import {Platform} from 'react-native';
import apiMain from '../../client/api/apiMain';

export const ConfigGlobalServices = {
  checkVersion: async (appId: string) => {
    try {
      const {data} = await apiMain.post('App/CheckVersion', {app: appId});

      return data;
    } catch (error) {
      return false;
    }
  },
};
