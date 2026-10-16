import { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { NetworkPropsContext } from './types';
import { Linking, View } from 'react-native';
import { NetWorkAlert } from '../NetWorkAlert';
import { TargetAlert } from '../TargetAlert';
import { If } from '../../client/components/If';
import { isBeta } from '../../constantBuild/config';
import { ConfigGlobalServices } from './services';
import { AppUpdateModal } from '../../components/AppUpdateModal';
import Constants from 'expo-constants';
import { translate } from '../../client/locales';
import { AppsId } from './constants';
import { buildApp } from '../../constantBuild/config';

export const ConfigGlobalContext = createContext({} as NetworkPropsContext);

export const ConfigGlobalProvider = ({ children }) => {
  const [itsNetwork, setItsNetwork] = useState(true);
  const [betaEnd, setBetaEnd] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [linkUpdate, setLinkUpdate] = useState('' as string);
  const [versionApp, setVersionApp] = useState('' as string);
  const { IS_APP_DEMO } = buildApp();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setItsNetwork(state.isConnected === true && state.isInternetReachable !== false);
    });

    return unsubscribe;
  }, []);

  const checkVersionMobilityPro = async () => {
    const data = await ConfigGlobalServices.checkVersion(AppsId['MOBILITY PRO']);
    if (!data?.status) {
      return;
    }
    const { update, version } = data?.data;
    setVersionApp(version?.version);

    if (update) {
      const currentVersion = Constants.expoConfig?.version;
      const targetVersion = version?.version;
      if (currentVersion && targetVersion) {
        const compare = currentVersion.localeCompare(targetVersion, undefined, { numeric: true, sensitivity: 'base' });
        if (compare >= 0) {
          setNeedUpdate(false);
          return;
        }
      }
      setNeedUpdate(true);
      setLinkUpdate(version?.link);
      return;
    }
    setNeedUpdate(false);
  };

  useEffect(() => {
    checkVersionMobilityPro();
  }, []);

  return (
    <ConfigGlobalContext.Provider
      value={{ itsNetwork, setItsNetwork, betaEnd, needUpdate, versionApp }}
    >
      <AppUpdateModal
        visible={needUpdate && !IS_APP_DEMO}
        title={translate('configGlobal.needs_update')}
        description={translate(
          'configGlobal.A_new_version_of_name_is_available_Please_update_the_app',
        ).replace('{name}', Constants?.expoConfig?.name)}
        onPressUpdate={() => Linking.openURL(linkUpdate)}
      />
      <View
        style={{
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <If condition={isBeta}>
          <TargetAlert betaEnd={betaEnd} setBetaEnd={setBetaEnd} />
        </If>
        <NetWorkAlert itsNetwork={itsNetwork} />
      </View>
      {children}
    </ConfigGlobalContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(ConfigGlobalContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
